'use client';

import config from '@/config';
import cn from '@/lib/cn';
import createQuarantine from '@/lib/request/dashboard/createQuarantine';
import useDashboardStore from '@/stores/dashboard';
import useGeneralStore from '@/stores/general';
import useModalsStore from '@/stores/modals';
import { useEffect } from 'react';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { RiUser3Fill } from 'react-icons/ri';
import { RiCommunityFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function CreateQuarantineModal() {
  const { reason, restriction, setReason, setRestriction, setStep, setTime, setType, setValue, step, time, type, value } = useGeneralStore(useShallow(state => ({
    reason: state.createQuarantineModal.reason,
    restriction: state.createQuarantineModal.restriction,
    setReason: state.createQuarantineModal.setReason,
    setRestriction: state.createQuarantineModal.setRestriction,
    setStep: state.createQuarantineModal.setStep,
    setTime: state.createQuarantineModal.setTime,
    setType: state.createQuarantineModal.setType,
    setValue: state.createQuarantineModal.setValue,
    step: state.createQuarantineModal.step,
    time: state.createQuarantineModal.time,
    type: state.createQuarantineModal.type,
    value: state.createQuarantineModal.value
  })));

  const fetchData = useDashboardStore(state => state.fetchData);

  const { closeModal, disableButton, enableButton, updateModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    updateModal: state.updateModal
  })));

  useEffect(() => {
    setRestriction(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  function continueCreateQuarantine(type, value, restriction, reason, time) {
    try {
      disableButton('create-quarantine-record', 'confirm');

      toast.promise(createQuarantine({ reason, restriction, time, type, value }), {
        error: error => {
          enableButton('create-quarantine-record', 'confirm');

          return error;
        },
        loading: 'Creating quarantine...',
        success: () => {
          closeModal('create-quarantine-record');
          fetchData(['quarantines']);

          setStep(0);
          setType(null);
          setValue('');
          setRestriction(null);
          setReason('');
          setTime('');

          return 'Created quarantine successfully.';
        }
      });
    } catch (error) {
      return toast.error(error.message);
    }
  }

  useEffect(() => {
    if (step == 1) {
      updateModal('create-quarantine-record', {
        buttons: [
          {
            action: () => setStep(0),
            id: 'previous',
            label: 'Previous',
            variant: 'ghost'
          },
          {
            action: () => continueCreateQuarantine(type, value, restriction, reason, time),
            id: 'confirm',
            label: 'Confirm',
            variant: 'solid'
          }
        ]
      });
    }

    if (step == 0) {
      updateModal('create-quarantine-record', {
        buttons: [
          {
            actionType: 'close',
            id: 'cancel',
            label: 'Cancel',
            variant: 'ghost'
          },
          {
            action: () => {
              if (!type) return toast.error('You must select a quarantine type.');
              if (!value) return toast.error('You must enter a value.');
              if (!restriction) return toast.error('You must select a restriction.');

              setStep(1);
            },
            id: 'next',
            label: 'Next',
            variant: 'solid'
          }
        ]
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, type, value, restriction, reason, time]);

  return (
    <div className='flex flex-col gap-y-4'>
      {step === 0 && (
        <>
          <div className='flex flex-col'>
            <h2 className='text-sm font-semibold text-secondary'>Quarantine Type</h2>
            <p className='text-xs text-tertiary'>Select the type of quarantine you want to create.</p>

            <div className='mt-4 flex w-full gap-4'>
              <div
                className={cn(
                  'relative flex flex-1 transition-all select-none font-bold text-lg gap-x-2 items-center justify-center w-full h-[80px] rounded-xl cursor-pointer bg-secondary hover:bg-background',
                  type === 'USER_ID' && 'pointer-events-none'
                )}
                onClick={() => setType('USER_ID')}
              >
                <RiUser3Fill />
                User ID

                {type === 'USER_ID' && (
                  <div className='absolute left-0 top-0 flex size-full items-center justify-center rounded-xl bg-secondary/80 text-2xl'>
                    <IoMdCheckmarkCircle className='text-primary' />
                  </div>
                )}
              </div>

              <div
                className={cn(
                  'relative flex flex-1 transition-all select-none font-bold text-lg gap-x-2 items-center justify-center w-full h-[80px] rounded-xl cursor-pointer bg-secondary hover:bg-background',
                  type === 'GUILD_ID' && 'pointer-events-none'
                )}
                onClick={() => setType('GUILD_ID')}
              >
                <RiCommunityFill />
                Guild ID

                {type === 'GUILD_ID' && (
                  <div className='absolute left-0 top-0 flex size-full items-center justify-center rounded-xl bg-secondary/80 text-2xl'>
                    <IoMdCheckmarkCircle className='text-primary' />
                  </div>
                )}
              </div>
            </div>
          </div>

          {(type === 'GUILD_ID' || type === 'USER_ID') && (
            <>
              <div className='flex flex-col'>
                <h2 className='text-sm font-semibold text-secondary'>{type === 'USER_ID' ? 'User ID' : 'Guild ID'}</h2>
                <p className='text-xs text-tertiary'>Enter the ID of the {type === 'USER_ID' ? 'user' : 'guild'} you want to quarantine.</p>

                <input
                  className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
                  onChange={event => setValue(event.target.value)}
                  placeholder={`${type === 'USER_ID' ? 'User' : 'Guild'} ID`}
                  type='text'
                  value={value}
                />
              </div>

              <div className='flex flex-col'>
                <h2 className='text-sm font-semibold text-secondary'>Restriction</h2>
                <p className='text-xs text-tertiary'>Select the type of restriction you want to apply to the quarantine.</p>

                <div className='scrollbar-hide relative mt-4 grid max-h-[20svh] grid-cols-1 gap-2 overflow-y-auto'>
                  {Object.keys(config.quarantineRestrictions)
                    .filter(quarantineRestriction => !type || config.quarantineRestrictions[quarantineRestriction].available_to.includes(type))
                    .map(quarantineRestriction => (
                      <div
                        className={cn(
                          'relative flex transition-all select-none font-bold text-xs gap-x-2 items-center justify-center w-full h-[80px] rounded-xl cursor-pointer bg-secondary hover:bg-background',
                          restriction === quarantineRestriction && 'pointer-events-none'
                        )}
                        key={quarantineRestriction}
                        onClick={() => setRestriction(quarantineRestriction)}
                      >
                        <div className='flex flex-col items-center gap-y-2'>
                          {quarantineRestriction}

                          <p className='text-xs text-tertiary'>
                            {config.quarantineRestrictions[quarantineRestriction].description}
                          </p>
                        </div>

                        {restriction === quarantineRestriction && (
                          <div className='absolute left-0 top-0 flex size-full items-center justify-center rounded-xl bg-secondary/80 text-2xl'>
                            <IoMdCheckmarkCircle className='text-primary' />
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>
            </>
          )}
        </>
      )}

      {step === 1 && (
        <>
          <div className='flex flex-col'>
            <h2 className='text-sm font-semibold text-secondary'>Reason</h2>
            <p className='text-xs text-tertiary'>Reason for quarantining the {type === 'USER_ID' ? 'user' : 'guild'}.</p>

            <input
              className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
              onChange={event => setReason(event.target.value)}
              placeholder='Reason'
              type='text'
              value={reason}
            />
          </div>

          <div className='flex flex-col'>
            <h2 className='text-sm font-semibold text-secondary'>Time</h2>
            <p className='text-xs text-tertiary'>Expiration time for the quarantine. (Optional, 20m, 6h, 3d, 1w, 30d, 1y)</p>

            <input
              className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
              onChange={event => setTime(event.target.value)}
              placeholder='Time'
              type='text'
              value={time}
            />
          </div>
        </>
      )}
    </div>
  );
}