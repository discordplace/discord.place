import config from '@/config';

export default function Theme({ data, avatar_base64 }) {
  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '0px' }}>
      { }
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
        <span
          style={{
            backgroundColor: data.colors.primary,
            borderRadius: '50%',
            height: '64px',
            width: '64px'
          }}
        />

        <span
          style={{
            backgroundColor: data.colors.secondary,
            borderRadius: '50%',
            clipPath: 'polygon(100% 0, 100% 48%, 100% 100%, 0 100%)',
            height: '64px',
            left: 0,
            position: 'absolute',
            top: 0,
            width: '64px'
          }}
        />
      </div>

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: '8px'
        }}
      >
        by

        <img
          src={avatar_base64 ? `data:image/png;base64,${avatar_base64}` : `http://127.0.0.1:${process.env.NEXT_PUBLIC_PORT}/default-discord-avatar.png`}
          alt={`${data.username}'s avatar`}
          style={{ borderRadius: '50%', height: '32px', width: '32px' }}
        />

        <span
          style={{
            color: 'rgba(153, 153, 153)',
            fontSize: '24px',
            fontWeight: 500
          }}
        >
          {data.username}
        </span>
      </div>

      <div
        style={{
          alignItems: 'center',
          color: 'rgba(153, 153, 153)',
          display: 'flex',
          gap: '24px',
          marginTop: '24px'
        }}
      >
        {data.categories.map(category => (
          <div
            style={{ alignItems: 'center', display: 'flex', gap: '12px' }}
            key={category}
          >
            <span style={{ color: '#c7c7c7', fontSize: '32px' }}>
              {config.themeCategoriesIcons[category]}
            </span>

            <span style={{ fontSize: '32px', fontWeight: 500 }}>
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}