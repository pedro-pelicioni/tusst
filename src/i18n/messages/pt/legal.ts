// Tradução de ../en/legal.ts — o arquivo em inglês é a fonte da verdade.
export const legal = {
  privacy: {
    metaTitle: "Política de Privacidade — TUSST",
    metaDescription:
      "Quais dados pessoais a TUSST coleta, por quê, quem os recebe e como exercer seus direitos.",
    kicker: "jurídico",
    title: "Política de Privacidade",
    updated: "Última atualização: {date}",
    body: `A TUSST é uma plataforma de aprendizado gratuita e open-source de Rust e da rede Stellar, disponível em tusst.xyz. Esta política explica quais dados pessoais coletamos quando você a usa, por que os coletamos, quem os recebe e quais são os seus direitos.

## Quem é o responsável

A TUSST é mantida por Pedro Pelicioni, no Brasil. Ele é o controlador dos seus dados pessoais e o contato para qualquer dúvida ou solicitação sobre privacidade (o encarregado de dados, nos termos da LGPD): [pedro@vants.xyz](mailto:pedro@vants.xyz).

## O que coletamos

- **Sua conta.** Quando você entra com GitHub ou Discord, armazenamos seu nome de exibição (ou seu nome de usuário, se você não tiver definido um), seu endereço de e-mail principal nesse provedor (mesmo que ele seja privado no GitHub) e o id numérico da sua conta lá. Não armazenamos sua foto de perfil nem outros detalhes do seu perfil. A biblioteca de login também armazena os tokens que o provedor emitiu no seu primeiro login (no caso do Discord, incluindo um refresh token). Eles só permitem ler seu perfil e seu endereço de e-mail, e nunca os usamos para acessar sua conta no GitHub ou no Discord.
- **Seu progresso.** As lições, os capítulos da Jornada e os labs que você concluiu e quando, os pontos de experiência (XP) que cada um rendeu e o seu nível, o herói que você escolheu, seu ouro no jogo, os itens do Arsenal que você comprou e quanto pagou por eles, e seu idioma preferido.
- **O código que você envia.** Quando você executa o código de uma lição, armazenamos o código, os resultados da avaliação e a saída do programa, com a data e a hora. Isso preserva seu progresso e nos permite corrigir lições que estejam quebradas ou difíceis demais.
- **Feedback do mentor e do examinador.** Quando você pede uma dica ao mentor de IA ou envia uma spec ao examinador da Jornada, armazenamos o texto da resposta (que pode citar seu código), o modelo que a escreveu, seu idioma, a lição a que ela se refere (se houver) e quando isso aconteceu. Não armazenamos os arquivos da Forja nem a spec que você enviou.
- **Evidências dos labs.** Quando você reivindica a recompensa de um lab, armazenamos o endereço público na testnet da Stellar, o id do contrato e os hashes de transação envolvidos.
- **Estatísticas de uso.** Usamos o Vercel Web Analytics, que registra as páginas que você visita, o site de onde você veio, seu país, navegador, sistema operacional e tipo de dispositivo, além de alguns eventos da interface (por exemplo, qual botão de login foi clicado ou qual herói você escolheu). Ele não usa cookies e não é vinculado à sua conta; os visitantes são contados por meio de um hash do endereço IP e do navegador, e esse hash muda todos os dias.
- **Dados técnicos.** Como em qualquer site, nossa hospedagem (Vercel) e nosso executor de código (DigitalOcean) recebem seu endereço IP e informações básicas do navegador a cada requisição, para disponibilizar o site e mantê-lo seguro. O executor de código também usa seu endereço IP para limitar quantos builds, testes e auditorias cada visitante pode iniciar; esse endereço fica apenas na memória desse servidor e nunca é gravado no nosso banco de dados.

Você precisa de uma conta no GitHub ou no Discord para entrar. Sem entrar, você ainda pode ler as lições, executar a primeira lição e usar a Forja: o código que você executa dessa forma é enviado ao nosso executor de código para ser avaliado ou compilado, não é armazenado e não é vinculado a ninguém. Seu progresso não é salvo, e o mentor e o examinador não ficam disponíveis.

## O que fica no seu navegador

Alguns dados ficam guardados apenas no armazenamento do seu navegador, no seu dispositivo, e não mantemos nenhuma cópia deles: os rascunhos de código das lições e de specs da Jornada que você ainda não enviou, seus projetos, seu histórico de deploys e seu layout na IDE da Forja, o progresso nos labs antes de você reivindicar a recompensa, os dados da carteira de passkey criada no lab de passkey (a passkey em si fica guardada no seu dispositivo ou no seu gerenciador de senhas), sua posição nos mapas, as configurações do tutorial e da música, e a chave secreta de qualquer carteira de testnet que você criar ou importar nos labs e na Forja. Nós nunca recebemos essa chave.

Alguns desses dados só são enviados para nós quando você usa um recurso que precisa deles: o código da lição, quando você o executa; os arquivos do seu projeto da Forja ou do lab, cada vez que você faz build, testa ou audita esse projeto (eles vão para o nosso executor de código e são excluídos quando a execução termina); seus arquivos da Forja e a saída do console, quando você pede ajuda ao mentor; e o endereço e os hashes de transação, quando você reivindica a recompensa de um lab. Limpar os dados do site no seu navegador apaga tudo o que fica armazenado apenas nele.

## Cookies

Usamos apenas os cookies de que o site precisa para funcionar: o cookie da sessão de login (criptografado; ele contém seu nome, seu endereço de e-mail e o id da sua conta, e expira após 30 dias sem uso), cookies de curta duração que protegem a etapa de login e um cookie que lembra seu idioma por um ano. Um cookie antigo, que registrava uma resposta do onboarding, ainda é lido se o seu navegador o tiver, mas ele não é mais gravado. Não usamos cookies de publicidade nem de rastreamento entre sites, e é por isso que não há banner de cookies.

## Como usamos seus dados

- Para operar a TUSST: autenticar você, salvar seu progresso, avaliar seu código e conceder XP, ouro e itens.
- Para gerar as dicas do mentor que você pede e para que um examinador de IA verifique as specs que você envia nos exercícios da Jornada com base nos critérios de avaliação do capítulo. Somente o veredito do examinador decide se você ganha o XP desse exercício; você pode nos pedir que revisemos um veredito e que expliquemos os critérios usados (veja "Seus direitos").
- Para responder a pedidos de suporte e corrigir lições, inclusive analisando as tentativas enviadas a elas.
- Para manter a plataforma segura e justa, evitando trapaças, abusos e sobrecarga.
- Para entender, de forma agregada, como a plataforma é usada e melhorar as lições.

Não vendemos seus dados, não exibimos anúncios e não enviamos e-mails de marketing.

## Bases legais

Tratamos seus dados para prestar o serviço que você usa ou no qual se cadastrou (LGPD art. 7, V; GDPR art. 6(1)(b)). Para segurança, prevenção de abusos e limitação de uso, suporte, correção de lições com base nas tentativas enviadas e estatísticas agregadas, nos apoiamos no nosso legítimo interesse em manter uma plataforma gratuita, segura e útil (LGPD art. 7, IX; GDPR art. 6(1)(f)).

## Quem recebe seus dados

- **Vercel**: hospeda o site e fornece as estatísticas de uso.
- **Neon**: hospeda nosso banco de dados.
- **DigitalOcean**: roda nosso executor de código (forge.tusst.xyz, nos Estados Unidos), que compila e executa seu código em sandboxes isolados. O código das lições chega a ele por meio do nosso site; os builds da Forja e dos labs são enviados a ele diretamente do seu navegador, então ele também vê seu endereço IP. O código enviado para lá é excluído assim que a execução termina e não é vinculado à sua conta.
- **Groq** (provedor de modelos de IA): quando você pede uma dica ao mentor, ele recebe o código, os nomes das verificações que falharam e a saída do compilador ou do programa da sua última tentativa malsucedida, ou até seis arquivos do seu projeto da Forja e a saída do console desse projeto. Quando você envia uma spec ao examinador da Jornada, ele recebe essa spec. Ele também é informado do idioma em que deve responder. Ele nunca recebe seu nome, seu endereço de e-mail, o id da sua conta nem seu endereço IP.
- **Raven (raven.stellar.buzz)**: um serviço de busca na documentação da Stellar. Para embasar algumas dicas do mentor, nosso servidor pode enviar a ele uma consulta curta, como o título de uma lição ou a primeira linha de um erro.
- **GitHub e Discord**: quando você os escolhe para entrar, eles confirmam sua identidade para nós. Eles tratam seus dados de acordo com as próprias políticas de privacidade, e não em nosso nome.
- **Stellar Development Foundation (SDF)**: os labs e a Forja se conectam diretamente do seu navegador aos servidores públicos de testnet da SDF (Horizon, RPC e Friendbot), que veem seu endereço IP e seu endereço na testnet. Quando você reivindica a recompensa de um lab, nosso servidor consulta seu endereço na testnet nesses servidores para verificar o seu trabalho. As transações que você faz, os endereços envolvidos e qualquer contrato de que você faça deploy (incluindo o código compilado dele) são públicos por design na testnet da Stellar, que é reiniciada periodicamente. O endereço que armazenamos vincula essa atividade pública à sua conta na TUSST.

## Serviços que seu navegador contata diretamente

Alguns recursos fazem seu navegador se conectar diretamente a outros serviços. Esses serviços veem seu endereço IP e o que foi solicitado, nos termos das próprias políticas de privacidade:

- **jsDelivr**, que entrega o editor de código usado nas lições e na Forja.
- **GitHub**, quando você importa um repositório público para a Forja.
- **A carteira que você escolher** no menu de carteiras da Forja (por exemplo, Freighter ou Albedo), e a Creit Tech (stellar.creit.tech), que fornece os ícones desse menu.

## Transferências internacionais

A maioria desses serviços está localizada fora do Brasil e da União Europeia, principalmente nos Estados Unidos. Transferimos dados para eles porque isso é necessário para prestar o serviço que você pediu (LGPD art. 33, IX). Quando o provedor os oferece, também nos apoiamos nos termos de tratamento de dados dele, em cláusulas-padrão contratuais ou na certificação dele no EU–U.S. Data Privacy Framework. Escreva para nós para saber qual salvaguarda se aplica a cada provedor ou para obter uma cópia.

## Por quanto tempo guardamos seus dados

Guardamos os dados da sua conta, seu progresso, o código enviado e o feedback do mentor e do examinador enquanto sua conta existir. Nosso executor de código mantém endereços IP apenas na memória, até ser reiniciado; os demais dados técnicos são mantidos apenas pelo tempo em que nossos provedores de hospedagem guardam os próprios registros de requisições. O cookie de login expira após 30 dias sem uso, e o cookie de idioma, após um ano. Quando você nos pede para excluir sua conta, nós a excluímos, com todos os dados associados, em até 30 dias; as cópias nos backups de curto prazo do nosso provedor de banco de dados desaparecem quando esses backups expiram. O que é público na testnet da Stellar está fora do nosso controle.

## Seus direitos

Você pode nos pedir para confirmar se tratamos seus dados; para acessá-los, corrigi-los, exportá-los ou excluí-los; para anonimizar, bloquear ou restringir dados desnecessários, excessivos ou tratados de forma ilícita; para saber com quem os compartilhamos; para registrar sua oposição a um tratamento baseado em legítimo interesse; e para que uma decisão automatizada, como um veredito do examinador da Jornada, seja revisada. Escreva para [pedro@vants.xyz](mailto:pedro@vants.xyz) a partir do endereço de e-mail vinculado à sua conta; respondemos em até 15 dias. Você também pode apresentar uma reclamação à autoridade brasileira de proteção de dados (ANPD) ou à autoridade do seu país.

## Crianças

A TUSST não se destina a crianças menores de 13 anos, e não permitimos conscientemente que elas criem contas. Se você tem menos de 18 anos, use a TUSST com o conhecimento de um dos seus pais ou do seu responsável legal. Se você acredita que uma criança menor de 13 anos tem uma conta, escreva para nós e nós a excluiremos.

## Segurança

O tráfego é criptografado (HTTPS), seu código roda em sandboxes isolados sem acesso à rede, e o acesso aos sistemas de produção é restrito ao mantenedor. Nenhum sistema é perfeitamente seguro: se soubermos de um incidente que afete seus dados, notificaremos você e a autoridade competente, conforme a lei exige.

## Alterações nesta política

Atualizamos esta página quando nossas práticas mudam e atualizamos a data no topo. Mudanças significativas também serão anunciadas no site.`,
  },
};
