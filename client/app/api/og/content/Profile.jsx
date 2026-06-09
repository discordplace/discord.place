import { FaHeart, FaRegEye } from 'react-icons/fa';
import { FiArrowRightCircle } from 'react-icons/fi';

export default function Profile({ data, avatar_base64 }) {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    style: 'decimal'
  });

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: '24px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar_base64 ? `data:image/png;base64,${avatar_base64}` : `http://127.0.0.1:${process.env.NEXT_PUBLIC_PORT}/default-discord-avatar.png`}
          alt={`${data.username}'s avatar`}
          style={{ borderRadius: '50%', height: '64px', width: '64px' }}
        />

        <h1
          style={{
            fontSize: '64px',
            fontWeight: 70,
            maxWidth: '1000px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {data.username}
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
        {data.bio}
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
          <FaHeart size={32} color='#ff0036' />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.likes)}
          </span>
        </div>

        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <FaRegEye size={32} color='#c7c7c7' />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.views)}
          </span>
        </div>

        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <FiArrowRightCircle size={32} color='#43b459' style={{ transform: 'rotate(-45deg)' }} />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {new Date(data.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}