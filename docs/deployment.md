# Deployment targets

The same application supports two hosting targets:

- `npm run build` builds the existing Cloudflare/Sites Worker in `dist/`.
- `npm run build:vercel` builds a Vercel function, routing manifest, and public assets in `.vercel/output/`, then verifies the generated function.

`vercel.json` selects the Vercel build command and output directory with the framework preset set to Other. Keep the Vercel project root at the repository root. Pushes to the connected production branch trigger deployment. Do not use `dist/` as Vercel's output directory: that build contains a Cloudflare Worker, not a Vercel function or a static homepage, and serving it results in `404: NOT_FOUND`.

The Vercel target uses Vinext's Nitro integration and the Vite 8-compatible Tailwind Vite plugin. The existing Sites target retains its Cloudflare and PostCSS plugins. No application pages, content, or access policies are changed by selecting a build target.

`npm run verify:vercel` requires a completed Vercel build. It checks the routing manifest and public assets, invokes the generated function for Home, Gallery, Reviews, robots.txt, and sitemap.xml, verifies referenced hydration assets, and checks RSC navigation and a genuine missing-page response. After deployment, also check these URLs on the live domain.

Set `NEXT_PUBLIC_SITE_URL` to the confirmed public HTTPS origin in the hosting environment when configuring canonical URLs for public launch.

References: [Vinext deployment](https://github.com/cloudflare/vinext#other-platforms-via-nitro), [Vercel Build Output API](https://vercel.com/docs/build-output-api), [Tailwind with Vite](https://tailwindcss.com/docs/installation/using-vite).
