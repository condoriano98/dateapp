/**
 * Renders a string where *words wrapped in asterisks* become rose italic accents,
 * matching the highlighted display headings in the design.
 */
export default function Highlight({ text }) {
  const parts = String(text).split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className="italic text-rose-600">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
