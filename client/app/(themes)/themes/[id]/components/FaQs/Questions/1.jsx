import { useTranslation } from 'react-i18next';

export default function Question1() {
  const { t } = useTranslation();

  return (
    <p className='mt-2'>
      {t('themePage.frequentlyAskedQuestions.answers.0')}
    </p>
  );
}