import { advanced } from "./advanced";
import { armory } from "./armory";
import { auth } from "./auth";
import { common } from "./common";
import { home } from "./home";
import { ide } from "./ide";
import { journey } from "./journey";
import { labs } from "./labs";
import { landing } from "./landing";
import { legal } from "./legal";
import { lesson } from "./lesson";
import { overworld } from "./overworld";
import { pages } from "./pages";
import { visuals } from "./visuals";

// English is the source of truth: every other locale must satisfy `Messages`,
// so a missing key is a compile error, not a silent runtime fallback.
export const en = { advanced, armory, auth, common, home, ide, journey, labs, landing, legal, lesson, overworld, pages, visuals };

export type Messages = typeof en;
