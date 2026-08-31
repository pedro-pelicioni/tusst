import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La Boucle Sans Fin",
  tagline: "Agir, observer, corriger — et les signaux qui la font monter.",
  steps: [
    { kind: "theory", body: `## Du souhait à la boucle

Le prompting en un coup est un souhait : décrire, recevoir, espérer. La **boucle agentique** remplace l'espoir par un cycle :

> **agir → observer → corriger → agir de nouveau**

Le golem écrit du code, l'*exécute*, lit la plainte du compilateur, corrige, relance — comme vous travaillez, au tempo de la machine. La qualité en un coup a cessé d'être le chiffre intéressant à l'instant où le golem a pu voir ses propres résultats.

Mais une boucle est une machine, pas de la magie. Elle a des pièces qui peuvent être bien ou mal conçues, et ce chapitre traite des deux qui décident si elle monte.` },
    { kind: "diagram", body: "La boucle, et la seule sortie qui compte :",
      caption: "Trois de ces quatre sont ce chapitre. La quatrième — décider d'arrêter — est la suivante, et c'est celle qu'on saute.",
      view: { kind: "flow", layout: "cycle", play: true, nodes: [
        { id: "act", label: "agir", note: "Faites le plus petit pas que le plan autorise, puis arrêtez-vous et regardez.", tone: "accent" },
        { id: "observe", label: "observer", note: "Lisez ce que le monde a répondu. Pas ce que vous espériez.", tone: "teal" },
        { id: "correct", label: "corriger", note: "Ajustez le plan, pas seulement le dernier coup.", tone: "gold" },
        { id: "stop", label: "arrêter ?", note: "Terminé, bloqué, ou à court de budget. Décidez-le explicitement, à chaque tour.", tone: "good" },
      ] } },
    { kind: "theory", body: `## L'observation : les yeux de la boucle

Une boucle ne s'améliore que dans la mesure où ses **observations** sont vraies. Corriger exige un signal *vers lequel* corriger :

- **codes de sortie** — la commande a-t-elle échoué ?
- **sortie des tests** — quelle épreuve, quelle assertion, quelle ligne ?
- **état on-chain** — que contient réellement le registre après l'exécution ?

Des signaux, pas des impressions. « La sortie a l'air raisonnable » ne corrige rien, car cela ne peut jamais être faux. Chaque vérificateur que vous avez mis dans le harnais rapporte maintenant des intérêts : branché sur la boucle, il devient les yeux qui guident le golem — **à chaque itération**.` },
    { kind: "quiz", question: `Quelle observation peut réellement guider une boucle ?`,
      options: [
        "Le rapport du lanceur de tests : 3 réussis, 1 échoué — refund_after_deadline, assertion ligne 41",
        "Le résumé final du golem lui-même : tout semble correct maintenant",
        "Le fait que le code ait compilé du premier coup — forte preuve que la logique est bonne",
      ], answer: 0,
      explain: `Compiler signifie que les types s'accordent, pas que le comportement est celui voulu — et un auto-résumé, c'est l'esprit qui corrige sa propre copie. Un signal de direction doit être externe, précis, et capable d'être une mauvaise nouvelle. « 1 échec, ligne 41 » est un titre ; « ça a l'air correct » est la météo.` },
    { kind: "theory", body: `## Un tour, tracé

Il est facile d'acquiescer devant un cycle abstrait. Voici un seul tour, avec ce qui passe réellement sur le fil.

**Agir.** Le golem modifie \`refunds.rs\` — fait passer la comparaison d'échéance de \`>\` à \`>=\`. Un seul changement, car un tour qui change six choses ne peut pas vous dire laquelle a marché.

**Observer.** Le harnais lance les evals fixes et renvoie exactement ceci :

> \`test_refund_after_deadline ... FAILED\`
> \`assertion failed: balance == 0, left: 40, right: 0\`
> \`4 passed, 3 failed\`

Pas « toujours cassé ». Une ligne, un nombre, et un décompte comparable à celui du tour précédent.

**Corriger.** Trois verts sont devenus quatre. La comparaison était donc *l'un* des bugs et pas le seul : l'échéance est traitée, le solde ne l'est pas. Le plan se met à jour — le prochain tour vise le solde.

Remarquez ce qui a donné sa valeur à ce tour. Ce n'est pas le golem qui a décidé s'être amélioré. **C'est le décompte.**` },
    { kind: "theory", body: `## Les evals : la boussole

Comment savez-vous que l'itération 7 a battu la 6 ? Pas au feeling. Les **evals** sont un ensemble *fixe* de vérifications — tests, lint, build, une assertion on-chain — exécutées **à chaque itération**, pour que chaque tentative soit mesurée à la même aune.

*Fixe* est le mot porteur. Si les vérifications changent d'une tentative à l'autre, le « progrès » devient impossible à mesurer — vous comparez des notes venues d'examens différents.

Avec une boussole, la boucle sait *de fait* si elle a avancé : 4 verts sur 7 sont devenus 6 sur 7. Sans elle, elle sait seulement qu'elle a bougé. Le progrès se **mesure, il ne se ressent pas**.` },
    { kind: "fill", prompt: `Complétez la propriété qui fait d'une boussole une boussole :`,
      file: "NOTES.md",
      before: `Les evals tournent à chaque itération, et l'ensemble des vérifications doit rester `,
      after: ` — sinon deux tentatives sont notées par deux examens différents.`,
      choices: ["fixe", "aléatoire", "facultatif", "régénéré à chaque tentative"], answer: 0,
      explain: `Une aune qui bouge ne mesure rien. C'est aussi pourquoi « laisse le golem écrire ses propres tests en chemin » détruit le signal en silence : l'examen et l'élève cessent d'être deux choses distinctes.` },
    { kind: "exercise", mode: "spec-write",
      brief: `## L'épreuve de l'examinateur : écrivez un contrat d'observation

Une boucle va être pointée sur une tâche réelle :

> Un contrat Soroban a un comportement défectueux : les remboursements sont versés **après** l'expiration du délai. Vous allez confier cela à une boucle agentique et la laisser travailler sans surveillance un moment.

Avant qu'elle ne tourne une seule fois, écrivez son **contrat d'observation** : par quels signaux cette boucle va se guider, et ce qui rend chacun digne de confiance. Comportement uniquement — pas de code de harnais, pas de noms de bibliothèques.`,
      rubric: `1. Nomme au moins deux signaux concrets et externes (sortie de test, code de sortie, état on-chain, résultat de lint/build) — ni auto-évaluation, ni « ça a l'air bon ».
2. Pour au moins un signal, dit ce qui le rend digne de confiance — déterministe, reproductible, ou indépendant du code en cours de modification.
3. Dit ce qui compte comme TERMINÉ en fonction de ces signaux, et non de l'avis du golem.
4. Nomme au moins un signal auquel il ne faut PAS se fier, et pourquoi (un auto-résumé, une compilation réussie, un test instable…).
5. Comportement uniquement — pas d'implémentation du harnais, aucun outil ni bibliothèque spécifique exigé.`,
      minChars: 140 },
    { kind: "theory", body: `## Ce que ce chapitre ne vous a pas donné

Vous savez désormais construire une boucle qui voit honnêtement et mesure sa propre progression. Pointez-la sur une tâche et elle montera.

Remarquez ce qui manque : rien ici ne décide quand elle **s'arrête**. Pas quand elle a terminé — cette part, vous venez de l'écrire — mais quand elle est *coincée*, ou quand elle a dépensé plus que la tâche ne valait. Une boucle aux bons yeux et sans frein n'échoue pas bruyamment. Elle échoue sur la facture.

**Ensuite :** les freins, et la seule série où vous découvrez à quoi ils servaient.` },
  ],
  testOut: [
    { question: `Que remplace une boucle agentique, comparée au prompting en un coup ?`,
      options: ["L'espoir — le golem voit désormais le résultat de son propre travail et corrige en conséquence","Le besoin d'une spécification, puisque la boucle découvre les exigences en chemin","Le compilateur, puisque la boucle vérifie le code elle-même"], answer: 0 },
    { question: `Pourquoi « la sortie a l'air raisonnable » ne peut-il jamais guider une boucle ?`,
      options: ["Parce que cela ne peut jamais être faux — un signal incapable d'être une mauvaise nouvelle ne porte aucune information","Parce que cela arrive trop tard dans l'itération pour être exploité","Parce que les modèles ne sont pas entraînés à évaluer des jugements en langue naturelle"], answer: 0 },
    { question: `Pourquoi l'ensemble des evals doit-il rester fixe entre les itérations ?`,
      options: ["Sinon deux tentatives sont notées par des examens différents et le progrès devient immesurable","Sinon la boucle ralentit à chaque vérification ajoutée","Sinon le modèle mémorise les vérifications et les contourne"], answer: 0 },
    { question: `Une boucle compile proprement du premier coup. Qu'est-ce que cela prouve ?`,
      options: ["Que les types s'accordent — pas que le comportement soit celui voulu","Que la logique est très probablement correcte, la plupart des bugs étant des erreurs de type","Rien du tout ; la compilation n'a aucun rapport avec la qualité du code"], answer: 0 },
  ],
};
