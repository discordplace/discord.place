import config from '@/config';
import Link from 'next/link';

export const metadata = {
  title: 'Content Policy',
  openGraph: {
    title: 'Discord Place - Content Policy'
  }
};

export default function ContentPolicy() {
  return (
    <>
      <h1>
        Content Policy
      </h1>

      <p>
        Last updated: 03/19/2024
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
        discord.place takes harmful content very seriously. If any profile is lited on this website that is harmful or copying your profile without permission, we will take action to ensure the profile is removed as soon as possible.
      </p>

      <h3>
        Servers
      </h3>

      <p>
        discord.place takes harmful content very seriously. If any server is lited on this website that is harmful or copying your server without permission, we will take action to ensure the server is removed as soon as possible.
      </p>

      <h2>
        3. Contact Us
      </h2>

      <p>
        You can reach us via the emails below or on our Discord server.
      </p>

      <div className="flex mt-2 gap-x-2">
        <Link href={config.supportInviteUrl} className='px-3 py-1 text-sm font-medium !text-white no-underline bg-black rounded-lg dark:bg-white dark:!text-black dark:hover:bg-white/70 hover:bg-black/70'>
          Discord Server
        </Link>
        <Link href='mailto:legal@discord.place' className='px-3 py-1 text-sm font-medium !text-white no-underline bg-black rounded-lg dark:bg-white dark:!text-black dark:hover:bg-white/70 hover:bg-black/70'>
          Email
        </Link>
      </div>
    </>
  );
}