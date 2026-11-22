"use client";

import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  CircleDollarSign,
  Coffee,
  CreditCard,
  Eye,
  EyeOff,
  Home,
  LogOut,
  MoreHorizontal,
  Pencil,
  PiggyBank,
  Play,
  Plus,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Target,
  Trash2,
  Utensils,
  WalletCards,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { money } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import {
  deleteOwnAccount,
  fetchAccount,
  persistLedger,
  persistUser,
  restoreDemo,
  signInAccount,
  signOutAccount,
  signUpAccount,
} from "@/lib/remote";
import {
  accountLabel,
  balanceOf,
  cardInvoice,
  categorySpent,
  currentMonth,
  daysLeftInMonth,
  daysUntilDue,
  firstName,
  formatMonthYear,
  formatWhen,
  goalSaved,
  iconForCategory,
  initials,
  monthSpent,
  parseMoney,
  planTotal,
  todayIso,
  uid,
  type AppState,
  type BudgetCategory,
  type BudgetIcon,
  type Card,
  type Contribution,
  type Goal,
  type Ledger,
  type Transaction,
  type User,
} from "@/lib/records";
import {
  Button,
  FieldLabel,
  Heading,
  IconButton,
  Input,
  Select,
  Sheet,
  Text,
} from "@/components/ui";

type View = "home" | "notes" | "assistant" | "cards" | "goals";
type SheetName = "add" | "account" | "transaction" | "card" | "category" | "goal" | null;

const transactionIcons = {
  cart: ShoppingBag,
  play: Play,
  car: Car,
  coffee: Coffee,
  home: Home,
};

const barTones = ["lilac", "lime", "cream"] as const;

function byDateDesc<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function dueLabel(dueDay: number) {
  const days = daysUntilDue(dueDay);
  return days === 0 ? "hoje" : `${days} dias`;
}

function AuthView({
  onLogin,
  onRegister,
}: {
  onLogin: (email: string, password: string) => Promise<string | null>;
  onRegister: (name: string, email: string, password: string) => Promise<string | null>;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    const message = mode === "login" ? await onLogin(email, password) : await onRegister(name, email, password);
    setPending(false);
    setError(message);
  }

  return (
    <main className="auth-page">
      <div className="auth-ambient auth-ambient--one" />
      <div className="auth-ambient auth-ambient--two" />
      <section className="auth-brand-panel">
        <div className="auth-wordmark">
          <span className="auth-wordmark__mark">e</span>
          <span>eskgo</span>
        </div>
        <div className="auth-brand-panel__copy">
          <Text className="eyebrow">SEU DINHEIRO, MAIS CLARO</Text>
          <Heading level={1}>Grandes conquistas começam com clareza.</Heading>
          <Text>
            Saldo, gastos, cartões e objetivos reunidos em uma experiência
            financeira simples e direta.
          </Text>
        </div>
        <div className="auth-balance-preview" aria-hidden="true">
          <span>Saldo disponível</span>
          <strong>R$ 14.500</strong>
          <div><span /><span /><span /><span /></div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-panel__content">
          <div className="auth-mobile-brand">
            <span className="auth-wordmark__mark">e</span>
            <span>eskgo</span>
          </div>
          <div className="auth-heading">
            <Text className="eyebrow">BEM-VINDO AO ESKGO</Text>
            <Heading level={2}>
              {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </Heading>
            <Text>
              {mode === "login"
                ? "Acompanhe seu dinheiro e avance nos seus planos."
                : "Comece agora a organizar seu dinheiro com clareza."}
            </Text>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Escolha entre login e cadastro">
            <Button
              type="button"
              variant="ghost"
              className={mode === "login" ? "is-active" : ""}
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              role="tab"
              aria-selected={mode === "login"}
            >
              Entrar
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={mode === "register" ? "is-active" : ""}
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              role="tab"
              aria-selected={mode === "register"}
            >
              Criar conta
            </Button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === "register" ? (
              <div className="field">
                <FieldLabel htmlFor="auth-name">Nome</FieldLabel>
                <Input
                  id="auth-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Como podemos chamar você?"
                  autoComplete="name"
                  required
                />
              </div>
            ) : null}
            <div className="field">
              <FieldLabel htmlFor="auth-email">E-mail</FieldLabel>
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <div className="auth-label-row">
                <FieldLabel htmlFor="auth-password">Senha</FieldLabel>
              </div>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={mode === "register" ? 6 : undefined}
              />
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <Button type="submit" className="auth-submit" disabled={pending}>
              {pending ? "Salvando..." : mode === "login" ? "Entrar" : "Criar conta e entrar"}
              <ChevronRight size={18} />
            </Button>
          </form>

          <div className="auth-prototype-note">
            <Sparkles size={14} />
            <Text>
              {mode === "login"
                ? "O acesso pede e-mail e senha. Sem uma conta, use Criar conta."
                : "A conta nova entra no Supabase, com saldo zerado e as quatro categorias do plano."}
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
}

function AppHeader({
  view,
  name,
  onBack,
  onAccount,
}: {
  view: View;
  name: string;
  onBack: () => void;
  onAccount: () => void;
}) {
  return (
    <header className="app-header">
      <div className="app-header__identity">
        {view === "home" ? (
          <IconButton className="avatar" onClick={onAccount} aria-label="Abrir conta">
            <span>{initials(name)}</span>
          </IconButton>
        ) : (
          <IconButton onClick={onBack} aria-label="Voltar para a home">
            <ArrowLeft size={20} />
          </IconButton>
        )}
        <div>
          <Text className="app-header__eyebrow">
            {view === "home" ? "Bom dia" : "Eskgo"}
          </Text>
          <Heading level={1}>
            {view === "home"
              ? `Olá, ${firstName(name)}!`
              : view === "notes"
                ? "Notas"
                : view === "assistant"
                  ? "Assistente IA"
                  : view === "cards"
                    ? "Cartões"
                    : "Objetivos"}
          </Heading>
        </div>
      </div>
      <div className="wordmark" aria-label="Eskgo">
        <span className="wordmark__dot" />
        eskgo
      </div>
    </header>
  );
}

function BalanceHero({
  hidden,
  balance,
  delta,
  onToggle,
}: {
  hidden: boolean;
  balance: number;
  delta: number;
  onToggle: () => void;
}) {
  const down = delta < 0;
  const DeltaIcon = down ? ArrowDownLeft : ArrowUpRight;
  const percent = Math.abs(delta).toLocaleString("pt-BR", { maximumFractionDigits: 1 });

  return (
    <article className="balance-hero">
      <div className="balance-hero__top">
        <div className="mini-brand">
          <span className="mini-brand__mark">e</span>
          <span>eskgo</span>
        </div>
        <Text className="balance-hero__status">
          <span className="status-dot" />
          Atualizado agora
        </Text>
      </div>
      <div className="balance-hero__content">
        <div>
          <Text className="balance-hero__label">Seu saldo</Text>
          <div className="balance-hero__value">
            <Heading level={2}>{hidden ? "R$ ••••••" : money(balance)}</Heading>
            <IconButton
              className="balance-hero__eye"
              onClick={onToggle}
              aria-label={hidden ? "Mostrar saldo" : "Ocultar saldo"}
            >
              {hidden ? <EyeOff size={19} /> : <Eye size={19} />}
            </IconButton>
          </div>
        </div>
        <div className="balance-hero__delta">
          <DeltaIcon size={16} />
          <span>{percent}%</span>
          <small>este mês</small>
        </div>
      </div>
      <div className="balance-hero__orb" aria-hidden="true" />
    </article>
  );
}

function QuickActions({
  cardCount,
  goalCount,
  onAdd,
  onCards,
  onGoals,
}: {
  cardCount: number;
  goalCount: number;
  onAdd: () => void;
  onCards: () => void;
  onGoals: () => void;
}) {
  const actions = [
    { label: "Adicionar", caption: "Nova compra", icon: Plus, action: onAdd, accent: true },
    {
      label: "Cartões",
      caption: `${cardCount} ${cardCount === 1 ? "ativo" : "ativos"}`,
      icon: WalletCards,
      action: onCards,
    },
    {
      label: "Metas",
      caption: `${goalCount} ${goalCount === 1 ? "objetivo" : "objetivos"}`,
      icon: PiggyBank,
      action: onGoals,
    },
  ];

  return (
    <section className="quick-actions" aria-label="Atalhos">
      {actions.map(({ label, caption, icon: Icon, action, accent }) => (
        <Button
          key={label}
          type="button"
          variant="ghost"
          className={`action-tile ${accent ? "action-tile--accent" : ""}`}
          onClick={action}
        >
          <span className="action-tile__icon">
            <Icon size={21} strokeWidth={2} />
          </span>
          <span className="action-tile__copy">
            <strong>{label}</strong>
            <small>{caption}</small>
          </span>
          <ChevronRight className="action-tile__arrow" size={17} />
        </Button>
      ))}
    </section>
  );
}

function MonthOverview({
  spent,
  plan,
  rows,
}: {
  spent: number;
  plan: number;
  rows: { label: string; amount: number; tone: string }[];
}) {
  const remainder = Math.max(plan - spent, 0);
  const used = plan > 0 ? Math.round((spent / plan) * 100) : 0;

  return (
    <section className="panel month-panel">
      <div className="section-heading">
        <div>
          <Text className="eyebrow">{new Date().toLocaleDateString("pt-BR", { month: "long" }).toUpperCase()}</Text>
          <Heading level={2}>Este mês</Heading>
        </div>
      </div>
      <Heading level={3} className="month-panel__amount">
        {money(spent)}
      </Heading>
      <Text className="month-panel__subtitle">de {money(plan)} planejados</Text>
      <div className="month-bar" aria-label={`${used}% do orçamento usado`}>
        {rows.filter((row) => row.amount > 0).map((row) => (
          <span
            key={row.label}
            className={`month-bar__segment month-bar__segment--${row.tone}`}
            style={{ flexGrow: row.amount }}
          />
        ))}
        {remainder > 0 ? (
          <span className="month-bar__segment month-bar__segment--empty" style={{ flexGrow: remainder }} />
        ) : null}
      </div>
      <div className="category-list">
        {rows.map((row) => (
          <div className="category-row" key={row.label}>
            <span className={`category-dot category-dot--${row.tone}`} />
            <Text as="span">{row.label}</Text>
            <Text as="strong">{money(row.amount)}</Text>
          </div>
        ))}
      </div>
    </section>
  );
}

function TransactionList({
  transactions,
  meta,
  onSelect,
}: {
  transactions: Transaction[];
  meta: string;
  onSelect: (transaction: Transaction) => void;
}) {
  return (
    <section className="panel transactions-panel">
      <div className="section-heading">
        <div>
          <Text className="eyebrow">MOVIMENTAÇÕES</Text>
          <Heading level={2}>Transações</Heading>
        </div>
        <Text className="section-heading__meta">{meta}</Text>
      </div>
      <div className="transaction-list">
        {transactions.length === 0 ? (
          <div className="empty-state">
            <ReceiptText size={24} />
            <Heading level={3}>Tudo limpo por aqui</Heading>
            <Text>Adicione uma compra para começar a acompanhar o mês.</Text>
          </div>
        ) : (
          transactions.map((transaction) => {
            const Icon = transactionIcons[transaction.icon];
            return (
              <Button
                variant="ghost"
                className="transaction-row"
                key={transaction.id}
                type="button"
                onClick={() => onSelect(transaction)}
              >
                <span className="transaction-row__icon">
                  <Icon size={18} />
                </span>
                <span className="transaction-row__copy">
                  <strong>{transaction.name}</strong>
                  <small>
                    {transaction.category} · {formatWhen(transaction.date)}
                  </small>
                </span>
                <span className="transaction-row__amount">
                  − {money(transaction.amount)}
                </span>
              </Button>
            );
          })
        )}
      </div>
    </section>
  );
}

function HomeView({
  user,
  ledger,
  hidden,
  onToggleBalance,
  onAdd,
  onCards,
  onGoals,
  onTransaction,
}: {
  user: User;
  ledger: Ledger;
  hidden: boolean;
  onToggleBalance: () => void;
  onAdd: () => void;
  onCards: () => void;
  onGoals: () => void;
  onTransaction: (transaction: Transaction) => void;
}) {
  const month = currentMonth();
  const spent = monthSpent(ledger, month);
  const plan = planTotal(ledger);
  const rows = ledger.categories.map((category, index) => ({
    label: category.name,
    amount: categorySpent(ledger, category.name, month),
    tone: barTones[index % barTones.length],
  }));
  const outside = spent - rows.reduce((sum, row) => sum + row.amount, 0);
  if (outside > 0.009) rows.push({ label: "Fora do plano", amount: outside, tone: "cream" });
  const transactions = byDateDesc(ledger.transactions.filter((item) => item.date.startsWith(month)));
  const delta = user.openingBalance > 0 ? (-spent / user.openingBalance) * 100 : spent > 0 ? -100 : 0;

  return (
    <main className="home-grid">
      <div className="home-grid__hero">
        <BalanceHero
          hidden={hidden}
          balance={balanceOf(user, ledger)}
          delta={delta}
          onToggle={onToggleBalance}
        />
      </div>
      <div className="home-grid__actions">
        <QuickActions
          cardCount={ledger.cards.length}
          goalCount={ledger.goals.length}
          onAdd={onAdd}
          onCards={onCards}
          onGoals={onGoals}
        />
      </div>
      <div className="home-grid__month">
        <MonthOverview spent={spent} plan={plan} rows={rows} />
      </div>
      <div className="home-grid__transactions">
        <TransactionList transactions={transactions} meta="Este mês" onSelect={onTransaction} />
      </div>
    </main>
  );
}

function CardVisual({
  card,
  position,
  onClick,
}: {
  card: Card;
  position: number;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      type="button"
      className={`wallet-card wallet-card--${card.tone} wallet-card--position-${position}`}
      onClick={onClick}
      aria-label={`Selecionar cartão ${card.name}`}
    >
      <span className="wallet-card__top">
        <span className="mini-brand">
          <span className="mini-brand__mark">e</span>
          <span>eskgo</span>
        </span>
        <span className="wallet-card__chip" />
      </span>
      <span className="wallet-card__bottom">
        <span>
          <small>{card.name}</small>
          <strong>•• {card.lastFour}</strong>
        </span>
        <span className="wallet-card__circles" />
      </span>
    </Button>
  );
}

function CardsView({
  ledger,
  onNewCard,
  onEditCard,
}: {
  ledger: Ledger;
  onNewCard: () => void;
  onEditCard: (card: Card) => void;
}) {
  const [activeId, setActiveId] = useState(ledger.cards[0]?.id);
  const active = ledger.cards.find((card) => card.id === activeId) ?? ledger.cards[0];
  const ordered = useMemo(() => {
    if (!active) return ledger.cards;
    return [active, ...ledger.cards.filter((card) => card.id !== active.id)];
  }, [active, ledger.cards]);

  if (!active) {
    return (
      <main className="cards-layout">
        <section className="wallet-stage">
          <div className="section-heading">
            <div>
              <Text className="eyebrow">SUA CARTEIRA</Text>
              <Heading level={2}>Nenhum cartão ainda</Heading>
            </div>
            <IconButton onClick={onNewCard} aria-label="Adicionar cartão">
              <Plus size={20} />
            </IconButton>
          </div>
          <div className="empty-state">
            <CreditCard size={24} />
            <Text>Adicione um cartão para acompanhar a fatura.</Text>
          </div>
        </section>
      </main>
    );
  }

  const invoice = cardInvoice(ledger, active.id);
  const used = active.limit > 0 ? Math.min(100, Math.round((invoice / active.limit) * 100)) : 0;

  return (
    <main className="cards-layout">
      <section className="wallet-stage">
        <div className="section-heading">
          <div>
            <Text className="eyebrow">SUA CARTEIRA</Text>
            <Heading level={2}>Escolha um cartão</Heading>
          </div>
          <IconButton onClick={onNewCard} aria-label="Adicionar cartão">
            <Plus size={20} />
          </IconButton>
        </div>
        <div className="card-stack">
          {[...ordered].reverse().map((card, reversedIndex) => {
            const position = ordered.length - 1 - reversedIndex;
            return (
              <CardVisual
                key={card.id}
                card={card}
                position={position}
                onClick={() => setActiveId(card.id)}
              />
            );
          })}
        </div>
        <Text className="wallet-stage__hint">Toque em um cartão para trazê-lo à frente</Text>
      </section>

      <section className="card-details">
        <div className="card-details__header">
          <div>
            <Text className="eyebrow">FATURA ATUAL</Text>
            <Heading level={2}>{active.name}</Heading>
          </div>
          <IconButton aria-label="Editar cartão" onClick={() => onEditCard(active)}>
            <MoreHorizontal size={20} />
          </IconButton>
        </div>
        <Heading level={3} className="card-details__invoice">
          {money(invoice)}
        </Heading>
        <Text className="card-details__due">Vence em {dueLabel(active.dueDay)}</Text>
        <div className="usage">
          <div className="usage__header">
            <Text as="span">Limite usado</Text>
            <Text as="strong">{used}%</Text>
          </div>
          <div className="progress">
            <span style={{ width: `${used}%` }} />
          </div>
          <div className="usage__footer">
            <Text as="span">{money(invoice)} usados</Text>
            <Text as="span">Limite {money(active.limit)}</Text>
          </div>
        </div>
      </section>

      <section className="panel upcoming-panel">
        <div className="section-heading">
          <div>
            <Text className="eyebrow">VISÃO GERAL</Text>
            <Heading level={2}>Próximas faturas</Heading>
          </div>
        </div>
        <div className="upcoming-list">
          {ledger.cards.map((card) => (
            <Button
              variant="ghost"
              className="upcoming-row"
              key={card.id}
              type="button"
              onClick={() => setActiveId(card.id)}
            >
              <span className={`upcoming-row__icon upcoming-row__icon--${card.tone}`}>
                <CreditCard size={18} />
              </span>
              <span>
                <strong>{card.name}</strong>
                <small>Vence em {dueLabel(card.dueDay)}</small>
              </span>
              <strong>{money(cardInvoice(ledger, card.id))}</strong>
              <ChevronRight size={17} />
            </Button>
          ))}
        </div>
      </section>
    </main>
  );
}

function BudgetIcon({ name }: { name: BudgetIcon }) {
  if (name === "utensils") return <Utensils size={19} />;
  if (name === "home") return <Home size={19} />;
  if (name === "car") return <Car size={19} />;
  return <Sparkles size={19} />;
}

function GoalsView({
  ledger,
  onOpenCategory,
  onCreateCategory,
  onOpenGoal,
  onCreateGoal,
}: {
  ledger: Ledger;
  onOpenCategory: (category: BudgetCategory) => void;
  onCreateCategory: () => void;
  onOpenGoal: (goal: Goal) => void;
  onCreateGoal: () => void;
}) {
  const month = currentMonth();
  const spent = monthSpent(ledger, month);
  const plan = planTotal(ledger);
  const remaining = plan - spent;
  const used = plan > 0 ? Math.min(100, Math.round((spent / plan) * 100)) : 0;
  const left = daysLeftInMonth();
  const featured = ledger.goals.find((goal) => goal.featured) ?? ledger.goals[0];
  const saved = featured ? goalSaved(ledger, featured.id) : 0;
  const progress = featured && featured.target > 0 ? Math.min(100, Math.round((saved / featured.target) * 100)) : 0;

  return (
    <main className="goals-layout">
      <section className="budget-hero">
        <div>
          <Text className="eyebrow">AINDA PODE GASTAR</Text>
          <Heading level={2}>{money(remaining)}</Heading>
          <Text>
            de {money(plan)} · {left === 0 ? "último dia do mês" : `faltam ${left} dias`}
          </Text>
        </div>
        <div className="budget-ring" aria-label={`${used}% do orçamento usado`}>
          <span>{used}%</span>
          <small>usado</small>
        </div>
      </section>

      <section className="budget-section">
        <div className="section-heading">
          <div>
            <Text className="eyebrow">{new Date().toLocaleDateString("pt-BR", { month: "long" }).toUpperCase()}</Text>
            <Heading level={2}>Seu mês</Heading>
          </div>
          <IconButton aria-label="Criar categoria" onClick={onCreateCategory}>
            <Plus size={20} />
          </IconButton>
        </div>
        <div className="budget-grid">
          {ledger.categories.map((category) => {
            const amount = categorySpent(ledger, category.name, month);
            const percent = category.planned > 0 ? Math.round((amount / category.planned) * 100) : 0;
            return (
              <Button
                variant="ghost"
                className="budget-card"
                key={category.id}
                type="button"
                onClick={() => onOpenCategory(category)}
              >
                <span className="budget-card__top">
                  <span className="budget-card__icon">
                    <BudgetIcon name={category.icon} />
                  </span>
                  <strong>{percent}%</strong>
                </span>
                <span className="budget-card__copy">
                  <strong>{category.name}</strong>
                  <small>{money(amount)} de {money(category.planned)}</small>
                </span>
                <span className="progress progress--thin">
                  <span style={{ width: `${Math.min(percent, 100)}%` }} />
                </span>
              </Button>
            );
          })}
        </div>
      </section>

      {featured ? (
        <section className="saving-feature">
          <div className="saving-feature__top">
            <div>
              <Text className="eyebrow">GUARDANDO</Text>
              <Heading level={2}>{featured.name}</Heading>
              <Text>{formatMonthYear(featured.deadline)}</Text>
            </div>
            <div className="goal-ring" style={{ "--progress": `${progress * 3.6}deg` } as CSSProperties}>
              <span>{progress}%</span>
            </div>
          </div>
          <div className="saving-feature__value">
            <div>
              <Text>Já guardado</Text>
              <Heading level={3}>{money(saved)}</Heading>
            </div>
            <Text>Meta {money(featured.target)}</Text>
          </div>
          <Button type="button" onClick={() => onOpenGoal(featured)}>
            <Plus size={18} />
            Guardar
          </Button>
        </section>
      ) : (
        <section className="saving-feature">
          <div>
            <Text className="eyebrow">GUARDANDO</Text>
            <Heading level={2}>Nenhuma meta ainda</Heading>
            <Text>Crie um objetivo para acompanhar o que você guarda.</Text>
          </div>
          <Button type="button" onClick={onCreateGoal}>
            <Plus size={18} />
            Criar meta
          </Button>
        </section>
      )}

      <section className="panel goals-list-panel">
        <div className="section-heading">
          <div>
            <Text className="eyebrow">OUTROS PLANOS</Text>
            <Heading level={2}>Suas metas</Heading>
          </div>
          <IconButton aria-label="Criar meta" onClick={onCreateGoal}>
            <Plus size={20} />
          </IconButton>
        </div>
        <div className="goals-list">
          {ledger.goals.filter((goal) => goal.id !== featured?.id).length === 0 ? (
            featured ? null : (
              <div className="empty-state">
                <Target size={24} />
                <Text>Nenhuma meta criada.</Text>
              </div>
            )
          ) : (
            ledger.goals.filter((goal) => goal.id !== featured?.id).map((goal) => {
              const amount = goalSaved(ledger, goal.id);
              const percent = goal.target > 0 ? Math.min(100, Math.round((amount / goal.target) * 100)) : 0;
              return (
                <Button
                  variant="ghost"
                  className="goal-row"
                  key={goal.id}
                  type="button"
                  onClick={() => onOpenGoal(goal)}
                >
                  <div className="goal-row__icon">
                    <CircleDollarSign size={19} />
                  </div>
                  <div className="goal-row__content">
                    <div>
                      <Text as="strong">{goal.name}</Text>
                      <Text as="span">{money(amount)} de {money(goal.target)}</Text>
                    </div>
                    <div className="progress progress--thin">
                      <span style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <Text as="strong" className="goal-row__percent">{percent}%</Text>
                </Button>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

function NotesView({
  ledger,
  onAdd,
  onTransaction,
}: {
  ledger: Ledger;
  onAdd: () => void;
  onTransaction: (transaction: Transaction) => void;
}) {
  const transactions = byDateDesc(ledger.transactions);
  const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <main className="notes-layout">
      <section className="notes-hero">
        <div>
          <Text className="eyebrow">REGISTROS MANUAIS</Text>
          <Heading level={2}>Seu dinheiro, anotado.</Heading>
          <Text>Revise tudo o que você registrou e mantenha o mês em dia.</Text>
        </div>
        <Button type="button" onClick={onAdd}>
          <Plus size={18} />
          Nova nota
        </Button>
      </section>
      <section className="notes-summary">
        <div className="notes-summary__icon"><ReceiptText size={20} /></div>
        <div>
          <Text>Total registrado</Text>
          <Heading level={3}>{money(total)}</Heading>
        </div>
        <Text as="strong">{transactions.length} notas</Text>
      </section>
      <TransactionList transactions={transactions} meta="Tudo" onSelect={onTransaction} />
    </main>
  );
}

function AssistantView() {
  const prompts = [
    "Onde gastei mais este mês?",
    "Quanto falta para minha viagem?",
    "Como posso economizar esta semana?",
  ];
  const [draft, setDraft] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || pending) return;
    setPending(true);
    setError(null);
    setAnswer(null);
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setPending(false);
      setError("Entre na sua conta para perguntar.");
      return;
    }
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: text }),
      });
      const body = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !body.answer) {
        setError(body.error ?? "Não consegui consultar o assistente.");
      } else {
        setAnswer(body.answer);
        setDraft("");
      }
    } catch {
      setError("Não consegui consultar o assistente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="assistant-layout">
      <section className="assistant-hero">
        <div className="assistant-hero__mark"><Sparkles size={30} /></div>
        <Text className="eyebrow">ESKGO PLUS</Text>
        <Heading level={2}>Clareza para o seu dinheiro.</Heading>
        <Text>
          O assistente responde com os lançamentos, cartões e metas da sua conta.
        </Text>
        <span className="assistant-badge">Seus números</span>
      </section>
      <section className="panel assistant-prompts">
        <div className="section-heading">
          <div>
            <Text className="eyebrow">EXEMPLOS</Text>
            <Heading level={2}>Pergunte sobre seu dinheiro</Heading>
          </div>
        </div>
        <div className="assistant-prompts__list">
          {prompts.map((prompt) => (
            <Button variant="ghost" type="button" disabled={pending} key={prompt} onClick={() => void ask(prompt)}>
              <Sparkles size={17} />
              <span>{prompt}</span>
              <ChevronRight size={17} />
            </Button>
          ))}
        </div>
        {answer ? <p className="assistant-reply">{answer}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        <form
          className="assistant-composer"
          onSubmit={(event) => {
            event.preventDefault();
            void ask(draft);
          }}
        >
          <label className="sr-only" htmlFor="assistant-question">Pergunta</label>
          <input
            id="assistant-question"
            className="assistant-composer__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={pending ? "Consultando os seus números..." : "Pergunte sobre o seu mês"}
            disabled={pending}
            maxLength={500}
          />
          <button className="assistant-composer__send" type="submit" disabled={pending} aria-label="Enviar pergunta">
            <ArrowUpRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}

function BottomNavigation({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  const items = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "notes" as const, label: "Notas", icon: ReceiptText },
    { id: "assistant" as const, label: "Assistente", icon: Sparkles, featured: true },
    { id: "cards" as const, label: "Cartões", icon: CreditCard },
    { id: "goals" as const, label: "Objetivos", icon: Target },
  ];

  return (
    <nav className="bottom-navigation" aria-label="Navegação principal">
      {items.map(({ id, label, icon: Icon, featured }) => (
        <Button
          variant="ghost"
          type="button"
          className={`bottom-navigation__item ${featured ? "bottom-navigation__item--featured" : ""} ${view === id ? "is-active" : ""}`}
          onClick={() => onChange(id)}
          aria-current={view === id ? "page" : undefined}
          key={id}
        >
          <span className="bottom-navigation__icon"><Icon size={21} /></span>
          <span>{label}</span>
        </Button>
      ))}
    </nav>
  );
}

function AddExpenseForm({
  ledger,
  initial,
  onSubmit,
}: {
  ledger: Ledger;
  initial?: Transaction;
  onSubmit: (transaction: Transaction) => void;
}) {
  const [value, setValue] = useState(initial ? String(initial.amount).replace(".", ",") : "");
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? ledger.categories[0]?.name ?? "Alimentação");
  const [account, setAccount] = useState(initial?.account ?? ledger.cards[0]?.id ?? "cash");
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const names = [...new Set([...ledger.categories.map((item) => item.name), "Assinaturas", category])];

  function submit(event: FormEvent) {
    event.preventDefault();
    const amount = parseMoney(value);
    if (!amount || !name.trim()) return;
    onSubmit({
      id: initial?.id ?? uid("tx"),
      name: name.trim(),
      category,
      account,
      date,
      amount,
      icon: initial?.icon === "coffee" && category === "Alimentação" ? "coffee" : iconForCategory(category),
    });
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <div className="amount-field">
        <Text as="span">R$</Text>
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          inputMode="decimal"
          placeholder="0,00"
          aria-label="Valor da compra"
          autoFocus
        />
      </div>
      <div className="field">
        <FieldLabel htmlFor="expense-name">Descrição</FieldLabel>
        <Input
          id="expense-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Mercado"
          required
        />
      </div>
      <div className="form-grid">
        <div className="field">
          <FieldLabel htmlFor="expense-category">Categoria</FieldLabel>
          <Select id="expense-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            {names.map((item) => <option key={item}>{item}</option>)}
          </Select>
        </div>
        <div className="field">
          <FieldLabel htmlFor="expense-date">Data</FieldLabel>
          <div className="input-with-icon">
            <CalendarDays size={17} />
            <Input id="expense-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          </div>
        </div>
      </div>
      <div className="field">
        <FieldLabel htmlFor="expense-account">Como pagou</FieldLabel>
        <Select id="expense-account" value={account} onChange={(event) => setAccount(event.target.value)}>
          {ledger.cards.map((card) => (
            <option value={card.id} key={card.id}>{card.name} •• {card.lastFour}</option>
          ))}
          <option value="cash">Dinheiro / Pix</option>
        </Select>
      </div>
      <Button type="submit" className="button--full">
        <Check size={18} />
        {initial ? "Salvar alterações" : "Salvar compra"}
      </Button>
    </form>
  );
}

function CardForm({
  initial,
  onSubmit,
  onDelete,
}: {
  initial?: Card;
  onSubmit: (card: Card) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [lastFour, setLastFour] = useState(initial?.lastFour ?? "");
  const [limit, setLimit] = useState(initial ? String(initial.limit).replace(".", ",") : "");
  const [dueDay, setDueDay] = useState(String(initial?.dueDay ?? 15));
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const parsedLimit = parseMoney(limit);
    const parsedDay = Number(dueDay);
    if (!/^\d{4}$/.test(lastFour)) {
      setError("O final do cartão precisa ter 4 números.");
      return;
    }
    if (!name.trim() || parsedLimit <= 0 || parsedDay < 1 || parsedDay > 31) {
      setError("Preencha apelido, limite e um dia de vencimento entre 1 e 31.");
      return;
    }
    onSubmit({
      id: initial?.id ?? uid("card"),
      name: name.trim(),
      lastFour,
      limit: parsedLimit,
      dueDay: parsedDay,
      tone: initial?.tone ?? "cream",
    });
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <div className="field">
        <FieldLabel htmlFor="card-name">Apelido</FieldLabel>
        <Input id="card-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Dia a dia" required />
      </div>
      <div className="form-grid">
        <div className="field">
          <FieldLabel htmlFor="card-last">Final do cartão</FieldLabel>
          <Input
            id="card-last"
            value={lastFour}
            onChange={(event) => setLastFour(event.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="0000"
            inputMode="numeric"
            maxLength={4}
            required
          />
        </div>
        <div className="field">
          <FieldLabel htmlFor="card-limit">Limite</FieldLabel>
          <Input
            id="card-limit"
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
            placeholder="3.000"
            inputMode="decimal"
            required
          />
        </div>
      </div>
      <div className="field">
        <FieldLabel htmlFor="card-due">Vence todo dia</FieldLabel>
        <Input
          id="card-due"
          value={dueDay}
          onChange={(event) => setDueDay(event.target.value.replace(/\D/g, "").slice(0, 2))}
          inputMode="numeric"
          required
        />
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <Button type="submit" className="button--full"><Plus size={18} /> {initial ? "Salvar cartão" : "Adicionar cartão"}</Button>
      {onDelete ? (
        <Button type="button" variant="danger" className="button--full" onClick={onDelete}>
          <Trash2 size={18} /> Excluir cartão
        </Button>
      ) : null}
    </form>
  );
}

function CategoryForm({
  initial,
  onSubmit,
  onDelete,
}: {
  initial?: BudgetCategory;
  onSubmit: (category: BudgetCategory) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [planned, setPlanned] = useState(initial ? String(initial.planned).replace(".", ",") : "");
  const [icon, setIcon] = useState<BudgetIcon>(initial?.icon ?? "sparkle");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const amount = parseMoney(planned);
    if (!name.trim() || amount <= 0) {
      setError("Informe o nome e um valor planejado.");
      return;
    }
    onSubmit({
      id: initial?.id ?? uid("cat"),
      name: name.trim(),
      planned: amount,
      icon,
    });
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <div className="field">
        <FieldLabel htmlFor="category-name">Categoria</FieldLabel>
        <Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Saúde" required />
      </div>
      <div className="form-grid">
        <div className="field">
          <FieldLabel htmlFor="category-planned">Planejado no mês</FieldLabel>
          <Input id="category-planned" value={planned} onChange={(event) => setPlanned(event.target.value)} inputMode="decimal" placeholder="0,00" required />
        </div>
        <div className="field">
          <FieldLabel htmlFor="category-icon">Ícone</FieldLabel>
          <Select id="category-icon" value={icon} onChange={(event) => setIcon(event.target.value as BudgetIcon)}>
            <option value="utensils">Alimentação</option>
            <option value="home">Moradia</option>
            <option value="car">Transporte</option>
            <option value="sparkle">Outro</option>
          </Select>
        </div>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <Button type="submit" className="button--full"><Check size={18} /> Salvar categoria</Button>
      {onDelete ? (
        <Button type="button" variant="danger" className="button--full" onClick={onDelete}>
          <Trash2 size={18} /> Excluir categoria
        </Button>
      ) : null}
    </form>
  );
}

function GoalSheet({
  ledger,
  goal,
  onSave,
  onDelete,
  onContribute,
  onRemoveContribution,
}: {
  ledger: Ledger;
  goal?: Goal;
  onSave: (goal: Goal) => void;
  onDelete?: () => void;
  onContribute: (amount: number) => void;
  onRemoveContribution: (contribution: Contribution) => void;
}) {
  const [name, setName] = useState(goal?.name ?? "");
  const [target, setTarget] = useState(goal ? String(goal.target).replace(".", ",") : "");
  const [deadline, setDeadline] = useState(goal?.deadline ?? todayIso());
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const saved = goal ? goalSaved(ledger, goal.id) : 0;
  const contributions = byDateDesc(ledger.contributions.filter((item) => item.goalId === goal?.id));

  function submit(event: FormEvent) {
    event.preventDefault();
    const parsedTarget = parseMoney(target);
    if (!name.trim() || parsedTarget <= 0 || !deadline) {
      setError("Informe nome, valor da meta e prazo.");
      return;
    }
    onSave({
      id: goal?.id ?? uid("goal"),
      name: name.trim(),
      target: parsedTarget,
      deadline,
      featured: goal?.featured ?? false,
    });
  }

  return (
    <div className="form-stack">
      {goal ? (
        <div className="transaction-detail__amount">
          <Text>Já guardado</Text>
          <Heading level={3}>{money(saved)}</Heading>
        </div>
      ) : null}
      {goal ? (
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            const parsed = parseMoney(amount);
            if (parsed <= 0) {
              setError("Informe quanto quer guardar.");
              return;
            }
            setAmount("");
            setError(null);
            onContribute(parsed);
          }}
        >
          <div className="field">
            <FieldLabel htmlFor="goal-amount">Guardar agora</FieldLabel>
            <Input id="goal-amount" value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="500,00" />
          </div>
          <Button type="submit" className="button--full"><Plus size={18} /> Guardar valor</Button>
        </form>
      ) : null}
      {contributions.length > 0 ? (
        <div className="detail-list">
          {contributions.map((item) => (
            <div key={item.id}>
              <Text>{formatWhen(item.date)} · {money(item.amount)}</Text>
              <Button type="button" variant="ghost" onClick={() => onRemoveContribution(item)}>Desfazer</Button>
            </div>
          ))}
        </div>
      ) : null}
      <form className="form-stack" onSubmit={submit}>
        <div className="field">
          <FieldLabel htmlFor="goal-name">Nome</FieldLabel>
          <Input id="goal-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Reserva" required />
        </div>
        <div className="form-grid">
          <div className="field">
            <FieldLabel htmlFor="goal-target">Meta</FieldLabel>
            <Input id="goal-target" value={target} onChange={(event) => setTarget(event.target.value)} inputMode="decimal" placeholder="0,00" required />
          </div>
          <div className="field">
            <FieldLabel htmlFor="goal-deadline">Prazo</FieldLabel>
            <Input id="goal-deadline" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} required />
          </div>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <Button type="submit" className="button--full"><Check size={18} /> {goal ? "Salvar meta" : "Criar meta"}</Button>
        {onDelete ? (
          <Button type="button" variant="danger" className="button--full" onClick={onDelete}>
            <Trash2 size={18} /> Excluir meta
          </Button>
        ) : null}
      </form>
    </div>
  );
}

function AccountSheet({
  user,
  onToggleHide,
  onRestore,
  onLogout,
  onDelete,
}: {
  user: User;
  onToggleHide: () => void;
  onRestore: () => void;
  onLogout: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="account-sheet">
      <div className="account-profile">
        <div className="account-avatar">{initials(user.name)}</div>
        <div>
          <Heading level={3}>{user.name}</Heading>
          <Text>{user.email}</Text>
          {user.role === "admin" ? <Text className="eyebrow">Administrador</Text> : null}
        </div>
      </div>
      <div className="account-menu">
        <Button type="button" variant="ghost" onClick={onToggleHide}>
          <EyeOff size={19} />
          <span>Ocultar saldo ao abrir</span>
          <span className={`toggle ${user.hideBalanceOnOpen ? "toggle--active" : ""}`}><span /></span>
        </Button>
        <Button type="button" variant="ghost" onClick={onRestore}>
          <RotateCcw size={19} />
          <span>Restaurar dados de exemplo</span>
          <ChevronRight size={18} />
        </Button>
      </div>
      <Button type="button" variant="secondary" className="button--full" onClick={onLogout}>
        <LogOut size={18} />
        Sair da conta
      </Button>
      <Button
        type="button"
        variant="danger"
        className="button--full"
        onClick={() => {
          if (!confirmDelete) {
            setConfirmDelete(true);
            return;
          }
          onDelete();
        }}
      >
        <Trash2 size={18} />
        {confirmDelete ? "Confirmar exclusão da conta" : "Excluir conta"}
      </Button>
    </div>
  );
}

function FinanceAppInner({
  user,
  ledger,
  onUser,
  onLedger,
  onLogout,
  onDelete,
  onRestore,
}: {
  user: User;
  ledger: Ledger;
  onUser: (user: User) => Promise<string | null>;
  onLedger: (ledger: Ledger) => Promise<string | null>;
  onLogout: () => Promise<string | null>;
  onDelete: () => Promise<string | null>;
  onRestore: () => Promise<string | null>;
}) {
  const [view, setView] = useState<View>("home");
  const [sheet, setSheet] = useState<SheetName>(null);
  const [hiddenBalance, setHiddenBalance] = useState(user.hideBalanceOnOpen);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const selected = ledger.transactions.find((item) => item.id === selectedId) ?? null;
  const editing = ledger.transactions.find((item) => item.id === editingId);
  const editingCard = ledger.cards.find((item) => item.id === cardId);
  const editingCategory = ledger.categories.find((item) => item.id === categoryId);
  const editingGoal = ledger.goals.find((item) => item.id === goalId);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(message: string) {
    setToast(message);
  }

  function closeSheet() {
    setSheet(null);
  }

  async function saveTransaction(transaction: Transaction) {
    const exists = ledger.transactions.some((item) => item.id === transaction.id);
    const error = await onLedger({
      ...ledger,
      transactions: exists
        ? ledger.transactions.map((item) => (item.id === transaction.id ? transaction : item))
        : [transaction, ...ledger.transactions],
    });
    if (error) {
      notify(error);
      return;
    }
    setSelectedId(transaction.id);
    closeSheet();
    notify(exists ? "Compra atualizada" : "Compra adicionada ao seu mês");
  }

  async function deleteTransaction() {
    if (!selected) return;
    const error = await onLedger({ ...ledger, transactions: ledger.transactions.filter((item) => item.id !== selected.id) });
    if (error) {
      notify(error);
      return;
    }
    setSelectedId(null);
    closeSheet();
    notify("Compra apagada");
  }

  async function saveCard(card: Card) {
    const exists = ledger.cards.some((item) => item.id === card.id);
    const tone = exists ? card.tone : (["cream", "lilac", "lime"] as const)[ledger.cards.length % 3];
    const next = { ...card, tone };
    const error = await onLedger({
      ...ledger,
      cards: exists ? ledger.cards.map((item) => (item.id === card.id ? next : item)) : [...ledger.cards, next],
    });
    if (error) {
      notify(error);
      return;
    }
    closeSheet();
    notify(exists ? "Cartão atualizado" : "Cartão adicionado à carteira");
  }

  async function deleteCard() {
    if (!editingCard) return;
    if (ledger.transactions.some((item) => item.account === editingCard.id)) {
      notify("Esse cartão tem lançamentos. Apague os gastos antes.");
      return;
    }
    const error = await onLedger({ ...ledger, cards: ledger.cards.filter((item) => item.id !== editingCard.id) });
    if (error) {
      notify(error);
      return;
    }
    closeSheet();
    notify("Cartão apagado");
  }

  async function saveCategory(category: BudgetCategory) {
    const previous = ledger.categories.find((item) => item.id === category.id);
    const error = await onLedger({
      ...ledger,
      categories: previous
        ? ledger.categories.map((item) => (item.id === category.id ? category : item))
        : [...ledger.categories, category],
      transactions: previous && previous.name !== category.name
        ? ledger.transactions.map((item) => (
          item.category === previous.name
            ? { ...item, category: category.name, icon: iconForCategory(category.name) }
            : item
        ))
        : ledger.transactions,
    });
    if (error) {
      notify(error);
      return;
    }
    closeSheet();
    notify(previous ? "Categoria atualizada" : "Categoria criada");
  }

  async function deleteCategory() {
    if (!editingCategory) return;
    const error = await onLedger({ ...ledger, categories: ledger.categories.filter((item) => item.id !== editingCategory.id) });
    if (error) {
      notify(error);
      return;
    }
    closeSheet();
    notify("Categoria apagada");
  }

  async function saveGoal(goal: Goal) {
    const exists = ledger.goals.some((item) => item.id === goal.id);
    const error = await onLedger({
      ...ledger,
      goals: exists
        ? ledger.goals.map((item) => (item.id === goal.id ? goal : item))
        : [...ledger.goals, goal],
    });
    if (error) {
      notify(error);
      return;
    }
    setGoalId(goal.id);
    if (!exists) closeSheet();
    notify(exists ? "Meta atualizada" : "Meta criada");
  }

  async function deleteGoal() {
    if (!editingGoal) return;
    const error = await onLedger({
      ...ledger,
      goals: ledger.goals.filter((item) => item.id !== editingGoal.id),
      contributions: ledger.contributions.filter((item) => item.goalId !== editingGoal.id),
    });
    if (error) {
      notify(error);
      return;
    }
    closeSheet();
    notify("Meta apagada");
  }

  async function contribute(amount: number) {
    if (!editingGoal) return;
    const error = await onLedger({
      ...ledger,
      contributions: [
        { id: uid("ap"), goalId: editingGoal.id, amount, date: todayIso() },
        ...ledger.contributions,
      ],
    });
    if (error) {
      notify(error);
      return;
    }
    notify(`${money(amount)} guardados em ${editingGoal.name}`);
  }

  async function removeContribution(contribution: Contribution) {
    const error = await onLedger({ ...ledger, contributions: ledger.contributions.filter((item) => item.id !== contribution.id) });
    if (error) {
      notify(error);
      return;
    }
    notify("Aporte desfeito");
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />
      <div className="app-container">
        <AppHeader
          view={view}
          name={user.name}
          onBack={() => setView("home")}
          onAccount={() => setSheet("account")}
        />

        {view === "home" ? (
          <HomeView
            user={user}
            ledger={ledger}
            hidden={hiddenBalance}
            onToggleBalance={() => setHiddenBalance((current) => !current)}
            onAdd={() => {
              setEditingId(null);
              setSheet("add");
            }}
            onCards={() => setView("cards")}
            onGoals={() => setView("goals")}
            onTransaction={(transaction) => {
              setSelectedId(transaction.id);
              setSheet("transaction");
            }}
          />
        ) : view === "notes" ? (
          <NotesView
            ledger={ledger}
            onAdd={() => {
              setEditingId(null);
              setSheet("add");
            }}
            onTransaction={(transaction) => {
              setSelectedId(transaction.id);
              setSheet("transaction");
            }}
          />
        ) : view === "assistant" ? (
          <AssistantView />
        ) : view === "cards" ? (
          <CardsView
            ledger={ledger}
            onNewCard={() => {
              setCardId(null);
              setSheet("card");
            }}
            onEditCard={(card) => {
              setCardId(card.id);
              setSheet("card");
            }}
          />
        ) : (
          <GoalsView
            ledger={ledger}
            onCreateCategory={() => {
              setCategoryId(null);
              setSheet("category");
            }}
            onOpenCategory={(category) => {
              setCategoryId(category.id);
              setSheet("category");
            }}
            onCreateGoal={() => {
              setGoalId(null);
              setSheet("goal");
            }}
            onOpenGoal={(goal) => {
              setGoalId(goal.id);
              setSheet("goal");
            }}
          />
        )}
      </div>

      <BottomNavigation view={view} onChange={setView} />

      <Sheet
        open={sheet === "add"}
        title={editing ? "Editar gasto" : "Adicionar gasto"}
        eyebrow="REGISTRO MANUAL"
        onClose={closeSheet}
      >
        <AddExpenseForm key={editing?.id ?? "new"} ledger={ledger} initial={editing} onSubmit={saveTransaction} />
      </Sheet>

      <Sheet open={sheet === "account"} title="Sua conta" onClose={closeSheet}>
        <AccountSheet
          user={user}
          onToggleHide={() => {
            const hideBalanceOnOpen = !user.hideBalanceOnOpen;
            void onUser({ ...user, hideBalanceOnOpen }).then((error) => {
              if (error) {
                notify(error);
                return;
              }
              setHiddenBalance(hideBalanceOnOpen);
              notify(hideBalanceOnOpen ? "O saldo vai abrir oculto" : "O saldo vai abrir visível");
            });
          }}
          onRestore={() => {
            void onRestore().then((error) => {
              if (error) {
                notify(error);
                return;
              }
              closeSheet();
              notify("Dados de exemplo restaurados");
            });
          }}
          onLogout={() => {
            void onLogout().then((error) => {
              if (error) notify(error);
            });
          }}
          onDelete={() => {
            void onDelete().then((error) => {
              if (error) notify(error);
            });
          }}
        />
      </Sheet>

      <Sheet
        open={sheet === "transaction" && Boolean(selected)}
        title={selected?.name ?? "Detalhe da compra"}
        eyebrow="COMPRA"
        onClose={closeSheet}
      >
        {selected ? (
          <div className="transaction-detail">
            <div className="transaction-detail__amount">
              <Text>Valor</Text>
              <Heading level={3}>− {money(selected.amount)}</Heading>
            </div>
            <div className="detail-list">
              <div><Text>Categoria</Text><Text as="strong">{selected.category}</Text></div>
              <div><Text>Pagamento</Text><Text as="strong">{accountLabel(ledger, selected.account)}</Text></div>
              <div><Text>Quando</Text><Text as="strong">{formatWhen(selected.date)}</Text></div>
            </div>
            <div className="sheet-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditingId(selected.id);
                  setSheet("add");
                }}
              >
                <Pencil size={18} /> Editar
              </Button>
              <Button type="button" variant="danger" onClick={deleteTransaction}><Trash2 size={18} /> Apagar</Button>
            </div>
          </div>
        ) : null}
      </Sheet>

      <Sheet
        open={sheet === "card"}
        title={editingCard ? "Editar cartão" : "Novo cartão"}
        eyebrow="CARTEIRA"
        onClose={closeSheet}
      >
        <CardForm
          key={editingCard?.id ?? "new-card"}
          initial={editingCard}
          onSubmit={saveCard}
          onDelete={editingCard ? deleteCard : undefined}
        />
      </Sheet>

      <Sheet
        open={sheet === "category"}
        title={editingCategory ? "Editar categoria" : "Nova categoria"}
        eyebrow="ORÇAMENTO"
        onClose={closeSheet}
      >
        <CategoryForm
          key={editingCategory?.id ?? "new-category"}
          initial={editingCategory}
          onSubmit={saveCategory}
          onDelete={editingCategory ? deleteCategory : undefined}
        />
      </Sheet>

      <Sheet
        open={sheet === "goal"}
        title={editingGoal ? editingGoal.name : "Nova meta"}
        eyebrow="META"
        onClose={closeSheet}
      >
        <GoalSheet
          key={editingGoal?.id ?? "new-goal"}
          ledger={ledger}
          goal={editingGoal}
          onSave={saveGoal}
          onDelete={editingGoal ? deleteGoal : undefined}
          onContribute={contribute}
          onRemoveContribution={removeContribution}
        />
      </Sheet>

      {toast ? (
        <div className="toast" role="status">
          <span><Check size={15} /></span>
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function signedOut(): AppState {
  return { users: [], ledgers: {}, sessionUserId: null };
}

function withAccount(user: User, ledger: Ledger): AppState {
  return { users: [user], ledgers: { [user.id]: ledger }, sessionUserId: user.id };
}

export function FinanceApp() {
  const [state, setState] = useState<AppState | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const savedLedger = useRef<Ledger | null>(null);
  const currentUser = useRef<User | null>(null);
  const tail = useRef(Promise.resolve());

  function remember(user: User, ledger: Ledger) {
    currentUser.current = user;
    savedLedger.current = ledger;
    setState(withAccount(user, ledger));
  }

  function enqueue(task: () => Promise<string | null>) {
    const run = tail.current.then(task, task);
    tail.current = run.then(() => undefined, () => undefined);
    return run;
  }

  useEffect(() => {
    let active = true;
    fetchAccount()
      .then((account) => {
        if (!active) return;
        if (account) remember(account.user, account.ledger);
        else setState(signedOut());
      })
      .catch(() => {
        if (!active) return;
        setBootError("Não consegui ler o Supabase. Atualize a página.");
        setState(signedOut());
      });
    return () => {
      active = false;
    };
  }, []);

  if (!state) return <main className="auth-page" aria-busy="true" />;
  if (bootError) {
    return (
      <main className="auth-page">
        <p className="form-error">{bootError}</p>
      </main>
    );
  }

  const user = state.users.find((item) => item.id === state.sessionUserId) ?? null;
  if (!user || !state.ledgers[user.id]) {
    return (
      <AuthView
        onLogin={async (email, password) => {
          const result = await signInAccount(email, password);
          if ("error" in result) return result.error;
          remember(result.user, result.ledger);
          return null;
        }}
        onRegister={async (name, email, password) => {
          const result = await signUpAccount(name, email, password);
          if ("error" in result) return result.error;
          remember(result.user, result.ledger);
          return null;
        }}
      />
    );
  }

  const ledger = state.ledgers[user.id];

  return (
    <FinanceAppInner
      key={user.id}
      user={user}
      ledger={ledger}
      onUser={(next) => {
        currentUser.current = next;
        setState(withAccount(next, savedLedger.current ?? ledger));
        return enqueue(() => persistUser(next));
      }}
      onLedger={(next) => {
        const active = currentUser.current ?? user;
        setState(withAccount(active, next));
        return enqueue(async () => {
          const base = savedLedger.current;
          if (!base) return "Sessão expirada. Entre de novo.";
          const error = await persistLedger(active.id, base, next);
          if (error) {
            const fresh = await fetchAccount();
            if (fresh) remember(fresh.user, fresh.ledger);
            return error;
          }
          savedLedger.current = next;
          return null;
        });
      }}
      onLogout={async () => {
        const error = await enqueue(() => signOutAccount());
        if (!error) {
          currentUser.current = null;
          savedLedger.current = null;
          setState(signedOut());
        }
        return error;
      }}
      onDelete={async () => {
        const error = await enqueue(() => deleteOwnAccount());
        if (!error) {
          currentUser.current = null;
          savedLedger.current = null;
          setState(signedOut());
        }
        return error;
      }}
      onRestore={() => enqueue(async () => {
        const result = await restoreDemo(user.id);
        if ("error" in result) return result.error;
        remember(result.user, result.ledger);
        return null;
      })}
    />
  );
}
