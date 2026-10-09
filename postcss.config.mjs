/** Standard Tailwind v4 pipeline. Replaces the custom Turbopack CSS loader,
 *  which was not invalidating globals.css on edit (stale styles in dev). */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
