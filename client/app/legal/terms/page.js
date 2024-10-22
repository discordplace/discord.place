import config from '@/config';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service',
  openGraph: {
    title: 'Discord Place - Terms of Service'
  }
};

export default function Page() {
  return (
    <>
      <h1>Terms of Service</h1>

      <p>Last updated: 07/12/2024</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By using our services, you agree to be bound by these Terms of Service ({'"'}Terms{'"'}). If you do not agree to these Terms, please do not use our services.</p>

      <h2>2. Description of Service</h2>
      <p>discord.place is designed to provide a platform for users to discover Discord servers, bots, emojis, templates and more. We reserve the right to modify or discontinue the bot at any time without notice.</p>

      <h2>3. User Responsibilities</h2>
      <p>As a user of the services, you agree to:</p>
      <ul>
        <li>Use the services in accordance with these Terms and applicable laws.</li>
        <li>Not use the services for any illegal or unauthorized purpose.</li>
        <li>Not interfere with or disrupt the services or servers or networks connected to the services.</li>
        <li>You are responsible for the content displayed on our website on your behalf.</li>
      </ul>

      <h2>4. Prohibited Activities</h2>
      <p>Users are prohibited from:</p>
      <ul>
        <li>Engaging in any activity that could harm the services or its users.</li>
        <li>Attempting to gain unauthorized access to the services or its related systems.</li>
        <li>Using the services to transmit any harmful or disruptive content.</li>
      </ul>

      <h2>5. Termination</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of the Republic of Turkey, without regard to its conflict of law principles. In the event of any disputes arising from the execution of this agreement, the courts and enforcement offices of İstanbul Küçükçekmece Adalet Sarayı shall have exclusive jurisdiction
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:</p>
      <ul>
        <li>Your use or inability to use the services.</li>
        <li>Any unauthorized access to or use of our servers and/or any personal information stored therein.</li>
        <li>Any bugs, viruses, trojan horses, or other similar issues transmitted through the services by any third party.</li>
      </ul>

      <h2>7. Changes to Terms</h2>
      <p>We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the services after such changes have been posted constitutes your acceptance of the new Terms.</p>

      <h2>8. Governing Law</h2>
      <p>These Terms are governed by and construed in accordance with the laws of the Republic of Turkey, without regard to its conflict of law principles.</p>

      <h2>9. Contact Information</h2>
      <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@discord.place">legal@discord.place</a>.</p>

      <h2>
        10. Contact Us
      </h2>

      <p>
        You can reach us via the emails below or on our Discord server.
      </p>

      <div className="mt-2 flex gap-x-2">
        <Link
          href={config.supportInviteUrl}
          className='rounded-lg bg-black px-3 py-1 text-sm font-medium !text-white no-underline hover:bg-black/70 dark:bg-white dark:!text-black dark:hover:bg-white/70'
        >
          Discord Server
        </Link>

        <Link
          href='mailto:legal@discord.place'
          className='rounded-lg bg-black px-3 py-1 text-sm font-medium !text-white no-underline hover:bg-black/70 dark:bg-white dark:!text-black dark:hover:bg-white/70'
        >
          Email
        </Link>
      </div>
    </>
  );
}