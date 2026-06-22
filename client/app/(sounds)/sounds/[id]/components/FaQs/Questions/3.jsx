import { useTranslation } from 'react-i18next';

export default function Question3() {
  const { t } = useTranslation();

  return (
    <p className='mt-2'>
      {t('soundPage.frequentlyAskedQuestions.answers.2')}
    </p>
  );
}