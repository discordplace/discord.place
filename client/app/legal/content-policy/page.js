import config from '@/config';
import Link from 'next/link';

export const metadata = {
  openGraph: {
    title: 'Discord Place - Content Policy'
  },
  title: 'Content Policy'
};

export default function ContentPolicy() {
  return (
    <>
      <h1>
        Content Policy
      </h1>

      <p>
        Last updated: 06/05/2024
      </p>

      <h2>
        1. User Generated Content
      </h2>

      <h3>
        Emojis
      </h3>

      <p>
        All emojis listed on this website (discord.place) is submitted by users, discord.place provides a platform for users to publish emojis with a publicly.
        <ul>
          <li>
            By submitting emojis to this website you agree that you are the creator of emoji or have permission to upload it on the creators behalf.
          </li>
          <li>
            By submitting emojis to this website you agree to giving us unrevokable permission to display, license and redistribute the emoji in any manner we see fit.
          </li>
          <li>
            By submitting emojis to this website you agree that the content you are submitting is not illegal, hateful, discriminatory or otherwise harmful to any person or group.
          </li>
          <li>
            discord.place reserves the right to remove emojis from the website at any time, without notice, for any reason, or for no reason, in its sole discretion.
          </li>
        </ul>
      </p>

      <h3>
        Profiles
      </h3>

      <p>
        All Discord user profiles listed on this website are created by users, discord.place provides a platform for users to publish their Discord user profiles publicly.

        <ul>
          <li>
            By creating a profile you agree that you are the owner of the Discord account or have permission to create a profile on the owners behalf.
          </li>
          <li>
            By creating a profile you agree to giving us unrevokable permission to display, license and redistribute the profile in any manner we see fit.
          </li>
          <li>
            By creating a profile you agree that the content of the profile is not illegal, hateful, discriminatory or otherwise harmful to any person or group.
          </li>
          <li>
            discord.place reserves the right to remove profiles from the website at any time, without notice, for any reason, or for no reason, in its sole discretion.
          </li>
        </ul>
      </p>

      <h3>
        Servers
      </h3>

      <p>
        All Discord servers listed on this website are created by users, discord.place provides a platform for users to publish their Discord servers publicly.

        <ul>
          <li>
            By adding a server you agree that you are the owner of the Discord server or have permission to add the server on the owners behalf.
          </li>
          <li>
            By adding a server you agree to giving us unrevokable permission to display, license and redistribute the server in any manner we see fit.
          </li>
          <li>
            By adding a server you agree that the content of the server is not illegal, hateful, discriminatory or otherwise harmful to any person or group.
          </li>
          <li>
            discord.place reserves the right to remove servers from the website at any time, without notice, for any reason, or for no reason, in its sole discretion.
          </li>
        </ul>
      </p>

      <h3>
        Bots
      </h3>

      <p>
        All Discord bots listed on this website are created by users, discord.place provides a platform for users to publish their Discord bots publicly.

        <ul>
          <li>
            By adding a bot you agree that you are the owner of the Discord bot or have permission to add the bot on the owners behalf.
          </li>
          <li>
            By adding a bot you agree to giving us unrevokable permission to display, license and redistribute the bot in any manner we see fit.
          </li>
          <li>
            By adding a bot you agree that the content of the bot is not illegal, hateful, discriminatory or otherwise harmful to any person or group.
          </li>
          <li>
            discord.place reserves the right to remove bots from the website at any time, without notice, for any reason, or for no reason, in its sole discretion.
          </li>
        </ul>
      </p>

      <h3>
        Templates
      </h3>

      <p>
        All templates listed on this website are created by users, discord.place provides a platform for users to publish their templates publicly.

        <ul>
          <li>
            By adding a template you agree that you are the owner of the template or have permission to add the template on the owners behalf.
          </li>
          <li>
            By adding a template you agree to giving us unrevokable permission to display, license and redistribute the template in any manner we see fit.
          </li>
          <li>
            By adding a template you agree that the content of the template is not illegal, hateful, discriminatory or otherwise harmful to any person or group.
          </li>
          <li>
            discord.place reserves the right to remove templates from the website at any time, without notice, for any reason, or for no reason, in its sole discretion.
          </li>
        </ul>
      </p>

      <h3>
        Sounds
      </h3>

      <p>
        All sounds listed on this website are created by users, discord.place provides a platform for users to publish sound files publicly.
      </p>

      <ul>
        <li>
          By adding a sound you agree that you have permission to add the sound on the copyright holders behalf.
        </li>
        <li>
          By adding a sound you agree to giving us unrevokable permission to display, license and redistribute the sound in any manner we see fit.
        </li>
        <li>
          By adding a sound you agree that the content of the sound is not illegal, hateful, discriminatory or otherwise harmful to any person or group.
        </li>
        <li>
          discord.place reserves the right to remove sounds from the website at any time, without notice, for any reason, or for no reason, in its sole discretion.
        </li>
      </ul>

      <h2>
        2. Reporting Content
      </h2>

      <h3>
        Emojis
      </h3>

      <p>
        discord.place takes copyright infringement and harmful content very seriously, if your emoji is listed on this website without permission and you have sufficient evidence of this or the emoji is harmful, we will take action to ensure the emoji is removed as soon as possible.
      </p>

      <h3>
        Profiles
      </h3>

      <p>
        discord.place takes harmful content very seriously. If any profile is listed on this website that is harmful or copying your profile without permission, we will take action to ensure the profile is removed as soon as possible.
      </p>

      <h3>
        Servers
      </h3>

      <p>
        discord.place takes harmful content very seriously. If any server is listed on this website that is harmful or copying your server without permission, we will take action to ensure the server is removed as soon as possible.
      </p>

      <h3>
        Bots
      </h3>

      <p>
        discord.place takes harmful content very seriously. If any bot is listed on this website that is harmful or copying your bot without permission, we will take action to ensure the bot is removed as soon as possible.
      </p>

      <h3>
        Templates
      </h3>

      <p>
        discord.place takes harmful content very seriously. If any template is listed on this website that is harmful or copying your server without permission, we will take action to ensure the template is removed as soon as possible.
      </p>

      <h3>
        Sounds
      </h3>

      <p>
        discord.place takes harmful content very seriously. If any sound is listed on this website that is harmful or copying your sound without permission, we will take action to ensure the sound is removed as soon as possible.
      </p>

      <h2>
        3. Contact Us
      </h2>

      <p>
        You can reach us via the emails below or on our Discord server.
      </p>

      <div className='mt-2 flex gap-x-2'>
        <Link className='rounded-lg bg-black px-3 py-1 text-sm font-medium !text-white no-underline hover:bg-black/70 dark:bg-white dark:!text-black dark:hover:bg-white/70' href={config.supportInviteUrl}>
          Discord Server
        </Link>
        <Link className='rounded-lg bg-black px-3 py-1 text-sm font-medium !text-white no-underline hover:bg-black/70 dark:bg-white dark:!text-black dark:hover:bg-white/70' href='mailto:legal@discord.place'>
          Email
        </Link>
      </div>
    </>
  );
}