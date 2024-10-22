export default function Square({ column, row, transparentEffectDirection, blockColor, zIndex }) {
  return (
    <>
      <div
        className='absolute inset-0 -z-10 size-full'
        style={{
          backgroundSize: `${column}rem ${row}rem`,
          backgroundImage: `linear-gradient(to right, ${blockColor} 1px, transparent 1px), linear-gradient(to bottom, ${blockColor} 1px, transparent 1px)`,
          zIndex: zIndex || '-10'
        }}
      />

      {transparentEffectDirection == 'bottomToTop' && (
        <div
          className='absolute inset-0 z-[-9] size-full bg-gradient-to-t from-[rgba(var(--bg-background))]' style={{
            zIndex: zIndex ? zIndex + 1 : '-10'
          }}
        />
      )}

      {transparentEffectDirection == 'leftRightBottomTop' && (
        <>
          <div
            className='absolute inset-0 z-[-9] size-full bg-gradient-to-t from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/[0.1]' style={{
              zIndex: zIndex ? zIndex + 1 : '-10'
            }}
          />

          <div
            className='absolute inset-0 z-[9] size-full bg-gradient-to-b from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/[0.1]' style={{
              zIndex: zIndex ? zIndex + 1 : '-10'
            }}
          />

          <div
            className='absolute inset-0 z-[-9] size-full bg-gradient-to-l from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/[0.1]' style={{
              zIndex: zIndex ? zIndex + 1 : '-10'
            }}
          />

          <div
            className='absolute inset-0 z-[-9] size-full bg-gradient-to-r from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/[0.1]' style={{
              zIndex: zIndex ? zIndex + 1 : '-10'
            }}
          />
        </>
      )}
    </>
  );
}