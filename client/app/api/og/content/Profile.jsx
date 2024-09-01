import { FaHeart, FaRegEye } from 'react-icons/fa';
import { FiArrowRightCircle } from 'react-icons/fi';

export default function Profile({ data, avatar_base64 }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact',
    maximumFractionDigits: 2
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${avatar_base64}`}
          alt={`${data.username}'s avatar`}
          style={{ width: '64px', height: '64px', borderRadius: '50%' }}
        />

        <h1 style={{ fontSize: '64px', fontWeight: 700 }}>
          {data.username}
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
        {data.bio}
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
          <FaHeart size={32} color="#ff0036" />
        
          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.likes)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaRegEye size={32} color="#c7c7c7" />
        
          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.views)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiArrowRightCircle size={32} color="#43b459" style={{ transform: 'rotate(-45deg)' }} />
        
          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}
