import { FiArrowRightCircle } from 'react-icons/fi';

export default function Blog({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
      <h1
        style={{
          fontSize: '64px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '1100px'
        }}
      >
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
          gap: '24px',
          color: 'rgba(153, 153, 153)',
          marginTop: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiArrowRightCircle size={32} color='#43b459' style={{ transform: 'rotate(-45deg)' }} />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}
