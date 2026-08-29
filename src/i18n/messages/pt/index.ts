import type { Messages } from "../en";

import { auth } from "./auth";
import { common } from "./common";
import { home } from "./home";
import { ide } from "./ide";
import { journey } from "./journey";
import { labs } from "./labs";
import { landing } from "./landing";
import { lesson } from "./lesson";
import { onboarding } from "./onboarding";
import { pages } from "./pages";
import { visuals } from "./visuals";

// Tradução pt-BR: espelha a estrutura de arquivos de ../en; o tipo `Messages`
// garante que nenhuma chave falte ou sobre.
export const pt: Messages = { auth, common, home, ide, journey, labs, landing, lesson, onboarding, pages, visuals };
