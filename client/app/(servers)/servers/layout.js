export default function Layout({ children }) {
  return (
    <div className='flex w-full h-full min-h-[100svh] flex-col'>
      {children}
    </div>
  );
}