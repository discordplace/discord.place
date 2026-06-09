export default function Square({ column, row, transparentEffectDirection, blockColor, zIndex }) {
  return (
    <>
      <div
        className='absolute inset-0 -z-10 size-full'
        style={{
          backgroundImage: `linear-gradient(to right, ${blockColor} 1px, transparent 1px), linear-gradient(to bottom, ${blockColor} 1px, transparent 1px)`,
          backgroundSize: `${column}rem ${row}rem`,
          zIndex: zIndex || '-10'
        }}
      />

      {transparentEffectDirection == 'bottomToTop' && (
        <div
          className='absolute inset-0 z-[-9] size-full bg-linear-to-t from-[rgba(var(--bg-background))]' style={{
            zIndex: zIndex ? zIndex + 1 : '-10'
          }}
        />
      )}

      {transparentEffectDirection == 'leftRightBottomTop' && (
        <>
          <div
            className='absolute inset-0 z-[-9] size-full bg-linear-to-t from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/10' style={{
              zIndex: zIndex ? zIndex + 1 : '-10'
            }}
          />

          <div
            className='absolute inset-0 z-9 size-full bg-linear-to-b from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/10' style={{
              zIndex: zIndex ? zIndex + 1 : '-10'
            }}
          />

          <div
            className='absolute inset-0 z-[-9] size-full bg-linear-to-l from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/10' style={{
              zIndex: zIndex ? zIndex + 1 : '-10'
            }}
          />

          <div
            className='absolute inset-0 z-[-9] size-full bg-linear-to-r from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/10' style={{
              zIndex: zIndex ? zIndex + 1 : '-10'
            }}
          />
        </>
      )}
    </>
  );
}