import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Nomos SDK + CLI",
  description: "TypeScript SDK and CLI for the Nomos Energy API",
  base: "/nomos-cli/",
  appearance: true,
  outDir: "../docs-dist",

  head: [
    ['link', { rel: 'stylesheet', href: '/custom.css' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: "SDK", link: "/sdk/" },
      { text: "CLI", link: "/cli/" },
      { text: "API", link: "/api/" },
    ],
    
    sidebar: {
      "/": [
        {
          text: "Getting Started",
          items: [
            { text: "Installation", link: "/installation" },
            { text: "Authentication", link: "/authentication" },
          ],
        },
        {
          text: "Use Cases",
          items: [
            { text: "Checkout", link: "/checkout" },
            { text: "Invoice Explanation", link: "/invoice" },
            { text: "Smart Meter Order", link: "/meter-order" },
            { text: "Examples", link: "/examples" },
          ],
        },
        {
          text: "Reference",
          items: [
            { text: "All Journeys", link: "/journeys" },
            { text: "SDK Reference", link: "/sdk/" },
            { text: "CLI Reference", link: "/cli/" },
            { text: "API Reference", link: "/api/" },
          ],
        },
      ],
      "/sdk/": [
        {
          text: "SDK Reference",
          items: [
            { text: "Overview", link: "/sdk/" },
            { text: "API Documentation", link: "/sdk/typedoc/" },
          ],
        },
      ],
      "/cli/": [
        {
          text: "CLI Reference",
          items: [
            { text: "Overview", link: "/cli/" },
            { text: "Commands", link: "/cli/commands" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Overview", link: "/api/" },
            { text: "OpenAPI Spec", link: "/api/openapi.html" },
          ],
        },
      ],
    },
    
    socialLinks: [
      { icon: "github", link: "https://github.com/tn819/nomos-cli" },
    ],

    footer: {
      message: "Generated with VitePress",
      copyright: "Copyright © 2026 Nomos Energy",
    },
  },
});
