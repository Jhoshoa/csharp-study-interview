import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkSimplePlantuml from '@akebifiky/remark-simple-plantuml';

const config: Config = {
  title: 'C# Interview Study Guide',
  tagline: 'Master C# and .NET for Technical Interviews',
  favicon: 'img/favicon.ico',

  url: 'https://jhoshoa.github.io',
  baseUrl: '/csharp-study-interview/',

  organizationName: 'jhoshoa',
  projectName: 'csharp-study-interview',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    format: 'md',
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/jhoshoa/csharp-study-interview/tree/main/',
          remarkPlugins: [remarkSimplePlantuml],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    navbar: {
      title: 'C# Study Guide',
      logo: {
        alt: 'C# Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Study Materials',
        },
        {
          href: 'https://github.com/jhoshoa/csharp-study-interview',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Study Topics',
          items: [
            {
              label: 'C# Fundamentals',
              to: '/docs/csharp-fundamentals',
            },
            {
              label: 'Advanced C#',
              to: '/docs/csharp-advanced',
            },
            {
              label: 'Interview Questions',
              to: '/docs/interview-questions',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Microsoft C# Docs',
              href: 'https://learn.microsoft.com/en-us/dotnet/csharp/',
            },
            {
              label: '.NET Documentation',
              href: 'https://learn.microsoft.com/en-us/dotnet/',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} C# Interview Study Guide. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['csharp', 'json', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
