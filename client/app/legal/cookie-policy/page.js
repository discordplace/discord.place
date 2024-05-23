import config from '@/config';
import { Link } from 'next-view-transitions';

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
        Cookie Policy
      </h1>

      <p>
        Last updated: 03/19/2024
      </p>

      <h2>
        1. What are cookies?
      </h2>

      <p>
        Cookies are small text files that are stored on your device when you visit a website. They serve various purposes, including remembering your preferences, analyzing site usage, and enabling certain website features.
      </p>

      <h2>
        2. How do we use cookies?
      </h2>

      <ol>
        <li>
          <strong>Authentication:</strong> We use cookies to authenticate users who log in to our website through Discord authorization. These cookies are essential for ensuring that you can access your account securely and navigate our site efficiently.
        </li>
        <li>
          <strong>Preferences:</strong> We may use cookies to remember your preferences, such as language settings or display preferences, to enhance your browsing experience.
        </li>
        <li>
          <strong>Analytics:</strong> We may use cookies to collect anonymous data on how visitors interact with our website. This information helps us analyze and improve the performance and usability of our site.
        </li>
        <li>
          <strong>Third-party cookies:</strong> Some third-party services, such as Discord, may also place cookies on your device when you interact with our website through their services. We have no control over these cookies and their usage is governed by the respective third-party privacy policies.
        </li>
      </ol>

      <h2>
        3. Managing cookies
      </h2>

      <p>
        You have the option to manage or disable cookies in your browser settings. However, please note that disabling cookies may affect the functionality of certain features on our website.
      </p>

      <h2>
        4. Updates to this policy
      </h2>

      <p>
        We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We encourage you to review this policy periodically for any updates.
      </p>

      <h2>
        5. Contact Us
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