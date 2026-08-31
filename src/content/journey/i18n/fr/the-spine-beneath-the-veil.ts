import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "L'Échine Sous le Voile",
  tagline: "Private payments et conformité : masquer les contreparties, rester auditable.",
  steps: [
    {
      kind: "theory",
      body: `## Paiements privés Stellar : masquer les contreparties

Un voile de plus. **Paiements privés Stellar (SPP)**, créés par **Nethermind**, ont atteint la prévisualisation développeur sur testnet en **août 2026**.

Au lieu d’envelopper un jeton, les utilisateurs **déposent des actifs dans un pool partagé**. Les transferts se font ensuite *à l’intérieur* du pool — et un observateur extérieur ne peut plus relier l’expéditeur au récepteur. Pas seulement les montants : les **contreparties elles‑mêmes sont cachées**.

Alors que les jetons confidentiels conviennent aux parties qui se connaissent, SPP répond aux cas où *l'identité de celui qui paie et de celui qui reçoit* doit elle aussi rester secrète : dons, relations sensibles avec des fournisseurs ou finances personnelles sur une infrastructure publique.`,
    },
    {
      kind: "diagram",
      body: "Suis un paiement à travers le pool et regarde ce que l'explorateur conserve :",
      caption:
        "Les bords sont publics par construction. Tout ce que le pool protège se passe entre eux.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "deposit",
            label: "Dépôt",
            tone: "gold",
            note: "Visible. L'explorateur enregistre que ce compte a versé des fonds dans le pool, et combien. Rien n'est masqué ici — et rien n'a besoin de l'être.",
          },
          {
            id: "inside",
            label: "Dans le pool",
            tone: "accent",
            note: "Masqué. Les transferts entre membres du pool n'ont pas besoin d'apparaître on-chain : ni émetteur, ni destinataire, ni montant. C'est la part que le voile recouvre.",
          },
          {
            id: "withdraw",
            label: "Retrait",
            tone: "gold",
            note: "Visible à nouveau. Quelqu'un sort du pool avec une valeur — mais relier CETTE sortie à CETTE entrée-là est précisément ce que le pool casse.",
          },
          {
            id: "observer",
            label: "Ce qu'il reste à l'observateur",
            tone: "neutral",
            note: "Deux bords publics et une foule entre les deux. Plus le pool est grand, plus le lien entre une entrée et une sortie est faible.",
          },
        ],
      },
    },
    { kind: "widget", component: "explorer-view",
      body: `Le choix entre ces couches ne porte pas sur le degré de confidentialité atteignable. Il porte sur **quel champ doit s'éteindre**. Changez de couche et lisez la colonne de l'observateur.` },
    {
      kind: "theory",
      body: `## La colonne vertébrale de conformité

Une confidentialité sans limites serait le cauchemar d’un responsable des sanctions ; ces systèmes refusent cette voie. SPP associe la confidentialité à des **garanties de conformité intégrées** :

- **Participation conditionnée KYC** — rejoindre le pool nécessite une identité vérifiée.
- **Contrôles d’accès liés à l'identité** — les permissions s’attachent à *qui tu es*, pas seulement à la clé que tu possèdes.
- **Capacité de gel au niveau compte** — les mauvais acteurs peuvent être arrêtés même à l’intérieur du voile.

Ces trois garde-fous sont appliqués par une pièce qu’il vaut la peine de connaître par son nom : l’**Association Set Provider (ASP)**. Un ASP publie un *ensemble* de dépôts dont il se porte garant — une allow list — ou ceux dont il refuse de se porter garant — une deny list. Pour retirer, tu prouves que tes fonds remontent à un dépôt situé dans cet ensemble, **sans révéler lequel**. SPP construit cela sur un association set fondé sur des clés, adossé à un registre public de clés pour que les participants puissent seulement être désignés.

Arrête-toi sur la conséquence, car c’est toute l’astuce : **le même retrait est à la fois privé et auditable**. Privé, parce que le lien avec ton dépôt précis n’est jamais publié. Auditable, parce que tu n’aurais pas pu retirer sans prouver ton appartenance à un ensemble cautionné. Des ASP différents peuvent servir des juridictions différentes — et c’est toi qui choisis la caution que tu portes.

L’objectif tient en une phrase : **la confidentialité pour les utilisateurs, pas pour le crime**. Des transferts à la fois confidentiels et conformes sur une infrastructure publique — c’est cette combinaison, et non le secret absolu, que les institutions attendaient.`,
    },
    {
      kind: "quiz",
      question: `Un explorateur regarde un transfert de Jeton confidentiel et un transfert de pool SPP. Que voit‑il dans chacun ?`,
      options: [
        "CT : les deux adresses mais pas le montant ; SPP : pas même les contreparties — valeur déplacée dans le pool partagé",
        "Les deux cachent montants et adresses de façon identique — SPP est juste le plus économique",
        "CT cache les adresses mais montre les montants ; SPP montre tout aux spectateurs KYC",
      ],
      answer: 0,
      explain: `Deux couches, deux voiles. Les jetons confidentiels cachent *combien* entre parties connues ; le pool partagé de SPP cache aussi *qui*. Choisis la couche qui correspond à ce que ton cas d’usage doit garder secret.`,
    },
    {
      kind: "quiz",
      question: `Tu appelles \`get_asp_non_membership_root()\` sur le pool vivant et il répond **0**. Qu'est-ce que cela t'apprend vraiment ?`,
      options: [
        "La blocklist est vide — et 0 est la valeur à laquelle le contrat compare chaque retrait, donc une liste vide est une politique appliquée, pas une politique absente",
        "L'appel a échoué et est retombé sur une valeur par défaut : une racine de Merkle n'est jamais légitimement nulle",
        "La blocklist est confidentielle, donc le contrat renvoie 0 à quiconque n'est pas un ASP",
      ],
      answer: 0,
      explain: `Un arbre vide a quand même une vraie racine, et pour cette blocklist elle vaut littéralement 0 — autrement dit « personne n'est banni » est activement appliqué à chaque dépense plutôt que laissé indéfini. Essaie maintenant sa voisine : \`get_asp_membership_root()\` répond 2302223575749844940221218608817648865122641281382153518325924961250440546344, un nombre impressionnant pour un arbre **lui aussi vide**. C'est le zero-hash d'arbre vide. Le lire comme « l'allowlist a des membres » est l'erreur la plus facile de tout ce sujet, et tu viens de l'éviter.`,
    },
    {
      kind: "theory",
      body: `## Va regarder à l'intérieur

Tout ce qui précède est vérifiable maintenant, sur un pool qui existe réellement. Le developer preview de Nethermind est vivant sur testnet, et ses fonctions de lecture répondent **sans portefeuille et sans signature**. Tu n'es pas client de cette chose — tu es spectateur, et regarder est gratuit.

Ouvre la [Forge](/ide), va dans **Explore** et choisis **pool de confidentialité SPP · XLM** parmi les contrats connus. Puis demande-lui, dans cet ordre :

- \`get_policy_flags()\` — comment ce pool est configuré. Il répond **2** : blocklist appliquée, pas d'allowlist.
- \`get_root()\` — la racine de Merkle qui engage chaque note jamais déposée là. Un seul nombre pour tout l'ensemble d'anonymat.
- \`is_known_root(<ce nombre>)\` — **true**. Change maintenant un seul chiffre et redemande : **false**. Tu viens de parcourir l'anneau de racines dont le pool se souvient.
- \`is_spent(<n'importe quel nombre>)\` — **false**. C'est l'ensemble des nullifiers : la défense du pool contre la double dépense, et à peu près la seule chose qu'un retrait publie sur lui-même.

Lis-les dans l'ordre et remarque ce qui *manque*. Aucune de ces réponses ne contient d'adresse, de montant ni de contrepartie. La chaîne te dit l'exacte vérité et ne te dit rien.

**Deux avertissements, car la spec d'un contrat ne peut pas t'avertir sur elle-même.** Ce pool expose cinq fonctions résiduelles — \`balance\`, \`transfer\`, \`approve\` et compagnie — qui répondent poliment et ne veulent rien dire ; la Forge les marque *leurre* pour qu'elles ne te trompent pas. Et l'état de l'aperçu **est archivé le 2026-09-02**, après quoi ces lectures cessent de répondre jusqu'à ce que quelqu'un paie pour les restaurer. Ce n'est pas la Forge qui échoue : c'est le state rent de Soroban, sous lequel vit chaque contrat de ce réseau.`,
    },
    {
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `Sur l’enclume de la Forge : un laboratoire **Jetons confidentiels**, où tu envelopperas un jeton testnet et verras les montants disparaître de l’explorateur tandis que les transferts continuent de se régler correctement. Sa carte indique *en cours de forge* — cette frontière est en train d’être martelée pendant que tu lis.

Remarque à quel point ces dates sont jeunes. Naviguer dans une technologie aussi fraîche signifie lire le pouls du protocole lui‑même — le dernier chapitre te montre comment.`,
    },
  ],
  testOut: [
    { question: `Comment un pool SPP masque-t-il les contreparties ?`,
      options: ["Les utilisateurs déposent dans un pool partagé et transfèrent à l'intérieur, si bien qu'un observateur ne peut relier un expéditeur à un destinataire","Les adresses sont chiffrées et seul le destinataire peut les déchiffrer","Les transferts sont groupés, plusieurs paiements partageant un même enregistrement"], answer: 0 },
    { question: `Un explorateur observe un transfert de jeton confidentiel et un transfert en pool SPP. Que voit-il dans chacun ?`,
      options: ["CT : les deux adresses, mais pas le montant. SPP : pas même les contreparties","Les deux masquent identiquement montants et adresses ; SPP est simplement moins cher","CT masque les adresses et montre les montants ; SPP montre tout aux détenteurs d'un KYC"], answer: 0 },
    { question: `Que publie un Association Set Provider, et contre quoi prouvez-vous ?`,
      options: ["Un ensemble de dépôts dont il se porte garant — et vous prouvez que vos fonds remontent à un dépôt de cet ensemble, sans révéler lequel","Une liste de destinataires approuvés, que le pool applique à chaque transfert","Les clés de déchiffrement qui permettent aux auditeurs de lire l'activité du pool"], answer: 0 },
    { question: `Comment un même retrait peut-il être à la fois privé et auditable ?`,
      options: ["Privé parce que le lien avec votre dépôt précis n'est jamais publié ; auditable parce que vous n'auriez pas pu retirer sans prouver l'appartenance à un ensemble cautionné","Les auditeurs détiennent une clé maîtresse qui révèle le lien au besoin","Impossible — la conception échange l'un contre l'autre, et SPP a choisi l'auditabilité"], answer: 0 },
  ],
};
