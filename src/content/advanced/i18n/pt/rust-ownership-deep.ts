import type { LessonStep } from "@/content/steps";

// PT · Ownership, Moves & Drops.
//
// Regras de tradução deste caminho:
//   · Termos técnicos do Rust NÃO se traduzem: ownership, borrow, move,
//     borrow checker, trait, guard. Traduzir "borrow checker" para
//     "verificador de empréstimo" só afasta o leitor da mensagem de erro
//     real que ele vai ver no compilador.
//   · `choices` de um passo `fill` são código — ficam idênticos ao inglês.
//   · O índice da resposta certa nunca muda (check:advanced trava isso).

export const rustOwnershipDeepStepsPt: Record<string, LessonStep[]> = {
  "rust-ownership-deep-1": [
    {
      kind: "theory",
      body: `Todo valor em Rust tem exatamente um dono, e o tipo dele decide onde os bytes realmente ficam.

Um \`i32\` ocupa 4 bytes e vive inteiro no stack frame da função que o segura. Um \`String\` é diferente: o *handle* fica na stack e tem sempre o mesmo tamanho, enquanto os caracteres ficam na heap.

Esse handle são três palavras — ponteiro, comprimento e capacidade:

\`\`\`rust
let name = String::from("stellar");
// stack:  [ ptr | len: 7 | cap: 7 ]   = 24 bytes num alvo 64 bits
// heap:   s t e l l a r               = 7 bytes
\`\`\``,
    },
    {
      kind: "theory",
      body: `Essa separação é a razão inteira de ownership existir.

Copiar os 4 bytes de um \`i32\` é de graça, então Rust simplesmente copia. Copiar um \`String\` significaria duplicar a alocação na heap (caro, e silenciosamente) ou ter dois handles apontando para a mesma alocação (o que a libera duas vezes).

Rust recusa as duas coisas. Em vez disso ele transfere o handle — e essa transferência é o que "move" significa. Nada na heap é tocado.

\`std::mem::size_of::<T>()\` informa o tamanho na **stack** de um tipo, nunca o payload na heap atrás dele. Vale internalizar essa distinção agora: é a que as pessoas erram em entrevista.`,
    },
    {
      kind: "quiz",
      question:
        "`size_of::<String>()` devolve 24 num alvo 64 bits, tanto para uma string de 3 caracteres quanto para uma de 3 milhões. Por quê?",
      options: [
        "Ele mede o handle na stack — ponteiro, comprimento e capacidade — e não o buffer na heap para o qual aponta",
        "Rust limita todo String a 24 bytes e joga o resto numa tabela lateral",
        "24 é o tamanho da primeira linha de cache que o alocador entrega",
      ],
      answer: 0,
      explain:
        "`size_of` é uma constante de tempo de compilação, então só pode descrever o que o compilador sabe: o layout fixo na stack. O comprimento na heap é um valor de runtime — isso é `.len()`.",
    },
    {
      kind: "fill",
      prompt:
        "Informe quantos bytes os dados da string ocupam na heap — não o handle.",
      file: "main.rs",
      before: 'let name = String::from("stellar");\nprintln!("heap bytes: {}", name.',
      after: ");",
      choices: ["len()", "capacity()", "size_of()"],
      answer: 0,
      explain:
        "`len()` são os bytes efetivamente em uso. `capacity()` são os bytes reservados, que podem ser mais depois de um crescimento — uma distinção real, só que não a pedida aqui.",
    },
    {
      kind: "quiz",
      question:
        "Uma função recebe `data: Vec<u8>` por valor e é chamada num laço quente. O que é copiado a cada chamada?",
      options: [
        "24 bytes — o handle do vetor. O buffer na heap não é tocado, ele é reapontado",
        "O buffer inteiro, e é por isso que passar por valor num laço é caro",
        "Nada — Rust passa todo argumento por referência por baixo dos panos",
      ],
      answer: 0,
      explain:
        "Mover é barato: é um memcpy do handle. O custo que as pessoas temem em `por valor` é o *drop* no fim da função chamada, não a transferência.",
    },
    {
      kind: "editor",
      intro: `### Meça a separação

Imprima o tamanho na stack de um \`i32\`, o tamanho na stack de um \`String\` e os bytes na heap de uma string específica.

Saída esperada:

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

Use \`std::mem::size_of\` nos dois primeiros e \`.len()\` no terceiro.`,
    },
  ],

  "rust-ownership-deep-2": [
    {
      kind: "theory",
      body: `Atribuição faz uma de duas coisas, e o tipo decide qual.

Se o tipo implementa \`Copy\`, os bits são duplicados e os dois bindings continuam usáveis. Se não implementa, o ownership **move** e o binding de origem está morto — usá-lo depois é erro de compilação, não surpresa em runtime.

\`\`\`rust
let x = 10;
let y = x;
println!("{x}");        // ok — i32 é Copy

let s1 = String::from("hi");
let s2 = s1;
println!("{s1}");       // erro: borrow of moved value: \`s1\`
\`\`\``,
    },
    {
      kind: "theory",
      body: `A regra de quais tipos são \`Copy\` não é arbitrária: **um tipo só pode ser \`Copy\` se todos os campos dele forem, e ele não pode implementar \`Drop\`.**

Isso exclui exatamente os tipos onde duplicar os bits estaria errado. \`String\`, \`Vec<T>\` e \`Box<T>\` são donos de uma alocação na heap e implementam \`Drop\` — duas cópias significariam dois frees.

\`Clone\` é o opt-in explícito para a mesma coisa: \`s1.clone()\` faz a cópia profunda que o \`=\` se recusou a fazer em silêncio. A verbosidade é o ponto. Uma alocação deve ser visível no código.`,
    },
    {
      kind: "quiz",
      question:
        "Por que um tipo que implementa `Drop` nunca pode também implementar `Copy`?",
      options: [
        "Copiar os bits produziria dois donos do mesmo recurso, e `drop` rodaria duas vezes sobre ele",
        "`Drop` e `Copy` definem os dois um método chamado `clone`, então colidem",
        "Pode — a biblioteca padrão simplesmente escolhe não fazer isso para `String`",
      ],
      answer: 0,
      explain:
        "Isso é regra dura do compilador, não convenção. `Copy` significa 'duplicar os bits é uma duplicata completa'; `Drop` significa 'estes bits são donos de algo que precisa ser liberado uma vez'. As duas afirmações se contradizem.",
    },
    {
      kind: "fill",
      prompt: "Mantenha `s1` usável depois de produzir uma segunda string independente.",
      file: "main.rs",
      before: 'let s1 = String::from("ledger");\nlet s2 = s1.',
      after: ';\nprintln!("{s1} {s2}");',
      choices: ["clone()", "as_str()", "to_owned().as_str()"],
      answer: 0,
      explain:
        "`clone()` aloca um segundo buffer, então cada handle é dono dos próprios dados. `as_str()` faria um borrow — Rust válido também, mas não te dá um segundo `String`.",
    },
    {
      kind: "quiz",
      question:
        "`let t = (1i32, String::from(\"a\")); let u = t;` — qual o estado de `t` depois disso?",
      options: [
        "Movido por inteiro. Uma tupla só é `Copy` se todos os elementos forem, e `String` não é",
        "Parcialmente movido: `t.0` ainda é legível porque `i32` é `Copy`",
        "Intacto — tuplas são sempre copiadas elemento por elemento",
      ],
      answer: 0,
      explain:
        "Atribuir a tupla inteira move a tupla inteira. Moves parciais campo a campo existem, mas só quando você nomeia o campo — que é a próxima lição.",
    },
    {
      kind: "editor",
      intro: `### Move, copy, clone

Mostre os três comportamentos num programa só:

1. Ligue \`10\` a \`a\`, depois \`a\` a \`b\`, e imprima os dois — isso é uma cópia.
2. Construa um \`String\` com \`ledger\`, faça \`clone()\` e imprima os dois.
3. Mova o clone para um terceiro binding e imprima.

Saída esperada:

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\``,
    },
  ],

  "rust-ownership-deep-3": [
    {
      kind: "theory",
      body: `Ownership é rastreado **por campo**, não só por valor.

Mover um campo para fora de uma struct deixa a struct parcialmente movida: o campo que você tirou está morto, todos os outros continuam legíveis.

\`\`\`rust
struct Account { id: String, balance: i64 }

let acct = Account { id: String::from("GA7Q"), balance: 250 };
let id = acct.id;              // move só este campo
println!("{}", acct.balance);  // ok
println!("{}", acct.id);       // erro: value moved
println!("{:?}", acct);        // erro: \`acct\` não está mais inteiro
\`\`\``,
    },
    {
      kind: "theory",
      body: `Dois limites valem saber antes de contar com isso.

**Um valor parcialmente movido não pode ser usado como um todo.** Você pode ler os campos que sobraram, mas não pode passar \`acct\` para uma função, retorná-lo, nem movê-lo de novo.

**Um tipo que implementa \`Drop\` não pode ser parcialmente movido de jeito nenhum.** O \`drop\` dele vai rodar contra o valor inteiro, então o compilador não pode permitir um buraco. Se você precisa de um campo de um tipo assim, use \`clone()\` ou \`std::mem::take\`, que troca pelo valor padrão e te devolve o original.`,
    },
    {
      kind: "quiz",
      question:
        "`let id = acct.id;` compila, mas acrescentar `#[derive(Debug)]` e depois `println!(\"{acct:?}\")` não compila. Por quê?",
      options: [
        "A formatação `Debug` lê a struct inteira, e um campo não guarda mais um valor válido",
        "`derive(Debug)` toma posse da struct em que é aplicado",
        "Moves parciais só são permitidos em structs que não derivam nada",
      ],
      answer: 0,
      explain:
        "A struct não sumiu — ela tem um buraco. Tudo que precisa dela inteira (Debug, repassar, retornar) é rejeitado; ler um campo intacto não é.",
    },
    {
      kind: "fill",
      prompt:
        "`Session` implementa `Drop`, então um campo não pode ser movido para fora dela. Pegue o token e deixe uma `String` vazia no lugar.",
      file: "main.rs",
      before: "let token = std::mem::",
      after: "(&mut session.token);",
      choices: ["take", "drop", "swap"],
      answer: 0,
      explain:
        "`take` substitui o campo por `Default::default()` e devolve o original — o valor continua inteiro, então `Drop` ainda tem algo válido para rodar. `swap` também funciona, mas você precisa fornecer o substituto.",
    },
    {
      kind: "quiz",
      question:
        "Você precisa de um campo `String` de uma struct que também precisa ser repassada depois. O que está correto?",
      options: [
        "`clone()` no campo, ou `mem::take` se deixar um valor vazio para trás for aceitável",
        "Mover o campo para fora e repassar a struct — o compilador tapa o buraco",
        "Envolver a struct num `Box` antes; boxing torna moves parciais inteiros de novo",
      ],
      answer: 0,
      explain:
        "A escolha é um trade real: `clone` custa uma alocação e preserva o original, `mem::take` é de graça mas muta a origem. Nenhum dos dois está sempre certo.",
    },
    {
      kind: "editor",
      intro: `### Tire um campo, guarde o resto

Defina \`struct Account { id: String, balance: i64 }\` e construa uma com id \`GA7Q\` e balance \`250\`.

Mova **apenas** o campo \`id\` para um binding próprio, depois imprima o id e o balance que ainda está na struct.

Saída esperada:

\`\`\`text
id: GA7Q
balance: 250
\`\`\``,
    },
  ],

  "rust-ownership-deep-4": [
    {
      kind: "theory",
      body: `O borrow checker impõe uma regra: em qualquer ponto, um valor tem **ou** qualquer número de referências compartilhadas \`&T\`, **ou** exatamente uma referência exclusiva \`&mut T\`. Nunca as duas.

A parte que derruba as pessoas é o *em qualquer ponto*. Um borrow dura até o **último uso**, não até o fim do bloco. Isso se chama NLL — non-lexical lifetimes — e significa que a maioria dos erros de aliasing se resolve movendo uma linha, não chamando clone.

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = &v[0];      // borrow compartilhado começa
println!("{first}");    // ...e termina aqui, no último uso
v.push(4);              // ok — nada está emprestando v
\`\`\``,
    },
    {
      kind: "theory",
      body: `Reordenar só funciona quando o *resultado* do borrow não precisa sobreviver à mutação. Quando precisa, extraia o valor para fora do borrow primeiro:

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = v[0];       // i32 é Copy — isso lê e encerra o borrow
v.push(4);
println!("{first}");    // ok: \`first\` é dono dos próprios 4 bytes
\`\`\`

Para um elemento que não é \`Copy\` o mesmo movimento existe — \`.clone()\`, ou calcular um resumo como \`.len()\` ou \`.iter().sum()\` — e deve ser escolha deliberada, não reflexo. Chamar \`clone()\` toda vez que o compilador reclama é como um caminho quente adquire silenciosamente uma alocação por iteração.`,
    },
    {
      kind: "quiz",
      question:
        "Por que `let n = &v[0]; v.push(4); println!(\"{n}\");` falha, se mover o `println!` para antes do `push` compila?",
      options: [
        "`push` pode realocar o buffer, então a referência poderia ficar pendurada — e o borrow ainda está vivo porque é usado depois",
        "`push` exige que o vetor não tenha referências em nenhum ponto do corpo da função inteira",
        "A macro `println!` captura os argumentos por valor, o que move para fora de um borrow",
      ],
      answer: 0,
      explain:
        "As duas metades importam: `push` precisa de `&mut`, e o borrow compartilhado ainda está vivo porque uma linha posterior o usa. Suba essa linha e o borrow acaba antes do `push` — que é exatamente o que NLL te dá.",
    },
    {
      kind: "fill",
      prompt: "Calcule um total sobre o vetor sem segurar um borrow além da linha.",
      file: "main.rs",
      before: "let total: i32 = ledger.iter().",
      after: ";\nledger.push(total);",
      choices: ["sum()", "collect()", "count()"],
      answer: 0,
      explain:
        "`sum()` consome o iterador e devolve um `i32` próprio, então o borrow de `ledger` acabou no fim do statement — o `push` fica livre para pegar `&mut`.",
    },
    {
      kind: "quiz",
      question:
        "Qual destas é a *pior* correção habitual para um erro do borrow checker num laço quente?",
      options: [
        "Clonar o valor emprestado, porque converte silenciosamente um erro de compilação numa alocação por iteração",
        "Estreitar o escopo do borrow para que termine antes da mutação",
        "Extrair um resumo `Copy` dos dados antes de mutar",
      ],
      answer: 0,
      explain:
        "`clone()` não é proibido — às vezes é genuinamente a decisão certa. O modo de falha é usá-lo *por reflexo*, o que faz o compilador parar de reclamar sem tornar o código correto nem rápido.",
    },
    {
      kind: "editor",
      intro: `### Encerre o borrow antes de mutar

Dado \`let mut ledger = vec![10, 20, 30];\`:

1. Some as entradas em \`total\` usando um iterador.
2. Faça \`push\` de \`total\` em \`ledger\`.
3. Imprima o vetor, depois o total.

Saída esperada:

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\``,
    },
  ],

  "rust-ownership-deep-5": [
    {
      kind: "theory",
      body: `Duas coerções acontecem com tanta frequência que ficam invisíveis — e aí confundem na primeira vez que não disparam.

**Deref coercion.** \`&String\` vira \`&str\`, \`&Vec<T>\` vira \`&[T]\`, \`&Box<T>\` vira \`&T\`. O compilador insere a conversão num call site sempre que o tipo alvo não bate mas existe um impl de \`Deref\` ligando os dois.

\`\`\`rust
fn describe(s: &str) -> usize { s.len() }

let owned = String::from("soroban");
describe(&owned);   // &String coagido para &str — sem alocação, sem cópia
\`\`\`

É por isso que você recebe \`&str\` num parâmetro e guarda \`String\` num campo de struct: o parâmetro aceita os dois, o campo é dono dos dados.`,
    },
    {
      kind: "theory",
      body: `**Reborrowing.** \`&mut T\` não é \`Copy\` — só pode existir um. Então passar um para uma função deveria movê-lo e deixar seu binding morto. Não deixa:

\`\`\`rust
let mut seq = 41;
let handle = &mut seq;
bump(handle);           // reborrow implícito: &mut *handle
bump(&mut *handle);     // a mesma coisa, escrita por extenso
\`\`\`

O compilador passa em silêncio \`&mut *handle\` — um borrow *novo* e mais curto, derivado do seu. Ele expira quando a função retorna e seu handle volta a valer. Sem isso, todo \`&mut\` seria de uso único e a linguagem seria insuportável.

Você precisa escrever o reborrow à mão num caso comum: guardar um \`&mut\` numa struct, ou retorná-lo, onde o compilador não consegue inferir o lifetime mais curto que você quis dizer.`,
    },
    {
      kind: "quiz",
      question:
        "`fn bump(n: &mut i64)` é chamada duas vezes seguidas com o mesmo binding `&mut`, e compila. Por que a primeira chamada não é um move?",
      options: [
        "O compilador insere um reborrow implícito, `&mut *handle`, que expira quando a chamada retorna",
        "`&mut i64` é `Copy` porque `i64` é `Copy`",
        "Argumentos de função são sempre passados por referência, então nada move",
      ],
      answer: 0,
      explain:
        "Reborrowing é o mecanismo que torna referências exclusivas usáveis mais de uma vez. `&mut T` nunca é `Copy`, independente de `T`.",
    },
    {
      kind: "fill",
      prompt:
        "Escreva o reborrow explicitamente, para que a segunda chamada receba seu próprio borrow exclusivo de vida curta.",
      file: "main.rs",
      before: "bump(",
      after: "handle);",
      choices: ["&mut *", "&", "*"],
      answer: 0,
      explain:
        "`&mut *handle` desreferencia para chegar ao valor e então pega um borrow exclusivo novo dele. `&handle` seria um borrow compartilhado *da própria referência* — outro tipo.",
    },
    {
      kind: "quiz",
      question:
        "Uma função pública recebe `name: String` e só chama `.len()` nele. Qual deveria ser a assinatura?",
      options: [
        "`&str` — aceita `&String` por deref coercion e `&'static str` direto, e não força alocação em quem chama",
        "`String`, para a função ser dona dos dados e não ser afetada por quem chama",
        "`&String`, que é o tipo mais preciso e portanto o mais rápido",
      ],
      answer: 0,
      explain:
        "`&String` é estritamente pior que `&str`: aceita menos (um literal não coage *para cima*) e não compra nada. Receba `String` só quando você realmente precisa guardar ou consumir.",
    },
    {
      kind: "editor",
      intro: `### As duas coerções num programa

1. Escreva \`fn describe(s: &str) -> usize\` devolvendo o comprimento, e chame com um \`&String\` contendo \`soroban\`.
2. Escreva \`fn bump(n: &mut i64)\` que soma 1.
3. Faça \`let mut seq = 41;\`, pegue \`let handle = &mut seq;\` e chame \`bump\` duas vezes — uma passando \`handle\`, outra passando \`&mut *handle\` explícito.
4. Imprima o valor final de \`seq\`.

Saída esperada:

\`\`\`text
len: 7
seq: 43
\`\`\``,
    },
  ],

  "rust-ownership-deep-6": [
    {
      kind: "theory",
      body: `Quando um valor sai de escopo, Rust roda o impl de \`Drop\` dele — sem \`finally\`, sem \`defer\`, sem \`close()\` para você esquecer. Isso é RAII: **adquirir o recurso é construir o valor, e liberá-lo é o valor terminar.**

\`\`\`rust
struct Guard(&'static str);

impl Drop for Guard {
    fn drop(&mut self) {
        println!("release {}", self.0);
    }
}
\`\`\`

Você nunca chama \`drop\` você mesmo. \`std::mem::drop(value)\` existe, mas tudo que ele faz é tomar posse e deixar o valor sair de escopo mais cedo.`,
    },
    {
      kind: "theory",
      body: `A ordem é exata e vale memorizar, porque é ela que torna lock guards e connection pools seguros:

**Variáveis de um escopo caem na ordem inversa da declaração.** Último declarado, primeiro liberado — a stack desmonta na ordem em que foi montada. *Campos* de struct, ao contrário, caem na ordem de declaração.

\`\`\`rust
let _outer = Guard("outer");
{
    let _inner = Guard("inner");
}   // "release inner" aqui
    // "release outer" no fim de main
\`\`\`

É por isso que \`MutexGuard\` dispensa chamada de unlock, e por que colocar um \`{ }\` em volta de uma seção crítica é técnica de verdade e não escolha de estilo: a chave que fecha *é* o unlock.`,
    },
    {
      kind: "quiz",
      question:
        "Três guards `a`, `b`, `c` são declarados nessa ordem num escopo. O que é impresso?",
      options: [
        "c, depois b, depois a — ordem inversa da declaração",
        "a, depois b, depois c — ordem de declaração, como campos de struct",
        "A ordem é indefinida e pode variar entre versões do compilador",
      ],
      answer: 0,
      explain:
        "Ordem inversa para locais, ordem direta para campos de struct. A assimetria é deliberada: um local declarado depois pode emprestar de um anterior, então precisa morrer primeiro.",
    },
    {
      kind: "fill",
      prompt: "Libere um lock guard mais cedo, sem esperar o fim da função.",
      file: "main.rs",
      before: "let guard = lock.acquire();\n",
      after: "(guard);\nlong_running_work();",
      choices: ["drop", "guard.close", "std::mem::forget"],
      answer: 0,
      explain:
        "`drop` toma o valor por ownership e o encerra ali. `mem::forget` faz o oposto — vaza o valor de propósito e o lock nunca é liberado.",
    },
    {
      kind: "quiz",
      question:
        "Por que segurar um `MutexGuard` durante uma chamada lenta é problema, mesmo em teste single-thread?",
      options: [
        "O guard vive até o fim do escopo, então o lock fica preso a chamada inteira — toda outra thread bloqueia atrás dele",
        "`Drop` não pode rodar enquanto há uma chamada de função na stack, então o guard vaza",
        "Não é problema; o compilador libera o lock no último uso do guard",
      ],
      answer: 0,
      explain:
        "A armadilha é exatamente essa: NLL encerra *borrows* no último uso, mas `Drop` roda no fim do *escopo*. Um guard que você parou de ler ainda está segurando o lock. Delimite com um bloco, de propósito.",
    },
    {
      kind: "editor",
      intro: `### Prove a ordem

Defina \`struct Guard(&'static str)\` com um impl de \`Drop\` que imprime \`release <nome>\`.

Em \`main\`, crie um guard chamado \`outer\`, depois abra um bloco interno com um guard chamado \`inner\` e um \`println!("inside")\`. Depois do bloco, imprima \`outside\`.

Saída esperada:

\`\`\`text
inside
release inner
outside
release outer
\`\`\``,
    },
  ],
};
