import { HiDocumentDownload } from 'react-icons/hi';
import config from '@/config';


export default function Emoji({ data, avatar_base64 }) {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    style: 'decimal'
  });

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: '24px' }}>
        {data.is_pack === false ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.getEmojiURL(data.id)}
              alt={`${data.name} emoji`}
              style={{ borderRadius: '50%', height: '64px', marginRight: '24px', marginTop: '24px', width: '64px' }}
            />

            <h1 style={{ fontSize: '64px', fontWeight: 700 }}>
              {data.name}
            </h1>
          </>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '200px',
                width: '100%'
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
                      backgroundColor: 'rgba(30, 30, 36)',
                      borderRadius: '8px',
                      height: '64px',
                      objectFit: 'contain',
                      width: '64px'
                    }}
                  />
                ))}

                {Array.from({ length: 9 - data.emoji_ids.length }).fill(0).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'rgba(37, 37, 45)',
                      borderRadius: '0.25rem',
                      height: '64px',
                      padding: '0.5rem',
                      width: '64px'
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
          alignItems: 'center',
          display: 'flex',
          gap: '8px',
          marginTop: '24px'
        }}
      >
        {data.is_pack === true && (
          <span
            style={{
              color: 'rgba(255, 255, 255)',
              fontSize: '24px',
              fontWeight: 700
            }}
          >
            {data.name}
          </span>
        )}

        by

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar_base64 ? `data:image/png;base64,${avatar_base64}` : `http://127.0.0.1:${process.env.NEXT_PUBLIC_PORT}/default-discord-avatar.png`}
          alt={`${data.username}'s avatar`}
          style={{ borderRadius: '50%', height: '32px', width: '32px' }}
        />

        <span
          style={{
            color: 'rgba(153, 153, 153)',
            fontSize: '24px',
            fontWeight: 500
          }}
        >
          {data.username}
        </span>
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
          <HiDocumentDownload size={32} color='#c7c7c7' />

          <span style={{ fontSize: '32px', fontWeight: 500 }}>
            {formatter.format(data.downloads)}
          </span>
        </div>

        <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
          <span style={{ color: '#c7c7c7', fontSize: '32px' }}>
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