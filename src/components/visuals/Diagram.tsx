"use client";

import type { DiagramView } from "@/content/visuals/types";
import { CompareDiagram } from "./CompareDiagram";
import { FlowDiagram } from "./FlowDiagram";
import { GraphDiagram } from "./GraphDiagram";
import { StackDiagram } from "./StackDiagram";
import "./visuals.css";

// One dispatcher for the declarative primitives. An exhaustive switch rather
// than a Record, because each view has a differently shaped payload — and the
// `never` assignment at the bottom makes a new primitive a compile error until
// it is handled here.

export function Diagram({ view }: { view: DiagramView }) {
  switch (view.kind) {
    case "flow":
      return (
        <FlowDiagram nodes={view.nodes} layout={view.layout} play={view.play} />
      );
    case "stack":
      return <StackDiagram bands={view.bands} />;
    case "compare":
      return <CompareDiagram columns={view.columns} rows={view.rows} />;
    case "graph":
      return <GraphDiagram nodes={view.nodes} edges={view.edges} />;
    default: {
      const exhaustive: never = view;
      return exhaustive;
    }
  }
}

/** The frame a lesson visual sits in: same panel language as the rest of the app. */
export function DiagramFrame({
  caption,
  children,
}: {
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="rounded-2xl border border-line bg-bg-elev/70 p-4">
      {children}
      {caption && (
        <figcaption className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
