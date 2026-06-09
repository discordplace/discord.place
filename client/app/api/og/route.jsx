/* eslint no-unreachable: 0 */

import { FaCompass, FaUserCircle } from 'react-icons/fa';
import { HiNewspaper, HiTemplate } from 'react-icons/hi';
import { MdEmojiEmotions } from 'react-icons/md';
import { PiWaveformBold } from 'react-icons/pi';
import { RiRobot2Fill, RiBrush2Fill } from 'react-icons/ri';
import { ImageResponse } from '@vercel/og';
import fs from 'node:fs';
import { NextResponse } from 'next/server';
import fuc from '@/lib/fuc';
import getImageBuffer from '@/lib/getImageBuffer';
import Profile from '@/app/api/og/content/Profile';
import Server from '@/app/api/og/content/Server';
import Bot from '@/app/api/og/content/Bot';
import Emoji from '@/app/api/og/content/Emoji';
import Template from '@/app/api/og/content/Template';
import Sound from '@/app/api/og/content/Sound';
import Blog from '@/app/api/og/content/Blog';
import Theme from '@/app/api/og/content/Theme';

function getFontData(fontName) {
  const file = fs.readFileSync(`${process.cwd()}/public/fonts/${fontName}.ttf`);

  return file.buffer;
}

function sendError(message, status) {
  return NextResponse.json({ error: message, status, success: false }, { status });
}

export async function GET(request) {
  const url = new URL(request.url);
  let data = url.searchParams.get('data');

  try {
    data = JSON.parse(decodeURIComponent(data));
  } catch  {
    return sendError('Data query parameter must be a valid JSON string.', 400);
  }

  const icons = {
    'blog': HiNewspaper,
    'bot': RiRobot2Fill,
    'emoji': MdEmojiEmotions,
    'profile': FaUserCircle,
    'server': FaCompass,
    'sound': PiWaveformBold,
    'template': HiTemplate,
    'theme': RiBrush2Fill
  };

  if (!data.type || !icons[data.type]) return sendError('Invalid type.', 400);

  const fonts = [
    {
      data: getFontData('Geist-Bold'),
      name: 'Geist',
      style: 'normal',
      weight: 700
    },
    {
      data: getFontData('Geist-SemiBold'),
      name: 'Geist',
      style: 'normal',
      weight: 600
    },
    {
      data: getFontData('Geist-Medium'),
      name: 'Geist',
      style: 'normal',
      weight: 500
    }
  ];

  let avatarBase64 = null;

  if (data.metadata.avatar_url) {
    const imageBuffer = await getImageBuffer(data.metadata.avatar_url);
    avatarBase64 = imageBuffer?.toString?.('base64');
  }

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          backgroundColor: 'rgba(16, 16, 19)',
          color: 'white',
          display: 'flex',
          fontWeight: '500',
          height: '100%',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <div
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(23, 23, 28) 1px, transparent 1px), linear-gradient(to bottom, rgba(23, 23, 28) 1px, transparent 1px)',
            backgroundSize: '100px 127.5px',
            height: '100%',
            inset: 0,
            position: 'absolute',
            width: '100%'
          }}
        />

        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {data.type === 'profile' && (
            <Profile
              data={data.metadata}
              avatar_base64={avatarBase64}
            />
          )}

          {data.type === 'server' && (
            <Server
              data={data.metadata}
              icon_base64={avatarBase64}
            />
          )}

          {data.type === 'bot' && (
            <Bot
              data={data.metadata}
              avatar_base64={avatarBase64}
            />
          )}

          {data.type === 'emoji' && (
            <Emoji
              data={data.metadata}
              avatar_base64={avatarBase64}
            />
          )}

          {data.type === 'template' && (
            <Template
              data={data.metadata}
              avatar_base64={avatarBase64}
            />
          )}

          {data.type === 'sound' && (
            <Sound
              data={data.metadata}
              avatar_base64={avatarBase64}
            />
          )}

          {data.type === 'theme' && (
            <Theme
              data={data.metadata}
              avatar_base64={avatarBase64}
            />
          )}

          {data.type === 'blog' && (
            <Blog data={data.metadata} />
          )}
        </div>

        <div
          style={{
            alignItems: 'center',
            backgroundColor: 'rgba(23, 23, 28)',
            bottom: 0,
            display: 'flex',
            gap: '28px',
            height: '120px',
            left: 0,
            position: 'absolute',
            width: '100%'
          }}
        >
          <img
            src={`http://127.0.0.1:${process.env.NEXT_PUBLIC_PORT}/symbol_white.png`}
            style={{ height: '56px', marginLeft: '20px', width: '56px' }}
            alt='discord.place Logo'
          />

          <h1 style={{ fontSize: '32px', fontWeight: 700 }}>discord.place</h1>

          <div
            style={{
              backgroundColor: 'rgba(37, 37, 45)',
              borderRadius: '10px',
              display: 'block',
              height: '40%',
              transform: 'rotate(20deg)',
              width: '4px'
            }}
          />

          <span
            style={{
              alignItems: 'center',
              color: 'rgba(204, 204, 204)',
              display: 'flex',
              fontSize: '20px',
              fontWeight: 600,
              gap: '12px'
            }}
          >
            {icons[data.type]({ size: 32 })}

            {fuc(data.type)}s
          </span>
        </div>
      </div>
    ),
    {
      fonts,
      height: 630,
      width: 1200
    }
  );
}