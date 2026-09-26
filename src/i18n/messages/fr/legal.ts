// Traduction française de ../en/legal.ts — c'est le fichier anglais qui fait foi.
export const legal = {
  privacy: {
    metaTitle: "Politique de confidentialité — TUSST",
    metaDescription:
      "Quelles données personnelles TUSST collecte, pourquoi, qui les reçoit et comment exercer tes droits.",
    kicker: "juridique",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : {date}",
    body: `TUSST est une plateforme d'apprentissage gratuite et open-source consacrée à Rust et au réseau Stellar, accessible sur tusst.xyz. Cette politique explique quelles données personnelles nous collectons lorsque tu l'utilises, pourquoi nous les collectons, qui les reçoit et quels sont tes droits.

## Qui est responsable

TUSST est maintenu par Pedro Pelicioni, au Brésil. Il est le responsable du traitement de tes données personnelles et l'interlocuteur pour toute question ou demande relative à la protection de la vie privée (l'« encarregado », c'est-à-dire le délégué à la protection des données au sens de la LGPD brésilienne) : [pedro@vants.xyz](mailto:pedro@vants.xyz).

## Ce que nous collectons

- **Ton compte.** Lorsque tu te connectes avec GitHub ou Discord, nous enregistrons ton nom d'affichage (ou ton nom d'utilisateur, si tu n'as pas défini de nom d'affichage), ton adresse email principale chez ce fournisseur (même si elle est privée sur GitHub) et l'identifiant numérique de ton compte chez celui-ci. Nous n'enregistrons ni ta photo de profil ni les autres informations de ton profil. La bibliothèque de connexion enregistre aussi les jetons émis par le fournisseur lors de ta première connexion (pour Discord, y compris un jeton d'actualisation). Ils permettent uniquement de lire ton profil et ton adresse email, et nous ne les utilisons jamais pour accéder à ton compte GitHub ou Discord.
- **Ta progression.** Les leçons, les chapitres du Voyage et les labs que tu as terminés, et à quel moment, les points d'expérience (XP) que chacun t'a rapportés et ton niveau, le héros que tu as choisi, ton or en jeu, les objets de l'Arsenal que tu as achetés et combien tu les as payés, ainsi que ta langue préférée.
- **Le code que tu soumets.** Lorsque tu exécutes le code d'une leçon, nous enregistrons le code, les résultats de l'évaluation et la sortie du programme, avec la date et l'heure. Cela sert à conserver ta progression et nous permet de corriger les leçons qui ne fonctionnent pas ou qui sont trop difficiles.
- **Retours du mentor et de l'examinateur.** Lorsque tu demandes un indice au mentor IA ou que tu soumets une spécification à l'examinateur du Voyage, nous enregistrons le texte de sa réponse (qui peut citer ton code), le modèle qui l'a rédigée, ta langue, la leçon concernée (le cas échéant) et à quel moment. Nous n'enregistrons ni les fichiers de la Forge ni la spécification que tu lui as envoyés.
- **Preuves des labs.** Lorsque tu réclames la récompense d'un lab, nous enregistrons l'adresse publique sur le testnet Stellar, l'identifiant du contrat et les hashes de transaction concernés.
- **Statistiques d'utilisation.** Nous utilisons Vercel Web Analytics, qui enregistre les pages que tu visites, le site d'où tu viens, ton pays, ton navigateur, ton système d'exploitation et ton type d'appareil, ainsi que quelques événements de l'interface (par exemple, sur quel bouton de connexion on a cliqué ou quel héros tu as choisi). Cet outil n'utilise aucun cookie et n'est pas lié à ton compte ; les visiteurs sont comptés à l'aide d'un hash de l'adresse IP et du navigateur, et ce hash change chaque jour.
- **Données techniques.** Comme pour tout site web, notre hébergeur (Vercel) et notre runner de code (DigitalOcean) reçoivent ton adresse IP et des informations de base sur ton navigateur à chaque requête, afin de fournir le site et d'en assurer la sécurité. Le runner de code utilise aussi ton adresse IP pour limiter le nombre de builds, de tests et d'audits que chaque visiteur peut lancer ; elle n'est conservée que dans la mémoire de ce serveur et n'est jamais écrite dans notre base de données.

Tu as besoin d'un compte GitHub ou Discord pour te connecter. Sans te connecter, tu peux tout de même lire les leçons, exécuter la première leçon et utiliser la Forge : le code que tu exécutes ainsi est envoyé à notre runner de code pour être évalué ou compilé, n'est pas enregistré et n'est lié à personne. Ta progression n'est pas sauvegardée, et le mentor et l'examinateur ne sont pas disponibles.

## Ce qui reste dans ton navigateur

Certaines données sont conservées uniquement dans le stockage de ton navigateur, sur ton appareil, et nous n'en gardons aucune copie : tes brouillons non envoyés de code de leçon et de spécifications du Voyage, les projets, l'historique des déploiements et la disposition de ton IDE de la Forge, ta progression dans les labs avant que tu n'en réclames la récompense, les données du portefeuille à passkey créé dans le lab des passkeys (la passkey elle-même est conservée par ton appareil ou ton gestionnaire de mots de passe), ta position sur les cartes, tes réglages du tutoriel et de la musique, ainsi que la clé secrète de tout portefeuille testnet que tu crées ou importes dans les labs et dans la Forge. Nous ne recevons jamais cette clé.

Certaines de ces données ne nous sont envoyées que lorsque tu utilises une fonctionnalité qui en a besoin : ton code de leçon quand tu l'exécutes, les fichiers de ton projet de la Forge ou de lab chaque fois que tu lances un build, un test ou un audit (ils sont envoyés à notre runner de code et supprimés à la fin de l'exécution), tes fichiers de la Forge et la sortie de la console quand tu demandes de l'aide au mentor, et l'adresse et les hashes de transaction quand tu réclames la récompense d'un lab. Effacer les données de site de ton navigateur supprime tout ce qui n'est stocké que dans ton navigateur.

## Cookies

Nous n'utilisons que les cookies nécessaires au fonctionnement du site : le cookie de session de connexion (chiffré ; il contient ton nom, ton adresse email et l'identifiant de ton compte, et expire après 30 jours sans utilisation), des cookies de courte durée qui protègent l'étape de connexion, et un cookie qui mémorise ta langue pendant un an. Un ancien cookie qui enregistrait une réponse donnée pendant l'onboarding est encore lu s'il est présent dans ton navigateur, mais il n'est plus déposé. Nous n'utilisons pas de cookies publicitaires ni de cookies de suivi entre sites, c'est pourquoi il n'y a pas de bannière de cookies.

## Comment nous utilisons tes données

- Pour faire fonctionner TUSST : te connecter, sauvegarder ta progression, évaluer ton code et t'attribuer de l'XP, de l'or et des objets.
- Pour générer les indices du mentor que tu demandes, et pour faire vérifier par un examinateur IA les spécifications que tu soumets dans les exercices du Voyage au regard des critères d'évaluation du chapitre. Le verdict de l'examinateur décide à lui seul si tu gagnes l'XP de cet exercice ; tu peux nous demander de réexaminer un verdict et de t'expliquer les critères appliqués (voir « Tes droits »).
- Pour répondre aux demandes d'assistance et corriger les leçons, notamment en examinant les tentatives qui y ont été soumises.
- Pour assurer la sécurité et l'équité de la plateforme, en prévenant la triche, les abus et la surcharge.
- Pour comprendre, de manière agrégée, comment la plateforme est utilisée et améliorer les leçons.

Nous ne vendons pas tes données, nous n'affichons pas de publicité et nous n'envoyons pas d'emails promotionnels.

## Bases légales

Nous traitons tes données pour fournir le service que tu utilises ou auquel tu t'es inscrit (LGPD art. 7, V ; RGPD art. 6(1)(b)). Pour la sécurité, la prévention des abus et la limitation d'usage, l'assistance, la correction des leçons à partir des tentatives soumises et les statistiques agrégées, nous nous fondons sur notre intérêt légitime à faire fonctionner une plateforme gratuite, sûre et utile (LGPD art. 7, IX ; RGPD art. 6(1)(f)).

## Qui reçoit tes données

- **Vercel** : héberge le site et fournit les statistiques d'utilisation.
- **Neon** : héberge notre base de données.
- **DigitalOcean** : fait tourner notre runner de code (forge.tusst.xyz, aux États-Unis), qui compile et exécute ton code dans des sandboxes isolées. Le code des leçons lui parvient par l'intermédiaire de notre site ; les builds de la Forge et des labs lui sont envoyés directement depuis ton navigateur, il voit donc aussi ton adresse IP. Le code qui y est envoyé est supprimé dès la fin de l'exécution et n'est pas lié à ton compte.
- **Groq** (fournisseur de modèles d'IA) : lorsque tu demandes un indice au mentor, il reçoit le code, les noms des vérifications échouées et la sortie du compilateur ou du programme de ta dernière tentative échouée, ou jusqu'à six fichiers de ton projet de la Forge et la sortie de sa console. Lorsque tu soumets une spécification à l'examinateur du Voyage, il reçoit cette spécification. On lui indique aussi dans quelle langue répondre. Il ne reçoit jamais ton nom, ton adresse email, l'identifiant de ton compte ni ton adresse IP.
- **Raven (raven.stellar.buzz)** : un service de recherche dans la documentation Stellar. Pour étayer certains indices du mentor, notre serveur peut lui envoyer une courte requête, comme le titre d'une leçon ou la première ligne d'une erreur.
- **GitHub et Discord** : lorsque tu les choisis pour te connecter, ils nous confirment ton identité. Ils traitent tes données selon leurs propres politiques de confidentialité, et non pour notre compte.
- **Stellar Development Foundation (SDF)** : les labs et la Forge se connectent directement depuis ton navigateur aux serveurs publics du testnet de la SDF (Horizon, RPC et Friendbot), qui voient ton adresse IP et ton adresse testnet. Lorsque tu réclames la récompense d'un lab, notre serveur consulte ton adresse testnet sur ces serveurs pour vérifier ton travail. Les transactions que tu effectues, les adresses concernées et tout contrat que tu déploies (y compris son code compilé) sont publics par nature sur le testnet Stellar, qui est réinitialisé périodiquement. L'adresse que nous enregistrons relie cette activité publique à ton compte TUSST.

## Services que ton navigateur contacte directement

Certaines fonctionnalités amènent ton navigateur à se connecter directement à d'autres services. Ces services voient ton adresse IP et ce qui a été demandé, et sont régis par leurs propres politiques de confidentialité :

- **jsDelivr**, qui fournit l'éditeur de code utilisé dans les leçons et dans la Forge.
- **GitHub**, lorsque tu importes un dépôt public dans la Forge.
- **Le portefeuille que tu choisis** dans le menu des portefeuilles de la Forge (par exemple Freighter ou Albedo), ainsi que Creit Tech (stellar.creit.tech), qui fournit les icônes de ce menu.

## Transferts internationaux

La plupart de ces services sont situés hors du Brésil et de l'Union européenne, principalement aux États-Unis. Nous leur transférons des données parce que c'est nécessaire pour fournir le service que tu as demandé (LGPD art. 33, IX). Lorsqu'un fournisseur les propose, nous nous appuyons également sur ses conditions de traitement des données, sur des clauses contractuelles types ou sur sa certification au titre de l'EU–U.S. Data Privacy Framework. Écris-nous pour savoir quelle garantie s'applique à chaque fournisseur ou pour en obtenir une copie.

## Durée de conservation

Nous conservons les données de ton compte, ta progression, le code que tu as soumis et les retours du mentor et de l'examinateur tant que ton compte existe. Notre runner de code ne conserve les adresses IP qu'en mémoire, jusqu'à son redémarrage ; les autres données techniques ne sont conservées que tant que nos hébergeurs conservent leurs journaux de requêtes. Le cookie de connexion expire après 30 jours sans utilisation et le cookie de langue après un an. Lorsque tu nous demandes de supprimer ton compte, nous le supprimons, ainsi que toutes les données associées, dans un délai de 30 jours ; les copies présentes dans les sauvegardes à court terme de notre fournisseur de base de données disparaissent à l'expiration de ces sauvegardes. Ce qui est public sur le testnet Stellar échappe à notre contrôle.

## Tes droits

Tu peux nous demander de confirmer si nous traitons tes données ; demander à y accéder, à les rectifier, à les exporter ou à les supprimer ; demander l'anonymisation, le blocage ou la limitation des données inutiles, excessives ou traitées de manière illicite ; demander avec qui nous les partageons ; t'opposer à un traitement fondé sur l'intérêt légitime ; et demander le réexamen d'une décision automatisée, comme un verdict de l'examinateur du Voyage. Écris à [pedro@vants.xyz](mailto:pedro@vants.xyz) depuis l'adresse email liée à ton compte ; nous répondons dans un délai de 15 jours. Tu peux aussi introduire une réclamation auprès de l'autorité brésilienne de protection des données (ANPD) ou auprès de l'autorité de ton pays.

## Enfants

TUSST n'est pas destiné aux enfants de moins de 13 ans, et nous ne les laissons pas sciemment créer un compte. Si tu as moins de 18 ans, un parent ou un tuteur doit savoir que tu utilises TUSST. Si tu penses qu'un enfant de moins de 13 ans a un compte, écris-nous et nous le supprimerons.

## Sécurité

Le trafic est chiffré (HTTPS), ton code s'exécute dans des sandboxes isolées sans accès au réseau, et l'accès aux systèmes de production est réservé au mainteneur. Aucun système n'est parfaitement sûr : si nous avons connaissance d'un incident qui affecte tes données, nous t'en informerons, ainsi que l'autorité compétente, comme l'exige la loi.

## Modifications de cette politique

Nous mettons cette page à jour lorsque nos pratiques changent et nous actualisons la date indiquée en haut. Les changements importants seront aussi annoncés sur le site.`,
  },
};
