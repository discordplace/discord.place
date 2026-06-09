import { FaStar } from 'react-icons/fa';
import config from '@/config';

export default function Profile({ data, avatar_base64 }) {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    style: 'decimal'
  });

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '0px' }}>
      { }
      <h1
        style={{
          fontSize: '64px',
          fontWeight: 700,
          maxWidth: '1000px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
        {data.name}
      </h1>

      <p
        style={{
          color: 'rgba(153, 153, 153)',
          display: '-webkit-box',
          fontSize: '24px',
          fontWeight: 500,
          lineClamp: 2,
          lineHeight: '1.5',
          maxWidth: '800px',
          overflow: 'hidden',
          textAlign: 'center',
          textOverflow: 'ellipsis',
          textWrap: 'pretty',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2
        }}
      >
        {data.description}
      </p>

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: '8px'
        }}
      >
        by

        {/* eslint-disable-next-line @next/next/no-img-element */}
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
        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <FaStar size={32} color='#c7c7c7' />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.uses)}
          </span>
        </div>

        {data.categories.map(category => (
          <div
            style={{ alignItems: 'center', display: 'flex', gap: '12px' }}
            key={category}
          >
            <span style={{ color: '#c7c7c7', fontSize: '32px' }}>
              {config.templateCategoriesIcons[category]}
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