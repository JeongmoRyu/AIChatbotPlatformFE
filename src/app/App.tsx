import { useEffect } from 'react';
import AppRouterProvider from '@/app/providers/router';
import { useRecoilValue } from 'recoil';
import { ToastContainer } from 'react-toastify';
import i18n from 'i18next';
import { withTranslation } from 'react-i18next';
import '@/shared/styles/index.scss';
import '@/shared/locale/i18next';

import { language } from '@/shared/store/language';

function App() {
  const selectLang = useRecoilValue(language);

  useEffect(() => {
    switch (selectLang) {
      case 'ko':
        i18n.changeLanguage('ko');
        break;
      case 'en':
        i18n.changeLanguage('en');
        break;
      default:
        break;
    }
  }, [selectLang]);

  return (
    <>
      <AppRouterProvider />
      <ToastContainer toastStyle={{ backgroundColor: '#4d5562' }} />
    </>
  );
}

export default withTranslation()(App);
