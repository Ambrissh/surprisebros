# Search readiness and launch

The home, gallery and reviews routes have distinct titles, descriptions, canonical URLs and social metadata. A sitemap, robots file, descriptive photo alt text, crawlable gallery index, LocalBusiness data and logo favicons are included. No review-rating rich-result claims or fabricated business details are added.

## Before public launch

- Connect the client's confirmed public domain and set `NEXT_PUBLIC_SITE_URL` to its HTTPS origin before building. Canonicals, sitemap and business data use this one value.
- Remove the owner-only sign-in restriction only with the owner's approval. Search engines cannot index the current private preview.
- Check the live home, gallery, reviews, `/robots.txt`, `/sitemap.xml`, `/favicon.png` and `/favicon.ico` on that domain.
- Verify domain ownership in Google Search Console and submit `/sitemap.xml`. Indexing and rankings are not guaranteed by implementation.
- Confirm the published WhatsApp number with the business. The existing contact destination is preserved; no conflicting telephone number is added to structured data.
- Photos 25 and 26 were supplied as tiny thumbnails. They remain included at restrained size; request original-resolution versions before a high-resolution client handoff.

## Photo provenance

All 30 gallery and film photographs come from the user attachments supplied on 7 September 2026, in attachment order. `lib/native-photos.json` records the matching attachment number, dimensions and alt text. Images are converted to WebP without enlargement. Original watermarks are retained. No stock photographs are used in these collections.

## Guidance

- [Google technical requirements](https://developers.google.com/search/docs/essentials/technical)
- [Favicon requirements](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
