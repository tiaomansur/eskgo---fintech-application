import {
  createSampleLedger,
  sampleOpeningBalance,
  uid,
  type Card,
  type Contribution,
  type Goal,
  type Ledger,
  type Transaction,
  type User,
} from "@/lib/records";
import { supabase } from "@/lib/supabase";

export type Account = {
  user: User;
  ledger: Ledger;
};

type DbError = { message: string; code?: string };

function cents(value: number) {
  return Math.round(value * 100);
}

function reais(value: number | string) {
  return Number(value) / 100;
}

function explain(error: DbError) {
  const text = `${error.code ?? ""} ${error.message}`.toLowerCase();
  if (text.includes("goals_one_featured")) return "Só uma meta pode ficar em destaque.";
  if (text.includes("budget_categories") && text.includes("duplicate")) return "Já existe uma categoria com esse nome.";
  if (text.includes("transactions_card_id")) return "Esse cartão tem lançamentos. Apague os gastos antes.";
  if (text.includes("row-level security") || text.includes("42501")) return "Essa ação não é permitida para esta conta.";
  if (text.includes("invalid login") || text.includes("invalid_credentials")) return "E-mail ou senha não conferem.";
  if (text.includes("already registered") || text.includes("user already")) return "Já existe uma conta com esse e-mail.";
  if (text.includes("password")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (text.includes("email") && text.includes("invalid")) return "Use um e-mail válido para criar a conta.";
  if (text.includes("missing-profile")) return "A conta entrou, mas o perfil ainda não apareceu. Tente de novo.";
  return "Não consegui salvar no Supabase. Tente de novo.";
}

async function unwrap<T>(result: { data: T; error: DbError | null }) {
  if (result.error) throw result.error;
  return result.data;
}

function ids<T extends { id: string }>(items: T[]) {
  return items.map((item) => item.id);
}

function added<T extends { id: string }>(previous: T[], next: T[]) {
  const known = new Set(ids(previous));
  return next.filter((item) => !known.has(item.id));
}

function removed<T extends { id: string }>(previous: T[], next: T[]) {
  const kept = new Set(ids(next));
  return previous.filter((item) => !kept.has(item.id));
}

function changed<T extends { id: string }>(previous: T[], next: T[], same: (left: T, right: T) => boolean) {
  const before = new Map(previous.map((item) => [item.id, item]));
  return next.filter((item) => {
    const prior = before.get(item.id);
    return prior ? !same(prior, item) : false;
  });
}

async function removeRows(table: "contributions" | "goals" | "transactions" | "cards" | "budget_categories", rows: { id: string }[]) {
  if (rows.length === 0) return;
  await unwrap(await supabase.from(table).delete().in("id", ids(rows)));
}

function cardRow(userId: string, card: Card) {
  return {
    id: card.id,
    user_id: userId,
    name: card.name,
    last_four: card.lastFour,
    limit_cents: cents(card.limit),
    due_day: card.dueDay,
    tone: card.tone,
  };
}

function categoryRow(userId: string, category: Ledger["categories"][number]) {
  return {
    id: category.id,
    user_id: userId,
    name: category.name,
    planned_cents: cents(category.planned),
    icon: category.icon,
  };
}

function goalRow(userId: string, goal: Goal) {
  return {
    id: goal.id,
    user_id: userId,
    name: goal.name,
    target_cents: cents(goal.target),
    deadline: goal.deadline,
    featured: goal.featured,
  };
}

function transactionRow(userId: string, transaction: Transaction) {
  const cash = transaction.account === "cash";
  return {
    id: transaction.id,
    user_id: userId,
    description: transaction.name,
    category_name: transaction.category,
    payment_kind: cash ? "cash" : "card",
    card_id: cash ? null : transaction.account,
    occurred_on: transaction.date,
    amount_cents: cents(transaction.amount),
    icon: transaction.icon,
  };
}

function contributionRow(userId: string, contribution: Contribution) {
  return {
    id: contribution.id,
    user_id: userId,
    goal_id: contribution.goalId,
    amount_cents: cents(contribution.amount),
    occurred_on: contribution.date,
  };
}

function toLedger(input: {
  cards: CardRow[];
  categories: CategoryRow[];
  transactions: TransactionRow[];
  goals: GoalRow[];
  contributions: ContributionRow[];
}): Ledger {
  return {
    cards: input.cards.map((card) => ({
      id: card.id,
      name: card.name,
      lastFour: card.last_four,
      limit: reais(card.limit_cents),
      dueDay: card.due_day,
      tone: card.tone,
    })),
    categories: input.categories.map((category) => ({
      id: category.id,
      name: category.name,
      planned: reais(category.planned_cents),
      icon: category.icon,
    })),
    transactions: input.transactions.map((transaction) => ({
      id: transaction.id,
      name: transaction.description,
      category: transaction.category_name,
      account: transaction.payment_kind === "cash" || !transaction.card_id ? "cash" : transaction.card_id,
      date: transaction.occurred_on,
      amount: reais(transaction.amount_cents),
      icon: transaction.icon,
    })),
    goals: input.goals.map((goal) => ({
      id: goal.id,
      name: goal.name,
      target: reais(goal.target_cents),
      deadline: goal.deadline,
      featured: goal.featured,
    })),
    contributions: input.contributions.map((contribution) => ({
      id: contribution.id,
      goalId: contribution.goal_id,
      amount: reais(contribution.amount_cents),
      date: contribution.occurred_on,
    })),
  };
}

type CardRow = {
  id: string;
  name: string;
  last_four: string;
  limit_cents: number | string;
  due_day: number;
  tone: Card["tone"];
};

type CategoryRow = {
  id: string;
  name: string;
  planned_cents: number | string;
  icon: Ledger["categories"][number]["icon"];
};

type TransactionRow = {
  id: string;
  description: string;
  category_name: string;
  payment_kind: "card" | "cash";
  card_id: string | null;
  occurred_on: string;
  amount_cents: number | string;
  icon: Transaction["icon"];
};

type GoalRow = {
  id: string;
  name: string;
  target_cents: number | string;
  deadline: string;
  featured: boolean;
};

type ContributionRow = {
  id: string;
  goal_id: string;
  amount_cents: number | string;
  occurred_on: string;
};

function toUser(
  profile: {
    id: string;
    full_name: string;
    email: string;
    hide_balance_on_open: boolean;
    opening_balance_cents: number | string;
  },
  role: User["role"],
): User {
  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    password: "",
    role,
    hideBalanceOnOpen: profile.hide_balance_on_open,
    openingBalance: reais(profile.opening_balance_cents),
  };
}

export async function fetchAccount(): Promise<Account | null> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return null;
  const userId = authData.user.id;

  const [profile, cards, categories, transactions, goals, contributions] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email, hide_balance_on_open, opening_balance_cents").eq("id", userId).maybeSingle(),
    supabase.from("cards").select("id, name, last_four, limit_cents, due_day, tone").eq("user_id", userId).order("created_at"),
    supabase.from("budget_categories").select("id, name, planned_cents, icon").eq("user_id", userId).order("created_at"),
    supabase.from("transactions").select("id, description, category_name, payment_kind, card_id, occurred_on, amount_cents, icon").eq("user_id", userId).order("occurred_on", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("goals").select("id, name, target_cents, deadline, featured").eq("user_id", userId).order("created_at"),
    supabase.from("contributions").select("id, goal_id, amount_cents, occurred_on").eq("user_id", userId).order("occurred_on", { ascending: false }).order("created_at", { ascending: false }),
  ]);

  for (const result of [profile, cards, categories, transactions, goals, contributions]) {
    if (result.error) throw result.error;
  }
  if (!profile.data) {
    await supabase.auth.signOut();
    return null;
  }

  const role = authData.user.app_metadata?.role === "admin" ? "admin" : "member";

  return {
    user: toUser(profile.data, role),
    ledger: toLedger({
      cards: cards.data ?? [],
      categories: categories.data ?? [],
      transactions: transactions.data ?? [],
      goals: goals.data ?? [],
      contributions: contributions.data ?? [],
    }),
  };
}

async function openSession(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  const account = await fetchAccount();
  if (!account) throw new Error("missing-profile");
  return account;
}

export async function signInAccount(email: string, password: string): Promise<Account | { error: string }> {
  if (!email.trim() || !password) return { error: "Informe e-mail e senha para entrar." };
  try {
    return await openSession(email, password);
  } catch (error) {
    return { error: explain(error as DbError) };
  }
}

export async function signUpAccount(name: string, email: string, password: string): Promise<Account | { error: string }> {
  const nextName = name.trim();
  const nextEmail = email.trim();
  if (!nextName || !nextEmail || !password) return { error: "Preencha nome, e-mail e senha." };
  try {
    const { data, error } = await supabase.auth.signUp({
      email: nextEmail,
      password,
      options: { data: { name: nextName } },
    });
    if (error) throw error;
    if (!data.session) return { error: "Conta criada. Confirme o e-mail para entrar." };
    const account = await fetchAccount();
    if (!account) return { error: "A conta entrou, mas o perfil ainda não apareceu. Tente de novo." };
    return account;
  } catch (error) {
    return { error: explain(error as DbError) };
  }
}

export async function signOutAccount() {
  const { error } = await supabase.auth.signOut();
  if (error) return explain(error);
  return null;
}

export async function deleteOwnAccount() {
  const { error } = await supabase.rpc("delete_own_account");
  if (error) return explain(error);
  await supabase.auth.signOut();
  return null;
}

export async function persistUser(user: User) {
  try {
    await unwrap(await supabase.from("profiles").update({
      full_name: user.name,
      email: user.email,
      hide_balance_on_open: user.hideBalanceOnOpen,
      opening_balance_cents: cents(user.openingBalance),
    }).eq("id", user.id));
    return null;
  } catch (error) {
    return explain(error as DbError);
  }
}

export async function persistLedger(userId: string, previous: Ledger, next: Ledger) {
  try {
    await removeRows("contributions", removed(previous.contributions, next.contributions));
    await removeRows("goals", removed(previous.goals, next.goals));
    await removeRows("transactions", removed(previous.transactions, next.transactions));
    await removeRows("cards", removed(previous.cards, next.cards));
    await removeRows("budget_categories", removed(previous.categories, next.categories));

    const categories = [
      ...changed(previous.categories, next.categories, (left, right) =>
        left.name === right.name && left.planned === right.planned && left.icon === right.icon),
      ...added(previous.categories, next.categories),
    ];
    if (categories.length > 0) {
      await unwrap(await supabase.from("budget_categories").upsert(categories.map((item) => categoryRow(userId, item))));
    }

    const cards = [
      ...changed(previous.cards, next.cards, (left, right) =>
        left.name === right.name && left.lastFour === right.lastFour && left.limit === right.limit && left.dueDay === right.dueDay && left.tone === right.tone),
      ...added(previous.cards, next.cards),
    ];
    if (cards.length > 0) {
      await unwrap(await supabase.from("cards").upsert(cards.map((item) => cardRow(userId, item))));
    }

    const goals = [
      ...changed(previous.goals, next.goals, (left, right) =>
        left.name === right.name && left.target === right.target && left.deadline === right.deadline && left.featured === right.featured),
      ...added(previous.goals, next.goals),
    ];
    const plainGoals = goals.filter((goal) => !goal.featured);
    const featuredGoals = goals.filter((goal) => goal.featured);
    if (plainGoals.length > 0) {
      await unwrap(await supabase.from("goals").upsert(plainGoals.map((item) => goalRow(userId, item))));
    }
    if (featuredGoals.length > 0) {
      await unwrap(await supabase.from("goals").upsert(featuredGoals.map((item) => goalRow(userId, item))));
    }

    const transactions = [
      ...changed(previous.transactions, next.transactions, (left, right) =>
        left.name === right.name && left.category === right.category && left.account === right.account && left.date === right.date && left.amount === right.amount && left.icon === right.icon),
      ...added(previous.transactions, next.transactions),
    ];
    if (transactions.length > 0) {
      await unwrap(await supabase.from("transactions").upsert(transactions.map((item) => transactionRow(userId, item))));
    }

    const contributions = [
      ...changed(previous.contributions, next.contributions, (left, right) =>
        left.goalId === right.goalId && left.amount === right.amount && left.date === right.date),
      ...added(previous.contributions, next.contributions),
    ];
    if (contributions.length > 0) {
      await unwrap(await supabase.from("contributions").upsert(contributions.map((item) => contributionRow(userId, item))));
    }

    return null;
  } catch (error) {
    return explain(error as DbError);
  }
}

function withFreshIds(ledger: Ledger): Ledger {
  const cards = new Map(ledger.cards.map((card) => [card.id, uid()]));
  const goals = new Map(ledger.goals.map((goal) => [goal.id, uid()]));
  return {
    categories: ledger.categories.map((category) => ({ ...category, id: uid() })),
    cards: ledger.cards.map((card) => ({ ...card, id: cards.get(card.id) ?? uid() })),
    transactions: ledger.transactions.map((transaction) => ({
      ...transaction,
      id: uid(),
      account: transaction.account === "cash" ? "cash" : cards.get(transaction.account) ?? "cash",
    })),
    goals: ledger.goals.map((goal) => ({ ...goal, id: goals.get(goal.id) ?? uid() })),
    contributions: ledger.contributions.map((contribution) => ({
      ...contribution,
      id: uid(),
      goalId: goals.get(contribution.goalId) ?? contribution.goalId,
    })),
  };
}

export async function restoreDemo(userId: string): Promise<Account | { error: string }> {
  const ledger = withFreshIds(createSampleLedger());
  const openingBalance = sampleOpeningBalance(ledger);
  try {
    await unwrap(await supabase.from("contributions").delete().eq("user_id", userId));
    await unwrap(await supabase.from("goals").delete().eq("user_id", userId));
    await unwrap(await supabase.from("transactions").delete().eq("user_id", userId));
    await unwrap(await supabase.from("cards").delete().eq("user_id", userId));
    await unwrap(await supabase.from("budget_categories").delete().eq("user_id", userId));
    await unwrap(await supabase.from("budget_categories").insert(ledger.categories.map((item) => categoryRow(userId, item))));
    await unwrap(await supabase.from("cards").insert(ledger.cards.map((item) => cardRow(userId, item))));
    await unwrap(await supabase.from("goals").insert(ledger.goals.map((item) => goalRow(userId, item))));
    await unwrap(await supabase.from("transactions").insert(ledger.transactions.map((item) => transactionRow(userId, item))));
    await unwrap(await supabase.from("contributions").insert(ledger.contributions.map((item) => contributionRow(userId, item))));
    await unwrap(await supabase.from("profiles").update({ opening_balance_cents: cents(openingBalance) }).eq("id", userId));
    const account = await fetchAccount();
    if (!account) return { error: "Os dados de exemplo entraram, mas a leitura falhou. Atualize a página." };
    return account;
  } catch (error) {
    return { error: explain(error as DbError) };
  }
}
