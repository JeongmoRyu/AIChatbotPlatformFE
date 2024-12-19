import icoInfo from '@/shared/assets/images/icons/ico_info.svg';
import { useTranslation } from 'react-i18next';

function NotLoginInfo() {
  const { t } = useTranslation(['common']);

  return (
    <div className="mt-5 result-notfound">
      <div className="notfound-img">
        <img src={icoInfo} alt="검색결과 없음" />
      </div>
      <p>
        {t('common:로그인_정보가_없습니다')}
        <br />
        {t('common:로그인하시면_데이터_등록_정보를_확인할_수_있습니다')}
      </p>
    </div>
  );
}

export default NotLoginInfo;
