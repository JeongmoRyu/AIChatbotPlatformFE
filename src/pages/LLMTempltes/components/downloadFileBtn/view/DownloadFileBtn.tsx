import GeneralButton from '@/shared/components/GeneralButton/view/GeneralButton';
import { useTranslation } from 'react-i18next';
import useDownloadFileBtnViewModel from '../viewModel/useDownloadFileBtnViewModel';

const DownloadFileBtn = ({
  fileSummaryContent,
  fileTitleContent,
  fileContentContent,
  name,
  disabled,
}: DownloadFileBtnProps) => {
  const { t } = useTranslation(['llm']);

  const { handleDownloadFile } = useDownloadFileBtnViewModel({
    fileSummaryContent,
    fileTitleContent,
    fileContentContent,
    name,
  });

  return (
    <GeneralButton
      type="button"
      name="download"
      className={`btn primary save flex items-center ${disabled ? '!bg-[#81859b] border-none cursor-not-allowed' : ''}`}
      onClick={handleDownloadFile}
      disabled={disabled}
    >
      {t('llm:파일_다운로드')}
    </GeneralButton>
  );
};

export default DownloadFileBtn;
