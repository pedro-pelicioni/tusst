import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Mots de Pouvoir",
  tagline: "Prompt engineering : les quatre parties de tout prompt qui fonctionne.",
  steps: [
    {
      kind: "theory",
      body: `## Vos mots sont tout ce qu'il a

Le golem ne connaît pas votre dépôt. Il ne se souvient pas d'hier, et il ne voit pas le fichier que vous n'avez *pas* joint. Son univers entier, c'est le texte posé devant lui à cet instant.

C'est la règle la plus profonde du prompting, et elle n'a rien de mystique : **c'est vous qui décidez ce qui existe.** Ce que vous mettez devant lui est le monde ; ce que vous laissez de côté n'a jamais eu lieu.

La question derrière chaque prompt n'est donc pas « comment le formuler ? » mais *« de quoi le golem a-t-il besoin pour réussir ? »* Ce chapitre est la première moitié de la réponse — les mots eux-mêmes. Le suivant est la moitié difficile.`,
    },
    {
      kind: "theory",
      body: `## Anatomie d'un prompt

Un prompt qui fonctionne est un petit document d'ingénierie en quatre parties :

1. **Rôle et instructions** — quel travail est fait, et comment : « Tu implémentes un cas d'usage dans un domaine de paiements. »
2. **Contraintes** — les doit et les ne doit pas : « API publique inchangée. Aucune nouvelle dépendance. Aucun panic. »
3. **Exemples** — un échantillon de ce qui est *bon*, pour montrer la qualité au lieu de la décrire.
4. **La demande** — la tâche elle-même, énoncée en dernier, précise et unique.

La plupart des mauvais prompts ne sont pas mal *rédigés* — il leur **manque une partie**, le plus souvent les contraintes ou l'exemple.`,
    },
    {
      kind: "diagram",
      body: "Les quatre parties, dans l'ordre qui leur revient :",
      caption:
        "La demande vient en dernier exprès : tout ce qui la précède est le cadre à travers lequel le golem lit la tâche.",
      view: {
        kind: "stack",
        bands: [
          { id: "role", label: "rôle et instructions", note: "Quel travail est fait, et dans quel monde. Une ou deux lignes suffisent.", tone: "neutral" },
          { id: "constraints", label: "contraintes", note: "Les doit et les ne doit pas. C'est la partie qui peut réellement être enfreinte — d'où son pouvoir de guider.", tone: "accent" },
          { id: "examples", label: "exemples", note: "Un échantillon de ce qui est bon. Montre le standard au lieu de le décrire.", tone: "teal" },
          { id: "ask", label: "la demande", note: "En dernier, précise et unique. Deux demandes dans un prompt font deux prompts.", tone: "gold" },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Quelle instruction améliore réellement le code du golem ?`,
      options: [
        "Valide le montant : rejette zéro et les négatifs avec une erreur typée ; ne fais jamais de panic ; garde l'API publique inchangée",
        "Écris s'il te plaît un code bien propre, professionnel, de très haute qualité, prêt pour la production",
        "Tu es le meilleur programmeur ayant jamais existé — code en conséquence",
      ],
      answer: 0,
      explain: `Le golem ne peut pas échouer à « haute qualité » — toute sortie se qualifie plausiblement. Il *peut* échouer à « ne fais jamais de panic », et c'est tout le propos : un critère d'acceptation crée la possibilité d'avoir tort, et c'est cela qui guide un modèle. La précision bat la politesse — et la flatterie.`,
    },
    {
      kind: "theory",
      body: `## Montrez, ne décrivez pas

Les adjectifs décrivent la qualité ; **les exemples la définissent.** Un exemple travaillé pèse plus que trois paragraphes d'adjectifs, car le golem est une machine à continuer des motifs — alors donnez-lui un motif qui mérite d'être continué.

Vous voulez des tests dans le style maison ? Collez **un test idéal** et dites « comme ça ». Vous voulez des messages d'erreur portant un code et une piste de correction ? Montrez-en *un*.

Le Chapitre I vous a appris que les exigences en prose laissent fuir de l'ambiguïté. C'est pareil ici : un exemple est une minuscule spécification qui se *copie* au lieu de s'interpréter — et copier perd bien moins qu'interpréter.`,
    },
    {
      kind: "quiz",
      question: `Votre équipe a une façon bien à elle d'écrire les messages d'erreur. Qu'est-ce qui la fait reproduire par le golem ?`,
      options: [
        "Coller un vrai message d'erreur du code et dire « comme ça »",
        "Décrire la convention soigneusement en trois phrases",
        "Lui dire de suivre le guide de style établi de l'équipe",
      ],
      answer: 0,
      explain: `Il n'a jamais lu votre guide de style et ne voit pas votre code. Une description doit être interprétée ; un exemple n'a qu'à être continué — et continuer est la seule chose que cette machine sache faire.`,
    },
    {
      kind: "fill",
      prompt: `Le prompt le plus tranchant que vous possédez, vous l'avez déjà écrit :`,
      file: "prompt.md",
      before: `Fais passer ce `,
      after: ` qui échoue, sans modifier ses assertions.`,
      choices: ["test", "build", "démo", "déploiement"],
      answer: 0,
      explain: `Un test qui échoue est un critère d'acceptation exécutable — comportement, cas limites et « terminé » sous une forme qu'on ne peut pas mal lire. Builds, démos et déploiements échouent aussi, mais seul un test porte des assertions : votre spécification avec des dents, désormais prompt à ses heures.`,
    },
    {
      kind: "theory",
      body: `## Itérer, c'est resserrer la spécification

La première sortie est fausse. Très bien — c'est une donnée. Le réflexe d'amateur est de relancer les dés ; celui de l'ingénieur est de **lire l'échec et de trouver l'instruction manquante**.

Le golem a ignoré un cas limite ? Vos contraintes ne l'ont jamais mentionné. Mauvais style ? Vous avez décrit au lieu de montrer. Il a touché des fichiers interdits ? La frontière n'a pas été dite.

Chaque échec nomme un trou dans vos mots — rapiécez le *prompt*, pas seulement la sortie, exactement comme le Chapitre I vous a appris à resserrer une spécification.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## L'épreuve de l'examinateur : écrivez le prompt

Voici la tâche que vous vous apprêtez à confier :

> Un contrat de paiements possède une fonction \`refund\`. Elle laisse aujourd'hui n'importe qui l'appeler. Elle ne doit être appelable que par le payeur d'origine, uniquement avant l'échéance, et ne doit jamais laisser le contrat détenir moins que la somme de ses dépôts ouverts.

Écrivez le **prompt** que vous enverriez — les quatre parties, dans l'ordre. N'écrivez pas l'implémentation, et n'écrivez pas la spécification en prose : écrivez ce que vous colleriez réellement sur l'établi.`,
      rubric: `1. Les quatre parties sont présentes et distinctes : rôle/instructions, contraintes, au moins un exemple, et une demande unique en fin.
2. Les contraintes sont formulées de manière à pouvoir être ENFREINTES — concrètes et vérifiables, pas « propre » ou « de haute qualité ».
3. Comprend au moins un exemple travaillé (un test, une signature, un message d'erreur, un appel type) plutôt que la seule description du style voulu.
4. La demande est unique et précise — une tâche, pas une liste de souhaits vaguement liés.
5. C'est un prompt, ni une implémentation ni une spécification en prose.`,
      minChars: 160,
    },
    {
      kind: "theory",
      body: `## La moitié la plus difficile

Vous savez désormais écrire un prompt qui dit exactement ce qu'il veut. C'est la discipline facile, et la plupart des gens s'arrêtent là.

La difficile consiste à décider **ce que le golem a le droit de voir** — quels fichiers, quelle spécification, quel test, et, bien plus important, quoi laisser dehors. Formuler est une compétence ; sélectionner est le métier.

**Ensuite :** l'établi lui-même, et pourquoi y ajouter n'est pas gratuit.`,
    },
  ],
  testOut: [
    { question: `Un prompt qui fonctionne a quatre parties. Laquelle manque le plus souvent ?`,
      options: ["Les contraintes — les doit et ne doit pas qui peuvent réellement être enfreints","Le rôle, qui dit au modèle qui il doit être","La salutation, qui installe un ton coopératif"], answer: 0 },
    { question: `Pourquoi « ne fais jamais de panic » guide-t-il mieux qu'« écris du code de haute qualité » ?`,
      options: ["Parce qu'on peut y échouer — un critère d'acceptation crée la possibilité d'avoir tort","Parce que c'est plus court, donc cela survit plus loin dans le contexte","Parce que cela emploie un impératif, que les modèles pondèrent davantage"], answer: 0 },
    { question: `Vous voulez une sortie dans le style maison de votre équipe. Qu'est-ce qui marche ?`,
      options: ["Coller un exemple réel et dire « comme ça »","Décrire le style soigneusement et en détail","Nommer le guide de style que suit l'équipe"], answer: 0 },
    { question: `La première sortie revient fausse. Quel est le réflexe d'ingénieur ?`,
      options: ["Lire l'échec, trouver l'instruction manquante et rapiécer le prompt","Relancer — le même prompt produit une sortie différente à chaque fois","Ajouter « sois prudent et réfléchis étape par étape » et réessayer"], answer: 0 },
  ],
};
