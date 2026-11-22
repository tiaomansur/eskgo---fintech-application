import { createClient } from "@supabase/supabase-js";
import { gateway, generateText } from "ai";

export const maxDuration = 30;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function reais(cents: number | string) {
  return (Number(cents) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function todayInBrazil() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function bearer(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? "";
}

export async function POST(request: Request) {
  if (!url || !key) {
    return Response.json({ error: "O Supabase não está configurado neste servidor." }, { status: 500 });
  }

  const token = bearer(request);
  if (!token) {
    return Response.json({ error: "Entre na sua conta para perguntar." }, { status: 401 });
  }

  let question = "";
  try {
    const body = await request.json() as { question?: unknown };
    question = typeof body.question === "string" ? body.question.trim() : "";
  } catch {
    question = "";
  }
  if (!question || question.length > 500) {
    return Response.json({ error: "Escreva uma pergunta de até 500 caracteres." }, { status: 400 });
  }

  const supabase = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    return Response.json({ error: "Sua sessão expirou. Entre de novo." }, { status: 401 });
  }

  const userId = authData.user.id;
  const [profile, cards, categories, transactions, goals, contributions] = await Promise.all([
    supabase.from("profiles").select("full_name, opening_balance_cents").eq("id", userId).maybeSingle(),
    supabase.from("cards").select("id, name, last_four, limit_cents").eq("user_id", userId),
    supabase.from("budget_categories").select("name, planned_cents").eq("user_id", userId),
    supabase.from("transactions").select("description, category_name, payment_kind, card_id, occurred_on, amount_cents").eq("user_id", userId).order("occurred_on", { ascending: false }).limit(80),
    supabase.from("goals").select("id, name, target_cents, deadline").eq("user_id", userId),
    supabase.from("contributions").select("goal_id, amount_cents").eq("user_id", userId),
  ]);

  const failed = [profile, cards, categories, transactions, goals, contributions].find((result) => result.error);
  if (failed?.error || !profile.data) {
    return Response.json({ error: "Não consegui ler os seus números." }, { status: 500 });
  }

  const today = todayInBrazil();
  const month = today.slice(0, 7);
  const spent = (transactions.data ?? []).reduce((sum, row) => sum + Number(row.amount_cents), 0);
  const monthRows = (transactions.data ?? []).filter((row) => row.occurred_on.startsWith(month));
  const monthSpent = monthRows.reduce((sum, row) => sum + Number(row.amount_cents), 0);
  const plan = (categories.data ?? []).reduce((sum, row) => sum + Number(row.planned_cents), 0);
  const cardName = new Map((cards.data ?? []).map((card) => [card.id, `${card.name} •• ${card.last_four}`]));
  const savedByGoal = new Map<string, number>();
  for (const row of contributions.data ?? []) {
    savedByGoal.set(row.goal_id, (savedByGoal.get(row.goal_id) ?? 0) + Number(row.amount_cents));
  }

  const snapshot = [
    `Data de hoje: ${today}.`,
    `Pessoa: ${profile.data.full_name}.`,
    `Saldo: ${reais(Number(profile.data.opening_balance_cents) - spent)}.`,
    `Gasto deste mês: ${reais(monthSpent)} de ${reais(plan)} planejados.`,
    "Categorias do plano:",
    ...(categories.data ?? []).map((row) => {
      const used = monthRows.filter((item) => item.category_name === row.name).reduce((sum, item) => sum + Number(item.amount_cents), 0);
      return `- ${row.name}: ${reais(used)} de ${reais(row.planned_cents)}`;
    }),
    "Cartões:",
    ...(cards.data ?? []).map((card) => {
      const invoice = monthRows.filter((item) => item.card_id === card.id).reduce((sum, item) => sum + Number(item.amount_cents), 0);
      return `- ${card.name} •• ${card.last_four}, limite ${reais(card.limit_cents)}, fatura do mês ${reais(invoice)}`;
    }),
    "Metas:",
    ...(goals.data ?? []).map((goal) => `- ${goal.name}: ${reais(savedByGoal.get(goal.id) ?? 0)} de ${reais(goal.target_cents)}, prazo ${goal.deadline}`),
    "Lançamentos mais recentes:",
    ...(transactions.data ?? []).slice(0, 40).map((row) => {
      const payment = row.payment_kind === "cash" ? "Dinheiro / Pix" : cardName.get(row.card_id ?? "") ?? "Cartão";
      return `- ${row.occurred_on} ${row.description}, ${row.category_name}, ${reais(row.amount_cents)}, ${payment}`;
    }),
  ].join("\n");

  try {
    const result = await generateText({
      model: gateway("openai/gpt-5.4-mini"),
      instructions: [
        "Você é o assistente do Eskgo. Responda em português do Brasil, em poucas frases.",
        "Use somente os números do retrato da conta. Não invente gasto, saldo, cartão ou meta.",
        "Se a pergunta não puder ser respondida com esses números, diga isso.",
        "Não peça senha, chave ou dado bancário.",
      ].join(" "),
      prompt: `${snapshot}\n\nPergunta: ${question}`,
      maxOutputTokens: 400,
    });
    return Response.json({ answer: result.text.trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    console.error("assistant", message);
    const missingKey = /API key|OIDC|authenticat|unauthorized|AI_GATEWAY/i.test(message);
    return Response.json({
      error: missingKey
        ? "O assistente ainda não está ligado. Na Vercel, ative o AI Gateway ou coloque AI_GATEWAY_API_KEY nas variáveis de ambiente."
        : "Não consegui responder agora. Tente de novo em instantes.",
    }, { status: missingKey ? 503 : 502 });
  }
}
