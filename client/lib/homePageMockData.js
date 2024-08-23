
const baseProfileData = {
  colors: {
    primary: null,
    secondary: null
  },
  badges: [],
  views: 100000,
  likes: 100000
};

const baseServerData = {
  data: {
    members: 100000,
    votes: 100000
  }
};

const baseBotData = {
  owner: {},
  votes: 100000
};

const baseEmojiData = {
  user: {},
  downloads: 100000,
  created_at: new Date().toISOString()
};

const baseTemplateData = {
  uses: 100000,
  created_at: new Date().toISOString()
};

const baseSoundData = {
  publisher: {
    username: 'discord'
  },
  downloadsCount: 100000,
  createdAt: new Date().toISOString()
};

const data = ({
  profiles: [
    {
      ...baseProfileData,
      slug: 'discord1',
      username: 'Discord',
      global_name: 'Discord',
      bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      badges: [],
      createdAt: '2015-05-14T00:00:00.000Z'
    },
    {
      ...baseProfileData,
      slug: 'discord2',
      username: 'Discord',
      global_name: 'Discord',
      bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      badges: [],
      createdAt: '2015-05-14T00:00:00.000Z'
    },
    {
      ...baseProfileData,
      slug: 'discord3',
      username: 'Discord',
      global_name: 'Discord',
      bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      views: 100000,
      likes: 100000,
      badges: [],
      createdAt: '2015-05-14T00:00:00.000Z'
    },
    {
      ...baseProfileData,
      slug: 'discord4',
      username: 'Discord',
      global_name: 'Discord',
      bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      views: 100000,
      likes: 100000,
      badges: [],
      createdAt: '2015-05-14T00:00:00.000Z'
    },
    {
      ...baseProfileData,
      slug: 'discord5',
      username: 'Discord',
      global_name: 'Discord',
      bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      views: 100000,
      likes: 100000,
      badges: [],
      createdAt: '2015-05-14T00:00:00.000Z'
    },
    {
      ...baseProfileData,
      slug: 'discord6',
      username: 'Discord',
      global_name: 'Discord',
      bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      views: 100000,
      likes: 100000,
      badges: [],
      createdAt: '2015-05-14T00:00:00.000Z'
    }
  ],
  servers: [
    {
      ...baseServerData,
      id: '1',
      name: 'Discord',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      category: 'Community'
    },
    {
      ...baseServerData,
      id: '2',
      name: 'Discord',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      category: 'Community',
      premium: true
    },
    {
      ...baseServerData,
      id: '3',
      name: 'Discord',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
      category: 'Community'
    },
    {
      ...baseServerData,
      id: '4',
      name: 'Discord',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/2.png',
      category: 'Community'
    },
    {
      ...baseServerData,
      id: '5',
      name: 'Discord',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/3.png',
      category: 'Community'
    },
    {
      ...baseServerData,
      id: '6',
      name: 'Discord',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/4.png',
      category: 'Community'
    },
    {
      ...baseServerData,
      id: '7',
      name: 'Discord',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/5.png',
      category: 'Community'
    },
    {
      ...baseServerData,
      id: '8',
      name: 'Discord',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      category: 'Community'
    },
    {
      ...baseServerData,
      id: '9',
      name: 'Discord',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
      category: 'Community'
    }
  ],
  bots: [
    {
      ...baseBotData,
      id: '1',
      username: 'Discord',
      discriminator: '0000',
      short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      categories: ['Utility']
    },
    {
      ...baseBotData,
      owner: {
        premium: true
      },
      id: '2',
      username: 'discord.place',
      discriminator: '#3175',
      short_description: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
      avatar_url: '/templates/square_logo.png',
      banner_url: '/templates/discord_banner.png',
      categories: ['Utility']
    },
    {
      ...baseBotData,
      id: '3',
      username: 'Discord',
      discriminator: '0000',
      short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
      categories: ['Utility']
    },
    {
      ...baseBotData,
      id: '4',
      username: 'Discord',
      discriminator: '0000',
      short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/2.png',
      categories: ['Utility']
    },
    {
      ...baseBotData,
      id: '5',
      username: 'Discord',
      discriminator: '0000',
      short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/3.png',
      categories: ['Utility']
    },
    {
      ...baseBotData,
      id: '6',
      username: 'Discord',
      discriminator: '0000',
      short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/4.png',
      categories: ['Utility']
    },
    {
      ...baseBotData,
      id: '7',
      username: 'Discord',
      discriminator: '0000',
      short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/5.png',
      categories: ['Utility']
    },
    {
      ...baseBotData,
      id: '8',
      username: 'Discord',
      discriminator: '0000',
      short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      categories: ['Utility']
    },
    {
      ...baseBotData,
      id: '9',
      username: 'Discord',
      discriminator: '0000',
      short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
      categories: ['Utility']
    }
  ],
  emojis: [
    {
      ...baseEmojiData,
      id: '1',
      name: 'discord_logo',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/0.png'
    },
    {
      ...baseEmojiData,
      id: '2',
      name: 'discord_place_logo',
      categories: ['Other'],
      overridedImage: '/templates/square_logo.png'
    },
    {
      ...baseEmojiData,
      id: '3',
      name: 'discord_logo_gray',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/1.png'
    },
    {
      ...baseEmojiData,
      id: '4',
      name: 'discord_logo_green',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/2.png'
    },
    {
      ...baseEmojiData,
      id: '5',
      name: 'discord_logo_yellow',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/3.png'
    },
    {
      ...baseEmojiData,
      id: '6',
      name: 'discord_logo_red',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/4.png'
    },
    {
      ...baseEmojiData,
      id: '7',
      name: 'discord_logo_pink',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/5.png'
    },
    {
      ...baseEmojiData,
      id: '8',
      name: 'discord_logo_blue',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/0.png'
    },
    {
      ...baseEmojiData,
      id: '9',
      name: 'discord_logo_gray',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/1.png'
    },
    {
      ...baseEmojiData,
      id: '10',
      name: 'discord_logo_green',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/2.png'
    },
    {
      ...baseEmojiData,
      id: '11',
      name: 'discord_logo_yellow',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/3.png'
    },
    {
      ...baseEmojiData,
      id: '12',
      name: 'discord_logo_red',
      categories: ['Other'],
      overridedImage: 'https://cdn.discordapp.com/embed/avatars/4.png'
    }
  ],
  templates: [
    {
      ...baseTemplateData,
      id: '1',
      name: 'Discord Template',
      description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
      user: {
        id: '1',
        username: 'Discord',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
      },
      categories: ['Other']
    },
    {
      ...baseTemplateData,
      id: '2',
      name: 'discord.place Template',
      description: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
      user: {
        id: '2',
        username: 'discord.place',
        avatar_url: '/templates/square_logo.png'
      },
      categories: ['Other']
    },
    {
      ...baseTemplateData,
      id: '3',
      name: 'Community Template',
      description: 'A Discord server template for communities.',
      user: {
        id: '3',
        username: 'Discord',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
      },
      categories: ['Chat']
    },
    {
      ...baseTemplateData,
      id: '4',
      name: 'Music Template',
      description: 'A Discord server template for music servers.',
      user: {
        id: '4',
        username: 'Discord',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/2.png'
      },
      categories: ['Music']
    },
    {
      ...baseTemplateData,
      id: '5',
      name: 'Design Template',
      description: 'A Discord server template for design servers.',
      user: {
        id: '5',
        username: 'Discord',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/3.png'
      },
      categories: ['Design']
    },
    {
      ...baseTemplateData,
      id: '6',
      name: 'Gaming Template',
      description: 'A Discord server template for gaming servers.',
      user: {
        id: '7',
        username: 'Discord',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/4.png'
      },
      categories: ['Gaming']
    },
    {
      ...baseTemplateData,
      id: '7',
      name: 'Community Template',
      description: 'A Discord server template for communities.',
      user: {
        id: '8',
        username: 'Discord',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/5.png'
      },
      categories: ['Chat']
    },
    {
      ...baseTemplateData,
      id: '8',
      name: 'Music Template',
      description: 'A Discord server template for music servers.',
      user: {
        id: '9',
        username: 'Discord',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
      },
      categories: ['Music']
    },
    {
      ...baseTemplateData,
      id: '9',
      name: 'Design Template',
      description: 'A Discord server template for design servers.',
      user: {
        id: '1',
        username: 'Discord',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
      },
      categories: ['Design']
    }
  ],
  sounds: [
    {
      ...baseSoundData,
      id: 'example1',
      name: 'Beep Boop',
      categories: ['Other']
    },
    {
      ...baseSoundData,
      id: 'example2',
      name: 'Beep Boop',
      categories: ['Other']
    },
    {
      ...baseSoundData,
      id: 'example3',
      name: 'Beep Boop',
      categories: ['Other']
    },
    {
      ...baseSoundData,
      id: 'example4',
      name: 'Beep Boop',
      categories: ['Other']
    },
    {
      ...baseSoundData,
      id: 'example5',
      name: 'Beep Boop',
      categories: ['Other']
    },
    {
      ...baseSoundData,
      id: 'example6',
      name: 'Beep Boop',
      categories: ['Other']
    },
    {
      ...baseSoundData,
      id: 'example7',
      name: 'Beep Boop',
      categories: ['Other']
    },
    {
      ...baseSoundData,
      id: 'example8',
      name: 'Beep Boop',
      categories: ['Other']
    },
    {
      ...baseSoundData,
      id: 'example9',
      name: 'Beep Boop',
      categories: ['Other']
    }
  ]
});

export default data;