export default function Layout({ children }) {
  return (
    <div className='flex size-full min-h-svh flex-col'>
      {children}
    </div>
  );
}