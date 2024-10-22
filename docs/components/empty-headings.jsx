export default function EmptyHeadings() {
  const totalLoaders = 5;
  const widths = [80, 60, 70, 50, 80];

  return (
    new Array(totalLoaders).fill(null).map((_, i) => (
      <div
        className='h-4 animate-pulse rounded bg-tertiary'
        key={i}
        style={{ width: `${widths[i]}%` }}
      />
    ))
  );
}