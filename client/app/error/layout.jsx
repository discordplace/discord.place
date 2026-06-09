import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  title: 'Error'
});

export default function Layout({ children }) {
  return children;
}