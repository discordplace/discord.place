/* eslint no-unreachable: 0 */

import { ImageResponse } from '@vercel/og';
import fs from 'node:fs';
import { NextResponse } from 'next/server';
import fuc from '@/lib/fuc';
import { FaCompass, FaUserCircle } from 'react-icons/fa';
import getImageBuffer from '@/lib/getImageBuffer';
import Profile from '@/app/api/og/content/Profile';
import Server from '@/app/api/og/content/Server';
import Bot from '@/app/api/og/content/Bot';
import Emoji from '@/app/api/og/content/Emoji';
import Template from '@/app/api/og/content/Template';
import Sound from '@/app/api/og/content/Sound';
import Blog from '@/app/api/og/content/Blog';
import { RiRobot2Fill } from 'react-icons/ri';
import { MdEmojiEmotions } from 'react-icons/md';
import { HiNewspaper, HiTemplate } from 'react-icons/hi';
import { PiWaveformBold } from 'react-icons/pi';

function getFontData(fontName) {
  const file = fs.readFileSync(`${process.cwd()}/public/fonts/${fontName}.ttf`);
  return file.buffer;
}

function sendError(message, status) {
  return NextResponse.json({ success: false, error: message, status }, { status });
}

export async function GET(request) {
  const url = new URL(request.url);
  let data = url.searchParams.get('data');
  
  try {
    data = JSON.parse(decodeURIComponent(data));
  } catch (error) {
    return sendError('Data query parameter must be a valid JSON string.', 400);
  }

  const icons = {
    'profile': FaUserCircle,
    'server': FaCompass,
    'bot': RiRobot2Fill,
    'emoji': MdEmojiEmotions,
    'template': HiTemplate,
    'sound': PiWaveformBold,
    'blog': HiNewspaper
  };

  if (!data.type || !icons[data.type]) return sendError('Invalid type.', 400);

  const fonts = [
    {
      name: 'Geist',
      data: getFontData('Geist-Bold'),
      style: 'normal',
      weight: 700
    },
    {
      name: 'Geist',
      data: getFontData('Geist-SemiBold'),
      style: 'normal',
      weight: 600
    },
    {
      name: 'Geist',
      data:  getFontData('Geist-Medium'),
      style: 'normal',
      weight: 500
    }
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: 'rgba(16, 16, 19)',
          color: 'white',
          fontWeight: '500',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            height: '100%',
            width: '100%',
            backgroundImage: 'linear-gradient(to right, rgba(23, 23, 28) 1px, transparent 1px), linear-gradient(to bottom, rgba(23, 23, 28) 1px, transparent 1px)',
            backgroundSize: '100px 127.5px'
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {data.type === 'profile' && (
            <Profile
              data={data.metadata}
              avatar_base64={(await getImageBuffer(data.metadata.avatar_url)).toString('base64')}
            />
          )}

          {data.type === 'server' && (
            <Server
              data={data.metadata}
              icon_base64={(await getImageBuffer(data.metadata.icon_url)).toString('base64')}
            />
          )}

          {data.type === 'bot' && (
            <Bot
              data={data.metadata}
              avatar_base64={(await getImageBuffer(data.metadata.avatar_url)).toString('base64')}
            />
          )}

          {data.type === 'emoji' && (
            <Emoji
              data={data.metadata}
              avatar_base64={(await getImageBuffer(data.metadata.avatar_url)).toString('base64')}
            />
          )}

          {data.type === 'template' && (
            <Template
              data={data.metadata}
              avatar_base64={(await getImageBuffer(data.metadata.avatar_url)).toString('base64')}
            />
          )}

          {data.type === 'sound' && (
            <Sound
              data={data.metadata}
              avatar_base64={(await getImageBuffer(data.metadata.avatar_url)).toString('base64')}
            />
          )}

          {data.type === 'blog' && (
            <Blog data={data.metadata} />
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '120px',
            backgroundColor: 'rgba(23, 23, 28)',
            display: 'flex',
            alignItems: 'center',
            gap: '28px'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='http://127.0.0.1:3000/symbol_white.png'
            style={{ width: '56px', height: '56px', marginLeft: '20px' }}
            alt="discord.place Logo"
          />

          <h1 style={{ fontSize: '32px', fontWeight: 700 }}>discord.place</h1>

          <div 
            style={{
              display: 'block',
              width: '4px',
              height: '40%',
              backgroundColor: 'rgba(37, 37, 45)',
              transform: 'rotate(20deg)',
              borderRadius: '10px'
            }}
          />

          <span
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'rgba(204, 204, 204)',
              display: 'flex',
              alignItems: 'center',
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
      width: 1200,
      height: 630,
      fonts
    }
  );
}