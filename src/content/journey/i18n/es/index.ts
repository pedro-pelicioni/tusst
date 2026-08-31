import { conceptTextFromConcept } from "../types";
import { conceptText as theBookNoOneCanErase } from "./the-book-no-one-can-erase";
import { conceptText as theKeyAndTheSeal } from "./the-key-and-the-seal";
import { conceptText as machinesThatKeepPromises } from "./machines-that-keep-promises";
import { conceptText as anatomyOfATransaction } from "./anatomy-of-a-transaction";
import { conceptText as wordsOfPower } from "./words-of-power";
import { conceptText as whatTheGolemSees } from "./what-the-golem-sees";
import { conceptText as theEndlessLoop } from "./the-endless-loop";
import { conceptText as theHandOnTheBrake } from "./the-hand-on-the-brake";
import { conceptText as bordersOfTheRealm } from "./borders-of-the-realm";
import { conceptText as whatTheBorderHolds } from "./what-the-border-holds";
import { conceptText as theCleanKeep } from "./the-clean-keep";
import { conceptText as theKeepsOwnDoors } from "./the-keeps-own-doors";
import { conceptText as tamingTheGolem } from "./taming-the-golem";
import { conceptText as whatCatchesIt } from "./what-catches-it";
import { conceptText as weavingTheGraph } from "./weaving-the-graph";
import { conceptText as theSkeletonAndTheOrgans } from "./the-skeleton-and-the-organs";
import { conceptText as riversOfValue } from "./rivers-of-value";
import { conceptText as theCrossing } from "./the-crossing";
import { conceptText as gatesOfTheRealm } from "./gates-of-the-realm";
import { conceptText as theCommonTongue } from "./the-common-tongue";
import { conceptText as theVeiledLedger } from "./the-veiled-ledger";
import { conceptText as theSpineBeneathTheVeil } from "./the-spine-beneath-the-veil";
import { conceptText as theLivingContracts } from "./the-living-contracts";
import { conceptText as theHeartbeatAndTheBill } from "./the-heartbeat-and-the-bill";
import { conceptText as accountsTrustAndAssets } from "./accounts-trust-and-assets";
import { conceptText as theIssuersSide } from "./the-issuers-side";
import { conceptText as theFateOfAnEnvelope } from "./the-fate-of-an-envelope";








import { theProtocolsEdge } from "./the-protocols-edge";
import { theRealmOfStellar } from "./the-realm-of-stellar";
import { theRedGreenRite } from "./the-red-green-rite";

import { conceptText as thinkBeforeYouForge } from "./think-before-you-forge";
import { walletsWithoutSeeds } from "./wallets-without-seeds";



const translatedConceptSources = {
  "the-protocols-edge": theProtocolsEdge,
  "the-realm-of-stellar": theRealmOfStellar,
  "the-red-green-rite": theRedGreenRite,
  "wallets-without-seeds": walletsWithoutSeeds,
};

export const translatedConcepts = {
  ...Object.fromEntries(
    Object.entries(translatedConceptSources).map(([slug, concept]) => [
      slug,
      conceptTextFromConcept(concept),
    ]),
  ),
  "think-before-you-forge": thinkBeforeYouForge,
  "the-book-no-one-can-erase": theBookNoOneCanErase,
  "the-key-and-the-seal": theKeyAndTheSeal,
  "machines-that-keep-promises": machinesThatKeepPromises,
  "anatomy-of-a-transaction": anatomyOfATransaction,
  "the-fate-of-an-envelope": theFateOfAnEnvelope,
  "words-of-power": wordsOfPower,
  "what-the-golem-sees": whatTheGolemSees,
  "the-endless-loop": theEndlessLoop,
  "the-hand-on-the-brake": theHandOnTheBrake,
  "borders-of-the-realm": bordersOfTheRealm,
  "what-the-border-holds": whatTheBorderHolds,
  "the-clean-keep": theCleanKeep,
  "the-keeps-own-doors": theKeepsOwnDoors,
  "taming-the-golem": tamingTheGolem,
  "what-catches-it": whatCatchesIt,
  "weaving-the-graph": weavingTheGraph,
  "the-skeleton-and-the-organs": theSkeletonAndTheOrgans,
  "rivers-of-value": riversOfValue,
  "the-crossing": theCrossing,
  "gates-of-the-realm": gatesOfTheRealm,
  "the-common-tongue": theCommonTongue,
  "the-veiled-ledger": theVeiledLedger,
  "the-spine-beneath-the-veil": theSpineBeneathTheVeil,
  "the-living-contracts": theLivingContracts,
  "the-heartbeat-and-the-bill": theHeartbeatAndTheBill,
  "accounts-trust-and-assets": accountsTrustAndAssets,
  "the-issuers-side": theIssuersSide,
};
