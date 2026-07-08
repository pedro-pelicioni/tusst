import ReactMarkdown from "react-markdown";

// Styled markdown for lesson instructions (terminal aesthetic, no typography
// plugin — explicit component mapping keeps the output tight and consistent).
// Note: react-markdown passes the hast `node` to custom components; it is
// destructured away everywhere so it never reaches the DOM as an attribute.
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ node, ...props }) => {
          void node;
          return (
            <h2
              className="text-xl font-semibold tracking-tight text-fg [&:not(:first-child)]:mt-8"
              {...props}
            />
          );
        },
        h3: ({ node, ...props }) => {
          void node;
          return (
            <h3
              className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-accent"
              {...props}
            />
          );
        },
        p: ({ node, ...props }) => {
          void node;
          return (
            <p className="mt-3 text-sm leading-relaxed text-muted2" {...props} />
          );
        },
        ul: ({ node, ...props }) => {
          void node;
          return (
            <ul
              className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted2 marker:text-muted"
              {...props}
            />
          );
        },
        ol: ({ node, ...props }) => {
          void node;
          return (
            <ol
              className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted2 marker:text-muted"
              {...props}
            />
          );
        },
        li: ({ node, ...props }) => {
          void node;
          return <li {...props} />;
        },
        code: ({ node, className, children, ...props }) => {
          void node;
          // Block code gets a language class from the fence; inline code doesn't.
          if (className) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
          return (
            <code
              className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ node, ...props }) => {
          void node;
          return (
            <pre
              className="mt-3 overflow-x-auto rounded-lg border border-line bg-bg px-4 py-3 font-mono text-[12.5px] leading-relaxed text-fg"
              {...props}
            />
          );
        },
        strong: ({ node, ...props }) => {
          void node;
          return <strong className="font-semibold text-fg" {...props} />;
        },
        a: ({ node, ...props }) => {
          void node;
          return (
            <a className="text-accent underline underline-offset-2" {...props} />
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
