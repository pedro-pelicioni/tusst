import { auth } from "./auth";
import { common } from "./common";
import { ide } from "./ide";
import { landing } from "./landing";
import { lesson } from "./lesson";
import { onboarding } from "./onboarding";
import { pages } from "./pages";

// English is the source of truth: every other locale must satisfy `Messages`,
// so a missing key is a compile error, not a silent runtime fallback.
export const en = { auth, common, ide, landing, lesson, onboarding, pages };

export type Messages = typeof en;
