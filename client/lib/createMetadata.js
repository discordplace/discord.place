import config from '@/config';

export default function createMetadata(metadata) {
  const siteName = 'discord.place';
  const baseTitle = 'discord.place - A place for all things that related to Discord';
  const baseDescription = 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.';
  const baseUrl = config.baseUrl;

  const defaultMetadata = {
    alternates: {
      canonical: baseUrl
    },
    authors: [{ name: siteName, url: baseUrl }],
    creator: siteName,
    description: baseDescription,
    keywords: ['discord', 'discord place', 'discord emojis', 'discord servers', 'discord profiles', 'discord emojis', 'discord bots', 'discord developers'],
    metadataBase: new URL(baseUrl),
    openGraph: {
      description: baseDescription,
      locale: 'en_US',
      siteName,
      title: baseTitle,
      type: 'website',
      url: baseUrl
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
      description: baseDescription,
      site: '@discord_place',
      title: baseTitle
    }
  };

  return {
    ...defaultMetadata,
    ...metadata,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...metadata?.openGraph
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...metadata?.twitter
    }
  };
}
