
import config from '@/config';
import { FaUsers } from 'react-icons/fa';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';

export default function Server({ data, icon_base64 }) {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    style: 'decimal'
  });

  const membersFormatter = new Intl.NumberFormat('en-US', {
    compactDisplay: 'short',
    notation: 'compact'
  });

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: '24px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`${data.name}'s icon`}
          src={icon_base64 ? `data:image/png;base64,${icon_base64}` : 'https://cdn.discordapp.com/embed/avatars/0.png'}
          style={{ borderRadius: '8px', height: '64px', width: '64px' }}
        />

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

        {data.premium && (
          <span
            style={{
              alignItems: 'center',
              background: 'rgba(217, 70, 239, 0.1)',
              border: '2px solid rgba(217, 70, 239)',
              borderRadius: '9999px',
              color: 'rgba(217, 70, 239)',
              display: 'flex',
              fontSize: '20px',
              fontWeight: 600,
              gap: '4px',
              padding: '5px 15px'
            }}
          >
            Premium
          </span>
        )}
      </div>

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
          color: 'rgba(153, 153, 153)',
          display: 'flex',
          gap: '24px',
          marginTop: '24px'
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <FaUsers color='#c7c7c7' size={32} />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {membersFormatter.format(data.members)}
          </span>
        </div>

        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <TbSquareRoundedChevronUp color='#c7c7c7' size={32} />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.votes)}
          </span>
        </div>

        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <span style={{ color: '#c7c7c7', fontSize: '32px' }}>
            {config.serverCategoriesIcons[data.category]}
          </span>

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {data.category}
          </span>
        </div>
      </div>
    </div>
  );
}
