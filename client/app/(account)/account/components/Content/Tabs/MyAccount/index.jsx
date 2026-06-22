'use client';

import { GoHeartFill } from 'react-icons/go';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { TbLoader } from 'react-icons/tb';
import useAuthStore from '@/stores/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import getPlans from '@/lib/request/payments/getPlansFromClient';
import { toast } from 'sonner';
import useModalsStore from '@/stores/modals';
import CreateProfile from '@/app/(account)/account/components/Content/Tabs/MyAccount/CreateProfile';
import createProfile from '@/lib/request/profiles/createProfile';
import { useShallow } from 'zustand/react/shallow';
import useGeneralStore from '@/stores/general';
import { useRouter } from 'next-nprogress-bar';
import { useTranslation } from 'react-i18next';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import { useMedia } from 'react-use';

export default function MyAccount() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const { openModal, disableButton, enableButton, closeModal, updateModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal,
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
    preferredHost: state.createProfileModal.preferredHost,
    slug: state.createProfileModal.slug
  })));

  function continueCreateProfile(slug, preferredHost) {
    disableButton('create-profile', 'create');

    toast.promise(createProfile(slug, preferredHost), {
      error: error => {
        enableButton('create-profile', 'create');

        return error;
      },
      loading: t('accountPage.tabs.myAccount.toast.creatingProfile'),
      success: () => {
        closeModal('create-profile');
        router.push(`/profile/${slug}`);

        return t('accountPage.tabs.myAccount.toast.profileCreated');
      }
    });
  }

  useEffect(() => {
    updateModal('create-profile', {
      buttons: [
        {
          actionType: 'close',
          id: 'cancel',
          label: t('buttons.cancel'),
          variant: 'ghost'
        },
        {
          action: () => {
            const newSlug = useGeneralStore.getState().createProfileModal.slug;
            const newPreferredHost = useGeneralStore.getState().createProfileModal.preferredHost;

            continueCreateProfile(newSlug, newPreferredHost);
          },
          id: 'create',
          label: t('buttons.create'),
          variant: 'solid'
        }
      ]
    });
  }, [slug, preferredHost]);

  const currentPlan = plans.find(plan => plan.id === user?.premium?.planId);

  const isMobile = useMedia('(max-width: 640px)');

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          {t('accountPage.tabs.myAccount.title')}
        </h1>

        <p className='text-sm text-secondary'>
          {t('accountPage.tabs.myAccount.subtitle')}
        </p>
      </div>

      <div className='mt-8 flex flex-col gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          {t('accountPage.tabs.myAccount.sections.connectedAccount.title')}
        </h2>

        <p className='text-sm text-tertiary'>
          {t('accountPage.tabs.myAccount.sections.connectedAccount.subtitle')}
        </p>

        <div className='mt-2 flex h-max w-full max-w-[500px] flex-col rounded-3xl bg-secondary p-2'>
          {user?.banner ? (
            <UserBanner
              id={user.id}
              hash={user.banner}
              size={512}
              width={500}
              height={150}
              className='h-[100px] w-full rounded-2xl object-cover mobile:h-[150px]'
            />
          ) : (
            <div className='h-[100px] w-full rounded-2xl bg-quaternary mobile:h-[150px]' />
          )}

          <UserAvatar
            id={user.id}
            hash={user.avatar}
            size={96}
            width={80}
            height={80}
            className='relative bottom-10 left-4 z-1 -mb-20 rounded-full border-8 border-[rgba(var(--bg-secondary))]'
          />

          <div className='mt-2 ml-28'>
            <div className='flex flex-col'>
              <h3 className='text-lg font-bold text-primary'>{user?.global_name || user?.username}</h3>
              <p className='text-sm font-medium text-tertiary'>@{user?.username}</p>
            </div>
          </div>

          <div className='mx-auto mt-4 mb-1.5 flex h-max w-[98%] flex-col gap-y-4 rounded-2xl bg-tertiary p-4'>
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
          <div className='mt-8 flex flex-col gap-y-2'>
            {isMobile ? (
              <>
                <h2 className='text-sm font-bold text-secondary'>
                  {t('accountPage.tabs.myAccount.sections.premium.title')}
                </h2>

                <p className='text-sm text-tertiary'>
                  {t('accountPage.tabs.myAccount.sections.premium.subtitle')}
                </p>

                <div className='flex flex-wrap items-center gap-2 select-none'>
                  <span className='bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-sm font-semibold text-transparent'>
                    {plansLoading ? (
                      <>
                        <TbLoader className='animate-spin' />
                        {t('accountPage.tabs.myAccount.sections.premium.plansLoading')}
                      </>
                    ) : (
                      currentPlan ? (
                        t(`accountPage.tabs.myAccount.sections.premium.plans.${currentPlan?.name}`)
                      ) : (
                        t('accountPage.tabs.myAccount.sections.premium.plans.custom', { date: new Date(user.premium.expiresAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }) })
                      )
                    )}
                  </span>

                  <p className='text-xs text-tertiary'>
                    {new Date(user.premium.createdAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </>
            ) : (
              <div className='relative max-w-[500px] rounded-xl border-2 border-purple-500 p-2.5'>
                <div className='absolute top-0 left-0 size-full rounded-xl bg-linear-to-r from-purple-500/25 via-purple-500/10'></div>

                <div className='flex items-center gap-x-4'>
                  <GoHeartFill className='min-h-[20px] min-w-[20px]' />

                  <div className='flex flex-col'>
                    <h2 className='flex flex-wrap items-center gap-x-2 font-semibold'>
                      {plansLoading ? (
                        <>
                          <TbLoader className='animate-spin' />
                          {t('accountPage.tabs.myAccount.sections.premium.plansLoading')}
                        </>
                      ) : (
                        currentPlan ? (
                          t(`accountPage.tabs.myAccount.sections.premium.plans.${currentPlan?.name}`)
                        ) : (
                          t('accountPage.tabs.myAccount.sections.premium.plans.custom', { date: new Date(user.premium.expiresAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }) })
                        )
                      )}

                      <span className='text-xs text-tertiary'>
                        {new Date(user.premium.createdAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </h2>

                    <p className='mt-1.5 text-sm text-tertiary mobile:mt-0'>
                      {t('accountPage.tabs.myAccount.sections.premium.thanks')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className='mt-8 flex flex-col gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myAccount.sections.yourProfile.title')}
          </h2>

          <div className='flex flex-col gap-y-4 text-sm text-tertiary'>

            {user?.profile ? (
              <>
                {t('accountPage.tabs.myAccount.sections.yourProfile.profileFound')}

                <Link
                  className='flex w-max items-center gap-x-1 rounded-xl bg-black px-4 py-1.5 font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
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
                  className='flex w-max items-center gap-x-1 rounded-xl bg-black px-4 py-1.5 font-semibold text-white outline-hidden hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                  onClick={() =>
                    openModal('create-profile', {
                      buttons: [
                        {
                          actionType: 'close',
                          id: 'cancel',
                          label: t('buttons.cancel'),
                          variant: 'ghost'
                        },
                        {
                          action: continueCreateProfile,
                          id: 'create',
                          label: t('buttons.create'),
                          variant: 'solid'
                        }
                      ],
                      content: <CreateProfile />,
                      description: t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.description'),
                      title: t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.title')
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
    </>
  );
}