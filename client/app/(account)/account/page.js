import Content from '@/app/(account)/account/components/Content';
import AuthProtected from '@/app/components/Providers/Auth/Protected';
import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  title: 'Account'
});

export default function Page() {
  return (
    <AuthProtected>
      <Content />
    </AuthProtected>
  );
}