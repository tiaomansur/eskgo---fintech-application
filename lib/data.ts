export type Transaction = {
  id: number;
  name: string;
  category: string;
  account: string;
  date: string;
  amount: number;
  icon: "cart" | "play" | "car" | "coffee" | "home";
};

export type Card = {
  id: string;
  name: string;
  lastFour: string;
  invoice: number;
  due: string;
  used: number;
  tone: "lime" | "lilac" | "cream";
};

export const initialTransactions: Transaction[] = [
  {
    id: 1,
    name: "Mercado Pão de Açúcar",
    category: "Alimentação",
    account: "Principal •• 4552",
    date: "Hoje, 11:42",
    amount: 286.4,
    icon: "cart",
  },
  {
    id: 2,
    name: "Netflix",
    category: "Assinaturas",
    account: "Principal •• 4552",
    date: "Hoje, 08:10",
    amount: 55.9,
    icon: "play",
  },
  {
    id: 3,
    name: "Uber",
    category: "Transporte",
    account: "Salário •• 6917",
    date: "Ontem, 20:18",
    amount: 32.8,
    icon: "car",
  },
  {
    id: 4,
    name: "Café do bairro",
    category: "Alimentação",
    account: "Dinheiro",
    date: "Ontem, 09:04",
    amount: 18,
    icon: "coffee",
  },
];

export const initialCards: Card[] = [
  {
    id: "principal",
    name: "Principal",
    lastFour: "4552",
    invoice: 1284,
    due: "8 dias",
    used: 43,
    tone: "lilac",
  },
  {
    id: "salario",
    name: "Salário",
    lastFour: "6917",
    invoice: 640,
    due: "12 dias",
    used: 31,
    tone: "cream",
  },
  {
    id: "viagem",
    name: "Viagem",
    lastFour: "1180",
    invoice: 98,
    due: "27 dias",
    used: 12,
    tone: "lime",
  },
];

export const budgetCategories = [
  { name: "Alimentação", value: 62, amount: "R$ 620", icon: "utensils" },
  { name: "Moradia", value: 100, amount: "R$ 1.200", icon: "home" },
  { name: "Transporte", value: 40, amount: "R$ 240", icon: "car" },
  { name: "Lazer", value: 78, amount: "R$ 390", icon: "sparkle" },
] as const;

export const savingsGoals = [
  { name: "Reserva", saved: "R$ 7.200", target: "R$ 10.000", value: 72 },
  { name: "Curso", saved: "R$ 2.700", target: "R$ 3.000", value: 90 },
  { name: "Carro novo", saved: "R$ 9.600", target: "R$ 40.000", value: 24 },
];

export function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}
