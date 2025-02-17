import config from '@/config';
import { FaHeart } from 'react-icons/fa';
import { FiArrowRightCircle } from 'react-icons/fi';
import { HiDocumentDownload } from 'react-icons/hi';

export default function Sound({ data, avatar_base64 }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact',
    maximumFractionDigits: 2
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 700,
            maxWidth: '1000px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {data.name}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        by {' '}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar_base64 ? `data:image/png;base64,${avatar_base64}` : `http://127.0.0.1:${process.env.NEXT_PUBLIC_PORT}/default-discord-avatar.png`}
          alt={`${data.username}'s avatar`}
          style={{ width: '32px', height: '32px', borderRadius: '50%' }}
        />

        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'rgba(153, 153, 153)' }}>
          {data.username}
        </h1>
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
          <FaHeart size={32} color='#ff0036' />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.likes)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HiDocumentDownload size={32} color='#c7c7c7' />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.downloads)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiArrowRightCircle size={32} color='#43b459' style={{ transform: 'rotate(-45deg)' }} />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {data.categories.map(category => (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            key={category}
          >
            <span style={{ fontSize: '32px', color: '#c7c7c7' }}>
              {config.soundCategoriesIcons[category]}
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
