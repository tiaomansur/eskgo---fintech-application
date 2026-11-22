import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Home,
  Landmark,
  Menu,
  MoreHorizontal,
  PiggyBank,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingDown,
  Utensils,
  WalletCards,
  X,
} from "lucide-react";
import "./styles.css";

const initialTransactions = [
  { id: 1, name: "Netflix", detail: "Assinatura • hoje", amount: -29.9, icon: "N", tone: "netflix" },
  { id: 2, name: "Uber", detail: "Transporte • hoje", amount: -18.5, icon: "U", tone: "uber" },
  { id: 3, name: "Pagamento recebido", detail: "Transferência • ontem", amount: 850, icon: "P", tone: "income" },
  { id: 4, name: "Mercado Verde", detail: "Alimentação • 18 jun", amount: -184.32, icon: "M", tone: "market" },
  { id: 5, name: "Café Orla", detail: "Alimentação • 17 jun", amount: -24, icon: "C", tone: "coffee" },
];

const cards = [
  { type: "Principal", bank: "Eskgo Black", last: "8666", value: "2.356,25", className: "card-lilac" },
  { type: "Crédito", bank: "Eskgo Lima", last: "2048", value: "1.840,70", className: "card-lime" },
  { type: "Reserva", bank: "Eskgo Flex", last: "1998", value: "5.803,04", className: "card-peach" },
];

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <span className="brand-mark"><span /></span>
      {!compact && <span>eskgo</span>}
    </div>
  );
}

function Sidebar({ page, setPage }) {
  const links = [
    ["home", Home, "Visão geral"],
    ["cards", WalletCards, "Cartões"],
    ["goals", Target, "Metas"],
  ];
  return (
    <aside className="sidebar">
      <Brand />
      <nav className="side-nav" aria-label="Navegação principal">
        <p>MENU</p>
        {links.map(([id, Icon, label]) => (
          <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
            <Icon size={19} strokeWidth={1.9} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button><Settings size={19} /><span>Configurações</span></button>
        <div className="profile-mini">
          <div className="avatar">TM</div>
          <div><strong>Tião Mansur</strong><small>Conta pessoal</small></div>
          <MoreHorizontal size={18} />
        </div>
      </div>
    </aside>
  );
}

function MobileHeader() {
  return (
    <header className="mobile-header">
      <Brand compact />
      <div className="avatar">TM</div>
      <div className="mobile-welcome"><small>Bem-vindo de volta</small><strong>Tião Mansur</strong></div>
      <button className="icon-button" aria-label="Notificações"><Bell size={20} /></button>
    </header>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div><small>QUARTA-FEIRA, 19 DE JUNHO</small><h1>Olá, Tião.</h1></div>
      <div className="top-actions">
        <label className="search"><Search size={18} /><input aria-label="Buscar" placeholder="Buscar transação" /></label>
        <button className="icon-button" aria-label="Notificações"><Bell size={20} /><i /></button>
      </div>
    </header>
  );
}

function BankCard({ card, index }) {
  return (
    <article className={`bank-card ${card.className}`} style={{ "--delay": `${index * 60}ms` }}>
      <div className="bank-card-top">
        <span className="mini-brand"><span />eskgo</span>
        <span className="contactless">)))</span>
      </div>
      <div className="bank-card-balance">
        <small>{card.type}</small>
        <strong>R$ {card.value}</strong>
      </div>
      <div className="bank-card-bottom"><span>•••• {card.last}</span><CreditCard size={24} strokeWidth={1.5} /></div>
    </article>
  );
}

function Transactions({ transactions }) {
  return (
    <section className="panel transaction-panel">
      <div className="section-heading">
        <div><span className="eyebrow">ATIVIDADE</span><h2>Transações recentes</h2></div>
        <button className="text-button">Ver todas <ArrowRight size={15} /></button>
      </div>
      <div className="transactions">
        {transactions.map((item) => (
          <button className="transaction" key={item.id}>
            <span className={`merchant-icon ${item.tone}`}>{item.icon}</span>
            <span className="transaction-info"><strong>{item.name}</strong><small>{item.detail}</small></span>
            <span className={item.amount > 0 ? "amount positive" : "amount"}>
              {item.amount > 0 ? "+" : ""}{money.format(item.amount)}
            </span>
            <ChevronRight className="row-arrow" size={18} />
          </button>
        ))}
      </div>
    </section>
  );
}

function SpendingPanel() {
  return (
    <section className="panel spending-panel">
      <div className="section-heading">
        <div><span className="eyebrow">JUNHO</span><h2>Gastos do mês</h2></div>
        <button className="period-button"><CalendarDays size={16} /> Este mês</button>
      </div>
      <div className="spending-total"><strong>R$ 3.482,60</strong><span><TrendingDown size={14} /> 8,4% menos</span></div>
      <div className="chart" aria-label="Gráfico de gastos nas últimas quatro semanas">
        {[52, 76, 45, 88, 64, 82, 58, 95, 68, 79, 52, 72, 48, 62].map((height, i) => (
          <i key={i} style={{ height: `${height}%` }} className={i === 13 ? "active" : ""} />
        ))}
      </div>
      <div className="chart-labels"><span>1 jun</span><span>7 jun</span><span>14 jun</span><span>Hoje</span></div>
      <div className="category-list">
        <div><span className="category-icon food"><Utensils size={17} /></span><p><strong>Alimentação</strong><small>32% do total</small></p><b>R$ 1.114,43</b></div>
        <div><span className="category-icon shop"><ShoppingBag size={17} /></span><p><strong>Compras</strong><small>24% do total</small></p><b>R$ 835,82</b></div>
      </div>
    </section>
  );
}

function QuickActions({ openAdd, setPage }) {
  return (
    <section className="quick-actions" aria-label="Ações rápidas">
      <button className="quick-main" onClick={openAdd}><Plus size={22} /><span><strong>Adicionar</strong><small>Novo gasto</small></span></button>
      <button onClick={() => setPage("cards")}><CreditCard size={21} /><span><strong>Cartões</strong><small>Gerenciar</small></span></button>
      <button onClick={() => setPage("goals")}><Target size={21} /><span><strong>Metas</strong><small>Acompanhar</small></span></button>
    </section>
  );
}

function HomePage({ transactions, openAdd, setPage }) {
  return (
    <>
      <section className="balance-hero">
        <div className="balance-copy">
          <span className="eyebrow">SALDO DISPONÍVEL</span>
          <div className="balance-line"><h2>R$ 9.999,99</h2><button aria-label="Opções do saldo"><MoreHorizontal /></button></div>
          <p><span><ArrowDownLeft size={13} /> R$ 850,00</span> entraram este mês</p>
        </div>
        <QuickActions openAdd={openAdd} setPage={setPage} />
      </section>

      <section className="cards-section">
        <div className="section-heading cards-heading">
          <div><span className="eyebrow">SUAS CONTAS</span><h2>Cartões</h2></div>
          <button className="text-button" onClick={() => setPage("cards")}>Gerenciar <ArrowRight size={15} /></button>
        </div>
        <div className="cards-scroll">{cards.map((card, i) => <BankCard card={card} index={i} key={card.last} />)}</div>
      </section>

      <div className="dashboard-grid">
        <SpendingPanel />
        <Transactions transactions={transactions} />
      </div>
    </>
  );
}

function CardsPage() {
  return (
    <section className="inner-page">
      <div className="page-title"><div><span className="eyebrow">CARTEIRA</span><h2>Seus cartões</h2><p>Acompanhe limites e faturas em um só lugar.</p></div><button className="primary-button"><Plus size={18} /> Novo cartão</button></div>
      <div className="cards-page-grid">
        {cards.map((card, i) => (
          <div className="card-detail panel" key={card.last}>
            <BankCard card={card} index={i} />
            <div className="limit-row"><span>Limite utilizado</span><strong>{[48, 32, 19][i]}%</strong></div>
            <div className="progress"><i style={{ width: `${[48, 32, 19][i]}%` }} /></div>
            <div className="card-meta"><span><small>Fecha em</small><strong>{[8, 14, 21][i]} dias</strong></span><span><small>Limite disponível</small><strong>R$ {["2.643,75", "3.959,30", "7.196,96"][i]}</strong></span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GoalsPage() {
  const goals = [
    { name: "Viagem para o Japão", value: "8.400", total: "15.000", percent: 56, color: "lilac" },
    { name: "Reserva de emergência", value: "12.600", total: "30.000", percent: 42, color: "lime" },
    { name: "Novo notebook", value: "4.200", total: "8.000", percent: 52, color: "peach" },
  ];
  return (
    <section className="inner-page">
      <div className="page-title"><div><span className="eyebrow">PLANOS</span><h2>Metas e conquistas</h2><p>Grandes planos começam com um próximo passo.</p></div><button className="primary-button"><Plus size={18} /> Criar meta</button></div>
      <div className="goals-grid">
        <article className="budget-card panel">
          <div className="goal-icon"><CircleDollarSign /></div><span className="eyebrow">ORÇAMENTO DE JUNHO</span>
          <h3>R$ 3.482,60 <small>de R$ 5.000,00</small></h3>
          <div className="progress large"><i style={{ width: "69.6%" }} /></div>
          <p>Você ainda pode gastar <strong>R$ 1.517,40</strong> este mês.</p>
        </article>
        {goals.map((goal) => (
          <article className="goal-card panel" key={goal.name}>
            <div className={`goal-icon ${goal.color}`}><PiggyBank /></div>
            <div className="goal-copy"><span className="eyebrow">OBJETIVO</span><h3>{goal.name}</h3></div>
            <strong className="goal-percent">{goal.percent}%</strong>
            <div className="progress"><i style={{ width: `${goal.percent}%` }} /></div>
            <p><strong>R$ {goal.value}</strong> de R$ {goal.total}</p>
            <button>Guardar agora <ArrowRight size={16} /></button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AddExpenseModal({ onClose, onAdd }) {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  function submit(e) {
    e.preventDefault();
    const parsed = Number(value.replace(",", "."));
    if (!parsed || !description.trim()) return;
    onAdd({ description: description.trim(), value: parsed });
  }
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head"><div><span className="eyebrow">NOVO LANÇAMENTO</span><h2>Adicionar gasto</h2></div><button type="button" className="icon-button" onClick={onClose}><X /></button></div>
        <label>Valor<div className="value-input"><span>R$</span><input autoFocus inputMode="decimal" placeholder="0,00" value={value} onChange={(e) => setValue(e.target.value)} /></div></label>
        <label>Descrição<input placeholder="Ex.: Almoço" value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        <div className="form-row">
          <label>Categoria<select><option>Alimentação</option><option>Transporte</option><option>Compras</option><option>Assinaturas</option></select></label>
          <label>Cartão<select><option>Eskgo Black • 8666</option><option>Eskgo Lima • 2048</option></select></label>
        </div>
        <button className="submit-button" type="submit">Adicionar gasto <ArrowRight size={18} /></button>
      </form>
    </div>
  );
}

function MobileNav({ page, setPage, openAdd }) {
  return (
    <nav className="mobile-nav" aria-label="Navegação mobile">
      <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}><Home /><span>Início</span></button>
      <button className={page === "cards" ? "active" : ""} onClick={() => setPage("cards")}><CreditCard /><span>Cartões</span></button>
      <button className="add-nav" onClick={openAdd}><Plus /></button>
      <button className={page === "goals" ? "active" : ""} onClick={() => setPage("goals")}><Target /><span>Metas</span></button>
      <button><Menu /><span>Menu</span></button>
    </nav>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [showAdd, setShowAdd] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const title = useMemo(() => ({ home: "Visão geral", cards: "Cartões", goals: "Metas" }[page]), [page]);

  function addExpense({ description, value }) {
    setTransactions((items) => [
      { id: Date.now(), name: description, detail: "Alimentação • agora", amount: -value, icon: description[0].toUpperCase(), tone: "coffee" },
      ...items,
    ]);
    setShowAdd(false);
    setPage("home");
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <main>
        <MobileHeader />
        <Topbar />
        <div className="mobile-page-label">{title}</div>
        <div className="content">
          {page === "home" && <HomePage transactions={transactions} openAdd={() => setShowAdd(true)} setPage={setPage} />}
          {page === "cards" && <CardsPage />}
          {page === "goals" && <GoalsPage />}
        </div>
      </main>
      <MobileNav page={page} setPage={setPage} openAdd={() => setShowAdd(true)} />
      {showAdd && <AddExpenseModal onClose={() => setShowAdd(false)} onAdd={addExpense} />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
