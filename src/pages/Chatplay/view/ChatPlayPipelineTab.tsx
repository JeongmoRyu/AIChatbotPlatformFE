import { useTranslation } from 'react-i18next';
import useChatPlayPipelineTabViewModel from '../viewModel/useChatPlayPipelineTabViewModel';

function ChatPlayPipelineTab() {
  const { t } = useTranslation(['chatplay']);
  const { handleTabClick, activeTab } = useChatPlayPipelineTabViewModel();

  return (
    <div className="flex cursor-pointer">
      <div
        className={`h-[60px] flex items-center justify-center relative flex-1 tab ${activeTab === 'setting' ? 'active' : ''}`}
        onClick={() => handleTabClick('setting')}
      >
        <span className={`${activeTab === 'setting' ? 'text-primary-darkblue font-bold' : 'text-gray'} mx-auto`}>
          {t('chatplay:설정')}
        </span>
        <div className="absolute w-full h-0.5 items-center bg-[#d2dcea] bottom-0 left-1/10" />
        {activeTab === 'setting' ? (
          <div className="absolute w-2/3 h-0.5 items-center bg-primary-darkblue bottom-0 left-1/10"></div>
        ) : (
          <div className="absolute w-full h-0.5 items-center bg-[#d2dcea] bottom-0 left-1/10"></div>
        )}
      </div>
      <div
        className={`h-[60px] flex items-center justify-center  relative flex-1 tab ${activeTab === 'testlog' ? 'active' : ''}`}
        onClick={() => handleTabClick('testlog')}
      >
        <span className={`${activeTab === 'testlog' ? 'text-primary-darkblue font-bold' : 'text-gray'} mx-auto`}>
          {t('chatplay:테스트_로그')}
        </span>
        <div className="absolute w-full h-0.5 items-center bg-[#d2dcea] bottom-0 left-1/10" />
        {activeTab === 'testlog' ? (
          <div className="absolute w-2/3 h-0.5 items-center bg-primary-darkblue bottom-0 left-1/10"></div>
        ) : (
          <div className="absolute w-full h-0.5 bg-[#d2dcea] bottom-0 left-1/10"></div>
        )}
      </div>
    </div>
  );
}

export default ChatPlayPipelineTab;
