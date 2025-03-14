import LogDataPipeLine from '../Chat/view/LogDataPipeLine';

interface ComponentProps {
  sidebarState: boolean;
  handleSideBar: () => void;
  logData: IDashBoardLogs;
}

export default function Sidebar({ sidebarState, handleSideBar, logData }: ComponentProps) {
  return (
    <div
      className={`${sidebarState && 'open'} fixed top-16 right-0 h-full bg-white shadow-lg overflow-y-auto 
      transition-all duration-300 ${sidebarState ? 'translate-x-0 w-[25rem]' : 'translate-x-full w-0'}`}
      // transition-all duration-300 ${sidebarState ? 'w-[25rem]' : 'w-0'}`}
    >
      <div className="relative w-[25rem] h-[65px] px-2 bg-white text-black text-center border-b border-[#f4f6f8] flex items-center justify-between">
        <h2 className="text-xl font-bold">로그 상세</h2>

        <button
          onClick={() => handleSideBar()}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[url('/src/shared/assets/images/image/amore_close.png')] bg-no-repeat bg-cover bg-center"
          style={{ filter: 'brightness(0) saturate(100%) invert(90%) sepia(5%) hue-rotate(180deg) brightness(100%)' }}
          aria-label="닫기"
        />
      </div>
      {sidebarState && (
        <div className="relative top-[-1.5rem]">
          <div className="chathub-sidebar">
            <LogDataPipeLine logData={logData} />
          </div>
        </div>
      )}
    </div>
  );
}
