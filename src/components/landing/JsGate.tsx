// Synchronous, render-blocking one-liner that stamps `data-js` on the
// landing root DURING HTML parse — before first paint and long before
// hydration. landing.css only hides `[data-reveal]` content under
// `#landing[data-js]`, so browsers without JS render everything visible
// and browsers with JS never flash content that later disappears.
// Must be the first child of #landing (it targets parentElement).
export function JsGate() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.currentScript.parentElement.setAttribute("data-js","")`,
      }}
    />
  );
}
