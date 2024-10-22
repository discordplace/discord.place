import config from '@/config';
import Link from 'next/link';

export const metadata = {
  title: 'Purchase Policy',
  openGraph: {
    title: 'Discord Place - Purchase Policy'
  }
};

export default function PurchasePolicy() {
  return (
    <>
      <h1>
        Purchase Policy
      </h1>

      <p>
        Last updated: 06/18/2024
      </p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to discord.place. By purchasing our premium products/services, you agree to be bound by the following terms and conditions.
      </p>

      <h2>2. Purchase and Payment</h2>
      <ul>
        <li>All prices are listed in USD and are subject to change without notice.</li>
        <li>Payments are processed through Lemon Squeezy, ensuring secure transactions.</li>
        <li>By completing a purchase, you authorize Lemon Squeezy to charge your selected payment method for the total amount of your order.</li>
      </ul>

      <h2>3. Delivery of Services/Products</h2>
      <ul>
        <li>Digital products/services will be delivered to you immediately upon purchase.</li>
        <li>Please ensure that your email address is correct to avoid delivery issues.</li>
      </ul>

      <h2>4. Refund Policy</h2>
      <p><strong>Digital Products/Services</strong>: Due to the nature of digital products/services, all sales are final and non-refundable.</p>
      <p><strong>Exceptions</strong>: Refunds may be considered on a case-by-case basis in the event of:</p>
      <ul>
        <li>Duplicate purchases</li>
        <li>Technical issues preventing access to the product/service that cannot be resolved</li>
        <li>Misrepresentation of the product/service</li>
      </ul>
      <p>
        To request a refund, please contact us within 7 days of purchase with your order details and reason for the refund request.
      </p>

      <h2>5. Cancellations and Modifications</h2>
      <p><strong>Subscription Services</strong>:</p>
      <ul>
        <li>You can cancel your subscription at any time through your Lemon Squeezy account.</li>
        <li>Cancellations will take effect at the end of the current billing period, and no partial refunds will be provided.</li>
      </ul>
      <p><strong>One-Time Purchases</strong>: Once a purchase is completed, it cannot be canceled or modified.</p>

      <h2>6. Access and Usage</h2>
      <ul>
        <li>Upon purchase, you will receive access to the premium product/service for the duration specified (if applicable).</li>
        <li>You agree not to share, distribute, or resell the purchased product/service without explicit permission from discord.place.</li>
      </ul>

      <h2>7. Account Termination</h2>
      <p>
        We reserve the right to terminate your access to premium products/services without refund if you violate any terms of this policy or our general Terms of Service.
      </p>

      <h2>8. Changes to Policy</h2>
      <p>
        We may update this policy from time to time. Any changes will be posted on this page, and your continued use of our premium products/services constitutes acceptance of those changes.
      </p>

      <h2>
        9. Contact Us
      </h2>

      <p>
        You can reach us via the emails below or on our Discord server.
      </p>

      <div className='mt-2 flex gap-x-2'>
        <Link href={config.supportInviteUrl} className='rounded-lg bg-black px-3 py-1 text-sm font-medium !text-white no-underline hover:bg-black/70 dark:bg-white dark:!text-black dark:hover:bg-white/70'>
          Discord Server
        </Link>
        <Link href='mailto:legal@discord.place' className='rounded-lg bg-black px-3 py-1 text-sm font-medium !text-white no-underline hover:bg-black/70 dark:bg-white dark:!text-black dark:hover:bg-white/70'>
          Email
        </Link>
      </div>
    </>
  );
}