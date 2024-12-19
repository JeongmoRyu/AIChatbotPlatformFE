import PipeLineFlow from '@/pages/Chathub/components/chatUI/view/PipeLineFlow';

type ActiveSideTab = 'setting' | 'testlog';
interface ComponentProps {
  activeTab: ActiveSideTab;
  onChangeTab: (id: ActiveSideTab) => void;
  sidebarState: boolean;
  handleSideBar: (isShow: boolean) => void;
  logData: IDashBoardLogs;
}

export default function Sidebar({ activeTab, onChangeTab, sidebarState, handleSideBar, logData }: ComponentProps) {
  return (
    <div className={`sidebar ${sidebarState && 'open'}`}>
      <div className="sidebar_head">
        <h2 className="title">Edit Chatbot</h2>
        <button onClick={() => handleSideBar(false)} className="btn_close">
          닫기
        </button>
      </div>
      {sidebarState && <PipeLineFlow logData={logData} activeTab={activeTab} onChangeTab={onChangeTab} />}
    </div>
  );
}
