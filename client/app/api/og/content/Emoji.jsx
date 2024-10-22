import config from '@/config';
import { HiDocumentDownload } from 'react-icons/hi';

export default function Emoji({ data, avatar_base64 }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact',
    maximumFractionDigits: 2
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {data.is_pack === false ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.getEmojiURL(data.id)}
              alt={`${data.name} emoji`}
              style={{ width: '64px', height: '64px', borderRadius: '50%', marginRight: '24px', marginTop: '24px' }}
            />

            <h1 style={{ fontSize: '64px', fontWeight: 700 }}>
              {data.name}
            </h1>
          </>
        ) : (
          <>
            <div
              style={{
                maxWidth: '200px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  placeItems: 'center',
                  position: 'relative',
                  top: '0'
                }}
              >
                {data.emoji_ids.map(packaged_emoji => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={packaged_emoji.id}
                    src={config.getEmojiURL(`packages/${data.id}/${packaged_emoji.id}`, packaged_emoji.animated)}
                    alt={`Emoji ${packaged_emoji.id}`}
                    style={{
                      objectFit: 'contain',
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(30, 30, 36)'
                    }}
                  />
                ))}

                {new Array(9 - data.emoji_ids.length).fill(0).map((_, index) => (
                  <div
                    key={index}
                    // className='w-[32px] h-[32px] p-0.5 rounded-md bg-secondary'
                    style={{
                      width: '64px',
                      height: '64px',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      backgroundColor: 'rgba(37, 37, 45)'
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '24px'
        }}
      >
        {data.is_pack === true && (
          <span
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255)'
            }}
          >
            {data.name}
          </span>
        )}

        by

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar_base64 ? `data:image/png;base64,${avatar_base64}` : 'https://cdn.discordapp.com/embed/avatars/0.png'}
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
          <HiDocumentDownload size={32} color="#c7c7c7" />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.downloads)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px', color: '#c7c7c7' }}>
            {config.emojiCategoriesIcons[data.category]}
          </span>

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {data.category}
          </span>
        </div>
      </div>
    </div>
  );
}
