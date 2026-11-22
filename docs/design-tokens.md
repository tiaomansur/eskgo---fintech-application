# Eskgo — design tokens

Duas coleções. Os nomes usam kebab e esse é o nome canônico do design system.

A coleção `primitives` guarda o valor cru: cor, família tipográfica, tamanho, peso, entrelinha, tracking, gap, gap negativo, stroke, raio, sombra, opacidade, camada, duração, easing e breakpoint.

A coleção `semantic` não tem valor solto. Cada token aponta para um primitivo com a sintaxe `{token-primitivo}`.

Os arquivos de máquina estão em `tokens/primitives.json` e `tokens/semantic.json`. As variáveis CSS espelhadas estão em `app/tokens.css`.

## Primitivos

### color

| Token | Valor | Uso |
| --- | --- | --- |
| `color-ink-0` | `#ffffff` | Branco puro. Entra em halos e vidro sobre o fundo escuro. |
| `color-ink-50` | `#f4f8ef` | Texto principal sobre o canvas. |
| `color-ink-300` | `#9ba79a` | Texto secundário. |
| `color-ink-500` | `#6f7d70` | Texto discreto, eyebrow e metadados. |
| `color-ink-700` | `#29362b` | Borda padrão. |
| `color-ink-750` | `#1a241c` | Borda suave. |
| `color-ink-800` | `#1b251d` | Fundo de linha, input e tile. |
| `color-ink-820` | `#121913` | Base do vidro da navegação inferior. |
| `color-ink-850` | `#151c16` | Superfície elevada e sheet. |
| `color-ink-900` | `#0d120e` | Superfície de painel. |
| `color-ink-950` | `#030503` | Canvas da aplicação. |
| `color-black-700` | `#151518` | Início do degradê do palco de cartões. |
| `color-black-800` | `#0e0e0f` | Fim do degradê do palco de cartões. |
| `color-black-900` | `#030303` | Theme color do viewport. |
| `color-black-950` | `#0a0a0a` | Tinta sobre a marca lima. |
| `color-lime-50` | `#efffda` | Lima quase branca. Cartão creme e destaque de meta. |
| `color-lime-100` | `#efffc8` | Lima suave. Ponta clara dos degradês. |
| `color-lime-300` | `#d7ff65` | Lima de marca. Ação primária e acento. |
| `color-lime-400` | `#c9ff85` | Lima clara, tom lilac do produto. |
| `color-lime-500` | `#baf52e` | Lima forte. Gradiente e estado pressionado. |
| `color-lime-600` | `#8fe52f` | Lima intensa. |
| `color-lime-700` | `#74bf18` | Lima profunda. Gráfico e cartão. |
| `color-mint-300` | `#9fffc1` | Menta. Ambiente e cartão. |
| `color-danger-200` | `#ffb9b9` | Perigo. Texto e ação destrutiva. |
| `color-black-alpha-10` | `rgba(10, 10, 10, 0.10)` | Preto da marca a 10%. |
| `color-black-alpha-12` | `rgba(10, 10, 10, 0.12)` | Preto da marca a 12%. |
| `color-black-alpha-13` | `rgba(10, 10, 10, 0.13)` | Preto da marca a 13%. |
| `color-black-alpha-15` | `rgba(10, 10, 10, 0.15)` | Preto da marca a 15%. |
| `color-black-alpha-48` | `rgba(10, 10, 10, 0.48)` | Preto da marca a 48%. |
| `color-black-alpha-50` | `rgba(10, 10, 10, 0.50)` | Preto da marca a 50%. |
| `color-black-alpha-52` | `rgba(10, 10, 10, 0.52)` | Preto da marca a 52%. |
| `color-black-alpha-56` | `rgba(10, 10, 10, 0.56)` | Preto da marca a 56%. |
| `color-black-alpha-30` | `rgba(0, 0, 0, 0.30)` | Preto a 30%. Sombra de cartão. |
| `color-black-alpha-48-shadow` | `rgba(0, 0, 0, 0.48)` | Preto a 48%. Sombra de overlay. |
| `color-black-alpha-70` | `rgba(0, 0, 0, 0.70)` | Preto a 70%. Véu do sheet. |
| `color-white-alpha-22` | `rgba(255, 255, 255, 0.22)` | Branco a 22%. |
| `color-white-alpha-30` | `rgba(255, 255, 255, 0.30)` | Branco a 30%. |
| `color-white-alpha-34` | `rgba(255, 255, 255, 0.34)` | Branco a 34%. |
| `color-white-alpha-55` | `rgba(255, 255, 255, 0.55)` | Branco a 55%. |
| `color-lime-alpha-7` | `rgba(186, 245, 46, 0.07)` | Lima forte a 7%. |
| `color-lime-alpha-9` | `rgba(186, 245, 46, 0.09)` | Lima forte a 9%. |
| `color-lime-alpha-13` | `rgba(186, 245, 46, 0.13)` | Lima forte a 13%. |
| `color-lime-alpha-14` | `rgba(186, 245, 46, 0.14)` | Lima forte a 14%. |
| `color-lime-alpha-18` | `rgba(186, 245, 46, 0.18)` | Lima forte a 18%. |
| `color-lime-alpha-22` | `rgba(186, 245, 46, 0.22)` | Lima forte a 22%. |
| `color-lime-soft-alpha-50` | `rgba(239, 255, 200, 0.50)` | Lima suave a 50%. |
| `color-lime-soft-alpha-70` | `rgba(239, 255, 200, 0.70)` | Lima suave a 70%. |
| `color-lime-soft-alpha-75` | `rgba(239, 255, 200, 0.75)` | Lima suave a 75%. |
| `color-lime-soft-alpha-80` | `rgba(239, 255, 200, 0.80)` | Lima suave a 80%. |
| `color-danger-alpha-10` | `rgba(255, 185, 185, 0.10)` | Perigo a 10%. |
| `color-ink-alpha-94` | `rgba(18, 25, 19, 0.94)` | Vidro da navegação a 94%. |

### font-family

| Token | Valor | Uso |
| --- | --- | --- |
| `font-family-sans` | `Plus Jakarta Sans` | Família de texto e títulos. |
| `font-family-mono` | `IBM Plex Mono` | Família de eyebrow e selos. |

### font-weight

| Token | Valor | Uso |
| --- | --- | --- |
| `font-weight-400` | `400` | Regular. Texto sem peso explícito. |
| `font-weight-500` | `500` | Medium. Mono e rótulos. |
| `font-weight-600` | `600` | Semibold. Títulos e valores. |
| `font-weight-650` | `650` | Semibold alto. Display. |
| `font-weight-700` | `700` | Bold. Botões e wordmark. |
| `font-weight-750` | `750` | Black. Marca da autenticação. |

### font-line-height

| Token | Valor | Uso |
| --- | --- | --- |
| `font-line-height-0-97` | `0.97` | Display da marca, bem fechado. |
| `font-line-height-1` | `1` | Valores e números grandes. |
| `font-line-height-1-05` | `1.05` | Títulos de autenticação e assistente. |
| `font-line-height-1-1` | `1.1` | Título do header e variação de saldo. |
| `font-line-height-1-45` | `1.45` | Nota curta. |
| `font-line-height-1-5` | `1.5` | Estado vazio. |
| `font-line-height-1-55` | `1.55` | Texto de apoio da autenticação. |
| `font-line-height-1-6` | `1.6` | Texto da marca no desktop. |
| `font-line-height-1-65` | `1.65` | Texto do assistente. |

### font-letter-spacing

| Token | Valor | Uso |
| --- | --- | --- |
| `font-letter-spacing-tight-7` | `-0.07em` | Tracking do hero de autenticação. |
| `font-letter-spacing-tight-6` | `-0.065em` | Tracking de saldo e orçamento. |
| `font-letter-spacing-tight-5` | `-0.06em` | Tracking de título e valor de formulário. |
| `font-letter-spacing-tight-4` | `-0.055em` | Tracking de wordmark e notas. |
| `font-letter-spacing-tight-3` | `-0.05em` | Tracking de valor de meta. |
| `font-letter-spacing-tight-2` | `-0.045em` | Tracking do header e do sheet. |
| `font-letter-spacing-tight-1` | `-0.04em` | Tracking de título de seção e mini marca. |
| `font-letter-spacing-0` | `0em` | Tracking neutro. |
| `font-letter-spacing-wide-1` | `0.08em` | Selo do assistente. |
| `font-letter-spacing-wide-2` | `0.09em` | Eyebrow. |

### font-size

| Token | Valor | Uso |
| --- | --- | --- |
| `font-size-9` | `9px` | Tamanho de fonte 9px na escala medida da interface. |
| `font-size-10` | `10px` | Tamanho de fonte 10px na escala medida da interface. |
| `font-size-11` | `11px` | Tamanho de fonte 11px na escala medida da interface. |
| `font-size-12` | `12px` | Tamanho de fonte 12px na escala medida da interface. |
| `font-size-13` | `13px` | Tamanho de fonte 13px na escala medida da interface. |
| `font-size-14` | `14px` | Tamanho de fonte 14px na escala medida da interface. |
| `font-size-15` | `15px` | Tamanho de fonte 15px na escala medida da interface. |
| `font-size-16` | `16px` | Tamanho de fonte 16px na escala medida da interface. |
| `font-size-18` | `18px` | Tamanho de fonte 18px na escala medida da interface. |
| `font-size-20` | `20px` | Tamanho de fonte 20px na escala medida da interface. |
| `font-size-22` | `22px` | Tamanho de fonte 22px na escala medida da interface. |
| `font-size-24` | `24px` | Tamanho de fonte 24px na escala medida da interface. |
| `font-size-26` | `26px` | Tamanho de fonte 26px na escala medida da interface. |
| `font-size-30` | `30px` | Tamanho de fonte 30px na escala medida da interface. |
| `font-size-32` | `32px` | Tamanho de fonte 32px na escala medida da interface. |
| `font-size-34` | `34px` | Tamanho de fonte 34px na escala medida da interface. |
| `font-size-40` | `40px` | Tamanho de fonte 40px na escala medida da interface. |
| `font-size-45` | `45px` | Tamanho de fonte 45px na escala medida da interface. |
| `font-size-48` | `48px` | Tamanho de fonte 48px na escala medida da interface. |
| `font-size-51` | `51px` | Tamanho de fonte 51px na escala medida da interface. |
| `font-size-53` | `53px` | Tamanho de fonte 53px na escala medida da interface. |
| `font-size-56` | `56px` | Tamanho de fonte 56px na escala medida da interface. |
| `font-size-64` | `64px` | Tamanho de fonte 64px na escala medida da interface. |
| `font-size-66` | `66px` | Tamanho de fonte 66px na escala medida da interface. |
| `font-size-72` | `72px` | Tamanho de fonte 72px na escala medida da interface. |
| `font-size-91` | `91px` | Tamanho de fonte 91px na escala medida da interface. |

### space

| Token | Valor | Uso |
| --- | --- | --- |
| `space-0` | `0px` | Gap positivo de 0px. |
| `space-1` | `1px` | Gap positivo de 1px. |
| `space-2` | `2px` | Gap positivo de 2px. |
| `space-1-6` | `1.6px` | Gap positivo de 1.6px. |
| `space-2-4` | `2.4px` | Gap positivo de 2.4px. |
| `space-2-9` | `2.9px` | Gap positivo de 2.9px. |
| `space-3-2` | `3.2px` | Gap positivo de 3.2px. |
| `space-4` | `4px` | Gap positivo de 4px. |
| `space-4-8` | `4.8px` | Gap positivo de 4.8px. |
| `space-5-6` | `5.6px` | Gap positivo de 5.6px. |
| `space-6-4` | `6.4px` | Gap positivo de 6.4px. |
| `space-7-2` | `7.2px` | Gap positivo de 7.2px. |
| `space-8` | `8px` | Gap positivo de 8px. |
| `space-8-8` | `8.8px` | Gap positivo de 8.8px. |
| `space-9-6` | `9.6px` | Gap positivo de 9.6px. |
| `space-10-4` | `10.4px` | Gap positivo de 10.4px. |
| `space-11-2` | `11.2px` | Gap positivo de 11.2px. |
| `space-12` | `12px` | Gap positivo de 12px. |
| `space-12-8` | `12.8px` | Gap positivo de 12.8px. |
| `space-13-6` | `13.6px` | Gap positivo de 13.6px. |
| `space-14-4` | `14.4px` | Gap positivo de 14.4px. |
| `space-16` | `16px` | Gap positivo de 16px. |
| `space-17-6` | `17.6px` | Gap positivo de 17.6px. |
| `space-18-4` | `18.4px` | Gap positivo de 18.4px. |
| `space-19-2` | `19.2px` | Gap positivo de 19.2px. |
| `space-20` | `20px` | Gap positivo de 20px. |
| `space-20-8` | `20.8px` | Gap positivo de 20.8px. |
| `space-21-6` | `21.6px` | Gap positivo de 21.6px. |
| `space-22-4` | `22.4px` | Gap positivo de 22.4px. |
| `space-23-2` | `23.2px` | Gap positivo de 23.2px. |
| `space-24` | `24px` | Gap positivo de 24px. |
| `space-26-4` | `26.4px` | Gap positivo de 26.4px. |
| `space-27-2` | `27.2px` | Gap positivo de 27.2px. |
| `space-28` | `28px` | Gap positivo de 28px. |
| `space-32` | `32px` | Gap positivo de 32px. |
| `space-36` | `36px` | Gap positivo de 36px. |
| `space-40` | `40px` | Gap positivo de 40px. |
| `space-44` | `44px` | Gap positivo de 44px. |
| `space-48` | `48px` | Gap positivo de 48px. |
| `space-52` | `52px` | Gap positivo de 52px. |
| `space-56` | `56px` | Gap positivo de 56px. |
| `space-64` | `64px` | Gap positivo de 64px. |
| `space-72` | `72px` | Gap positivo de 72px. |
| `space-80` | `80px` | Gap positivo de 80px. |
| `space-96` | `96px` | Gap positivo de 96px. |
| `space-112` | `112px` | Gap positivo de 112px. |
| `space-128` | `128px` | Gap positivo de 128px. |
| `space-144` | `144px` | Gap positivo de 144px. |
| `space-160` | `160px` | Gap positivo de 160px. |
| `space-176` | `176px` | Gap positivo de 176px. |
| `space-192` | `192px` | Gap positivo de 192px. |
| `space-208` | `208px` | Gap positivo de 208px. |
| `space-224` | `224px` | Gap positivo de 224px. |
| `space-240` | `240px` | Gap positivo de 240px. |
| `space-256` | `256px` | Gap positivo de 256px. |
| `space-288` | `288px` | Gap positivo de 288px. |
| `space-320` | `320px` | Gap positivo de 320px. |
| `space-352` | `352px` | Gap positivo de 352px. |
| `space-384` | `384px` | Gap positivo de 384px. |
| `space-416` | `416px` | Gap positivo de 416px. |
| `space-448` | `448px` | Gap positivo de 448px. |
| `space-480` | `480px` | Gap positivo de 480px. |

### space-negative

| Token | Valor | Uso |
| --- | --- | --- |
| `space-negative-1` | `-1px` | Gap negativo de 1px. Espelha space-1. |
| `space-negative-2` | `-2px` | Gap negativo de 2px. Espelha space-2. |
| `space-negative-1-6` | `-1.6px` | Gap negativo de 1.6px. Espelha space-1-6. |
| `space-negative-2-4` | `-2.4px` | Gap negativo de 2.4px. Espelha space-2-4. |
| `space-negative-2-9` | `-2.9px` | Gap negativo de 2.9px. Espelha space-2-9. |
| `space-negative-3-2` | `-3.2px` | Gap negativo de 3.2px. Espelha space-3-2. |
| `space-negative-4` | `-4px` | Gap negativo de 4px. Espelha space-4. |
| `space-negative-4-8` | `-4.8px` | Gap negativo de 4.8px. Espelha space-4-8. |
| `space-negative-5-6` | `-5.6px` | Gap negativo de 5.6px. Espelha space-5-6. |
| `space-negative-6-4` | `-6.4px` | Gap negativo de 6.4px. Espelha space-6-4. |
| `space-negative-7-2` | `-7.2px` | Gap negativo de 7.2px. Espelha space-7-2. |
| `space-negative-8` | `-8px` | Gap negativo de 8px. Espelha space-8. |
| `space-negative-8-8` | `-8.8px` | Gap negativo de 8.8px. Espelha space-8-8. |
| `space-negative-9-6` | `-9.6px` | Gap negativo de 9.6px. Espelha space-9-6. |
| `space-negative-10-4` | `-10.4px` | Gap negativo de 10.4px. Espelha space-10-4. |
| `space-negative-11-2` | `-11.2px` | Gap negativo de 11.2px. Espelha space-11-2. |
| `space-negative-12` | `-12px` | Gap negativo de 12px. Espelha space-12. |
| `space-negative-12-8` | `-12.8px` | Gap negativo de 12.8px. Espelha space-12-8. |
| `space-negative-13-6` | `-13.6px` | Gap negativo de 13.6px. Espelha space-13-6. |
| `space-negative-14-4` | `-14.4px` | Gap negativo de 14.4px. Espelha space-14-4. |
| `space-negative-16` | `-16px` | Gap negativo de 16px. Espelha space-16. |
| `space-negative-17-6` | `-17.6px` | Gap negativo de 17.6px. Espelha space-17-6. |
| `space-negative-18-4` | `-18.4px` | Gap negativo de 18.4px. Espelha space-18-4. |
| `space-negative-19-2` | `-19.2px` | Gap negativo de 19.2px. Espelha space-19-2. |
| `space-negative-20` | `-20px` | Gap negativo de 20px. Espelha space-20. |
| `space-negative-20-8` | `-20.8px` | Gap negativo de 20.8px. Espelha space-20-8. |
| `space-negative-21-6` | `-21.6px` | Gap negativo de 21.6px. Espelha space-21-6. |
| `space-negative-22-4` | `-22.4px` | Gap negativo de 22.4px. Espelha space-22-4. |
| `space-negative-23-2` | `-23.2px` | Gap negativo de 23.2px. Espelha space-23-2. |
| `space-negative-24` | `-24px` | Gap negativo de 24px. Espelha space-24. |
| `space-negative-26-4` | `-26.4px` | Gap negativo de 26.4px. Espelha space-26-4. |
| `space-negative-27-2` | `-27.2px` | Gap negativo de 27.2px. Espelha space-27-2. |
| `space-negative-28` | `-28px` | Gap negativo de 28px. Espelha space-28. |
| `space-negative-32` | `-32px` | Gap negativo de 32px. Espelha space-32. |
| `space-negative-36` | `-36px` | Gap negativo de 36px. Espelha space-36. |
| `space-negative-40` | `-40px` | Gap negativo de 40px. Espelha space-40. |
| `space-negative-44` | `-44px` | Gap negativo de 44px. Espelha space-44. |
| `space-negative-48` | `-48px` | Gap negativo de 48px. Espelha space-48. |
| `space-negative-52` | `-52px` | Gap negativo de 52px. Espelha space-52. |
| `space-negative-56` | `-56px` | Gap negativo de 56px. Espelha space-56. |
| `space-negative-64` | `-64px` | Gap negativo de 64px. Espelha space-64. |
| `space-negative-72` | `-72px` | Gap negativo de 72px. Espelha space-72. |
| `space-negative-80` | `-80px` | Gap negativo de 80px. Espelha space-80. |
| `space-negative-96` | `-96px` | Gap negativo de 96px. Espelha space-96. |
| `space-negative-112` | `-112px` | Gap negativo de 112px. Espelha space-112. |
| `space-negative-128` | `-128px` | Gap negativo de 128px. Espelha space-128. |
| `space-negative-144` | `-144px` | Gap negativo de 144px. Espelha space-144. |
| `space-negative-160` | `-160px` | Gap negativo de 160px. Espelha space-160. |
| `space-negative-176` | `-176px` | Gap negativo de 176px. Espelha space-176. |
| `space-negative-192` | `-192px` | Gap negativo de 192px. Espelha space-192. |
| `space-negative-208` | `-208px` | Gap negativo de 208px. Espelha space-208. |
| `space-negative-224` | `-224px` | Gap negativo de 224px. Espelha space-224. |
| `space-negative-240` | `-240px` | Gap negativo de 240px. Espelha space-240. |
| `space-negative-256` | `-256px` | Gap negativo de 256px. Espelha space-256. |
| `space-negative-288` | `-288px` | Gap negativo de 288px. Espelha space-288. |
| `space-negative-320` | `-320px` | Gap negativo de 320px. Espelha space-320. |
| `space-negative-352` | `-352px` | Gap negativo de 352px. Espelha space-352. |
| `space-negative-384` | `-384px` | Gap negativo de 384px. Espelha space-384. |
| `space-negative-416` | `-416px` | Gap negativo de 416px. Espelha space-416. |
| `space-negative-448` | `-448px` | Gap negativo de 448px. Espelha space-448. |
| `space-negative-480` | `-480px` | Gap negativo de 480px. Espelha space-480. |

### stroke

| Token | Valor | Uso |
| --- | --- | --- |
| `stroke-0` | `0px` | Sem traço. |
| `stroke-1` | `1px` | Hairline. Borda padrão de 1px (0.0625rem). |
| `stroke-2` | `2px` | Foco. Outline de 2px (0.125rem). |
| `stroke-3-2` | `3.2px` | Progresso fino. 0.2rem. |
| `stroke-3-5` | `3.52px` | Anel do item em destaque na navegação. 0.22rem. |
| `stroke-5-6` | `5.6px` | Anel do orçamento. 0.35rem. |
| `stroke-8` | `8px` | Trilha de progresso. 0.5rem. |

### radius

| Token | Valor | Uso |
| --- | --- | --- |
| `radius-0` | `0px` | Sem raio. |
| `radius-3` | `3.2px` | Barras do preview de autenticação. 0.2rem. |
| `radius-6` | `5.6px` | Chip do cartão. 0.35rem. |
| `radius-10` | `9.6px` | Aba de autenticação. 0.6rem. |
| `radius-10-4` | `10.4px` | Ícone da navegação. 0.65rem. |
| `radius-12` | `12px` | Controle. 0.75rem. Raio sm. |
| `radius-18` | `17.6px` | Marca do assistente. 1.1rem. |
| `radius-20` | `20px` | Card e tile. 1.25rem. Raio md. |
| `radius-22` | `21.6px` | Navegação inferior. 1.35rem. |
| `radius-26` | `26px` | Painel. 1.625rem. Raio lg. |
| `radius-32` | `32px` | Sheet. 2rem. |
| `radius-34` | `34px` | Hero. 2.125rem. Raio xl. |
| `radius-pill` | `999px` | Pílula. |
| `radius-full` | `50%` | Círculo. |

### shadow

| Token | Valor | Uso |
| --- | --- | --- |
| `shadow-overlay` | `0 28px 80px rgba(0, 0, 0, 0.48)` | Sombra de navegação, sheet e toast. |
| `shadow-card` | `0 22.4px 48px rgba(0, 0, 0, 0.3)` | Sombra do cartão na carteira. |
| `shadow-glow` | `0 0 0 4.48px rgba(186, 245, 46, 0.13), 0 0 20px rgba(186, 245, 46, 0.18)` | Halo do wordmark. |
| `shadow-mark` | `0 0 48px rgba(186, 245, 46, 0.18)` | Halo da marca do assistente. |

### opacity

| Token | Valor | Uso |
| --- | --- | --- |
| `opacity-0` | `0` | Opacidade 0%. |
| `opacity-5` | `0.05` | Opacidade 5%. |
| `opacity-7` | `0.07` | Opacidade 7%. |
| `opacity-9` | `0.09` | Opacidade 9%. |
| `opacity-10` | `0.1` | Opacidade 10%. |
| `opacity-12` | `0.12` | Opacidade 12%. |
| `opacity-13` | `0.13` | Opacidade 13%. |
| `opacity-14` | `0.14` | Opacidade 14%. |
| `opacity-15` | `0.15` | Opacidade 15%. |
| `opacity-16` | `0.16` | Opacidade 16%. |
| `opacity-18` | `0.18` | Opacidade 18%. |
| `opacity-20` | `0.2` | Opacidade 20%. |
| `opacity-22` | `0.22` | Opacidade 22%. |
| `opacity-25` | `0.25` | Opacidade 25%. |
| `opacity-30` | `0.3` | Opacidade 30%. |
| `opacity-34` | `0.34` | Opacidade 34%. |
| `opacity-35` | `0.35` | Opacidade 35%. |
| `opacity-40` | `0.4` | Opacidade 40%. |
| `opacity-44` | `0.44` | Opacidade 44%. |
| `opacity-45` | `0.45` | Opacidade 45%. |
| `opacity-48` | `0.48` | Opacidade 48%. |
| `opacity-50` | `0.5` | Opacidade 50%. |
| `opacity-52` | `0.52` | Opacidade 52%. |
| `opacity-55` | `0.55` | Opacidade 55%. |
| `opacity-56` | `0.56` | Opacidade 56%. |
| `opacity-58` | `0.58` | Opacidade 58%. |
| `opacity-60` | `0.6` | Opacidade 60%. |
| `opacity-62` | `0.62` | Opacidade 62%. |
| `opacity-64` | `0.64` | Opacidade 64%. |
| `opacity-65` | `0.65` | Opacidade 65%. |
| `opacity-66` | `0.66` | Opacidade 66%. |
| `opacity-70` | `0.7` | Opacidade 70%. |
| `opacity-75` | `0.75` | Opacidade 75%. |
| `opacity-80` | `0.8` | Opacidade 80%. |
| `opacity-85` | `0.85` | Opacidade 85%. |
| `opacity-90` | `0.9` | Opacidade 90%. |
| `opacity-94` | `0.94` | Opacidade 94%. |
| `opacity-95` | `0.95` | Opacidade 95%. |
| `opacity-100` | `1` | Opacidade 100%. |

### z-index

| Token | Valor | Uso |
| --- | --- | --- |
| `z-index-0` | `0` | Camada 0. |
| `z-index-1` | `1` | Camada 1. |
| `z-index-2` | `2` | Camada 2. |
| `z-index-3` | `3` | Camada 3. |
| `z-index-10` | `10` | Camada 10. |
| `z-index-20` | `20` | Camada 20. |
| `z-index-30` | `30` | Camada 30. |
| `z-index-40` | `40` | Camada 40. |
| `z-index-50` | `50` | Camada 50. |
| `z-index-60` | `60` | Camada 60. |
| `z-index-70` | `70` | Camada 70. |
| `z-index-80` | `80` | Camada 80. |

### duration

| Token | Valor | Uso |
| --- | --- | --- |
| `duration-0` | `0ms` | Duração 0ms. |
| `duration-180` | `180ms` | Duração 180ms. |
| `duration-240` | `240ms` | Duração 240ms. |
| `duration-300` | `300ms` | Duração 300ms. |

### easing

| Token | Valor | Uso |
| --- | --- | --- |
| `easing-standard` | `ease` | Transição de botão, borda e toggle. |
| `easing-emphasized` | `cubic-bezier(0.22, 0.8, 0.22, 1)` | Entrada do sheet. |

### breakpoint

| Token | Valor | Uso |
| --- | --- | --- |
| `breakpoint-md` | `800px` | Desktop inicial. 50rem. |
| `breakpoint-lg` | `1100px` | Desktop largo. 68.75rem. |
| `breakpoint-xl` | `1920px` | Tela muito larga. 120rem. |

### size

| Token | Valor | Uso |
| --- | --- | --- |
| `size-52` | `52px` | Altura mínima do botão. 3.25rem. |
| `size-51-2` | `51.2px` | Altura mínima do campo. 3.2rem. |
| `size-69-6` | `69.6px` | Altura da navegação. 4.35rem. |
| `size-1376` | `1376px` | Largura máxima do miolo. 86rem. |
| `size-1600` | `1600px` | Largura máxima em tela muito larga. 100rem. |

## Semânticos

### color

| Token | Valor | Uso |
| --- | --- | --- |
| `color-bg-canvas` | `{color-ink-950}` | Fundo da página. |
| `color-bg-surface` | `{color-ink-900}` | Painel, formulário e resumo. |
| `color-bg-surface-raised` | `{color-ink-850}` | Sheet e botão de ícone. |
| `color-bg-row` | `{color-ink-800}` | Linha, input, aba ativa e tile. |
| `color-bg-nav` | `{color-ink-alpha-94}` | Vidro da navegação inferior. |
| `color-bg-stage-start` | `{color-black-700}` | Palco de cartões, início. |
| `color-bg-stage-end` | `{color-black-800}` | Palco de cartões, fim. |
| `color-bg-scrim` | `{color-black-alpha-70}` | Véu atrás do sheet. |
| `color-bg-brand` | `{color-lime-300}` | Fundo de ação primária. |
| `color-bg-brand-strong` | `{color-lime-500}` | Fundo de ação pressionada e gradiente. |
| `color-bg-brand-soft` | `{color-lime-100}` | Ponta clara dos heróis. |
| `color-bg-brand-deep` | `{color-lime-700}` | Base escura dos heróis e gráfico. |
| `color-bg-mint` | `{color-mint-300}` | Cartão e ambiente menta. |
| `color-bg-cream` | `{color-lime-50}` | Destaque creme e item central da navegação. |
| `color-bg-danger-subtle` | `{color-danger-alpha-10}` | Fundo da ação destrutiva. |
| `color-bg-brand-subtle` | `{color-lime-alpha-9}` | Selo e nota sobre o canvas. |
| `color-bg-inverse` | `{color-black-950}` | Botão escuro sobre herói lima. |
| `color-text-primary` | `{color-ink-50}` | Texto principal. |
| `color-text-secondary` | `{color-ink-300}` | Texto de apoio. |
| `color-text-muted` | `{color-ink-500}` | Metadado e placeholder. |
| `color-text-on-brand` | `{color-black-950}` | Texto sobre lima. |
| `color-text-brand` | `{color-lime-300}` | Acento, link e valor positivo. |
| `color-text-danger` | `{color-danger-200}` | Texto destrutivo. |
| `color-text-on-inverse` | `{color-lime-300}` | Texto lima sobre botão escuro. |
| `color-border-default` | `{color-ink-700}` | Borda de controle, navegação e divisor forte. |
| `color-border-subtle` | `{color-ink-750}` | Borda de painel e divisor de lista. |
| `color-border-focus` | `{color-lime-300}` | Anel de foco. |
| `color-border-brand-subtle` | `{color-lime-alpha-14}` | Borda da nota de protótipo. |
| `color-border-on-brand` | `{color-black-alpha-12}` | Divisor sobre herói lima. |
| `color-border-glass` | `{color-white-alpha-34}` | Borda de vidro. |
| `color-icon-brand` | `{color-lime-300}` | Ícone de acento. |
| `color-icon-muted` | `{color-ink-500}` | Ícone discreto. |
| `color-icon-on-brand` | `{color-black-950}` | Ícone sobre lima. |
| `color-action-primary-bg` | `{color-lime-300}` | Botão primário. |
| `color-action-primary-fg` | `{color-black-950}` | Rótulo do botão primário. |
| `color-action-secondary-bg` | `{color-ink-800}` | Botão secundário. |
| `color-action-secondary-fg` | `{color-ink-50}` | Rótulo do botão secundário. |
| `color-action-danger-bg` | `{color-danger-alpha-10}` | Botão destrutivo. |
| `color-action-danger-fg` | `{color-danger-200}` | Rótulo do botão destrutivo. |
| `color-chart-deep` | `{color-lime-700}` | Fatia profunda do gráfico. |
| `color-chart-lime` | `{color-lime-300}` | Fatia lima do gráfico. |
| `color-chart-cream` | `{color-lime-50}` | Fatia creme do gráfico. |
| `color-chart-empty` | `{color-ink-700}` | Trecho vazio do gráfico. |
| `color-selection-bg` | `{color-lime-300}` | Fundo da seleção de texto. |
| `color-selection-fg` | `{color-black-950}` | Texto selecionado. |

### font-family

| Token | Valor | Uso |
| --- | --- | --- |
| `font-family-body` | `{font-family-sans}` | Texto, título e controle. |
| `font-family-label` | `{font-family-mono}` | Eyebrow e selo. |

### font-size

| Token | Valor | Uso |
| --- | --- | --- |
| `font-size-caption` | `{font-size-10}` | Navegação, meta e nota. |
| `font-size-label` | `{font-size-11}` | Rótulo de campo e linha. |
| `font-size-body-sm` | `{font-size-12}` | Apoio e eyebrow visual. |
| `font-size-body` | `{font-size-14}` | Texto corrente. |
| `font-size-body-lg` | `{font-size-16}` | Controle e botão. |
| `font-size-title-sm` | `{font-size-20}` | Título de painel. |
| `font-size-title` | `{font-size-24}` | Título de sheet. |
| `font-size-title-lg` | `{font-size-32}` | Título de página. |
| `font-size-display` | `{font-size-66}` | Saldo e valor de herói. |
| `font-size-hero` | `{font-size-91}` | Hero de autenticação no desktop. |

### font-weight

| Token | Valor | Uso |
| --- | --- | --- |
| `font-weight-regular` | `{font-weight-400}` | Texto corrente. |
| `font-weight-medium` | `{font-weight-500}` | Rótulo mono. |
| `font-weight-semibold` | `{font-weight-600}` | Título e valor. |
| `font-weight-bold` | `{font-weight-700}` | Botão e marca. |
| `font-weight-black` | `{font-weight-750}` | Wordmark de autenticação. |

### font-line-height

| Token | Valor | Uso |
| --- | --- | --- |
| `font-line-height-display` | `{font-line-height-1}` | Números de saldo. |
| `font-line-height-title` | `{font-line-height-1-1}` | Títulos de página. |
| `font-line-height-body` | `{font-line-height-1-55}` | Parágrafo de apoio. |

### font-letter-spacing

| Token | Valor | Uso |
| --- | --- | --- |
| `font-letter-spacing-display` | `{font-letter-spacing-tight-6}` | Valores grandes. |
| `font-letter-spacing-title` | `{font-letter-spacing-tight-1}` | Títulos de seção. |
| `font-letter-spacing-eyebrow` | `{font-letter-spacing-wide-2}` | Eyebrow. |

### space-gap

| Token | Valor | Uso |
| --- | --- | --- |
| `space-gap-2xs` | `{space-4}` | Gap interno de abas. 0.25rem. |
| `space-gap-xs` | `{space-8}` | Gap curto entre ícone e rótulo. |
| `space-gap-sm` | `{space-10-4}` | Gap de atalhos e categorias. 0.65rem. |
| `space-gap-md` | `{space-16}` | Gap de formulário e da home. 1rem. |
| `space-gap-lg` | `{space-20}` | Gap da home no desktop. 1.25rem. |

### space-inset

| Token | Valor | Uso |
| --- | --- | --- |
| `space-inset-2xs` | `{space-4}` | Respiro mínimo. |
| `space-inset-xs` | `{space-8}` | Respiro de nota. |
| `space-inset-sm` | `{space-12}` | Respiro de tile. |
| `space-inset-md` | `{space-16}` | Respiro de página no mobile. |
| `space-inset-lg` | `{space-20}` | Respiro de painel. 1.25rem. |
| `space-inset-xl` | `{space-24}` | Respiro de herói. 1.5rem. |
| `space-inset-2xl` | `{space-32}` | Respiro de página no desktop. 2rem. |

### space-stack

| Token | Valor | Uso |
| --- | --- | --- |
| `space-stack-xs` | `{space-8}` | Pilha curta. |
| `space-stack-sm` | `{space-12}` | Pilha de lista. |
| `space-stack-md` | `{space-16}` | Pilha de seção. |
| `space-stack-lg` | `{space-24}` | Pilha de bloco. |
| `space-stack-xl` | `{space-32}` | Pilha de header. |

### space-offset

| Token | Valor | Uso |
| --- | --- | --- |
| `space-offset-nav` | `{space-negative-23-2}` | O item central da navegação sobe 1.45rem. |
| `space-offset-card` | `{space-negative-16}` | Cartão recuado na pilha. |
| `space-offset-orb` | `{space-negative-80}` | Orbe do saldo fora do cartão. |
| `space-offset-ambient-sm` | `{space-negative-128}` | Ambiente curto fora da tela. |
| `space-offset-ambient-md` | `{space-negative-160}` | Ambiente médio fora da tela. |
| `space-offset-ambient-lg` | `{space-negative-176}` | Anel do assistente. |
| `space-offset-ambient-xl` | `{space-negative-192}` | Ambiente da home. |
| `space-offset-ambient-2xl` | `{space-negative-224}` | Ambiente da autenticação. |
| `space-offset-ambient-3xl` | `{space-negative-240}` | Anel da marca no desktop. |
| `space-offset-ambient-4xl` | `{space-negative-256}` | Ambiente lateral. |
| `space-offset-ambient-5xl` | `{space-negative-288}` | Ambiente inferior. |
| `space-offset-ambient-6xl` | `{space-negative-320}` | Ambiente largo. |

### stroke

| Token | Valor | Uso |
| --- | --- | --- |
| `stroke-border-none` | `{stroke-0}` | Controle sem borda. |
| `stroke-border-default` | `{stroke-1}` | Borda de painel, input, lista e navegação. |
| `stroke-border-focus` | `{stroke-2}` | Anel de foco visível. |
| `stroke-border-progress` | `{stroke-3-2}` | Barra de progresso fina. |
| `stroke-border-emphasis` | `{stroke-3-5}` | Anel do atalho central. |
| `stroke-border-ring` | `{stroke-5-6}` | Anel do orçamento. |
| `stroke-border-track` | `{stroke-8}` | Altura da trilha de progresso. |

### radius

| Token | Valor | Uso |
| --- | --- | --- |
| `radius-control` | `{radius-12}` | Botão, input e aba. |
| `radius-card` | `{radius-20}` | Tile, meta e conta. |
| `radius-panel` | `{radius-26}` | Painel e cartão da carteira. |
| `radius-hero` | `{radius-34}` | Herói de saldo, meta e notas. |
| `radius-sheet` | `{radius-32}` | Sheet. |
| `radius-nav` | `{radius-22}` | Navegação inferior. |
| `radius-chip` | `{radius-6}` | Chip do cartão. |
| `radius-badge` | `{radius-pill}` | Selo, toast e toggle. |
| `radius-circle` | `{radius-full}` | Avatar, ícone circular e progresso. |

### shadow

| Token | Valor | Uso |
| --- | --- | --- |
| `shadow-elevation-overlay` | `{shadow-overlay}` | Navegação, sheet e toast. |
| `shadow-elevation-card` | `{shadow-card}` | Cartão empilhado. |
| `shadow-elevation-glow` | `{shadow-glow}` | Wordmark. |
| `shadow-elevation-mark` | `{shadow-mark}` | Marca do assistente. |

### opacity

| Token | Valor | Uso |
| --- | --- | --- |
| `opacity-ambient` | `{opacity-9}` | Brilho de ambiente da home. |
| `opacity-ambient-strong` | `{opacity-16}` | Brilho de ambiente da autenticação. |
| `opacity-muted` | `{opacity-56}` | Texto secundário sobre herói. |
| `opacity-glass` | `{opacity-22}` | Vidro claro. |
| `opacity-scrim` | `{opacity-70}` | Véu do sheet. |
| `opacity-nav` | `{opacity-94}` | Vidro da navegação. |

### z-index

| Token | Valor | Uso |
| --- | --- | --- |
| `z-index-base` | `{z-index-1}` | Conteúdo acima do ambiente. |
| `z-index-raised` | `{z-index-3}` | Cartão ativo na pilha. |
| `z-index-sticky-nav` | `{z-index-40}` | Navegação inferior. |
| `z-index-overlay` | `{z-index-50}` | Sheet. |
| `z-index-toast` | `{z-index-80}` | Toast. |

### duration

| Token | Valor | Uso |
| --- | --- | --- |
| `duration-press` | `{duration-180}` | Pressão de botão e toggle. |
| `duration-toast` | `{duration-240}` | Entrada do toast. |
| `duration-sheet` | `{duration-300}` | Entrada do sheet e troca de cartão. |
| `duration-instant` | `{duration-0}` | Sem movimento, inclusive com reduced motion. |

### easing

| Token | Valor | Uso |
| --- | --- | --- |
| `easing-press` | `{easing-standard}` | Movimento de controle. |
| `easing-sheet` | `{easing-emphasized}` | Movimento do sheet. |

### breakpoint

| Token | Valor | Uso |
| --- | --- | --- |
| `breakpoint-desktop` | `{breakpoint-md}` | A interface ganha colunas. |
| `breakpoint-desktop-wide` | `{breakpoint-lg}` | Grade de orçamento com quatro colunas. |
| `breakpoint-canvas` | `{breakpoint-xl}` | Aumenta a raiz tipográfica. |

### size

| Token | Valor | Uso |
| --- | --- | --- |
| `size-icon-button` | `{space-44}` | Botão de ícone. 2.75rem. |
| `size-button` | `{size-52}` | Altura mínima do botão. |
| `size-input` | `{size-51-2}` | Altura mínima do campo. |
| `size-nav` | `{size-69-6}` | Altura da navegação inferior. |
| `size-page` | `{size-1376}` | Largura máxima do miolo. |
| `size-page-wide` | `{size-1600}` | Largura máxima em tela muito larga. |
