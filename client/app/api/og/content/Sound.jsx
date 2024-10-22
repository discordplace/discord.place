import config from '@/config';
import { FaHeart } from 'react-icons/fa';
import { FiArrowRightCircle } from 'react-icons/fi';
import { HiDocumentDownload } from 'react-icons/hi';

export default function Sound({ avatar_base64, data }) {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    style: 'decimal'
  });

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: '24px' }}>
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

      <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
        by {' '}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`${data.username}'s avatar`}
          src={avatar_base64 ? `data:image/png;base64,${avatar_base64}` : 'https://cdn.discordapp.com/embed/avatars/0.png'}
          style={{ borderRadius: '50%', height: '32px', width: '32px' }}
        />

        <h1 style={{ color: 'rgba(153, 153, 153)', fontSize: '24px', fontWeight: 700 }}>
          {data.username}
        </h1>
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
          <FaHeart color='#ff0036' size={32} />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.likes)}
          </span>
        </div>

        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <HiDocumentDownload color='#c7c7c7' size={32} />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.downloads)}
          </span>
        </div>

        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <FiArrowRightCircle color='#43b459' size={32} style={{ transform: 'rotate(-45deg)' }} />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {new Date(data.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {data.categories.map(category => (
          <div
            key={category}
            style={{ alignItems: 'center', display: 'flex', gap: '12px' }}
          >
            <span style={{ color: '#c7c7c7', fontSize: '32px' }}>
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
