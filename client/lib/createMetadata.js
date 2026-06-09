import config from '@/config';

const siteName = 'discord.place';
const baseTitle = 'discord.place - A place for all things related to Discord';
const baseDescription = 'A place for all things related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.';
const baseUrl = config.baseUrl;

export default function createMetadata(customMetadata = {}) {
  const { openGraph, twitter, alternates, ...rest } = customMetadata;

  const resolvedTitle = customMetadata.title || baseTitle;
  const resolvedDescription = customMetadata.description || baseDescription;

  return {
    alternates: {
      canonical: baseUrl,
      ...alternates
    },
    authors: [{ name: siteName, url: baseUrl }],
    creator: siteName,
    description: baseDescription,
    keywords: [
      'discord',
      'discord bots',
      'discord developers',
      'discord emojis',
      'discord place',
      'discord profiles',
      'discord servers'
    ],
    metadataBase: new URL(baseUrl),
    openGraph: {
      description: resolvedDescription,
      locale: 'en_US',
      siteName,
      title: resolvedTitle,
      type: 'website',
      url: baseUrl,
      ...openGraph
    },
    publisher: siteName,
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      },
      index: true
    },
    title: {
      default: baseTitle,
      template: `%s | ${siteName}`
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@discord_place',
      description: resolvedDescription,
      site: '@discord_place',
      title: resolvedTitle,
      ...twitter
    },
    ...rest
  };
}