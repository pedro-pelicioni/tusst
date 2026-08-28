# TUSST v2 — Dossiê de contexto completo

> **Para quem é este documento:** o time da Nearx e qualquer agente de IA/sessão futura que
> pegue este trabalho. Ele assume ZERO contexto sobre a v2 e existe para que ninguém precise
> reconstruir decisões por arqueologia de commits. Regra do dono: **"não perca nada"**.
>
> **Data de referência:** 28/08/2026. As Fases A, B e C estão commitadas; o incremento
> pós-C abre o lab de passkey com deploy real e verificação do código on-chain. Antes de
> mexer, rode `git status` e leia as seções 12 e 14.

---

## 1. TL;DR

1. A v2 é uma **reestruturação completa do TUSST** (poupando apenas a landing), decidida em 28/08/2026 após o Kaan (SDF) recusar o pitch do TUSST como sucessor do Stellar Quest.
2. O produto deixa de ser "campanha Rust de 8 atos" e vira **dois caminhos de aprendizado + a Forge expandida**: a **Jornada do Builder** (essencial, `/journey`) e a **Campanha Rust** (opcional, `/campaign`), com os **Labs guiados on-chain** morando na marca Forge (`/labs`) ao lado do IDE livre (`/ide`).
3. A Jornada ensina **duas grandes coisas em dois arcos**: *The Craft* (ser um dev foda na era da IA — specs, TDD, DDD, clean arch, harness/prompt/loop/graph engineering) e *The Realm* (o ecossistema Stellar de ponta a ponta, do SCP à fronteira de privacidade e ao protocolo vivo).
4. **17 capítulos** (16 live + capstone "soon"), **4 labs live** (wallet, SCP, OZ Token Wizard, Passkey Smart Wallet) + 3 cards "soon", **XP vivo** com ledger anti-replay e retroativo aplicado.
5. Estado: **Fases A, B e C commitadas e verificadas** (4 commits de 28/08); o incremento de passkey está implementado e verificado até o limite headless (a cerimônia WebAuthn ainda exige teste no dispositivo real do Pedro); Fase D ampla não iniciada.
6. As **14 artes v2** foram geradas pelo MCP do Higgsfield (modelo `cinematic_studio_2_5`) e já estão processadas e commitadas em `public/v2/`.
7. Toda conclusão de lab on-chain é **verificada pelo servidor lendo a própria chain** antes de pagar XP — o cliente nunca "afirma" nada.
8. Invariantes críticas (seção 14): P2002 FORA da `$transaction`, conteúdo é dado puro, kit `sc-` é cópia (nunca import) da landing, seed append-only, **nunca `git push`**, autoria Pedro + trailer Nearx.
9. Fatos de fronteira do currículo são datados e verificados (Protocol 28 "Adapter": testnet 27/08/2026 → mainnet 16/09/2026; js-sdk v17 = P28 — o repo está em ^16.2.0, bump pendente com janela até 16/09).
10. Decisão do lab de passkey v1: **sem relayer** — a conta G local e fundada paga o deploy como `deployerSecret` dedicado, mas não vira signer da smart account. Fee sponsorship continua como evolução posterior.

---

## 2. Contexto & motivação

Pedro pitchou o TUSST ao **Kaan (SDF)** como sucessor do Stellar Quest. Kaan recusou levar
adiante o formato v1 por **dois motivos**, que viraram o eixo da v2:

1. **"Ninguém aprende Rust do zero na era da IA."** Ele quer uma **Forge expandida estilo
   lab.stellar.org**: botões que executam fluxos on-chain complexos de verdade enquanto
   ensinam — wallet sendo fundada, trustline abrindo, tokens OpenZeppelin, Blend,
   confidential tokens. Aprender apertando o botão real, não lendo sobre o botão.
2. **"O dev de hoje vibe coda."** O que precisa ser ensinado é o que a IA **não** faz pelo
   dev: spec-driven development, a arquitetura da própria Stellar, DDD, TDD, clean
   architecture, harness engineering, prompt/context engineering, loops agênticos, graph
   engineering, bounded contexts. **Rust vira aprofundamento opcional.**

Disso saiu a meta da v2 — **duas grandes coisas** que o produto entrega juntas:

- **Ser um dev foda na era da IA** (Arco I · The Craft);
- **Dominar o ecossistema técnico da Stellar** (Arco II · The Realm), tendo o Stellar Quest
  como referência de gamificação, o Lab como referência de ensino hands-on, e cobrindo as
  últimas tecnologias: privacy pools, confidential tokens, Stellar Private Payments,
  js-sdk v17 / Protocol 28.

### Os quatro commits da v2 (todos de 28/08/2026)

| Commit | Título | Conteúdo |
|---|---|---|
| `29d639e` | feat(v2): the Hall, the expanded Forge with on-chain labs, and live XP | **Fase A**: home "The Hall", `/campaign`, engine de labs + lab wallet-onboarding, `classic.ts`, verificação on-chain, XP vivo (XpEvent + backfill), kit `sc-`, pipeline `assets:v2`, i18n home/labs ×4 |
| `0b3a10e` | feat(v2): the Builder's Journey — chapters, SCP simulator, chapter XP | **Fase B**: modelo de conteúdo da Jornada, 3 capítulos autorais, ScpSim, ConceptPlayer, `/journey`, `api/journey/complete` (+30 XP), lab scp-simulator live, onboarding → Jornada, i18n journey ×4 |
| `10a960e` | feat(v2): full two-arc curriculum and the Higgsfield art drop | **Expansão**: Jornada de 3 → 17 capítulos em 2 arcos, numeração por arco, fatos de fronteira datados, 14 artes Higgsfield processadas em `public/v2/`, `bgCenter` no pipeline, porta da Jornada segue `JOURNEY_LIVE` do registry |
| `ead9ca4` | feat(v2): the OZ Token Wizard forges real tokens, and the examiner grades real specs | **Fase C**: Wizard OZ live e2e, transporte NDJSON compartilhado, deploy/invoke/verificação de saldo, exercício spec-write via mentor, fix do SceneRoot |

(O commit anterior, `8204076`, é só da landing — a "adventuring party" no hero — e não faz
parte da reestruturação.)

---

## 3. Decisões de produto e design (com o porquê)

Todas tomadas/travadas pelo Pedro em 28/08/2026. Plano aprovado completo em
`~/.claude/plans/quero-implementar-uma-grande-partitioned-eich.md`.

1. **Reestruturação completa poupando a landing.** A landing acabou de ser refeita e é
   intocável; a v2 se estende a partir dela, nunca a edita (diff zero verificado na Fase A).
2. **Dois caminhos + Forge expandida.** Caminhos de aprendizado = Jornada (essencial) e
   Campanha (opcional). Labs guiados + IDE livre moram juntos sob a marca **Forge**. Nav:
   **Journey · Forge · Campaign**. Porquê: responde diretamente às duas críticas do Kaan sem
   jogar fora a campanha de 8 atos pronta.
3. **`/path` vira a home "The Hall".** A landing hardcoda `/path` no `beginHref` e os 4
   forms de login redirecionam para lá — manter a URL = zero edições na landing/login. O
   trilho da campanha migrou **verbatim** para `/campaign`.
4. **Jornada = conteúdo TS puro + tabela `JourneyProgress`** (não vira `Lesson` no banco).
   Porquê: zero contato com o seed append-only e com o gate posicional da campanha; o mentor
   é reusado via `MentorHint.kind` (string livre — sem migration).
5. **Jornada em 2 ARCOS.** A ideia original de "jornada única misturada" evoluiu (feedback
   do Pedro: "profundidade na cobertura, lições fáceis") para dois arcos explícitos — campo
   `arc: "craft" | "realm"` no meta, que **o próprio Pedro iniciou nos arquivos** — com
   numeração romana própria por arco e "próximo recomendado" por arco. Progressão
   **free-roam**: qualquer capítulo live é jogável, sem gates.
6. **Labs = dados + engine.** Cenários são DADOS em `src/content/labs/`; um registry de
   ações interpreta. Conclusão é **verificada on-chain no servidor** — única via de XP de
   lab. Porquê: anti-fraude e um formato em que adicionar lab = 1 módulo de conteúdo + 1
   entrada no catálogo.
7. **XP entra no ar via ledger `XpEvent`** com unique constraint como anti-replay;
   `Character.xp/level` (colunas antes mortas) viram agregados denormalizados. Ouro
   intocado. **XP retroativo aprovado** — script one-off owner-run (`npm run xp:backfill`).
8. **Visual: duplicar-e-generalizar** num namespace `sc-` (kit `src/components/scene/`).
   Porquê: o `MotionOrchestrator` da landing hardcoda `#landing` e o `landing.css` escopa
   reduced-motion em `#landing` — extrair exigiria editar a landing (proibido).
9. **Arte gerada no Higgsfield** (MCP conectado — Pedro confirmou o acesso), no mesmo fluxo
   da landing: masters em `art-src/v2/` (gitignored) → script sharp → `public/v2/`
   (commitado). Toda superfície funciona em gradiente/glyph antes de a arte existir.
10. **Campanha permanece byte-compatível**: `unlock.ts`, `campaign-progress.ts`, o ratchet
    `maxUnlockedAct`, o cookie de onboarding e os 4 gates `findIndex < count` não mudam.
11. **Passkey v1 sem relayer.** O `smart-account-kit@0.6.2` permite um deployer dedicado;
    o lab reutiliza a conta G local já fundada como fonte de fee/salt e instala somente a
    passkey como signer da smart account. Relayer/fee sponsorship fica para uma evolução.

---

## 4. Mapa do produto (rotas & superfícies)

| Rota | Estado | O que é |
|---|---|---|
| `/` | intocada | Landing cinematográfica (D&D dark-fantasy) |
| `/path` | reescrita | **The Hall** — home pública: cena cinematográfica com 2 portas (Jornada em destaque, Campanha) + a **Forge como vinheta distinta** (bigorna/oficina — é onde se pratica, não um caminho), "continue de onde parou", faixa XP/nível. A porta da Jornada segue `JOURNEY_LIVE` do registry |
| `/journey` | nova | Mapa da Jornada em **2 arcos** com trilho por arco, estado de conclusão e "próximo recomendado" por arco |
| `/journey/[slug]` | nova | `ConceptPlayer` — o servidor enriquece os steps (estado do lab p/ `labLink`, lock da campanha p/ `rustBranch`) e passa tudo como props |
| `/labs` | nova | **Casa da Forge expandida**: labs guiados live + cards "soon" do catálogo + card destacado do modo livre → `/ide`. Pública como `/ide`: anônimo joga; o claim de XP vem após login |
| `/labs/[slug]` | nova | `LabPlayer` |
| `/campaign` | nova | O trilho Mimo-style da campanha, movido **verbatim** do antigo `/path` (só header/copy novos; matemática de unlock idêntica) |
| `/ide` | inalterada | Forge modo livre (IDE Soroban) — agora também recebe os deploys feitos nos labs (store compartilhado) |
| `/tracks`, `/lessons`, `/cards`, `/profile`, `/onboarding` | inalteradas | Gates da campanha intocados; `/cards` e `/profile` seguem no menu do avatar |

**Nav** ([`../src/components/Nav.tsx`](../src/components/Nav.tsx) + `NavMenu.tsx`):
Journey (condicional a `JOURNEY_LIVE`) · Forge (→ `/labs`) · Campaign, + pouch de ouro +
**chip de nível** (via `character { level }`) + Sign in quando deslogado.

**Onboarding**: cookie `tusst_onboarding`/`unlockedActs` intocado (segue alimentando só os
gates da campanha). A tela final do `OnboardingFlow` mantém o reveal dos atos (retitulado
como trilha de maestria opcional) e o botão final leva ao **primeiro conceito live da
Jornada** (`firstLiveConceptSlug()`), com a campanha a um toque.

**Rotas de API novas**: `api/labs/complete` (verificação on-chain + XP),
`api/journey/complete` (selo do capítulo + XP), `api/journey/exercise` (examinador de spec
via mentor — Fase C). `api/submissions` ganhou +25 XP dentro da `$transaction`
existente do ouro.

---

## 5. Modelo de dados & XP

Migration única: `prisma/migrations/20260828072051_v2_labs_journey_xp/` (só adições).
O `deploy.yml` aplica migrations no Neon automaticamente **no push a main** — por isso a
regra "nunca push" importa dobrado aqui.

### Modelos novos ([`../prisma/schema.prisma`](../prisma/schema.prisma))

```prisma
model LabProgress   { userId labSlug stepsDone artifacts Json? completed completedAt  @@unique([userId, labSlug]) }
model JourneyProgress { userId conceptSlug completed completedAt                      @@unique([userId, conceptSlug]) }
model XpEvent       { userId amount source sourceKey createdAt                        @@unique([userId, source, sourceKey]) @@index([userId, createdAt]) }
```

- `artifacts` = `{ address?, txHashes: {stepId: hash}, contractId?, wasmB64? }` (o servidor
  só persiste a forma validada: address `^G[A-Z2-7]{55}$`, contractId `^C[A-Z2-7]{55}$`,
  hashes hex-64).
- `XpEvent` é o **ledger fonte-da-verdade**; `source` ∈ `"lesson" | "lab" | "journey"`,
  `sourceKey` = slug do conteúdo (o exercício usa `"<slug>#exercise"`). O unique constraint
  **É** o anti-replay.
- `Character.xp/level` são **agregados denormalizados**, atualizados na mesma transaction.

### Valores e curva ([`../src/lib/xp.ts`](../src/lib/xp.ts))

| Evento | XP |
|---|---|
| Lição da campanha (`XP_LESSON`) | **25** (dentro da `$transaction` do ouro em `api/submissions`) |
| Capítulo da Jornada (`XP_CONCEPT`) | **30** |
| Exercício de mentor aprovado (`XP_CONCEPT_EXERCISE`) | **20** |
| Lab `novice` / `adept` / `master` (`XP_LAB`) | **75 / 100 / 150** |

Curva: `xpForLevel(l) = 50·l·(l−1)` → L2=100, L3=300, L4=600, L5=1000…
(`levelFromXp` é a inversa fechada; `progressToNext` alimenta a barra do Hall/nav.)

### A regra do P2002 (a mais fácil de quebrar)

[`../src/lib/xp-award.ts`](../src/lib/xp-award.ts) — `awardXp(tx, {...})` roda **dentro de
uma `$transaction` do chamador**: faz **read-before-create** no XpEvent (replay sequencial
→ responde "já premiado" sem erro) e cria o evento + incrementa/recalcula o Character.
Um duplicado **concorrente** estoura o unique (P2002) e, **no Postgres, isso aborta a
transaction inteira** — qualquer query subsequente dentro dela só devolve
"current transaction is aborted". Portanto o catch do P2002 fica **FORA** da
`$transaction`, no route handler (mesmo padrão do crédito de ouro em
`api/submissions`), respondendo `already:true`. Ver seção 11, bug 1.

### Backfill retroativo ([`../scripts/backfill-xp.mjs`](../scripts/backfill-xp.mjs))

One-off, owner-run (`npm run xp:backfill`): gera um XpEvent de +25 por `Progress` completo
pré-ledger (`createMany` + `skipDuplicates`) e **recalcula os agregados de todo usuário a
partir do ledger** (também cura drift). Idempotente por construção. Rodado no dev em 28/08:
34 lições → 34 XpEvents; re-run = 0 novos. **No Neon é manual do Pedro** (como o seed).

---

## 6. Sistema de Labs (a Forge expandida)

### DSL ([`../src/content/labs/types.ts`](../src/content/labs/types.ts))

Um lab é `LabScenario { meta, steps, verify }` — **dados**, interpretados por um engine e um
player. Módulos de conteúdo são dependency-free: imports type-only, dados puros e funções
puras sobre `LabRunCtx` (`{ walletAddress, state, artifacts }`).

- **`LabStep`**: `narrate` | `quiz` (resposta certa primeiro, player embaralha com seed) |
  `choice` (grava em `stateKey`) | **`input`** (texto com `pattern` regex — Fase C) |
  `action` (botão grande + `successBody` com interpolação `{address} {companion} {balance}
  {tx} {contract} {name} {symbol}` + link de explorer) | `sim` (componente `scp-sim`) |
  `checkpoint` (claim).
- **`LabAction`**: `generate-keypair` (target `wallet` ou `state`) | `friendbot` |
  `classic-op` | **`contract-build` | `contract-deploy` | `contract-invoke`** (Fase C) |
  **`passkey-create` | `passkey-connect`** (pós-C; WebAuthn + smart-account-kit).
- **`VerifySpec`** (data-only, o servidor interpreta): `account-exists` | `trustline` |
  `payment-sent` | **`token-balance-positive`** (Fase C — simula `func(address)` no
  contractId via RPC e exige > 0) | **`smart-account-code`** (baixa o Wasm do contrato,
  recalcula SHA-256 e exige a identidade canônica). **`verify: []` = lab honor-based**
  (sim-only).

### Engine ([`../src/lib/labs/engine.ts`](../src/lib/labs/engine.ts))

`runLabAction` mapeia ação → executor real na testnet, emitindo fases
(`prepare|passkey|queued|building|sign|submit|confirm`) para o stepper ao vivo do botão (o padrão
`DeployStep` do DeployPanel, generalizado). `LabActionError { retryable }`; retry automático
1× para friendbot congestionado e `tx_bad_seq` (o rebuild parte de sequence fresca, então o
retry é seguro por construção). O `contract-deploy` registra o deployment no
`forge-store` (`addDeployment`, label `lab: <SYMBOL>`) — **o token do lab aparece no painel
Interact do `/ide`**: uma Forja só.

### Classic ops ([`../src/lib/stellar/classic.ts`](../src/lib/stellar/classic.ts))

Primeiras operações classic do codebase: `ClassicOpSpec` = `create-account` | `payment` |
`change-trust` (specs declarativas, não objetos do sdk — conteúdo serializável).
`buildClassicTx` (sequence via Horizon, `TESTNET.passphrase`) → assinatura pelo seam
existente `ForgeWallet.signTransaction` → `submitClassicTx` (POST no Horizon) com
**mapa didático de result codes** (`op_underfunded`, `op_no_trust`, `op_low_reserve`,
`tx_bad_seq`…) virando frases humanas. Soroban continua em `deploy.ts`/`invoke.ts`.

### Verificação server-side ([`../src/lib/labs/verify.ts`](../src/lib/labs/verify.ts) + [`../src/app/api/labs/complete/route.ts`](../src/app/api/labs/complete/route.ts))

POST `{labSlug, address, artifacts}` autenticado → o servidor **lê o Horizon/RPC públicos**
(fetch `cache: "no-store"`): conta existe, trustline presente, payment saído do próprio
address, simulação de `balance(address) > 0` para o wizard. Tudo passou ⇒ `$transaction` =
upsert `LabProgress` + `awardXp` (P2002 fora, `already:true`). Falhou ⇒ 422 com a lista
`failed`. Verificação acontece **no momento do claim** — um reset trimestral da testnet
nunca retro-invalida conclusões já persistidas. Labs sim-only (`verify: []`) pagam
honor-based, o modelo de confiança dos capítulos.

### Store client-side ([`../src/lib/labs/store.ts`](../src/lib/labs/store.ts))

Runs em localStorage `tusst:labs:v1:{slug}` (jogo anônimo + resume). A wallet é **a mesma
wallet local da Forge** (`tusst:forge:secret` via helpers de `wallet.ts`). Anônimo joga
tudo; ao final, "entre para reivindicar o XP" — os artifacts são re-postados após login e a
prova on-chain continua exigida.

### Catálogo ([`../src/content/labs/index.ts`](../src/content/labs/index.ts))

| Lab | Status | Dificuldade / XP | Chain | Verify |
|---|---|---|---|---|
| `wallet-onboarding` — Your First Wallet | **live** (Fase A) | novice / 75 | classic, client puro | account-exists + trustline USDC + payment-sent |
| `oz-token-wizard` — OpenZeppelin Token Wizard | **live** (Fase C) | adept / 100 | build no runner + deploy/invoke | account-exists + token-balance-positive(`balance`) |
| `scp-simulator` — SCP: The Council of Nodes | **live** (Fase B) | novice / 75 | nenhuma | `[]` (honor) |
| `passkey-smart-wallet` — Passkey Smart Wallet | **live** (pós-C) | adept / 100 | WebAuthn + deploy + transfer Soroban | account-exists + smart-account-code + native balance |
| `treasure-chest` (claimable balances) | soon | novice | classic | — |
| `guild-vault` (multisig) | soon | adept | classic | — |
| `confidential-tokens` | soon | master | fronteira | — |

O roadmap completo do plano é maior (patrono/sponsored reserves + fee-bump, emissão de
token + SAC, path payments/AMM, preconditions, Blend, Reflector, KALE, Soroswap, x402,
âncora SEP-24, state archival) — os 3 "soon" acima são os cards visíveis restantes.
Regra dos labs de protocolo: **invocar contratos deployados; NUNCA buildar SDKs sdk-25
(Blend/sep-41) junto dos pins OZ sdk-26** do runner.

### Detalhes dos labs live

- **wallet-onboarding** (o exemplo exato do Kaan): keypair client-side → Friendbot →
  trustline **USDC da Circle na testnet** (issuer hardcoded no conteúdo:
  `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` — reconferir após reset
  trimestral se o changeTrust falhar com `op_no_issuer`) → "companion sigil" (keypair cujo
  secret é descartado de propósito) → `create_account` de 100 XLM → `payment` de 25 XLM,
  tudo assinado no browser. 2 quizzes (base reserve; trustlines).
- **oz-token-wizard** ([`../src/content/labs/oz-token-wizard.ts`](../src/content/labs/oz-token-wizard.ts)):
  inputs name/symbol/supply → choices pausable/burnable → **gera Rust real** compondo
  fragmentos do template `oz-fungible` comprovado do IDE
  ([`../src/content/labs/oz-token-files.ts`](../src/content/labs/oz-token-files.ts) — o
  Cargo.toml é o **`CURATED_CARGO_TOML` importado** de `soroban-templates.ts`, então o
  triângulo de pins e o `check:forge-pins` ficam intactos **por construção**; as 4 variantes
  são builds conhecidos-bons) → compila no runner sandboxed (stream NDJSON) → deploy com 2
  assinaturas (upload + create com `__constructor(name, symbol, owner, initial_supply)`;
  decimals fixo em 7; name/symbol/supply viajam como **args do constructor**, não no código)
  → `mint` extra via invoke (spec lida da chain, simulate-then-sign) → claim com simulação
  server-side de `balance(you) > 0`.
- **passkey-smart-wallet** ([`../src/content/labs/passkey-smart-wallet.ts`](../src/content/labs/passkey-smart-wallet.ts)):
  conta G local → Friendbot → cria passkey WebAuthn real → usa essa conta G como
  `deployerSecret` dedicado do `smart-account-kit@0.6.2` (paga fees/salt; **não** vira
  signer) → deploya e funda a smart account P27 via RPC → reconecta a credential e faz
  uma transferência real de 1 XLM assinada pela passkey (`__check_auth` + verifier
  secp256r1 executam on-chain) → claim busca o Wasm pela C-address, recalcula SHA-256
  contra `1b5f…785a` e exige saldo XLM positivo no contrato. Credencial/sessão ficam em IndexedDB
  `tusst-smart-accounts-v1`; nenhum segredo cruza o servidor.
- **scp-simulator**: 100% client, compartilha o `ScpSim` com o capítulo "The Realm of
  Stellar". Fluxo: fechar ledgers → quebrar de propósito → quizzes de safety/recovery.

---

## 7. A Jornada em 2 arcos

### Modelo ([`../src/content/journey/types.ts`](../src/content/journey/types.ts))

`Concept { meta, steps }` — **dados puros, serializáveis** (o servidor enriquece e passa
como props). `JourneyStep`:

- `theory | quiz | fill` — mesmas shapes do `steps.ts` da campanha, **redeclaradas de
  propósito** (memória muscular de autoria; `steps.ts` não muda);
- `widget` (registry de componentes; hoje só `scp-sim`);
- `labLink` (handoff cinematográfico para um lab da Forge, com estado live/completed);
- `rustBranch` ("**See it in Rust**" → `/lessons/[slug]` da campanha; se o ato estiver
  trancado, o card renderiza "destrava com o Ato N" — **nunca link para 404**);
- `exercise` (`mode: "spec-write"`, com `brief` + `rubric` — Fase C).

Meta: `slug, title, tagline, numeral` (romano **por arco**), `arc: "craft" | "realm"`,
`status: "live" | "soon"`, `estMinutes`, `sigil` (arte), `glyph` (stand-in).

### Registry ([`../src/content/journey/index.ts`](../src/content/journey/index.ts))

`journeyChapters[]` posicional mas **free-roam** (sem gates). `JOURNEY_LIVE = true` é o
interruptor único que liga porta do Hall + item do nav + retarget do onboarding de uma vez.
Helpers: `conceptBySlug`, `chaptersByArc`, `firstLiveConceptSlug`.

### Arco I · The Craft — "O Ofício" (engenharia na era da IA)

| # | Slug | Capítulo | Uma linha | Min | Steps especiais |
|---|---|---|---|---|---|
| I | `think-before-you-forge` | Think Before You Forge | Spec-driven: a spec é a habilidade que a IA não faz por você; exercício de spec-review curado | 12 | `exercise` spec-write |
| II | `the-red-green-rite` | The Red-Green Rite | TDD: teste primeiro, forja depois | 12 | rustBranch |
| III | `borders-of-the-realm` | Borders of the Realm | DDD & bounded contexts, mapeados no próprio domínio da Stellar | 13 | — |
| IV | `the-clean-keep` | The Clean Keep | Clean/hexagonal architecture — cada peça no seu lugar | 13 | — |
| V | `taming-the-golem` | Taming the Golem | Harness engineering: dê à IA uma bancada, não um desejo | 13 | — |
| VI | `words-of-power` | Words of Power | Prompt & context engineering — o que o golem realmente vê | 12 | — |
| VII | `the-endless-loop` | The Endless Loop | Loops agênticos & evals: agir, observar, corrigir — e saber parar | 12 | — |
| VIII | `weaving-the-graph` | Weaving the Graph | Graph engineering: muitos golems pequenos, um plano tecido | 12 | — |
| IX | `the-capstone-forging` | The Capstone Forging | Spec + testes + IA ao lado → contrato deployado | 25 | **soon** (precisa do maquinário mentor/runner da Fase C) |

### Arco II · The Realm — "O Reino" (Stellar de ponta a ponta)

| # | Slug | Capítulo | Uma linha | Min | Steps especiais |
|---|---|---|---|---|---|
| I | `the-realm-of-stellar` | The Realm of Stellar | SCP: como milhares de máquinas concordam sem um rei — aprendido quebrando | 12 | widget `scp-sim`, rustBranch |
| II | `anatomy-of-a-transaction` | Anatomy of a Transaction | Envelope, operations, fees, assinaturas — dissecados ao vivo | 10 | labLink → wallet-onboarding, rustBranch |
| III | `accounts-trust-and-assets` | Accounts, Trust & Assets | Reserves, trustlines e como qualquer asset nasce | 12 | labLink → wallet-onboarding, rustBranch |
| IV | `rivers-of-value` | Rivers of Value | Payments, path payments, o DEX e os AMMs | 12 | — |
| V | `gates-of-the-realm` | Gates of the Realm | Âncoras & SEPs — onde o ledger encontra o mundo real | 12 | — |
| VI | `the-living-contracts` | The Living Contracts | Soroban: Wasm, storage que expira (TTL/state archival), fees que fazem sentido | 13 | labLink → oz-token-wizard, rustBranch |
| VII | `wallets-without-seeds` | Wallets Without Seeds | Smart accounts, passkeys e fees patrocinadas (incl. Protocol 27 Zipper / CAP-0071) | 12 | labLink → passkey-smart-wallet |
| VIII | `the-veiled-ledger` | The Veiled Ledger | Confidential tokens, private payments — privacidade com espinha de compliance | 13 | labLink → confidential-tokens (soon) |
| IX | `the-protocols-edge` | The Protocol's Edge | CAPs, SEPs, upgrades nomeados — cavalgando um protocolo vivo | 11 | rustBranch |

**Estilo dos capítulos** (regra do Pedro: "profundidade na cobertura, lições fáceis"):
8–11 steps curtos, quizzes com explicação que ensina, um `fill` cada. Os 14 capítulos novos
foram autorados por 2 agentes em paralelo contra um **fact-sheet verificado via gateway
Raven em 28/08** — todo fato de fronteira é datado:

- Protocol 26 **"Yardstick"**; 27 **"Zipper"** mainnet 08/07/2026 com **CAP-0071**
  (delegação de autenticação para smart accounts); 28 **"Adapter"** testnet 27/08/2026 →
  **mainnet 16/09/2026**.
- js-stellar-sdk **v17.0.0 = Protocol 28** (17.0.1 em 25/08/2026).
- **Confidential Tokens** dev preview 28/06/2026 (OpenZeppelin + Nethermind; wrapper ZK
  sobre SEP-41: valores ocultos, endereços públicos).
- **Stellar Private Payments** (Nethermind) dev preview na testnet 28/08/2026 (pool
  compartilhado, contrapartes ocultas, KYC-gated + freeze).
- ZK primitives: **CAP-0059** trouxe BLS12-381 (verificação Groth16 dentro de contratos
  Soroban); os **protocolos 25/26** adicionaram a curva **BN254** e o hash **Poseidon**.

### Player ([`../src/components/journey/ConceptPlayer.tsx`](../src/components/journey/ConceptPlayer.tsx))

Cópia estrutural do LessonSteps/LabPlayer (index/maxIndex, shuffle com seed determinística
por slug, feedback sheet, mascote), sem o finale de editor. Marca conclusão local em
`tusst:journey-steps:{slug}`; rascunho do exercício em `tusst:journey-ex:{slug}`. O selo
final posta em [`../src/app/api/journey/complete/route.ts`](../src/app/api/journey/complete/route.ts)
(valida slug contra conteúdo live, upsert `JourneyProgress` + `awardXp` +30; quiz/fill são
client-validados como na campanha — stakes de 30 XP, trade-off aceito, anti-replay pelo
ledger).

### Exercício spec-write (Fase C)

[`../src/app/api/journey/exercise/route.ts`](../src/app/api/journey/exercise/route.ts):
o aluno escreve uma **spec comportamental** (o brief atual: "Guild Tip Jar" em
think-before-you-forge, 80–6.000 chars) e o **provider do mentor existente** julga contra a
rubric do capítulo com veredito **JSON estrito** `{meets, feedback}` (feedback ≤ 110
palavras, no locale do aluno, sem escrever a spec pelo aluno). Brief e rubric vêm do
**conteúdo no servidor**; a spec do aluno é tratada como **dado não-confiável** (hardening
anti prompt-injection no system prompt). Quota contada como `MentorHint kind:"journey"`
(sem mudança de schema). Aprovou ⇒ +20 XP com `sourceKey "<slug>#exercise"` (mesmo padrão
P2002-fora). Veredito malformado ⇒ 503, sem XP e sem "reprovação" injusta.

---

## 8. Sistema visual & arte

### Kit de cena ([`../src/components/scene/`](../src/components/scene/))

Namespace **`sc-`**, escopado em `[data-scene-root]` — uma **CÓPIA generalizada** da
linguagem cinematográfica da landing (`landing.css` → `scene.css`, MotionOrchestrator →
`SceneMotion` com `rootId` parametrizado, mesmo contrato `data-plx`/`data-reveal`, respeita
reduced-motion). **Nunca importa nem edita arquivos da landing.** Peças:

- `SceneRoot.tsx` — wrapper server: `data-js` **estático** + `<noscript><style>` fail-safe
  (o gate por `<script>` inline foi removido — ver bug 4 na seção 11; a landing intocável
  continua com o JsGate dela);
- `SceneMotion.tsx` — parallax/reveals;
- `SceneArt.tsx` — camadas com `hasV2Asset()`: arte ausente ⇒ pula para o stand-in;
- `SceneParticles.tsx`; `scene.css`.

Usado por Hall, `/journey`, `/labs` e backdrops dos players. **Toda superfície funciona em
gradiente antes de a arte existir.**

### Pipeline de assets ([`../scripts/v2-assets.mjs`](../scripts/v2-assets.mjs), `npm run assets:v2`)

Irmão do `landing-assets.mjs` (mesma estrutura JOBS/budgets/aspect-check; cópia do
`grayKey`, **sem import cruzado** — a pipeline da landing fica independente). Masters em
`art-src/v2/` (**gitignored**) → saída WebP otimizada em `public/v2/` (**commitada**).
Camadas keyed são pintadas sobre cinza-claro chapado (#d4d4d4) e cortadas por distância de
cor. **Gotcha `bgCenter`**: por padrão o fundo é amostrado na linha do topo (convenção da
landing); se os props do master encostam no topo, use `key: { bgCenter: true }` no JOB —
a amostragem vai para a meia-altura (x em 40/50/60% da largura). Foi o fix do
hall-mid de 2.2MB → 167KB (bug 3, seção 11).

### Slots & proveniência

Briefs versionados em [`ART-BRIEFS-v2.md`](./ART-BRIEFS-v2.md): preâmbulo de estilo
compartilhado (dark-fantasy pictórica D&D, violetas #0b0716/#120b22, dourado #d9b96a,
brasas, rim light, **sem texto embutido**) + 1 seção por slot com filename, dimensões,
matte vs keyed vs transparente, áreas seguras e o **prompt pronto para colar**.

**Status 28/08: os 14 masters foram gerados via MCP do Higgsfield conectado** (modelo
`cinematic_studio_2_5`, 2K; cutouts pelo `image_background_remover` deles), baixados para
`art-src/v2/` e processados — **todos dentro do budget**. Para refazer qualquer slot:
regenerar com o prompt do brief, dropar o master em `art-src/v2/`, `npm run assets:v2`.

Saídas commitadas em `public/v2/`:

| Superfície | Arquivos |
|---|---|
| Hall | `home/hall-bg.webp`, `home/hall-mid.webp` (keyed, bgCenter), `home/door-journey.webp`, `home/door-campaign.webp`, `home/forge-vignette.webp` |
| Forge | `labs/forge-bg.webp`, `labs/emblems/{wallet-onboarding, oz-token-wizard, passkey-smart-wallet, scp-simulator}.webp` |
| Jornada | `journey/map-bg.webp`, `journey/sigils/{think-before-you-forge, the-realm-of-stellar, anatomy-of-a-transaction}.webp` |

Nuance: os sigilos agora são **nomeados por slug**, e só os 3 capítulos originais têm arte —
os outros 14 capítulos renderizam o glyph stand-in até o próximo drop (Fase D).

---

## 9. i18n

Duas camadas, regras diferentes:

1. **UI (chrome)** — namespaces tipados contra o `en` (fonte da verdade): **o build quebra
   se faltar chave em qualquer locale**. A v2 adicionou `home.ts`, `labs.ts`, `journey.ts`
   em `src/i18n/messages/{en,pt,es,fr}/` + registros nos 4 `index.ts` (+ edições em
   `common` [nav], `onboarding`, `pages`). Inclui labels dos arcos ("Arco I — O Ofício" /
   "Arco II — O Reino"), strings do simulador (bloco `sim`), fases/erros do engine e nomes
   humanos dos checks de verify.
2. **Conteúdo (steps de lab/capítulo)** — **EN-first nos módulos TS**. O overlay parcial
   por locale (`labSteps`/`journeySteps` no `LocaleContent`, com fallback EN) é **Fase D**,
   seguindo o padrão já existente do conteúdo da campanha.

Locale via cookie `tusst_locale` (padrões do projeto em `tusst-i18n` na memória). O
language switcher deve ser regressado em toda página nova (parte do checklist de fase).

---

## 10. Verificação já feita (evidências, 28/08/2026)

Tudo em dev local (`AUTH_DEV_LOGIN=true`) contra a **testnet real**, via preview.

**Fase A — lab wallet-onboarding jogado inteiro:**
- Keypair forjada client-side; Friendbot creditou **10.000 XLM lidos do Horizon** (não um
  número hardcoded);
- Trustline **USDC** (issuer Circle testnet `GBBD47IF…FLA5`) assinada e confirmada;
- `create_account` de 100 XLM para o companion; `payment` de 25 XLM com **hash real
  interpolado no copy** do passo;
- Claim: servidor releu o Horizon e pagou **+75 XP**;
- **Replay do claim → `already:true`, sem crédito duplo** (anti-replay provado).

**Fase A — XP e retroativo:**
- +25/lição dentro da transaction do ouro; double-submit sem duplicata;
- Backfill no dev: **34 lições retroativas → 34 XpEvents; re-run = 0 novos (idempotente)**.

**Fase B — Jornada e SCP:**
- Capítulo SCP selado → **+30 XP** com **"Level 2 reached!"** (105 XP; bate com a curva:
  L2 = 100);
- Lab scp-simulator (honor, `verify: []`) → **+75 XP** (**180 total**, chip de nível 2 no
  nav);
- **ScpSim**: fecha ledger com a ondulação voto→accept; **trava com 4+ nós caídos**
  ("safety over liveness" — nunca forka); reviver nem sempre destrava de imediato —
  depende de **onde mora a confiança** (quais slices ficaram satisfeitas), que é exatamente
  a lição; fixpoint instantâneo sob reduced-motion.

**Estático (toda fase):** `npx tsc --noEmit` (prova os 4 locales), `npm run lint`,
`npm run check:forge-pins` — verdes.

**Fase C — Wizard + exercício:** e2e completo no commit `ead9ca4`: Wizard OZ compilou no
runner real, deployou `CCVAG…NP6X`, executou constructor, mintou +25 FGOLD, o servidor
simulou `balance(você)` e o ledger fechou em 300 XP. Exercício spec-write provou spec fraca
→ objeção e spec forte → aceite/+20 XP. Checks estáticos verdes.

**Pós-C — Passkey Smart Wallet:** `tsc`, lint, pins e build Next via Webpack verdes. A
verificação server-side foi exercitada contra o smart account oficial
`CCKO2…G4YP`: 41.855 bytes, SHA-256 `1b5f…785a`, match verdadeiro. A cerimônia WebAuthn
real (biometria/PIN do dispositivo) é intencionalmente a única pendência de e2e; não é
simulável com honestidade no runner headless.

---

## 11. Bugs reais encontrados & lições

1. **P2002 dentro de `$transaction` = 500 no replay.** Capturar o P2002 **dentro** da
   transaction aborta a transaction no Postgres (toda query seguinte falha com "current
   transaction is aborted"). Padrão correto: **read-before-create no `awardXp` + catch do
   P2002 FORA da `$transaction`** no route handler (mesmo padrão do crédito de ouro em
   `api/submissions`). Está documentado em comentário no próprio `xp-award.ts`.
2. **ScpSim v1 sem bootstrap** — só o proponente aceitava e nada se propagava. Fix: **duas
   ondas** — voto por fofoca de slice (nomination) → accept por **threshold 3-de-5** na
   slice, fechamento com **quórum 4-de-7** do conselho.
3. **hall-mid.webp com 2.2MB**: o `grayKey` amostrava o fundo na linha do topo, mas os
   props do master encostavam no topo — a matte vazou e o WebP explodiu. Fix: opção
   `key:{bgCenter:true}` no `v2-assets.mjs` (amostra na meia-altura) → **167KB**.
4. **Next 16: "Encountered a script tag while rendering React component"** em navegação
   client-side — React não executa `<script>` inline em client-nav e avisa alto. O gate do
   `SceneRoot` trocou o `<script>` inline por **`data-js` estático + `<noscript><style>`**
   (mesmo fail-safe, zero script). A landing intocável continua com o JsGate original dela.
5. **Porta da Jornada presa em "being forged"**: a home tinha um `JOURNEY_LIVE` local
   hardcoded em vez de importar do registry. Fix: importar de `src/content/journey` — o
   registry é a **única** fonte do interruptor.
6. **Batch de edits via `perl` mojibakou os 4 labs.ts** (latin-1 vs UTF-8): arquivos com
   acentos corrompidos em massa. Restaurados do git e reaplicados com ferramenta UTF-8-safe.
   **Lição: nunca editar arquivos com acentos via perl in-place sem camada utf8.**
7. **Wallets Kit com dois nomes de pacote**: o app ainda importava o escopo npm legado
   `@creit.tech`, mas o `smart-account-kit` declara peer no escopo JSR atual
   `@creit-tech`. Isso produzia warnings de módulo ausente no bundle. Migração: `.npmrc`
   aponta `@jsr:registry=https://npm.jsr.io`, dependência aliasada pelo JSR e imports no
   escopo novo. O warning de peer do plugin Trezor (`sdk ^13.3.0`) é upstream do Wallets
   Kit; o bundle usa uma única instância `stellar-sdk@16.2.0` e fica verde.

---

## 12. Pendências (o que falta)

### Incremento passkey — implementado, falta o dispositivo real

- [x] `smart-account-kit@0.6.2` fixado (peer `stellar-sdk >=16`) e artefatos P27 testnet
  conferidos no repositório oficial;
- [x] Wallets Kit migrado do escopo npm legado `@creit.tech` para o pacote JSR v2
  `@creit-tech` (mesma versão 2.5.0; `.npmrc` aponta o scope `@jsr`);
- [x] Ações `passkey-create`/`passkey-connect`, lab live, handoff do capítulo VII e i18n
  de chrome ×4;
- [x] Sem relayer no v1: a conta G local fundada é deployer dedicado e paga o RPC direto;
- [x] Claim verifica a conta G, a identidade do código C e saldo XLM nativo positivo;
- [x] `tsc`/lint/check-forge-pins/build verdes e hash provado contra contrato testnet real;
- [ ] **E2E no browser do Pedro**: aprovar criação e autenticação da passkey com
  Touch ID/Face ID/PIN, confirmar o C-address e reivindicar os +100 XP;
- [ ] Incidental preservado: a working tree remove a entrada
  `[mcp_servers.stellar-raven]` de `.codex/config.toml` (backup `.bak-raven`). Continua
  fora dos commits de produto até decisão do Pedro.

### Bump do SDK 17 — item da Fase C com **janela dura**

O repo está em `@stellar/stellar-sdk` **^16.2.0**; existe branch do Dependabot parado
(`dependabot/npm_and_yarn/stellar/stellar-sdk-17.0.0`). **js-sdk v17 = Protocol 28**, que
entra na **mainnet em 16/09/2026** (testnet desde 27/08). Fazer o bump (e o teste dos
fluxos de deploy/invoke/classic) **antes de 16/09**.

### Fase D — amplitude (não iniciada)

- [ ] Prateleira **"Relics of the Forge"** no `/cards` (array `labRelics` no conteúdo,
  imagem = emblema, populada de `LabProgress`, via `ChampionCard` existente);
- [ ] 2–3 labs classic do roadmap (baú claimable, patrono/sponsored reserves, cofre
  multisig);
- [ ] Overlays i18n de conteúdo (`labSteps`/`journeySteps` no `LocaleContent`);
- [ ] Capítulo capstone (precisa do maquinário mentor/runner) + sigilos/artes dos 14
  capítulos sem arte;
- [ ] XP/eventos no profile ("feitos de renome").

### Riscos verify-first (do plano)

Passkeys/WebAuthn dependem de dispositivo real e contexto seguro (HTTPS/localhost);
fee-sponsorship/relayer segue fora do v1; Blend invoke-only (conferir endereços antes de
agendar); Confidential Tokens segue roadmap (dev preview); x402/KALE dependem de endpoints
do ecossistema; custo do mentor nos exercícios (monitorar `MentorHint`).

---

## 13. Como rodar & verificar localmente

```bash
cp .env.example .env        # npx auth secret → AUTH_SECRET; AUTH_DEV_LOGIN="true"
npm install                 # postinstall roda prisma generate
npm run db:up               # Postgres 17 no Docker (user/pass/db: tusst)
npm run db:migrate          # prisma migrate dev
npm run db:seed             # seed append-only (slug = identidade)
npm run dev                 # http://localhost:3000
```

- **Dev login**: com `AUTH_DEV_LOGIN="true"`, qualquer nome loga (hard-disabled em
  produção). É o caminho para testar claims de XP.
- **Runners Docker** (opcionais no dia-a-dia, necessários para os fluxos completos):
  `npm run runner:build` (grading da campanha; sem ele use `RUNNER_MODE="regex"`) e
  `npm run runner:soroban:build` (Forge IDE **e o build do wizard OZ**; imagem grande).
  Em host serverless o wizard usa `NEXT_PUBLIC_FORGE_RUNNER_URL`.
- **Checks estáticos**: `npx tsc --noEmit` (prova os 4 locales) · `npm run lint` ·
  `npm run check:forge-pins`.
- **Passkey**: requer HTTPS ou `localhost` e um dispositivo/navegador WebAuthn. O lab usa
  IndexedDB `tusst-smart-accounts-v1`; apagar os dados do site apaga a associação local.
  O pacote `smart-account-kit` está fixado em **0.6.2** porque código/artefatos testnet são
  tratados como um conjunto verificado.
- **Assets**: `npm run assets:v2` (precisa dos masters em `art-src/v2/`; slots ausentes são
  ok). `npm run assets:landing` é da landing e não se mistura.
- **XP retroativo**: `npm run xp:backfill` (local); **no Neon é manual do Pedro**.
- **Roteiro de smoke v2**: `/` intocada → Hall em `/path` (portas + vinheta da Forge +
  faixa de XP) → `/journey` (2 arcos, próximo recomendado) → jogar um capítulo e selar
  (+30) → `/labs` → wallet-onboarding na testnet real até o claim (+75; replay =
  `already:true`) → passkey-smart-wallet num dispositivo real (+100; contrato C com hash
  canônico) → `/campaign` (paridade do trilho, gate 1/3/6 por cookie, submit credita ouro
  1× + 1 XpEvent) → language switcher nas páginas novas.
- **Gotchas de ambiente** (detalhes na memória `tusst-stack-gotchas`): Prisma 7 exige
  driver-adapter (`@prisma/adapter-pg`); `prisma migrate reset` **bloqueado para IA**;
  numa sessão com preview MCP, o submit de forms precisa de `requestSubmit`; o preview MCP
  não roda em sessão worktree; o browser pane já derrubou sessão.

---

## 14. Invariantes — NÃO QUEBRAR

1. **XP / P2002**: o ledger `XpEvent` com unique `(userId, source, sourceKey)` é o
   anti-replay. `awardXp` faz read-before-create, e o **P2002 concorrente DEVE ser
   capturado FORA da `$transaction`** (Postgres aborta a tx inteira — mesmo padrão do ouro
   em `api/submissions`). `Character.xp/level` são agregados denormalizados escritos na
   mesma transaction; curva `50·l·(l−1)`; valores 25/30(+20)/75/100/150. Ouro intocado.
2. **Labs são DADOS**: conteúdo em `src/content/labs/` com funções apenas em campos
   client-side (`ops(ctx)`, `files(ctx)`, `argsFrom(ctx)`); `verify[]` é **data-only**,
   interpretado exclusivamente pelo servidor contra Horizon/RPC. **`verify: []` = lab
   honor-based.** O cliente jamais é fonte de verdade de conclusão on-chain.
3. **Wallet e storage compartilhados**: a wallet local dos labs é a da Forge
   (`tusst:forge:secret`); runs em `tusst:labs:v1:{slug}`; jornada em
   `tusst:journey-steps:{slug}` (+ draft `tusst:journey-ex:{slug}`). Deploys de lab entram
   no `forge-store` — uma Forja só.
4. **Jornada é dado puro e serializável** — o servidor enriquece `labLink`/`rustBranch` e
   passa por props. `JOURNEY_LIVE` exportado de `src/content/journey/index.ts` é o
   interruptor **único** (porta do Hall + nav + onboarding); nunca duplicar o flag.
   Branch para ato trancado renderiza cadeado ("destrava com o Ato N"), **nunca 404**.
5. **Campanha byte-compatível**: `unlock.ts`, `campaign-progress.ts`, o ratchet
   `maxUnlockedAct`, o cookie `tusst_onboarding`/`unlockedActs` e os 4 gates
   `findIndex < count` não mudam. Jornada/labs nunca consultam nem alimentam esses gates.
6. **Kit visual `sc-` é CÓPIA, não import**: nunca importar/editar arquivos da landing
   (`landing.css`, MotionOrchestrator, JsGate…). Escopo `[data-scene-root]`; toda
   superfície funciona sem arte (gradiente/glyph). Gate de JS via `data-js` estático +
   `<noscript>` — **nunca** reintroduzir `<script>` inline em componente React.
7. **Arte**: masters em `art-src/v2/` (gitignored) → `npm run assets:v2` → commit **só** de
   `public/v2/`; briefs em `docs/ART-BRIEFS-v2.md`; budgets por arquivo no script; layer
   keyed com props no topo ⇒ `key:{bgCenter:true}`.
8. **Triângulo de pins do runner Soroban**: geração de código de lab importa
   `CURATED_CARGO_TOML` de `soroban-templates.ts` — **nenhum literal de pin novo**;
   `npm run check:forge-pins` deve ficar verde por construção. Nunca buildar SDKs sdk-25
   (Blend, sep-41 standalone) junto dos pins OZ sdk-26.
9. **USDC testnet**: issuer da Circle hardcoded em
   `src/content/labs/wallet-onboarding.ts` — se o changeTrust falhar com `op_no_issuer`
   após um reset trimestral da testnet, é essa constante que se reconfere.
10. **Seed append-only**: nunca inserir/reordenar em `prisma/seed.ts`, só anexar (slug =
    identidade; gate é posicional). Jornada e labs **não tocam o seed** por design.
    `prisma migrate reset` é bloqueado (incidente 2026-07-16, memória `tusst-seed-safety`).
11. **Git/deploy**: commits como **Pedro `<pedropelicioni@gmail.com>`** com trailer
    `Co-authored-by: Nearx-Labs <nearxlabs@nearx.com.br>` — **nunca** Claude como
    autora/co-autora. **NUNCA `git push`** em nenhuma circunstância (o `deploy.yml` no push
    a main aplica migrations no Neon + sync do VPS) — sempre perguntar ao Pedro.
    `xp:backfill` no Neon é manual do Pedro.
12. **i18n**: UI tipada ×4 com `en` como fonte da verdade (build quebra se faltar);
    conteúdo EN-first com overlay opcional por locale (fallback EN). Nunca "traduzir
    depois" uma chave de UI — ela nasce nos 4.
13. **Exercício de mentor**: brief/rubric saem do conteúdo **no servidor**; a spec do aluno
    é dado não-confiável (manter o hardening no system prompt); veredito malformado nunca
    premia nem reprova; quota via `MentorHint kind:"journey"`.
14. **Verificação on-chain é no claim**: nunca re-verificar retroativamente conclusões
    persistidas (resets da testnet apagariam o histórico dos alunos).
15. **Passkey**: `smart-account-kit` + artefatos P27 formam uma unidade — versão 0.6.2,
    account Wasm `1b5f…785a`, verifier `CC7E…OM3F`. O deployer G dedicado paga fee/salt,
    mas **nunca é signer da smart account**. Credenciais/sessões ficam em IndexedDB; nunca
    persistir credential ID no servidor nem expor o `deployerSecret`. O claim verifica o
    hash do Wasm + saldo nativo via RPC, não um booleano do cliente. A prova interativa
    é uma transferência real: sucesso significa que verifier + `__check_auth` aceitaram a
    assinatura da passkey on-chain.

---

## 15. Índice de arquivos-chave

| Caminho | Papel |
|---|---|
| [`../prisma/schema.prisma`](../prisma/schema.prisma) | Modelos `LabProgress`/`JourneyProgress`/`XpEvent` + `Character` (agregados) |
| `../prisma/migrations/20260828072051_v2_labs_journey_xp/` | A migration única da v2 |
| [`../src/lib/xp.ts`](../src/lib/xp.ts) | Valores de XP, curva de nível, progresso (client+server safe) |
| [`../src/lib/xp-award.ts`](../src/lib/xp-award.ts) | `awardXp` server-only — a regra do P2002 mora aqui |
| [`../scripts/backfill-xp.mjs`](../scripts/backfill-xp.mjs) | Backfill retroativo idempotente (owner-run) |
| [`../src/content/labs/types.ts`](../src/content/labs/types.ts) | DSL dos labs (steps, ações, verify) |
| [`../src/content/labs/index.ts`](../src/content/labs/index.ts) | Catálogo da Forge (live + soon) |
| [`../src/content/labs/wallet-onboarding.ts`](../src/content/labs/wallet-onboarding.ts) | Lab 1 (+ constante `USDC_TESTNET`) |
| [`../src/content/labs/oz-token-wizard.ts`](../src/content/labs/oz-token-wizard.ts) | Lab wizard OZ |
| [`../src/content/labs/oz-token-files.ts`](../src/content/labs/oz-token-files.ts) | Gerador de Rust do wizard (importa `CURATED_CARGO_TOML`) |
| [`../src/content/labs/passkey-smart-wallet.ts`](../src/content/labs/passkey-smart-wallet.ts) | Lab passkey + identidade canônica dos artefatos P27 testnet |
| [`../src/content/labs/scp-simulator.ts`](../src/content/labs/scp-simulator.ts) | Lab SCP (honor-based) |
| [`../src/lib/labs/engine.ts`](../src/lib/labs/engine.ts) | Interpretador de ações (client) com fases e retries |
| [`../src/lib/labs/verify.ts`](../src/lib/labs/verify.ts) | Verificação on-chain server-only (Horizon + RPC simulate) |
| [`../src/lib/labs/store.ts`](../src/lib/labs/store.ts) | Runs em localStorage (anônimo + resume) |
| [`../src/lib/stellar/classic.ts`](../src/lib/stellar/classic.ts) | Primeiras classic ops + result codes didáticos |
| [`../src/lib/stellar/smart-account.ts`](../src/lib/stellar/smart-account.ts) | Seam browser do smart-account-kit (WebAuthn + deploy/reconnect) |
| [`../src/lib/soroban/run-stream.ts`](../src/lib/soroban/run-stream.ts) | Transporte NDJSON compartilhado IDE/labs |
| [`../src/components/ide/use-forge-run.ts`](../src/components/ide/use-forge-run.ts) | Wrapper fino do IDE sobre o run-stream |
| [`../src/content/journey/types.ts`](../src/content/journey/types.ts) | Modelo de conteúdo da Jornada (incl. `exercise`) |
| [`../src/content/journey/index.ts`](../src/content/journey/index.ts) | Registry dos 17 capítulos, 2 arcos, `JOURNEY_LIVE` |
| `../src/content/journey/concepts/` | Os 17 capítulos (1 arquivo por slug) |
| [`../src/components/journey/ConceptPlayer.tsx`](../src/components/journey/ConceptPlayer.tsx) | Player da Jornada (widgets, handoffs, branch, exercício, selo) |
| [`../src/components/labs/LabPlayer.tsx`](../src/components/labs/LabPlayer.tsx) | Player dos labs (stepper de fases, claim) |
| [`../src/components/labs/LabCard.tsx`](../src/components/labs/LabCard.tsx) | Card do catálogo |
| [`../src/components/labs/sims/ScpSim.tsx`](../src/components/labs/sims/ScpSim.tsx) | Simulador SCP (7 nós, slices 3-de-5, quórum 4-de-7) |
| `../src/components/scene/` | Kit visual `sc-` (SceneRoot/Motion/Art/Particles + scene.css) |
| [`../scripts/v2-assets.mjs`](../scripts/v2-assets.mjs) | Pipeline de arte v2 (grayKey, `bgCenter`, budgets) |
| [`ART-BRIEFS-v2.md`](./ART-BRIEFS-v2.md) | Briefs + prompts Higgsfield + nota de proveniência |
| `../src/app/(app)/path/page.tsx` | The Hall (home) |
| `../src/app/(app)/journey/page.tsx` + `journey/[slug]/page.tsx` | Mapa 2 arcos + página do capítulo (enriquecimento server-side) |
| `../src/app/(app)/labs/page.tsx` + `labs/[slug]/page.tsx` | Forge expandida + página do lab |
| `../src/app/(app)/campaign/page.tsx` | Trilho da campanha (verbatim do antigo /path) |
| [`../src/app/api/labs/complete/route.ts`](../src/app/api/labs/complete/route.ts) | Claim de lab (verify on-chain → XP) |
| [`../src/app/api/journey/complete/route.ts`](../src/app/api/journey/complete/route.ts) | Selo de capítulo (+30 XP) |
| [`../src/app/api/journey/exercise/route.ts`](../src/app/api/journey/exercise/route.ts) | Examinador spec-write via mentor |
| `../src/app/api/submissions/route.ts` | Grading da campanha (+ ouro + 25 XP na mesma transaction) |
| `../src/content/soroban-templates.ts` | `CURATED_CARGO_TOML` (fonte única dos pins) |
| `../src/lib/forge-store.ts` | Deployments compartilhados labs ↔ painel Interact do IDE |
| `../src/components/Nav.tsx` / `NavMenu.tsx` | Nav Journey · Forge · Campaign + chip de nível |
| `../src/components/onboarding/OnboardingFlow.tsx` | Tela final → primeiro conceito da Jornada |
| `../src/i18n/messages/{en,pt,es,fr}/{home,labs,journey}.ts` | Namespaces de UI da v2 (×4, tipados contra en) |

**Documentos-irmãos**: o plano aprovado
(`~/.claude/plans/quero-implementar-uma-grande-partitioned-eich.md`) e as memórias do
projeto (`tusst-v2-restructure`, `tusst-project`, `tusst-stack-gotchas`, `tusst-i18n`,
`tusst-seed-safety`, `tusst-vps-deploy`, `forge-ide`) — este dossiê consolida, mas as
memórias seguem sendo atualizadas.
