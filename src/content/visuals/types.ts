// Lesson visuals — the data model.
//
// Two DIFFERENT things live here, deliberately not merged:
//
//   `DiagramView` is a picture whose DATA is the lesson. Labels sit inline, so
//   the existing locale overlay translates them for free, and a new instance
//   costs ~15 lines of content rather than a component.
//
//   `WidgetComponent` names a bespoke simulator whose INTERACTION is the
//   lesson — tampering with a ledger page, breaking a signature. Those cannot
//   be expressed as data without inventing a programming language, so they
//   stay hand-written and take no props.
//
// This module is type-only and runtime-free on purpose: it is imported by
// content modules, by server components, and by the client players alike.

/** Semantic colour, resolved to design tokens by the renderer. */
export type DiagramTone = "neutral" | "accent" | "teal" | "gold" | "good" | "bad";

export interface DiagramNode {
  id: string;
  label: string;
  /** revealed when the reader picks this node — never hover-only */
  note?: string;
  tone?: DiagramTone;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  style?: "solid" | "dashed";
}

/** One band of a stack; `bands` nests exactly one level (an op inside an envelope). */
export interface DiagramBand {
  id: string;
  label: string;
  note?: string;
  tone?: DiagramTone;
  bands?: DiagramBand[];
}

export interface DiagramCell {
  text: string;
  tone?: DiagramTone;
}

export type DiagramView =
  /** ordered stages with connectors; `cycle` closes the loop back to the first */
  | {
      kind: "flow";
      layout: "row" | "cycle";
      nodes: DiagramNode[];
      /** a ▶ that walks the stages one at a time */
      play?: boolean;
    }
  /** labelled bands, top to bottom, one level of nesting */
  | { kind: "stack"; bands: DiagramBand[] }
  /** columns × rows with a per-cell verdict tone */
  | {
      kind: "compare";
      columns: { id: string; label: string; tone?: DiagramTone }[];
      rows: { label: string; cells: DiagramCell[] }[];
    }
  /** nodes placed by the author on a 0–100 grid; no layout engine, no d3 */
  | {
      kind: "graph";
      nodes: (DiagramNode & { x: number; y: number; shape?: "circle" | "box" })[];
      edges: DiagramEdge[];
    };

/** Bespoke simulators. Adding a member here is a compile error until the
 *  registry in components/visuals/WidgetSlot.tsx maps it. */
export type WidgetComponent =
  | "scp-sim"
  | "ledger-tamper"
  | "seal-sign"
  | "context-window"
  | "loop-brake"
  | "dependency-rule"
  | "blast-radius"
  | "fan-out"
  | "amm-pool"
  | "path-payment"
  | "explorer-view"
  | "state-archival";
