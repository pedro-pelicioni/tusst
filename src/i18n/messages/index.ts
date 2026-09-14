import type { Locale } from "@/i18n/config";
import { en, type Messages } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { tr } from "./tr";
import { pt } from "./pt";

export type { Messages };

export const MESSAGES: Record<Locale, Messages> = { en, pt, es, fr, tr };
