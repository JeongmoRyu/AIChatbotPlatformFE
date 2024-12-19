import React, { useEffect, useState } from 'react';

import { useTransition } from '@/shared/hooks/useTransition';

const useFeatureCardListViewLLMViewModel = () => {
  const [redirectData, setRedirectData] = useState<string | null>(null);
  const { transNavigate } = useTransition();

  useEffect(() => {
    if (redirectData) transNavigate(redirectData, { state: null });
  }, [redirectData, transNavigate]);

  const handleClickMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const redirect = e.currentTarget.dataset.redirect;

    if (!redirect) return;

    if (redirect) {
      setRedirectData(redirect);
    }
  };

  return { handleClickMenu };
};

export default useFeatureCardListViewLLMViewModel;
