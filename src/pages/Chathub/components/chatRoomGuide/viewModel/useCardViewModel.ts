import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';

const useCardViewModel = (serverImg: string | undefined) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  useEffect(() => {
    serverImg && setImageSrc(serverImg);
  }, [serverImg]);

  return { imageSrc, connectionInfoState };
};

export default useCardViewModel;
