import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  title: 'Create new template'
});

export default function Layout({ children }) {
  return children;
}