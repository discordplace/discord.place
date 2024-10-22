import config from '@/config';
import Link from 'next/link';

export const metadata = {
  openGraph: {
    title: 'Discord Place - Privacy Policy'
  },
  title: 'Privacy Policy'
};

export default function Page() {
  return (
    <>
      <h1>Privacy Policy</h1>

      <p>Last updated: 07/12/2024</p>

      <h2>1. Introduction</h2>
      <p>Welcome to the privacy policy for discord.place. This document explains how we collect, use, and protect your information when you use our services.</p>

      <h2>2. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li><strong>Usage Data:</strong> We may collect information about how you interact with the bot, such as commands used and messages sent.</li>
        <li><strong>Device Information:</strong> We may collect information about your device, such as IP address, browser type, and operating system.</li>
        <li><strong>Cookies:</strong> We may use cookies to store information about your preferences and settings. For more information, please see our Cookie Policy.</li>
        <li><strong>Third-Party Services:</strong> We may collect information from third-party services, such as Discord, to provide our services, such as user IDs and email addresses.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain our services.</li>
        <li>Improve and personalize user experience.</li>
        <li>Analyze usage patterns to improve the services.</li>
      </ul>

      <h2>4. Information Sharing and Disclosure</h2>
      <p>We do not share, sell, or disclose your personal information to third parties except as follows:</p>
      <ul>
        <li>If required by law or to comply with legal processes.</li>
        <li>To protect our rights and property.</li>
      </ul>

      <h2>5. Data Security</h2>
      <p>We take reasonable measures to protect the information we collect from unauthorized access, disclosure, alteration, or destruction. However, no internet or email transmission is ever fully secure or error-free.</p>

      <h2>6. Your Data Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the information we hold about you.</li>
        <li>Request the correction of inaccurate information.</li>
        <li>Request the deletion of your information.</li>
        <li>Object to the processing of your data.</li>
      </ul>
      <p>To exercise these rights, please contact us at <a href='mailto:legal@discord.place'>legal@discord.place</a>.</p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this privacy policy periodically for any changes.</p>

      <h2>
        8. Contact Us
      </h2>

      <p>
        You can reach us via the emails below or on our Discord server.
      </p>

      <div className='mt-2 flex gap-x-2'>
        <Link
          className='rounded-lg bg-black px-3 py-1 text-sm font-medium !text-white no-underline hover:bg-black/70 dark:bg-white dark:!text-black dark:hover:bg-white/70'
          href={config.supportInviteUrl}
        >
          Discord Server
        </Link>

        <Link
          className='rounded-lg bg-black px-3 py-1 text-sm font-medium !text-white no-underline hover:bg-black/70 dark:bg-white dark:!text-black dark:hover:bg-white/70'
          href='mailto:legal@discord.place'
        >
          Email
        </Link>
      </div>
    </>
  );
}