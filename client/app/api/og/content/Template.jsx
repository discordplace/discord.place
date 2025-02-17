import config from '@/config';
import { FaStar } from 'react-icons/fa';

export default function Profile({ data, avatar_base64 }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact',
    maximumFractionDigits: 2
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
          fontSize: '24px',
          fontWeight: 500,
          textAlign: 'center',
          textWrap: 'pretty',
          color: 'rgba(153, 153, 153)',
          maxWidth: '800px',
          lineHeight: '1.5',
          lineClamp: 2,
          display: '-webkit-box',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2
        }}
      >
        {data.description}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        by

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar_base64 ? `data:image/png;base64,${avatar_base64}` : `http://127.0.0.1:${process.env.NEXT_PUBLIC_PORT}/default-discord-avatar.png`}
          alt={`${data.username}'s avatar`}
          style={{ width: '32px', height: '32px', borderRadius: '50%' }}
        />

        <span
          style={{
            fontSize: '24px',
            fontWeight: 500,
            color: 'rgba(153, 153, 153)'
          }}
        >
          {data.username}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          color: 'rgba(153, 153, 153)',
          marginTop: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaStar size={32} color='#c7c7c7' />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.uses)}
          </span>
        </div>

        {data.categories.map(category => (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            key={category}
          >
            <span style={{ fontSize: '32px', color: '#c7c7c7' }}>
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
