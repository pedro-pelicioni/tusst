import type { Messages } from "../en";

import { auth } from "./auth";
import { common } from "./common";
import { ide } from "./ide";
import { landing } from "./landing";
import { lesson } from "./lesson";
import { onboarding } from "./onboarding";
import { pages } from "./pages";

// Tradução pt-BR: espelha a estrutura de arquivos de ../en; o tipo `Messages`
// garante que nenhuma chave falte ou sobre.
export const pt: Messages = { auth, common, ide, landing, lesson, onboarding, pages };
