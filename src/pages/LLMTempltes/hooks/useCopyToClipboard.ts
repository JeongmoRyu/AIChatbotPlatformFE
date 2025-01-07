import { showNotification } from '@/shared/utils/common-helper';
import { useTranslation } from 'react-i18next';

const useCopyToClipboard = () => {
  const { t } = useTranslation(['llm']);

  const fallbackCopyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showNotification(t('llm:내용이_클립보드에_복사되었습니다'), 'success');
    } catch (err) {
      console.error(t('llm:클립보드_복사에_실패했습니다'), err);
      showNotification(t('llm:복사할_내용이_없습니다'), 'error');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const copyToClipboard = async (text: string) => {
    if (!text) {
      showNotification(t('llm:복사할_내용이_없습니다'), 'error');
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        showNotification(t('llm:내용이_클립보드에_복사되었습니다'), 'success');
      } catch (err) {
        console.error(t('llm:클립보드_복사에_실패했습니다'), err);
        showNotification(t('llm:복사할_내용이_없습니다'), 'error');
      }
    } else {
      console.warn('Using fallback for clipboard copy.');
      fallbackCopyToClipboard(text);
    }
  };

  return copyToClipboard;
};

export default useCopyToClipboard;
