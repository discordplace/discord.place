'use client';

import config from '@/config';
import cn from '@/lib/cn';
import { useEffect } from 'react';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { RiUser3Fill } from 'react-icons/ri';
import { RiCommunityFill } from 'react-icons/ri';
import useModalsStore from '@/stores/modals';
import useGeneralStore from '@/stores/general';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import createQuarantine from '@/lib/request/dashboard/createQuarantine';
import useDashboardStore from '@/stores/dashboard';

export default function CreateQuarantineModal() {
  const { step, setStep, type, setType, value, setValue, restriction, setRestriction, reason, setReason, time, setTime } = useGeneralStore(useShallow(state => ({
    step: state.createQuarantineModal.step,
    setStep: state.createQuarantineModal.setStep,
    type: state.createQuarantineModal.type,
    setType: state.createQuarantineModal.setType,
    value: state.createQuarantineModal.value,
    setValue: state.createQuarantineModal.setValue,
    restriction: state.createQuarantineModal.restriction,
    setRestriction: state.createQuarantineModal.setRestriction,
    reason: state.createQuarantineModal.reason,
    setReason: state.createQuarantineModal.setReason,
    time: state.createQuarantineModal.time,
    setTime: state.createQuarantineModal.setTime
  })));

  const fetchData = useDashboardStore(state => state.fetchData);

  const { disableButton, enableButton, closeModal, updateModal } = useModalsStore(useShallow(state => ({
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal,
    updateModal: state.updateModal
  })));

  useEffect(() => {
    setRestriction(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  function continueCreateQuarantine(type, value, restriction, reason, time) {
    try {
      disableButton('create-quarantine-record', 'confirm');

      toast.promise(createQuarantine({ type, value, restriction, reason, time }), {
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
        },
        error: error => {
          enableButton('create-quarantine-record', 'confirm');

          return error;
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
            id: 'previous',
            label: 'Previous',
            variant: 'ghost',
            action: () => setStep(0)
          },
          {
            id: 'confirm',
            label: 'Confirm',
            variant: 'solid',
            action: () => continueCreateQuarantine(type, value, restriction, reason, time)
          }
        ]
      });
    }

    if (step == 0) {
      updateModal('create-quarantine-record', {
        buttons: [
          {
            id: 'cancel',
            label: 'Cancel',
            variant: 'ghost',
            actionType: 'close'
          },
          {
            id: 'next',
            label: 'Next',
            variant: 'solid',
            action: () => {
              if (!type) return toast.error('You must select a quarantine type.');
              if (!value) return toast.error('You must enter a value.');
              if (!restriction) return toast.error('You must select a restriction.');

              setStep(1);
            }
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
                  type='text'
                  placeholder={`${type === 'USER_ID' ? 'User' : 'Guild'} ID`}
                  className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
                  value={value}
                  onChange={event => setValue(event.target.value)}
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
                        key={quarantineRestriction}
                        className={cn(
                          'relative flex transition-all select-none font-bold text-xs gap-x-2 items-center justify-center w-full h-[80px] rounded-xl cursor-pointer bg-secondary hover:bg-background',
                          restriction === quarantineRestriction && 'pointer-events-none'
                        )}
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
              type='text'
              placeholder='Reason'
              className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
              value={reason}
              onChange={event => setReason(event.target.value)}
            />
          </div>

          <div className='flex flex-col'>
            <h2 className='text-sm font-semibold text-secondary'>Time</h2>
            <p className='text-xs text-tertiary'>Expiration time for the quarantine. (Optional, 20m, 6h, 3d, 1w, 30d, 1y)</p>

            <input
              type='text'
              placeholder='Time'
              className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
              value={time}
              onChange={event => setTime(event.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
}