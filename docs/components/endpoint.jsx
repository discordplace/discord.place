'use client';

import CodeBlock from '@/components/code-block';
import { useGeneralStore } from '@/stores/general';
import cn from '@/utils/cn';
import { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { BiCodeCurly } from 'react-icons/bi';
import { FiChevronDown } from 'react-icons/fi';

const endpoints = [
  {
    body: {
      command_count: 'number',
      server_count: 'number'
    },
    body_information: 'Note that, even though you set the server count, this value can only be at most 50 more or less than the actual server count of your bot.',
    description: 'Using this endpoint, you can update the command & server value that appear on the bot page. We recommend you to do this every 24 hours and keep the page updated with this endpoint.',
    endpoint: 'api.discord.place/bots/{id}/stats',
    headers: [
      {
        description: 'Your bot token that you can get from the dashboard.',
        key: 'Authorization',
        type: 'string'
      },
      {
        description: 'application/json',
        key: 'Content-Type',
        type: 'string'
      }
    ],
    id: 'update-bot-stats',
    method: 'PATCH',
    name: 'Update Bot Stats',
    params: [
      {
        description: 'Bot ID that you want to update the stats.',
        key: 'id',
        type: 'string'
      }
    ],
    responses: [
      {
        body: {
          success: true
        },
        code: 200,
        description: 'Successfully updated the bot stats.',
        name: 'OK'
      },
      {
        body: {
          error: 'string',
          status: 400,
          success: false
        },
        code: 400,
        description: 'Invalid request body.',
        name: 'Bad Request'
      },
      {
        body: {
          error: 'string',
          status: 401,
          success: false
        },
        code: 401,
        description: 'Unauthorized request.',
        name: 'Unauthorized'
      },
      {
        body: {
          error: 'string',
          status: 404,
          success: false
        },
        code: 404,
        description: 'Bot not found.',
        name: 'Not Found'
      }
    ]
  },
  {
    description: 'Using this endpoint, check if user has voted for your bot in the last 24 hours.',
    endpoint: 'api.discord.place/bots/{id}/voters/{user_id}',
    headers: [
      {
        description: 'Your bot token that you can get from the dashboard.',
        key: 'Authorization',
        type: 'string'
      },
      {
        description: 'application/json',
        key: 'Content-Type',
        type: 'string'
      }
    ],
    id: 'fetch-vote-status',
    method: 'GET',
    name: 'Fetch Vote Status',
    params: [
      {
        description: 'Bot ID that you want to check the vote status.',
        key: 'id',
        type: 'string'
      },
      {
        description: 'User ID that you want to check the vote status.',
        key: 'user_id',
        type: 'string'
      }
    ],
    responses: [
      {
        body: {
          lastVote: 1729462649777,
          vote: 'number',
          voted: true
        },
        code: 200,
        description: 'Successfully fetched the vote status. If the user has voted in the last 24 hours, the lastVote field will be the timestamp of the last vote. Otherwise, it will be null.',
        name: 'OK'
      },
      {
        body: {
          error: 'string',
          status: 401,
          success: false
        },
        code: 401,
        description: 'Unauthorized request.',
        name: 'Unauthorized'
      },
      {
        body: {
          error: 'string',
          status: 404,
          success: false
        },
        code: 404,
        description: 'Bot not found.',
        name: 'Not Found'
      }
    ]
  }
];

export default function Endpoint({ id }) {
  const activeEndpoint = useGeneralStore(state => state.activeEndpoint);
  const setActiveEndpoint = useGeneralStore(state => state.setActiveEndpoint);

  const data = endpoints.find(endpoint => endpoint.id === id);
  const [activeResponseTab, setActiveResponseTab] = useState(data?.responses?.[0].code || null);

  if (!data) return null;

  return (
    <>
      <div
        className={cn(
          'flex flex-col p-2 mb-1 border rounded-full cursor-pointer border-primary bg-secondary hover:bg-tertiary',
          activeEndpoint === id && 'bg-tertiary cursor-default'
        )}
        onClick={() => setActiveEndpoint(id)}
      >
        <h2
          className='hidden'
          data-name={data.name}
          id={`endpoint-${data.id}`}
        >
          {data.id}
        </h2>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-2'>
            <span
              className={cn(
                'select-none px-2 py-0.5 text-xs font-bold rounded-full',
                data.method === 'GET' && 'bg-green-500 text-white',
                data.method === 'PATCH' && 'bg-blue-500 text-white'
              )}
            >
              {data.method}
            </span>

            <span className='select-none text-sm font-medium'>
              {data.name}
            </span>
          </div>

          <FiChevronDown
            className={cn(
              'text-primary transition-transform',
              activeEndpoint === id && 'transform rotate-180'
            )}
            size={16}
          />
        </div>
      </div>

      <AnimateHeight
        animateOpacity={true}
        duration={500}
        height={activeEndpoint === id ? 'auto' : 0}
      >
        <div className='not-prose pb-4 pt-0.5'>
          <div className='flex flex-col gap-y-2 rounded-3xl bg-secondary p-4'>
            <div
              className='text-xs text-tertiary'
              dangerouslySetInnerHTML={{
                __html: data.endpoint
                  .replace(/\{([^}]+)\}/g, '<span class="text-primary">{$1}</span>')
              }}
            />

            <p className='text-xs text-secondary'>
              {data.description}
            </p>

            <div className='mt-2 flex flex-col gap-y-2'>
              <h2 className='text-xs font-semibold text-primary'>
                Parameters
              </h2>

              {data.params.map(param => (
                <div className='flex gap-2' key={param.key}>
                  <div className='text-xs text-primary'>
                    {param.key}

                    <span className='text-tertiary'>: {param.type}</span>
                  </div>

                  <p className='text-xs text-secondary'>{param.description}</p>
                </div>
              ))}
            </div>

            <div className='mt-2 flex flex-col gap-y-2'>
              <h2 className='text-xs font-semibold text-primary'>
                Headers
              </h2>

              {data.headers.map(header => (
                <div className='flex flex-wrap gap-2' key={header.key}>
                  <div className='text-xs text-primary'>
                    {header.key}

                    <span className='text-tertiary'>: {header.type}</span>
                  </div>

                  <p className='text-xs text-secondary'>{header.description}</p>
                </div>
              ))}
            </div>

            {data.body && (
              <div className='mt-2 flex flex-col gap-y-2'>
                <h2 className='text-xs font-semibold text-primary'>
                  Body Parameters
                </h2>

                <p className='text-xs text-secondary'>
                  The body parameters that you need to send with the request.
                </p>

                {Object.entries(data.body).map(([key, value]) => (
                  <div className='flex gap-2' key={key}>
                    <div className='text-xs text-primary'>
                      {key}

                      <span className='text-tertiary'>: {value}</span>
                    </div>
                  </div>
                ))}

                {data.body_information && (
                  <p className='text-xs text-tertiary'>
                    {data.body_information}
                  </p>
                )}
              </div>
            )}

            <div className='mt-2 flex flex-col gap-y-2'>
              <h2 className='text-xs font-semibold text-primary'>
                Responses
              </h2>

              <p className='text-xs text-secondary'>
                The responses that you can get from the endpoint.
              </p>

              <div className='mt-2 flex flex-col gap-2 sm:flex-row'>
                {data.responses.map(response => (
                  <div
                    className={cn(
                      'text-xs w-full font-semibold text-center py-2 rounded-2xl border border-primary select-none',
                      activeResponseTab === response.code ? 'bg-quaternary border-[rgba(var(--bg-quaternary))] text-primary' : 'text-tertiary hover:text-secondary cursor-pointer hover:bg-tertiary'
                    )}
                    key={response.code}
                    onClick={() => setActiveResponseTab(response.code)}
                  >
                    {response.code} {response.name}
                  </div>
                ))}
              </div>

              {activeResponseTab && (
                <CodeBlock
                  dimmed={true}
                  FileIcon={<BiCodeCurly />}
                  fileName='response.json'
                  language='json'
                >
                  {JSON.stringify(data.responses.find(response => response.code === activeResponseTab).body, null, 2)}
                </CodeBlock>

              // <SyntaxHighlighter
              //   className='max-w-[calc(100vw_-_4rem)] w-full !p-3 mt-2 !bg-[rgba(var(--dark-bg-quaternary))] !rounded-2xl [&>code]:!bg-[unset]'
              //   PreTag={'div'}
              //   // eslint-disable-next-line react/no-children-prop
              //   children={JSON.stringify(data.responses.find(response => response.code === activeResponseTab).body, null, 2)}
              //   language={'json'}
              //   style={oneDark}
              //   wrapLongLines={false}
              // />
              )}
            </div>
          </div>
        </div>
      </AnimateHeight>
    </>
  );
}