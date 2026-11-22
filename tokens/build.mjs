import { mkdirSync, writeFileSync } from "node:fs";

const color = (value, description) => ({ $type: "color", $value: value, $description: description });
const dimension = (value, description) => ({ $type: "dimension", $value: value, $description: description });
const number = (value, description) => ({ $type: "number", $value: value, $description: description });
const text = (value, description) => ({ $type: "string", $value: value, $description: description });
const alias = (type, target, description) => ({ $type: type, $value: `{${target}}`, $description: description });

const spaceSteps = [
  0, 1, 2, 1.6, 2.4, 2.9, 3.2, 4, 4.8, 5.6, 6.4, 7.2, 8, 8.8, 9.6, 10.4, 11.2, 12, 12.8,
  13.6, 14.4, 16, 17.6, 18.4, 19.2, 20, 20.8, 21.6, 22.4, 23.2, 24, 26.4, 27.2, 28, 32, 36,
  40, 44, 48, 52, 56, 64, 72, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 288, 320,
  352, 384, 416, 448, 480,
];

function stepName(prefix, value) {
  const label = Number.isInteger(value) ? String(value) : String(value).replace(".", "-");
  return `${prefix}-${label}`;
}

const primitives = {
  "color-ink-0": color("#ffffff", "Branco puro. Entra em halos e vidro sobre o fundo escuro."),
  "color-ink-50": color("#f4f8ef", "Texto principal sobre o canvas."),
  "color-ink-300": color("#9ba79a", "Texto secundário."),
  "color-ink-500": color("#6f7d70", "Texto discreto, eyebrow e metadados."),
  "color-ink-700": color("#29362b", "Borda padrão."),
  "color-ink-750": color("#1a241c", "Borda suave."),
  "color-ink-800": color("#1b251d", "Fundo de linha, input e tile."),
  "color-ink-820": color("#121913", "Base do vidro da navegação inferior."),
  "color-ink-850": color("#151c16", "Superfície elevada e sheet."),
  "color-ink-900": color("#0d120e", "Superfície de painel."),
  "color-ink-950": color("#030503", "Canvas da aplicação."),
  "color-black-700": color("#151518", "Início do degradê do palco de cartões."),
  "color-black-800": color("#0e0e0f", "Fim do degradê do palco de cartões."),
  "color-black-900": color("#030303", "Theme color do viewport."),
  "color-black-950": color("#0a0a0a", "Tinta sobre a marca lima."),
  "color-lime-50": color("#efffda", "Lima quase branca. Cartão creme e destaque de meta."),
  "color-lime-100": color("#efffc8", "Lima suave. Ponta clara dos degradês."),
  "color-lime-300": color("#d7ff65", "Lima de marca. Ação primária e acento."),
  "color-lime-400": color("#c9ff85", "Lima clara, tom lilac do produto."),
  "color-lime-500": color("#baf52e", "Lima forte. Gradiente e estado pressionado."),
  "color-lime-600": color("#8fe52f", "Lima intensa."),
  "color-lime-700": color("#74bf18", "Lima profunda. Gráfico e cartão."),
  "color-mint-300": color("#9fffc1", "Menta. Ambiente e cartão."),
  "color-danger-200": color("#ffb9b9", "Perigo. Texto e ação destrutiva."),
  "color-black-alpha-10": color("rgba(10, 10, 10, 0.10)", "Preto da marca a 10%."),
  "color-black-alpha-12": color("rgba(10, 10, 10, 0.12)", "Preto da marca a 12%."),
  "color-black-alpha-13": color("rgba(10, 10, 10, 0.13)", "Preto da marca a 13%."),
  "color-black-alpha-15": color("rgba(10, 10, 10, 0.15)", "Preto da marca a 15%."),
  "color-black-alpha-48": color("rgba(10, 10, 10, 0.48)", "Preto da marca a 48%."),
  "color-black-alpha-50": color("rgba(10, 10, 10, 0.50)", "Preto da marca a 50%."),
  "color-black-alpha-52": color("rgba(10, 10, 10, 0.52)", "Preto da marca a 52%."),
  "color-black-alpha-56": color("rgba(10, 10, 10, 0.56)", "Preto da marca a 56%."),
  "color-black-alpha-30": color("rgba(0, 0, 0, 0.30)", "Preto a 30%. Sombra de cartão."),
  "color-black-alpha-48-shadow": color("rgba(0, 0, 0, 0.48)", "Preto a 48%. Sombra de overlay."),
  "color-black-alpha-70": color("rgba(0, 0, 0, 0.70)", "Preto a 70%. Véu do sheet."),
  "color-white-alpha-22": color("rgba(255, 255, 255, 0.22)", "Branco a 22%."),
  "color-white-alpha-30": color("rgba(255, 255, 255, 0.30)", "Branco a 30%."),
  "color-white-alpha-34": color("rgba(255, 255, 255, 0.34)", "Branco a 34%."),
  "color-white-alpha-55": color("rgba(255, 255, 255, 0.55)", "Branco a 55%."),
  "color-lime-alpha-7": color("rgba(186, 245, 46, 0.07)", "Lima forte a 7%."),
  "color-lime-alpha-9": color("rgba(186, 245, 46, 0.09)", "Lima forte a 9%."),
  "color-lime-alpha-13": color("rgba(186, 245, 46, 0.13)", "Lima forte a 13%."),
  "color-lime-alpha-14": color("rgba(186, 245, 46, 0.14)", "Lima forte a 14%."),
  "color-lime-alpha-18": color("rgba(186, 245, 46, 0.18)", "Lima forte a 18%."),
  "color-lime-alpha-22": color("rgba(186, 245, 46, 0.22)", "Lima forte a 22%."),
  "color-lime-soft-alpha-50": color("rgba(239, 255, 200, 0.50)", "Lima suave a 50%."),
  "color-lime-soft-alpha-70": color("rgba(239, 255, 200, 0.70)", "Lima suave a 70%."),
  "color-lime-soft-alpha-75": color("rgba(239, 255, 200, 0.75)", "Lima suave a 75%."),
  "color-lime-soft-alpha-80": color("rgba(239, 255, 200, 0.80)", "Lima suave a 80%."),
  "color-danger-alpha-10": color("rgba(255, 185, 185, 0.10)", "Perigo a 10%."),
  "color-ink-alpha-94": color("rgba(18, 25, 19, 0.94)", "Vidro da navegação a 94%."),
  "font-family-sans": text("Plus Jakarta Sans", "Família de texto e títulos."),
  "font-family-mono": text("IBM Plex Mono", "Família de eyebrow e selos."),
  "font-weight-400": number(400, "Regular. Texto sem peso explícito."),
  "font-weight-500": number(500, "Medium. Mono e rótulos."),
  "font-weight-600": number(600, "Semibold. Títulos e valores."),
  "font-weight-650": number(650, "Semibold alto. Display."),
  "font-weight-700": number(700, "Bold. Botões e wordmark."),
  "font-weight-750": number(750, "Black. Marca da autenticação."),
  "font-line-height-0-97": number(0.97, "Display da marca, bem fechado."),
  "font-line-height-1": number(1, "Valores e números grandes."),
  "font-line-height-1-05": number(1.05, "Títulos de autenticação e assistente."),
  "font-line-height-1-1": number(1.1, "Título do header e variação de saldo."),
  "font-line-height-1-45": number(1.45, "Nota curta."),
  "font-line-height-1-5": number(1.5, "Estado vazio."),
  "font-line-height-1-55": number(1.55, "Texto de apoio da autenticação."),
  "font-line-height-1-6": number(1.6, "Texto da marca no desktop."),
  "font-line-height-1-65": number(1.65, "Texto do assistente."),
  "font-letter-spacing-tight-7": text("-0.07em", "Tracking do hero de autenticação."),
  "font-letter-spacing-tight-6": text("-0.065em", "Tracking de saldo e orçamento."),
  "font-letter-spacing-tight-5": text("-0.06em", "Tracking de título e valor de formulário."),
  "font-letter-spacing-tight-4": text("-0.055em", "Tracking de wordmark e notas."),
  "font-letter-spacing-tight-3": text("-0.05em", "Tracking de valor de meta."),
  "font-letter-spacing-tight-2": text("-0.045em", "Tracking do header e do sheet."),
  "font-letter-spacing-tight-1": text("-0.04em", "Tracking de título de seção e mini marca."),
  "font-letter-spacing-0": text("0em", "Tracking neutro."),
  "font-letter-spacing-wide-1": text("0.08em", "Selo do assistente."),
  "font-letter-spacing-wide-2": text("0.09em", "Eyebrow."),
};

for (const size of [9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 30, 32, 34, 40, 45, 48, 51, 53, 56, 64, 66, 72, 91]) {
  primitives[stepName("font-size", size)] = dimension(`${size}px`, `Tamanho de fonte ${size}px na escala medida da interface.`);
}

for (const step of spaceSteps) {
  const name = stepName("space", step);
  primitives[name] = dimension(`${step}px`, `Gap positivo de ${step}px.`);
  if (step !== 0) {
    primitives[stepName("space-negative", step)] = dimension(`-${step}px`, `Gap negativo de ${step}px. Espelha ${name}.`);
  }
}

for (const [name, px, description] of [
  ["stroke-0", 0, "Sem traço."],
  ["stroke-1", 1, "Hairline. Borda padrão de 1px (0.0625rem)."],
  ["stroke-2", 2, "Foco. Outline de 2px (0.125rem)."],
  ["stroke-3-2", 3.2, "Progresso fino. 0.2rem."],
  ["stroke-3-5", 3.52, "Anel do item em destaque na navegação. 0.22rem."],
  ["stroke-5-6", 5.6, "Anel do orçamento. 0.35rem."],
  ["stroke-8", 8, "Trilha de progresso. 0.5rem."],
]) {
  primitives[name] = dimension(`${px}px`, description);
}

for (const [name, value, description] of [
  ["radius-0", "0px", "Sem raio."],
  ["radius-3", "3.2px", "Barras do preview de autenticação. 0.2rem."],
  ["radius-6", "5.6px", "Chip do cartão. 0.35rem."],
  ["radius-10", "9.6px", "Aba de autenticação. 0.6rem."],
  ["radius-10-4", "10.4px", "Ícone da navegação. 0.65rem."],
  ["radius-12", "12px", "Controle. 0.75rem. Raio sm."],
  ["radius-18", "17.6px", "Marca do assistente. 1.1rem."],
  ["radius-20", "20px", "Card e tile. 1.25rem. Raio md."],
  ["radius-22", "21.6px", "Navegação inferior. 1.35rem."],
  ["radius-26", "26px", "Painel. 1.625rem. Raio lg."],
  ["radius-32", "32px", "Sheet. 2rem."],
  ["radius-34", "34px", "Hero. 2.125rem. Raio xl."],
  ["radius-pill", "999px", "Pílula."],
  ["radius-full", "50%", "Círculo."],
]) {
  primitives[name] = dimension(value, description);
}

primitives["shadow-overlay"] = text("0 28px 80px rgba(0, 0, 0, 0.48)", "Sombra de navegação, sheet e toast.");
primitives["shadow-card"] = text("0 22.4px 48px rgba(0, 0, 0, 0.3)", "Sombra do cartão na carteira.");
primitives["shadow-glow"] = text("0 0 0 4.48px rgba(186, 245, 46, 0.13), 0 0 20px rgba(186, 245, 46, 0.18)", "Halo do wordmark.");
primitives["shadow-mark"] = text("0 0 48px rgba(186, 245, 46, 0.18)", "Halo da marca do assistente.");

for (const value of [0, 5, 7, 9, 10, 12, 13, 14, 15, 16, 18, 20, 22, 25, 30, 34, 35, 40, 44, 45, 48, 50, 52, 55, 56, 58, 60, 62, 64, 65, 66, 70, 75, 80, 85, 90, 94, 95, 100]) {
  primitives[stepName("opacity", value)] = number(value / 100, `Opacidade ${value}%.`);
}

for (const value of [0, 1, 2, 3, 10, 20, 30, 40, 50, 60, 70, 80]) {
  primitives[stepName("z-index", value)] = number(value, `Camada ${value}.`);
}

for (const value of [0, 180, 240, 300]) {
  primitives[stepName("duration", value)] = dimension(`${value}ms`, `Duração ${value}ms.`);
}

primitives["easing-standard"] = text("ease", "Transição de botão, borda e toggle.");
primitives["easing-emphasized"] = text("cubic-bezier(0.22, 0.8, 0.22, 1)", "Entrada do sheet.");
primitives["breakpoint-md"] = dimension("800px", "Desktop inicial. 50rem.");
primitives["breakpoint-lg"] = dimension("1100px", "Desktop largo. 68.75rem.");
primitives["breakpoint-xl"] = dimension("1920px", "Tela muito larga. 120rem.");
primitives["size-52"] = dimension("52px", "Altura mínima do botão. 3.25rem.");
primitives["size-51-2"] = dimension("51.2px", "Altura mínima do campo. 3.2rem.");
primitives["size-69-6"] = dimension("69.6px", "Altura da navegação. 4.35rem.");
primitives["size-1376"] = dimension("1376px", "Largura máxima do miolo. 86rem.");
primitives["size-1600"] = dimension("1600px", "Largura máxima em tela muito larga. 100rem.");

const semantic = {
  "color-bg-canvas": alias("color", "color-ink-950", "Fundo da página."),
  "color-bg-surface": alias("color", "color-ink-900", "Painel, formulário e resumo."),
  "color-bg-surface-raised": alias("color", "color-ink-850", "Sheet e botão de ícone."),
  "color-bg-row": alias("color", "color-ink-800", "Linha, input, aba ativa e tile."),
  "color-bg-nav": alias("color", "color-ink-alpha-94", "Vidro da navegação inferior."),
  "color-bg-stage-start": alias("color", "color-black-700", "Palco de cartões, início."),
  "color-bg-stage-end": alias("color", "color-black-800", "Palco de cartões, fim."),
  "color-bg-scrim": alias("color", "color-black-alpha-70", "Véu atrás do sheet."),
  "color-bg-brand": alias("color", "color-lime-300", "Fundo de ação primária."),
  "color-bg-brand-strong": alias("color", "color-lime-500", "Fundo de ação pressionada e gradiente."),
  "color-bg-brand-soft": alias("color", "color-lime-100", "Ponta clara dos heróis."),
  "color-bg-brand-deep": alias("color", "color-lime-700", "Base escura dos heróis e gráfico."),
  "color-bg-mint": alias("color", "color-mint-300", "Cartão e ambiente menta."),
  "color-bg-cream": alias("color", "color-lime-50", "Destaque creme e item central da navegação."),
  "color-bg-danger-subtle": alias("color", "color-danger-alpha-10", "Fundo da ação destrutiva."),
  "color-bg-brand-subtle": alias("color", "color-lime-alpha-9", "Selo e nota sobre o canvas."),
  "color-bg-inverse": alias("color", "color-black-950", "Botão escuro sobre herói lima."),
  "color-text-primary": alias("color", "color-ink-50", "Texto principal."),
  "color-text-secondary": alias("color", "color-ink-300", "Texto de apoio."),
  "color-text-muted": alias("color", "color-ink-500", "Metadado e placeholder."),
  "color-text-on-brand": alias("color", "color-black-950", "Texto sobre lima."),
  "color-text-brand": alias("color", "color-lime-300", "Acento, link e valor positivo."),
  "color-text-danger": alias("color", "color-danger-200", "Texto destrutivo."),
  "color-text-on-inverse": alias("color", "color-lime-300", "Texto lima sobre botão escuro."),
  "color-border-default": alias("color", "color-ink-700", "Borda de controle, navegação e divisor forte."),
  "color-border-subtle": alias("color", "color-ink-750", "Borda de painel e divisor de lista."),
  "color-border-focus": alias("color", "color-lime-300", "Anel de foco."),
  "color-border-brand-subtle": alias("color", "color-lime-alpha-14", "Borda da nota de protótipo."),
  "color-border-on-brand": alias("color", "color-black-alpha-12", "Divisor sobre herói lima."),
  "color-border-glass": alias("color", "color-white-alpha-34", "Borda de vidro."),
  "color-icon-brand": alias("color", "color-lime-300", "Ícone de acento."),
  "color-icon-muted": alias("color", "color-ink-500", "Ícone discreto."),
  "color-icon-on-brand": alias("color", "color-black-950", "Ícone sobre lima."),
  "color-action-primary-bg": alias("color", "color-lime-300", "Botão primário."),
  "color-action-primary-fg": alias("color", "color-black-950", "Rótulo do botão primário."),
  "color-action-secondary-bg": alias("color", "color-ink-800", "Botão secundário."),
  "color-action-secondary-fg": alias("color", "color-ink-50", "Rótulo do botão secundário."),
  "color-action-danger-bg": alias("color", "color-danger-alpha-10", "Botão destrutivo."),
  "color-action-danger-fg": alias("color", "color-danger-200", "Rótulo do botão destrutivo."),
  "color-chart-deep": alias("color", "color-lime-700", "Fatia profunda do gráfico."),
  "color-chart-lime": alias("color", "color-lime-300", "Fatia lima do gráfico."),
  "color-chart-cream": alias("color", "color-lime-50", "Fatia creme do gráfico."),
  "color-chart-empty": alias("color", "color-ink-700", "Trecho vazio do gráfico."),
  "color-selection-bg": alias("color", "color-lime-300", "Fundo da seleção de texto."),
  "color-selection-fg": alias("color", "color-black-950", "Texto selecionado."),
  "font-family-body": alias("string", "font-family-sans", "Texto, título e controle."),
  "font-family-label": alias("string", "font-family-mono", "Eyebrow e selo."),
  "font-size-caption": alias("dimension", "font-size-10", "Navegação, meta e nota."),
  "font-size-label": alias("dimension", "font-size-11", "Rótulo de campo e linha."),
  "font-size-body-sm": alias("dimension", "font-size-12", "Apoio e eyebrow visual."),
  "font-size-body": alias("dimension", "font-size-14", "Texto corrente."),
  "font-size-body-lg": alias("dimension", "font-size-16", "Controle e botão."),
  "font-size-title-sm": alias("dimension", "font-size-20", "Título de painel."),
  "font-size-title": alias("dimension", "font-size-24", "Título de sheet."),
  "font-size-title-lg": alias("dimension", "font-size-32", "Título de página."),
  "font-size-display": alias("dimension", "font-size-66", "Saldo e valor de herói."),
  "font-size-hero": alias("dimension", "font-size-91", "Hero de autenticação no desktop."),
  "font-weight-regular": alias("number", "font-weight-400", "Texto corrente."),
  "font-weight-medium": alias("number", "font-weight-500", "Rótulo mono."),
  "font-weight-semibold": alias("number", "font-weight-600", "Título e valor."),
  "font-weight-bold": alias("number", "font-weight-700", "Botão e marca."),
  "font-weight-black": alias("number", "font-weight-750", "Wordmark de autenticação."),
  "font-line-height-display": alias("number", "font-line-height-1", "Números de saldo."),
  "font-line-height-title": alias("number", "font-line-height-1-1", "Títulos de página."),
  "font-line-height-body": alias("number", "font-line-height-1-55", "Parágrafo de apoio."),
  "font-letter-spacing-display": alias("string", "font-letter-spacing-tight-6", "Valores grandes."),
  "font-letter-spacing-title": alias("string", "font-letter-spacing-tight-1", "Títulos de seção."),
  "font-letter-spacing-eyebrow": alias("string", "font-letter-spacing-wide-2", "Eyebrow."),
  "space-gap-2xs": alias("dimension", "space-4", "Gap interno de abas. 0.25rem."),
  "space-gap-xs": alias("dimension", "space-8", "Gap curto entre ícone e rótulo."),
  "space-gap-sm": alias("dimension", "space-10-4", "Gap de atalhos e categorias. 0.65rem."),
  "space-gap-md": alias("dimension", "space-16", "Gap de formulário e da home. 1rem."),
  "space-gap-lg": alias("dimension", "space-20", "Gap da home no desktop. 1.25rem."),
  "space-inset-2xs": alias("dimension", "space-4", "Respiro mínimo."),
  "space-inset-xs": alias("dimension", "space-8", "Respiro de nota."),
  "space-inset-sm": alias("dimension", "space-12", "Respiro de tile."),
  "space-inset-md": alias("dimension", "space-16", "Respiro de página no mobile."),
  "space-inset-lg": alias("dimension", "space-20", "Respiro de painel. 1.25rem."),
  "space-inset-xl": alias("dimension", "space-24", "Respiro de herói. 1.5rem."),
  "space-inset-2xl": alias("dimension", "space-32", "Respiro de página no desktop. 2rem."),
  "space-stack-xs": alias("dimension", "space-8", "Pilha curta."),
  "space-stack-sm": alias("dimension", "space-12", "Pilha de lista."),
  "space-stack-md": alias("dimension", "space-16", "Pilha de seção."),
  "space-stack-lg": alias("dimension", "space-24", "Pilha de bloco."),
  "space-stack-xl": alias("dimension", "space-32", "Pilha de header."),
  "space-offset-nav": alias("dimension", "space-negative-23-2", "O item central da navegação sobe 1.45rem."),
  "space-offset-card": alias("dimension", "space-negative-16", "Cartão recuado na pilha."),
  "space-offset-orb": alias("dimension", "space-negative-80", "Orbe do saldo fora do cartão."),
  "space-offset-ambient-sm": alias("dimension", "space-negative-128", "Ambiente curto fora da tela."),
  "space-offset-ambient-md": alias("dimension", "space-negative-160", "Ambiente médio fora da tela."),
  "space-offset-ambient-lg": alias("dimension", "space-negative-176", "Anel do assistente."),
  "space-offset-ambient-xl": alias("dimension", "space-negative-192", "Ambiente da home."),
  "space-offset-ambient-2xl": alias("dimension", "space-negative-224", "Ambiente da autenticação."),
  "space-offset-ambient-3xl": alias("dimension", "space-negative-240", "Anel da marca no desktop."),
  "space-offset-ambient-4xl": alias("dimension", "space-negative-256", "Ambiente lateral."),
  "space-offset-ambient-5xl": alias("dimension", "space-negative-288", "Ambiente inferior."),
  "space-offset-ambient-6xl": alias("dimension", "space-negative-320", "Ambiente largo."),
  "stroke-border-none": alias("dimension", "stroke-0", "Controle sem borda."),
  "stroke-border-default": alias("dimension", "stroke-1", "Borda de painel, input, lista e navegação."),
  "stroke-border-focus": alias("dimension", "stroke-2", "Anel de foco visível."),
  "stroke-border-progress": alias("dimension", "stroke-3-2", "Barra de progresso fina."),
  "stroke-border-emphasis": alias("dimension", "stroke-3-5", "Anel do atalho central."),
  "stroke-border-ring": alias("dimension", "stroke-5-6", "Anel do orçamento."),
  "stroke-border-track": alias("dimension", "stroke-8", "Altura da trilha de progresso."),
  "radius-control": alias("dimension", "radius-12", "Botão, input e aba."),
  "radius-card": alias("dimension", "radius-20", "Tile, meta e conta."),
  "radius-panel": alias("dimension", "radius-26", "Painel e cartão da carteira."),
  "radius-hero": alias("dimension", "radius-34", "Herói de saldo, meta e notas."),
  "radius-sheet": alias("dimension", "radius-32", "Sheet."),
  "radius-nav": alias("dimension", "radius-22", "Navegação inferior."),
  "radius-chip": alias("dimension", "radius-6", "Chip do cartão."),
  "radius-badge": alias("dimension", "radius-pill", "Selo, toast e toggle."),
  "radius-circle": alias("dimension", "radius-full", "Avatar, ícone circular e progresso."),
  "shadow-elevation-overlay": alias("string", "shadow-overlay", "Navegação, sheet e toast."),
  "shadow-elevation-card": alias("string", "shadow-card", "Cartão empilhado."),
  "shadow-elevation-glow": alias("string", "shadow-glow", "Wordmark."),
  "shadow-elevation-mark": alias("string", "shadow-mark", "Marca do assistente."),
  "opacity-ambient": alias("number", "opacity-9", "Brilho de ambiente da home."),
  "opacity-ambient-strong": alias("number", "opacity-16", "Brilho de ambiente da autenticação."),
  "opacity-muted": alias("number", "opacity-56", "Texto secundário sobre herói."),
  "opacity-glass": alias("number", "opacity-22", "Vidro claro."),
  "opacity-scrim": alias("number", "opacity-70", "Véu do sheet."),
  "opacity-nav": alias("number", "opacity-94", "Vidro da navegação."),
  "z-index-base": alias("number", "z-index-1", "Conteúdo acima do ambiente."),
  "z-index-raised": alias("number", "z-index-3", "Cartão ativo na pilha."),
  "z-index-sticky-nav": alias("number", "z-index-40", "Navegação inferior."),
  "z-index-overlay": alias("number", "z-index-50", "Sheet."),
  "z-index-toast": alias("number", "z-index-80", "Toast."),
  "duration-press": alias("dimension", "duration-180", "Pressão de botão e toggle."),
  "duration-toast": alias("dimension", "duration-240", "Entrada do toast."),
  "duration-sheet": alias("dimension", "duration-300", "Entrada do sheet e troca de cartão."),
  "duration-instant": alias("dimension", "duration-0", "Sem movimento, inclusive com reduced motion."),
  "easing-press": alias("string", "easing-standard", "Movimento de controle."),
  "easing-sheet": alias("string", "easing-emphasized", "Movimento do sheet."),
  "breakpoint-desktop": alias("dimension", "breakpoint-md", "A interface ganha colunas."),
  "breakpoint-desktop-wide": alias("dimension", "breakpoint-lg", "Grade de orçamento com quatro colunas."),
  "breakpoint-canvas": alias("dimension", "breakpoint-xl", "Aumenta a raiz tipográfica."),
  "size-icon-button": alias("dimension", "space-44", "Botão de ícone. 2.75rem."),
  "size-button": alias("dimension", "size-52", "Altura mínima do botão."),
  "size-input": alias("dimension", "size-51-2", "Altura mínima do campo."),
  "size-nav": alias("dimension", "size-69-6", "Altura da navegação inferior."),
  "size-page": alias("dimension", "size-1376", "Largura máxima do miolo."),
  "size-page-wide": alias("dimension", "size-1600", "Largura máxima em tela muito larga."),
};

function groupKey(name) {
  const families = [
    "font-letter-spacing",
    "font-line-height",
    "font-family",
    "font-weight",
    "font-size",
    "space-negative",
    "space-gap",
    "space-inset",
    "space-stack",
    "space-offset",
    "space",
    "color",
    "stroke",
    "radius",
    "shadow",
    "opacity",
    "z-index",
    "duration",
    "easing",
    "breakpoint",
    "size",
  ];
  return families.find((family) => name.startsWith(family)) ?? "outros";
}

function collection(tokens, collectionName) {
  return Object.fromEntries(
    Object.entries(tokens).map(([name, token]) => [
      name,
      {
        ...token,
        $extensions: { "com.eskgo.collection": collectionName, "com.eskgo.name": name },
      },
    ]),
  );
}

function cssValue(token) {
  if (typeof token.$value === "string" && token.$value.startsWith("{") && token.$value.endsWith("}")) {
    return `var(--${token.$value.slice(1, -1)})`;
  }
  if (typeof token.$value === "number") return String(token.$value);
  return token.$value;
}

function toCss(primitiveTokens, semanticTokens) {
  const lines = [
    "/* Gerado por tokens/build.mjs. Não editar à mão. */",
    ":root {",
  ];
  for (const [name, token] of Object.entries(primitiveTokens)) {
    lines.push(`  --${name}: ${cssValue(token)};`);
  }
  lines.push("");
  for (const [name, token] of Object.entries(semanticTokens)) {
    lines.push(`  --${name}: ${cssValue(token)};`);
  }
  lines.push("}", "");
  return lines.join("\n");
}

function table(tokens) {
  const groups = new Map();
  for (const [name, token] of Object.entries(tokens)) {
    const key = groupKey(name);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push([name, token]);
  }
  return [...groups.entries()]
    .map(([group, rows]) => {
      const body = rows
        .map(([name, token]) => `| \`${name}\` | \`${token.$value}\` | ${token.$description} |`)
        .join("\n");
      return `### ${group}\n\n| Token | Valor | Uso |\n| --- | --- | --- |\n${body}`;
    })
    .join("\n\n");
}

const markdown = `# Eskgo — design tokens

Duas coleções. Os nomes usam kebab e esse é o nome canônico do design system.

A coleção \`primitives\` guarda o valor cru: cor, família tipográfica, tamanho, peso, entrelinha, tracking, gap, gap negativo, stroke, raio, sombra, opacidade, camada, duração, easing e breakpoint.

A coleção \`semantic\` não tem valor solto. Cada token aponta para um primitivo com a sintaxe \`{token-primitivo}\`.

Os arquivos de máquina estão em \`tokens/primitives.json\` e \`tokens/semantic.json\`. As variáveis CSS espelhadas estão em \`app/tokens.css\`.

## Primitivos

${table(primitives)}

## Semânticos

${table(semantic)}
`;

const primitiveCollection = collection(primitives, "primitives");
const semanticCollection = collection(semantic, "semantic");

mkdirSync(new URL("../docs", import.meta.url), { recursive: true });
writeFileSync(new URL("./primitives.json", import.meta.url), `${JSON.stringify(primitiveCollection, null, 2)}\n`);
writeFileSync(new URL("./semantic.json", import.meta.url), `${JSON.stringify(semanticCollection, null, 2)}\n`);
writeFileSync(new URL("../docs/design-tokens.md", import.meta.url), markdown);
writeFileSync(new URL("../app/tokens.css", import.meta.url), toCss(primitiveCollection, semanticCollection));

console.log(`primitives ${Object.keys(primitiveCollection).length}`);
console.log(`semantic ${Object.keys(semanticCollection).length}`);
