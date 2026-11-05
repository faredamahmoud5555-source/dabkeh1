/**
 * A template is re-created on every navigation (unlike layout.js), which makes it
 * the simplest place for a light page transition. Opacity only, so sticky and
 * fixed elements inside pages keep working.
 */
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
