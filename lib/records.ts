export type TransactionIcon = "cart" | "play" | "car" | "coffee" | "home";

export type Transaction = {
  id: string;
  name: string;
  category: string;
  account: string;
  date: string;
  amount: number;
  icon: TransactionIcon;
};

export type CardTone = "lime" | "lilac" | "cream";

export type Card = {
  id: string;
  name: string;
  lastFour: string;
  limit: number;
  dueDay: number;
  tone: CardTone;
};

export type BudgetIcon = "utensils" | "home" | "car" | "sparkle";

export type BudgetCategory = {
  id: string;
  name: string;
  planned: number;
  icon: BudgetIcon;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  deadline: string;
  featured: boolean;
};

export type Contribution = {
  id: string;
  goalId: string;
  amount: number;
  date: string;
};

export type Ledger = {
  transactions: Transaction[];
  cards: Card[];
  categories: BudgetCategory[];
  goals: Goal[];
  contributions: Contribution[];
};

export type UserRole = "admin" | "member";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  hideBalanceOnOpen: boolean;
  openingBalance: number;
};

export type AppState = {
  users: User[];
  ledgers: Record<string, Ledger>;
  sessionUserId: string | null;
};

const STORAGE_KEY = "eskgo.v1";

export function uid(_prefix?: string) {
  return crypto.randomUUID();
}

export function todayIso(today = new Date()) {
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

export function currentMonth(today = new Date()) {
  return todayIso(today).slice(0, 7);
}

export function parseMoney(value: string) {
  const clean = value.trim().replace(/[^\d,.-]/g, "");
  if (!clean) return 0;
  const normalized = clean.includes(",")
    ? clean.replace(/\./g, "").replace(",", ".")
    : clean;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "você";
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "E";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatWhen(iso: string, today = new Date()) {
  const date = new Date(`${iso}T12:00:00`);
  const start = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const diff = Math.round((start(today) - start(date)) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function formatMonthYear(iso: string) {
  const label = new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function daysUntilDue(dueDay: number, today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let due = new Date(today.getFullYear(), today.getMonth(), dueDay);
  if (due < start) due = new Date(today.getFullYear(), today.getMonth() + 1, dueDay);
  return Math.round((due.getTime() - start.getTime()) / 86400000);
}

export function daysLeftInMonth(today = new Date()) {
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  return last - today.getDate();
}

export function accountLabel(ledger: Ledger, account: string) {
  if (account === "cash") return "Dinheiro / Pix";
  const card = ledger.cards.find((item) => item.id === account);
  return card ? `${card.name} •• ${card.lastFour}` : "Conta removida";
}

export function iconForCategory(category: string): TransactionIcon {
  if (category === "Transporte") return "car";
  if (category === "Moradia") return "home";
  if (category === "Lazer" || category === "Assinaturas") return "play";
  return "cart";
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return todayIso(date);
}

function sampleCategories(): BudgetCategory[] {
  return [
    { id: "alimentacao", name: "Alimentação", planned: 620, icon: "utensils" },
    { id: "moradia", name: "Moradia", planned: 1200, icon: "home" },
    { id: "transporte", name: "Transporte", planned: 240, icon: "car" },
    { id: "lazer", name: "Lazer", planned: 390, icon: "sparkle" },
  ];
}

export function createSampleLedger(): Ledger {
  return {
    categories: sampleCategories(),
    cards: [
      { id: "principal", name: "Principal", lastFour: "4552", limit: 3000, dueDay: 30, tone: "lilac" },
      { id: "salario", name: "Salário", lastFour: "6917", limit: 3000, dueDay: 4, tone: "cream" },
      { id: "viagem", name: "Viagem", lastFour: "1180", limit: 3000, dueDay: 19, tone: "lime" },
    ],
    transactions: [
      {
        id: "tx-mercado",
        name: "Mercado Pão de Açúcar",
        category: "Alimentação",
        account: "principal",
        date: daysAgo(0),
        amount: 286.4,
        icon: "cart",
      },
      {
        id: "tx-netflix",
        name: "Netflix",
        category: "Assinaturas",
        account: "principal",
        date: daysAgo(0),
        amount: 55.9,
        icon: "play",
      },
      {
        id: "tx-uber",
        name: "Uber",
        category: "Transporte",
        account: "salario",
        date: daysAgo(1),
        amount: 32.8,
        icon: "car",
      },
      {
        id: "tx-cafe",
        name: "Café do bairro",
        category: "Alimentação",
        account: "cash",
        date: daysAgo(1),
        amount: 18,
        icon: "coffee",
      },
    ],
    goals: [
      { id: "japao", name: "Viagem ao Japão", target: 20000, deadline: "2027-12-01", featured: true },
      { id: "reserva", name: "Reserva", target: 10000, deadline: "2026-12-01", featured: false },
      { id: "curso", name: "Curso", target: 3000, deadline: "2027-06-01", featured: false },
      { id: "carro", name: "Carro novo", target: 40000, deadline: "2028-01-01", featured: false },
    ],
    contributions: [
      { id: "ap-japao", goalId: "japao", amount: 13600, date: daysAgo(0) },
      { id: "ap-reserva", goalId: "reserva", amount: 7200, date: daysAgo(0) },
      { id: "ap-curso", goalId: "curso", amount: 2700, date: daysAgo(0) },
      { id: "ap-carro", goalId: "carro", amount: 9600, date: daysAgo(0) },
    ],
  };
}

export function createStarterLedger(): Ledger {
  return {
    transactions: [],
    cards: [],
    categories: sampleCategories(),
    goals: [],
    contributions: [],
  };
}

export function sampleOpeningBalance(ledger: Ledger) {
  return 14500 + ledger.transactions.reduce((sum, item) => sum + item.amount, 0);
}

export function createInitialState(): AppState {
  const ledger = createSampleLedger();
  const user: User = {
    id: "demo",
    name: "Tião Mansur",
    email: "mansurtiao@gmail.com",
    password: "",
    role: "admin",
    hideBalanceOnOpen: false,
    openingBalance: sampleOpeningBalance(ledger),
  };
  return { users: [user], ledgers: { [user.id]: ledger }, sessionUserId: null };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as AppState;
    if (!Array.isArray(parsed.users) || !parsed.ledgers) return createInitialState();
    return parsed;
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function login(state: AppState, email: string, password: string) {
  const mail = email.trim().toLowerCase();
  if (!mail || !password) {
    return { ok: false as const, error: "Informe e-mail e senha para entrar." };
  }
  const user = state.users.find((item) => item.email.toLowerCase() === mail);
  if (!user || user.password !== password) {
    return { ok: false as const, error: "E-mail ou senha não conferem." };
  }
  return { ok: true as const, state: { ...state, sessionUserId: user.id } };
}

export function register(state: AppState, name: string, email: string, password: string) {
  const nextName = name.trim();
  const nextEmail = email.trim();
  if (!nextName || !nextEmail || !password) {
    return { ok: false as const, error: "Preencha nome, e-mail e senha." };
  }
  if (state.users.some((item) => item.email.toLowerCase() === nextEmail.toLowerCase())) {
    return { ok: false as const, error: "Já existe uma conta com esse e-mail." };
  }
  const user: User = {
    id: uid("user"),
    name: nextName,
    email: nextEmail,
    password,
    role: "member",
    hideBalanceOnOpen: false,
    openingBalance: 0,
  };
  return {
    ok: true as const,
    state: {
      ...state,
      users: [...state.users, user],
      ledgers: { ...state.ledgers, [user.id]: createStarterLedger() },
      sessionUserId: user.id,
    },
  };
}

export function logout(state: AppState): AppState {
  return { ...state, sessionUserId: null };
}

export function deleteAccount(state: AppState, userId: string): AppState {
  const ledgers = { ...state.ledgers };
  delete ledgers[userId];
  return {
    users: state.users.filter((item) => item.id !== userId),
    ledgers,
    sessionUserId: null,
  };
}

export function updateUser(state: AppState, user: User): AppState {
  return { ...state, users: state.users.map((item) => (item.id === user.id ? user : item)) };
}

export function updateLedger(state: AppState, userId: string, ledger: Ledger): AppState {
  return { ...state, ledgers: { ...state.ledgers, [userId]: ledger } };
}

export function restoreSample(state: AppState, userId: string): AppState {
  const ledger = createSampleLedger();
  return {
    ...state,
    users: state.users.map((item) =>
      item.id === userId ? { ...item, openingBalance: sampleOpeningBalance(ledger) } : item,
    ),
    ledgers: { ...state.ledgers, [userId]: ledger },
  };
}

export function monthSpent(ledger: Ledger, month = currentMonth()) {
  return ledger.transactions
    .filter((item) => item.date.startsWith(month))
    .reduce((sum, item) => sum + item.amount, 0);
}

export function planTotal(ledger: Ledger) {
  return ledger.categories.reduce((sum, item) => sum + item.planned, 0);
}

export function categorySpent(ledger: Ledger, name: string, month = currentMonth()) {
  return ledger.transactions
    .filter((item) => item.date.startsWith(month) && item.category === name)
    .reduce((sum, item) => sum + item.amount, 0);
}

export function cardInvoice(ledger: Ledger, cardId: string, month = currentMonth()) {
  return ledger.transactions
    .filter((item) => item.account === cardId && item.date.startsWith(month))
    .reduce((sum, item) => sum + item.amount, 0);
}

export function goalSaved(ledger: Ledger, goalId: string) {
  return ledger.contributions
    .filter((item) => item.goalId === goalId)
    .reduce((sum, item) => sum + item.amount, 0);
}

export function balanceOf(user: User, ledger: Ledger) {
  const spent = ledger.transactions.reduce((sum, item) => sum + item.amount, 0);
  return user.openingBalance - spent;
}
