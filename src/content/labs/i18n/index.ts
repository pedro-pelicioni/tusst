import type { Locale } from "@/i18n/config";
import type { LabTextOverlay } from "../localize";
import { labText as ozEs } from "./oz-token-wizard.es";
import { labText as ozFr } from "./oz-token-wizard.fr";
import { labText as ozPt } from "./oz-token-wizard.pt";
import { labText as passkeyEs } from "./passkey-smart-wallet.es";
import { labText as passkeyFr } from "./passkey-smart-wallet.fr";
import { labText as passkeyPt } from "./passkey-smart-wallet.pt";
import { labText as chestEs } from "./treasure-chest.es";
import { labText as chestFr } from "./treasure-chest.fr";
import { labText as chestPt } from "./treasure-chest.pt";
import { labText as vaultEs } from "./guild-vault.es";
import { labText as vaultFr } from "./guild-vault.fr";
import { labText as vaultPt } from "./guild-vault.pt";
import { labText as scpEs } from "./scp-simulator.es";
import { labText as scpFr } from "./scp-simulator.fr";
import { labText as scpPt } from "./scp-simulator.pt";
import { labText as walletEs } from "./wallet-onboarding.es";
import { labText as walletFr } from "./wallet-onboarding.fr";
import { labText as walletPt } from "./wallet-onboarding.pt";

type TranslatedLocale = Exclude<Locale, "en">;

export const LAB_TEXT = {
  pt: {
    "wallet-onboarding": walletPt,
    "oz-token-wizard": ozPt,
    "passkey-smart-wallet": passkeyPt,
    "scp-simulator": scpPt,
    "treasure-chest": chestPt,
    "guild-vault": vaultPt,
    "confidential-tokens": {
      meta: {
        title: "Tokens Confidenciais",
        tagline: "O que o explorer vê e o que só você consegue ver.",
      },
    },
  },
  es: {
    "wallet-onboarding": walletEs,
    "oz-token-wizard": ozEs,
    "passkey-smart-wallet": passkeyEs,
    "scp-simulator": scpEs,
    "treasure-chest": chestEs,
    "guild-vault": vaultEs,
    "confidential-tokens": {
      meta: {
        title: "Tokens Confidenciales",
        tagline: "Lo que ve el explorador y lo que solo tú puedes ver.",
      },
    },
  },
  fr: {
    "wallet-onboarding": walletFr,
    "oz-token-wizard": ozFr,
    "passkey-smart-wallet": passkeyFr,
    "scp-simulator": scpFr,
    "treasure-chest": chestFr,
    "guild-vault": vaultFr,
    "confidential-tokens": {
      meta: {
        title: "Tokens confidentiels",
        tagline:
          "Ce que voit l'explorateur et ce que toi seul peux voir.",
      },
    },
  },
} satisfies Record<
  TranslatedLocale,
  Record<string, LabTextOverlay>
>;
