'use client';

import Square from '@/app/components/Background/Square';
import AuthProtected from '@/app/components/Providers/Auth/Protected';
import config from '@/config';
import cn from '@/lib/cn';
import createTemplate from '@/lib/request/templates/createTemplate';
import fetchTemplateDetails from '@/lib/request/templates/fetchTemplateDetails';
import { t } from '@/stores/language';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'sonner';

export default function Page() {
  const [templateId, setTemplateId] = useState('');
  const [templateDetailsLoading, setTemplateDetailsLoading] = useState(false);
  const [templateDetails, setTemplateDetails] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  useEffect(() => {
    if (templateDetails) {
      setTemplateName(templateDetails.name || '');
      setTemplateDescription(templateDetails.description || '');
    }
  }, [templateDetails]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    t('publishTemplatePage.steps.0.title'),
    t('publishTemplatePage.steps.1.title'),
    t('publishTemplatePage.steps.2.title')
  ];
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function publishTemplate() {
    setLoading(true);

    toast.promise(createTemplate({
      categories: selectedCategories,
      description: templateDescription,
      id: templateId,
      name: templateName
    }), {
      error: error => {
        setLoading(false);

        return error;
      },
      loading: t('publishTemplatePage.toast.publishingTemplate'),
      success: () => {
        router.push(`/templates/${templateId}/preview`);

        return t('publishTemplatePage.toast.templatePublished');
      }
    });
  }

  return (
    <AuthProtected>
      <div className='relative z-0 flex w-full justify-center px-6 lg:px-0'>
        <Square blockColor='rgba(var(--bg-secondary))' column='10' row='10' transparentEffectDirection='bottomToTop' />

        <div className='mb-16 mt-48 flex w-full max-w-[600px] flex-col gap-y-2'>
          <h1 className='text-4xl font-bold text-primary'>
            {t('publishTemplatePage.title')}
          </h1>

          <p className='text-sm text-tertiary'>
            {t('publishTemplatePage.subtitle')}
          </p>

          <div className='mt-6 flex flex-col gap-y-4'>
            <div className='flex justify-between gap-x-4 border-b border-y-primary pb-4'>
              {steps.map((step, index) => (
                <div className='flex flex-col items-center gap-x-2' key={step}>
                  <div className='text-xs uppercase text-tertiary'>
                    {t('step', { currentStep: index + 1 })}
                  </div>

                  <h2 className={cn(
                    'text-sm mobile:text-base transition-colors font-medium text-secondary flex items-center',
                    activeStep === index && 'text-primary'
                  )}>
                    {step}
                  </h2>
                </div>
              ))}
            </div>
          </div>

          {activeStep === 0 && (
            <>
              <h2 className='mt-4 text-lg font-medium text-primary sm:text-xl'>
                {t('publishTemplatePage.steps.0.inputs.templateId.title')}
              </h2>

              <p className='text-sm text-tertiary'>
                {t('publishTemplatePage.steps.0.inputs.templateId.subtitle')}
              </p>

              <input
                className='w-full rounded-lg bg-secondary px-3 py-2 text-sm text-tertiary outline-none placeholder:text-placeholder hover:bg-tertiary focus-visible:bg-quaternary focus-visible:text-secondary'
                id='templateId'
                maxLength={12}
                onChange={event => setTemplateId(event.target.value)}
                placeholder={t('publishTemplatePage.steps.0.inputs.templateId.placeholder')}
                type='text'
                value={templateId}
              />
            </>
          )}

          {activeStep === 1 && (
            <>
              <h2 className='mt-4 text-lg font-medium text-primary sm:text-xl'>
                {t('publishTemplatePage.steps.1.inputs.templateCategories.title')}
              </h2>

              <p className='text-sm text-tertiary'>
                {t('publishTemplatePage.steps.1.inputs.templateCategories.subtitle')}
              </p>

              <div className='mt-4 flex flex-wrap items-center justify-center gap-4'>
                {config.templateCategories
                  .filter(category => category !== 'All')
                  .map(category => (
                    <button
                      className={cn(
                        'w-[100px] px-2 relative h-[100px] rounded-2xl font-semibold flex gap-x-1 items-center justify-center',
                        selectedCategories.includes(category) ? 'text-primary bg-tertiary hover:bg-quaternary' : 'bg-secondary hover:bg-tertiary',
                        selectedCategories.length >= config.templateMaxCategoriesLength && !selectedCategories.includes(category) && 'pointer-events-none opacity-70'
                      )}
                      key={nanoid()}
                      onClick={() => {
                        if (selectedCategories.includes(category)) setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory !== category));
                        else setSelectedCategories([...selectedCategories, category]);
                      }}
                    >
                      {t(`categories.${category}`)}
                      {selectedCategories.includes(category) && (
                        <div className='absolute left-0 top-0 flex size-full items-center justify-center rounded-2xl bg-secondary/90'>
                          <MdCheckCircle className='text-primary' />
                        </div>
                      )}
                    </button>
                  ))}
              </div>

              <label className='mt-6 flex flex-col gap-y-2' htmlFor='templateName'>
                <h2 className='text-xl font-medium text-primary'>
                  {t('publishTemplatePage.steps.1.inputs.templateName.title')}
                </h2>

                <p className='text-sm text-tertiary'>
                  {t('publishTemplatePage.steps.1.inputs.templateName.subtitle')}
                </p>
              </label>

              <input
                className='w-full rounded-lg bg-secondary px-3 py-2 text-sm text-tertiary outline-none placeholder:text-placeholder hover:bg-tertiary focus-visible:bg-quaternary focus-visible:text-secondary'
                id='templateName'
                maxLength={20}
                onChange={event => setTemplateName(event.target.value)}
                placeholder={t('publishTemplatePage.steps.1.inputs.templateName.placeholder')}
                type='text'
                value={templateName}
              />

              <label className='mt-6 flex flex-col gap-y-2' htmlFor='templateDescription'>
                <h2 className='text-xl font-medium text-primary'>
                  {t('publishTemplatePage.steps.1.inputs.templateDescription.title')}
                </h2>

                <p className='text-sm text-tertiary'>
                  {t('publishTemplatePage.steps.1.inputs.templateDescription.subtitle')}
                </p>
              </label>

              <textarea
                className='scrollbar-hide h-[100px] w-full resize-none rounded-lg bg-secondary px-3 py-2 text-sm text-tertiary outline-none ring-0 ring-purple-500 placeholder:text-placeholder hover:bg-tertiary focus:ring-2 focus-visible:bg-quaternary focus-visible:text-secondary'
                id='templateDescription'
                maxLength={config.templateDescriptionMaxLength}
                onChange={event => setTemplateDescription(event.target.value)}
                placeholder={t('publishTemplatePage.steps.1.inputs.templateDescription.placeholder', { min: config.templateDescriptionMinLength })}
                value={templateDescription}
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              <h2 className='mt-2 text-lg font-medium text-primary sm:text-xl'>
                {t('publishTemplatePage.steps.2.heading')}
              </h2>

              <p className='text-sm text-tertiary'>
                {t('publishTemplatePage.steps.2.description')}
              </p>

              <div className='mt-4 flex flex-col gap-y-2'>
                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    {t('publishTemplatePage.steps.2.fields.categories')}
                  </h3>
                  <h3 className='text-sm text-tertiary'>
                    {selectedCategories.join(', ')}
                  </h3>
                </div>

                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    {t('publishTemplatePage.steps.2.fields.templateName')}
                  </h3>
                  <h3 className='text-sm text-tertiary'>
                    {templateName}
                  </h3>
                </div>

                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    {t('publishTemplatePage.steps.2.fields.templateDescription')}
                  </h3>
                  <p className='max-w-[250px] break-words text-sm text-tertiary'>
                    {templateDescription}
                  </p>
                </div>
              </div>

              <p className='mt-2 text-xs text-tertiary mobile:text-sm'>
                {t('publishTemplatePage.steps.2.disclaimer.content', { contentPolicyLink: <Link className='hover:text-primary hover:underline' href='/legal/terms-of-service'>{t('publishTemplatePage.steps.2.disclaimer.linkText')}</Link> })}
              </p>
            </>
          )}

          <div className='mt-8 flex w-full justify-between'>
            <button className='flex items-center gap-x-1 rounded-lg bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70' disabled={activeStep === 0 || loading} onClick={() => setActiveStep(activeStep - 1)}>
              {t('buttons.back')}
            </button>

            <button
              className='flex items-center gap-x-1 rounded-lg bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
              disabled={
                activeStep === 0 ? !templateId :
                  activeStep === 1 ? (selectedCategories.length < 1 || templateName.length <= 0 || templateDescription.length < config.templateDescriptionMinLength || templateDescription.length > config.templateDescriptionMaxLength) :
                    ((loading === true || templateDetailsLoading) || false)
              } onClick={async () => {
                let templateDetailsFound = false;

                if (activeStep === 0) {
                  setTemplateDetailsLoading(true);

                  await fetchTemplateDetails(templateId)
                    .then(data => {
                      templateDetailsFound = true;
                      setTemplateDetails(data);
                    })
                    .catch(error => {
                      templateDetailsFound = false;
                      toast.error(
                        error === 'Request failed with status code 404' ? t('publishTemplatePage.toast.templateNotFound') : error
                      );
                    })
                    .finally(() => setTemplateDetailsLoading(false));

                  if (!templateDetailsFound) return;
                }

                if (activeStep === steps.length - 1) publishTemplate();
                else setActiveStep(activeStep + 1);
              }}
            >
              {activeStep === steps.length - 1 ? t('buttons.publish') : t('buttons.next')}

              {(loading || templateDetailsLoading) && (
                <TbLoader className='animate-spin' />
              )}
            </button>
          </div>
        </div>
      </div>
    </AuthProtected>
  );
}