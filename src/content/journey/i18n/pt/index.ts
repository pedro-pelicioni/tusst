import { conceptTextFromConcept } from "../types";
// Level 0 ships as text-only overlays (the shape the loader actually wants);
// the older chapters below are still full Concepts whose meta gets discarded.
import { conceptText as theBookNoOneCanErase } from "./the-book-no-one-can-erase";
import { conceptText as theKeyAndTheSeal } from "./the-key-and-the-seal";
import { conceptText as machinesThatKeepPromises } from "./machines-that-keep-promises";
import { accountsTrustAndAssets } from "./accounts-trust-and-assets";
import { anatomyOfATransaction } from "./anatomy-of-a-transaction";
import { bordersOfTheRealm } from "./borders-of-the-realm";
import { gatesOfTheRealm } from "./gates-of-the-realm";
import { riversOfValue } from "./rivers-of-value";
import { tamingTheGolem } from "./taming-the-golem";
import { theCleanKeep } from "./the-clean-keep";
import { theEndlessLoop } from "./the-endless-loop";
import { theLivingContracts } from "./the-living-contracts";
import { theProtocolsEdge } from "./the-protocols-edge";
import { theRealmOfStellar } from "./the-realm-of-stellar";
import { theRedGreenRite } from "./the-red-green-rite";
import { theVeiledLedger } from "./the-veiled-ledger";
import { walletsWithoutSeeds } from "./wallets-without-seeds";
import { weavingTheGraph } from "./weaving-the-graph";
import { wordsOfPower } from "./words-of-power";

const translatedConceptSources = {
  "accounts-trust-and-assets": accountsTrustAndAssets,
  "anatomy-of-a-transaction": anatomyOfATransaction,
  "borders-of-the-realm": bordersOfTheRealm,
  "gates-of-the-realm": gatesOfTheRealm,
  "rivers-of-value": riversOfValue,
  "taming-the-golem": tamingTheGolem,
  "the-clean-keep": theCleanKeep,
  "the-endless-loop": theEndlessLoop,
  "the-living-contracts": theLivingContracts,
  "the-protocols-edge": theProtocolsEdge,
  "the-realm-of-stellar": theRealmOfStellar,
  "the-red-green-rite": theRedGreenRite,
  "the-veiled-ledger": theVeiledLedger,
  "wallets-without-seeds": walletsWithoutSeeds,
  "weaving-the-graph": weavingTheGraph,
  "words-of-power": wordsOfPower,
};

export const translatedConcepts = {
  ...Object.fromEntries(
    Object.entries(translatedConceptSources).map(([slug, concept]) => [
      slug,
      conceptTextFromConcept(concept),
    ]),
  ),
  "the-book-no-one-can-erase": theBookNoOneCanErase,
  "the-key-and-the-seal": theKeyAndTheSeal,
  "machines-that-keep-promises": machinesThatKeepPromises,
};
