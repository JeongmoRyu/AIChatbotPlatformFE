import { useRecoilState } from 'recoil';
import { chatPlayTabInfoState } from '@/shared/store/chatplay';

const useChatPlayPipelineTabViewModel = () => {
  const [activeTab, setActiveTab] = useRecoilState(chatPlayTabInfoState);

  const handleTabClick = (tab: TChatPlayTab) => {
    setActiveTab(tab);
  };

  return { handleTabClick, activeTab };
};

export default useChatPlayPipelineTabViewModel;
