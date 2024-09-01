
import config from '@/config';
import { FaUsers } from 'react-icons/fa';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';

export default function Server({ data, icon_base64 }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact',
    maximumFractionDigits: 2
  });

  const membersFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${icon_base64}`}
          alt={`${data.name}'s icon`}
          style={{ width: '64px', height: '64px', borderRadius: '8px' }}
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
              background: 'rgba(217, 70, 239, 0.1)',
              borderRadius: '9999px',
              border: '2px solid rgba(217, 70, 239)',
              padding: '5px 15px',
              fontSize: '20px',
              fontWeight: 600,
              color: 'rgba(217, 70, 239)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Premium
          </span>
        )}
      </div>

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
          gap: '24px',
          color: 'rgba(153, 153, 153)',
          marginTop: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaUsers size={32} color="#c7c7c7" />
        
          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {membersFormatter.format(data.members)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TbSquareRoundedChevronUp size={32} color="#c7c7c7" />
        
          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.votes)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px', color: '#c7c7c7' }}>
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
