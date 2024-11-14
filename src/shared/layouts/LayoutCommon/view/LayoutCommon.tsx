import TopNav from '@/widgets/navigation/view/WidgetNavigationBar';
import tw from 'tailwind-styled-components';
import { FC } from 'react';
import useLayoutCommonViewModal from '../viewModel/useLayoutCommonViewModal';
import { TailSpin } from 'react-loader-spinner';
import Backdrop from '@/features/backdrop/view/Backdrop';

const LayoutCommon: FC<LayoutProps> = ({ children }) => {
  const { roomStatusState, isLoadingState, modalState, setModalState } = useLayoutCommonViewModal();

  return (
    <LayoutWrapContainer>
      <TopNav />
      <ContentContainer>
        {children}
        <div id="dimmed-root" />
      </ContentContainer>
      {(roomStatusState.chatUiState === 'ING' || isLoadingState) && (
        <div className="flex justify-center items-center z-[15] fixed top-0 left-0 w-full h-full bg-black bg-opacity-20">
          <TailSpin
            height="80"
            width="80"
            color="#4262FF"
            ariaLabel="tail-spin-loading"
            radius="2"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <Backdrop
        isShow={modalState.isShow}
        onClick={() => {
          setModalState((prev) => ({
            ...prev,
            type: '',
            isShow: false,
            data: {},
          }));
        }}
      />
    </LayoutWrapContainer>
  );
};

export default LayoutCommon;

const LayoutWrapContainer = tw.div`
  flex
  flex-col
  w-full
  h-screen
  select-none
`;

const ContentContainer = tw.div`
  flex-1
  w-full
  overflow-y-auto
  flex
  flex-col
  items-center
  justify-start
`;
