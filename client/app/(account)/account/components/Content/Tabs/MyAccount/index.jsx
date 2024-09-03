'use client';

import useAuthStore from '@/stores/auth';
import Link from 'next/link';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { GoHeartFill } from 'react-icons/go';
import { useEffect, useState } from 'react';
import getPlans from '@/lib/request/payments/getPlans';
import { toast } from 'sonner';
import { TbLoader } from 'react-icons/tb';
import useModalsStore from '@/stores/modals';
import CreateProfile from '@/app/(account)/account/components/Content/Tabs/MyAccount/CreateProfile';
import createProfile from '@/lib/request/profiles/createProfile';
import { useShallow } from 'zustand/react/shallow';
import useGeneralStore from '@/stores/general';
import { useRouter } from 'next-nprogress-bar';
import useLanguageStore, { t } from '@/stores/language';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

export default function MyAccount() {
  const user = useAuthStore(state => state.user);
  const language = useLanguageStore(state => state.language);
  const router = useRouter();

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
    
  const { openModal, disableButton, enableButton, closeModal, updateModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal,
    updateModal: state.updateModal
  })));

  useEffect(() => {
    setPlansLoading(true);

    getPlans()
      .then(data => setPlans(data))
      .catch(toast.error)
      .finally(() => setPlansLoading(false));
  }, []);

  const { slug, preferredHost } = useGeneralStore(useShallow(state => ({
    slug: state.createProfileModal.slug,
    preferredHost: state.createProfileModal.preferredHost
  })));

  function continueCreateProfile(slug, preferredHost) {
    disableButton('create-profile', 'create'); 
  
    toast.promise(createProfile(slug, preferredHost), {
      loading: t('accountPage.tabs.myAccount.toast.creatingProfile'),
      success: () => {
        closeModal('create-profile');
        router.push(`/profile/${slug}`);

        return t('accountPage.tabs.myAccount.toast.profileCreated');
      },
      error: error => {
        enableButton('create-profile', 'create');
        
        return error;
      }
    });
  }

  useEffect(() => {
    updateModal('create-profile', {
      buttons: [
        {
          id: 'cancel',
          label: t('buttons.cancel'),
          variant: 'ghost',
          actionType: 'close'
        },
        {
          id: 'create',
          label: t('buttons.create'),
          variant: 'solid',
          action: () => {
            const newSlug = useGeneralStore.getState().createProfileModal.slug;
            const newPreferredHost = useGeneralStore.getState().createProfileModal.preferredHost;

            continueCreateProfile(newSlug, newPreferredHost);
          }
        }
      ]
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, preferredHost]);

  return (
    <div className='flex flex-col px-6 mt-16 mb-8 lg:px-16 gap-y-6'>      
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          {t('accountPage.tabs.myAccount.title')}
        </h1>

        <p className='text-sm text-secondary'>
          {t('accountPage.tabs.myAccount.subtitle')}
        </p>
      </div>

      <div className='flex flex-col mt-8 gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          {t('accountPage.tabs.myAccount.sections.connectedAccount.title')}
        </h2>

        <p className='text-sm text-tertiary'>
          {t('accountPage.tabs.myAccount.sections.connectedAccount.subtitle')}
        </p>

        <div className='flex max-w-[500px] flex-col w-full p-2 mt-2 h-max rounded-3xl bg-secondary'>
          {user?.banner ? (
            <UserBanner
              id={user.id}
              hash={user.banner}
              size={512}
              width={500}
              height={150}
              className='w-full h-[150px] rounded-2xl object-cover'
            />
          ) : (
            <div className='w-full h-[150px] rounded-2xl bg-quaternary' />
          )}

          <UserAvatar
            id={user.id}
            hash={user.avatar}
            size={96}
            width={80}
            height={80}
            className='relative z-[1] -mb-20 border-8 border-[rgba(var(--bg-secondary))] rounded-full bottom-10 left-4'
          />

          <div className='mt-2 ml-28'>
            <div className='flex flex-col'>
              <h3 className='text-lg font-bold text-primary'>{user?.global_name}</h3>
              <p className='text-sm font-medium text-tertiary'>@{user?.username}</p>
            </div>
          </div>

          <div className='mx-auto flex flex-col w-[98%] p-4 mb-1.5 mt-4 bg-tertiary h-max rounded-2xl gap-y-4'>
            <div className='flex flex-col'>
              <h3 className='text-sm font-bold text-primary'>
                {t('accountPage.tabs.myAccount.sections.connectedAccount.fields.displayName')}
              </h3>

              <p className='text-sm font-medium text-tertiary'>{user?.global_name}</p>
            </div>

            <div className='flex flex-col'>
              <h3 className='text-sm font-bold text-primary'>
                {t('accountPage.tabs.myAccount.sections.connectedAccount.fields.username')}
              </h3>

              <p className='text-sm font-medium text-tertiary'>@{user?.username}</p>
            </div>

            <div className='flex flex-col'>
              <h3 className='text-sm font-bold text-primary'>
                {t('accountPage.tabs.myAccount.sections.connectedAccount.fields.userId')}
              </h3>

              <p className='text-sm font-medium text-tertiary'>{user?.id}</p>
            </div>
          </div>
        </div>
        
        {user?.premium?.createdAt && (
          <div className='flex flex-col mt-8 gap-y-2'>
            <div className='border-2 border-purple-500 p-2.5 max-w-[500px] rounded-xl relative'>
              <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/25 via-purple-500/10 rounded-xl'></div>
            
              <div className='flex items-center gap-x-4'>
                <GoHeartFill className='text-xl' />

                <div className='flex flex-col'>
                  <h2 className='flex flex-wrap items-center font-semibold gap-x-2'>
                    {plansLoading ? (
                      <>
                        <TbLoader className='animate-spin' />
                        {t('accountPage.tabs.myAccount.sections.premium.plansLoading')}
                      </>
                    ) : (
                      t(`accountPage.tabs.myAccount.sections.premium.plans.${plans.find(plan => plan.id === user.premium.planId)?.name}`)
                    )}

                    <span className='text-xs text-tertiary'>
                      {new Date(user.premium.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </h2>

                  <p className='mt-1.5 text-sm mobile:mt-0 text-tertiary'>
                    {t('accountPage.tabs.myAccount.sections.premium.thanks')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myAccount.sections.yourProfile.title')}
          </h2>

          <div className='flex flex-col text-sm text-tertiary gap-y-4'>

            {user?.profile ? (
              <>
                {t('accountPage.tabs.myAccount.sections.yourProfile.profileFound')}

                <Link
                  className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
                  href={`/profile/${user.profile.slug}`}
                >
                  {t('buttons.viewProfile')}
                  <MdOutlineOpenInNew />
                </Link>
              </>
            ) : (
              <>
                {t('accountPage.tabs.myAccount.sections.yourProfile.noProfile')}

                <button
                  className='outline-none px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
                  onClick={() => 
                    openModal('create-profile', {
                      title: 'Create Profile',
                      description: 'Create your customizable profile to show off to your friends!',
                      content: <CreateProfile />,
                      buttons: [
                        {
                          id: 'cancel',
                          label: t('buttons.cancel'),
                          variant: 'ghost',
                          actionType: 'close'
                        },
                        {
                          id: 'create',
                          label: t('buttons.create'),
                          variant: 'solid',
                          action: continueCreateProfile
                        }
                      ]
                    })
                  }
                >
                  {t('buttons.createProfile')}
                  <MdOutlineOpenInNew />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}