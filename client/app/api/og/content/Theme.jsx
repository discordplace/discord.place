import { BiSolidCategory } from 'react-icons/bi';
import { FiArrowRightCircle } from 'react-icons/fi';

export default function Sound({ data, avatar_base64 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            maxWidth: '1000px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'  ,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span
              style={{
                backgroundColor: data.colors.primary,
                display: 'block',
                width: '64px',
                height: '64px',
                borderRadius: '50%'
              }}
            />

            <span
              style={{
                backgroundColor: data.colors.secondary,
                display: 'block',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                marginLeft: '-48px'
              }}
            />
          </div>

          {data.id}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        by {' '}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar_base64 ? `data:image/png;base64,${avatar_base64}` : 'https://cdn.discordapp.com/embed/avatars/0.png'}
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
          <FiArrowRightCircle size={32} color="#43b459" style={{ transform: 'rotate(-45deg)' }} />
        
          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '32px'
          }}
        >
          <BiSolidCategory size={32} color="#c7c7c7" />

          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '800px'
            }}
          >
            {data.categories.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}
