import { FiArrowRightCircle } from 'react-icons/fi';

export default function Blog({ data }) {
  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <h1
        style={{
          alignItems: 'center',
          display: 'flex',
          fontSize: '64px',
          fontWeight: 700,
          gap: '2px',
          maxWidth: '1100px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
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
          color: 'rgba(153, 153, 153)',
          display: 'flex',
          gap: '24px',
          marginTop: '24px'
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <FiArrowRightCircle color='#43b459' size={32} style={{ transform: 'rotate(-45deg)' }} />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {new Date(data.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}
