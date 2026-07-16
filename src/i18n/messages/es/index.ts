import type { Messages } from "../en";
import { auth } from "./auth";
import { common } from "./common";
import { ide } from "./ide";
import { landing } from "./landing";
import { lesson } from "./lesson";
import { onboarding } from "./onboarding";
import { pages } from "./pages";

// Spanish translation: mirrors the file structure of ../en.
export const es: Messages = { auth, common, ide, landing, lesson, onboarding, pages };
