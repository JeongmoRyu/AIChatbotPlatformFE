import tw from 'tailwind-styled-components';
import { ICONS_LIBRARY_URL } from '@/shared/utils/pictogram';
import RoundCardForbidden from '@/features/card/view/ChathubCard/RoundCardForbidden';
import EmbeddingCheckRoundCard from '@/features/card/view/ChathubCard/EmbeddingCheckRoundCard';
import EditToggle from '@/shared/components/toggle/view/EditToggle';
import Modal from '@/shared/components/modal/view/Modal';
import RoundCard from '@/features/card/view/ChathubCard/RoundCard';
import ico_new_create from '@/shared/assets/images/icons/ico_new_create2.svg';
import ico_add from '@/shared/assets/images/image/ico_add@3x.png';
import usePageChathubViewModel from '../viewModel/usePageChathubViewModel';
// import '@/shared/styles/_modal.scss';
// import '@/shared/styles/chat.scss';

const PageChathub = () => {
  const {
    userAuthority,
    setChatbotItemState,
    chatbotItemState,
    isModalVisible,
    handleToggleIsMine,
    toggleState,
    handleCreateBuilder,
    chatbotList,
    handleChatbotClick,
    setIsModalVisible,
    handleCreateFunctions,
    functionList,
    handleModalClose,
    handleModalSave,
    setToggleState,
    getChatbotInfo,
  } = usePageChathubViewModel();

  return (
    <Container>
      <div className="page_main pt-[3.5625rem] pb-[6.25rem] mx-auto flex justify-center w-full h-fit">
        <div className="w-full h-full mx-auto">
          <div className="flex flex-col w-full justify-evenly">
            <div className="flex justify-between text-2xl font-bold">
              AI Chat
              <div className="flex justify-end">
                {userAuthority && (
                  <>
                    <EditToggle
                      title="내가 만든 AI Chat 보기"
                      id="chatbot_mine"
                      value={toggleState[0]}
                      onChange={(val) => handleToggleIsMine('chatbot', val)}
                    />
                    <button
                      className="btn_type black w-[6.25rem] h-[2.5rem] rounded-[0.5rem] text-[1rem] py-[0.375rem] px-[0.9375rem] flex items-center justify-center"
                      onClick={handleCreateBuilder}
                    >
                      <img src={ico_new_create} alt="create" className="btn-icon" />
                      Create
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-[1.875rem] result-wrap">
            <div className="mx-auto">
              <div className="gap-5 grid grid-cols-4 gap-[0.9375rem] justify-center">
                {/* <div className="gap-5 grid grid-cols-4 desktop:grid-cols-4 mobile:grid-cols-1 gap-[0.9375rem] justify-center"> */}
                {chatbotList.length > 0 &&
                  chatbotList.map((item) =>
                    item.embedding_status === 'C' ? (
                      <EmbeddingCheckRoundCard
                        key={`chatbot_round_${item.id}`}
                        cardItem={item}
                        to="/chatroom"
                        navigateOptions={{ id: item.id }}
                        cardClick={() => {
                          handleChatbotClick(item.id);
                          setChatbotItemState(item);
                        }}
                        imgClassName="max-w-none w-full h-full object-cover"
                        isToggleBtnVisible={!!userAuthority}
                        onDeleteSuccess={() => {
                          getChatbotInfo();
                          setToggleState([false, toggleState[1]]);
                        }}
                        setIsModalVisible={setIsModalVisible}
                        setChatbotItemState={setChatbotItemState}
                      />
                    ) : (
                      <RoundCardForbidden
                        key={item.id}
                        cardItem={item}
                        isToggleBtnVisible={!!userAuthority}
                        imgClassName="max-w-none w-full h-full object-cover"
                      />
                    ),
                  )}

                {userAuthority && (
                  <RoundCard
                    cardItem={{
                      id: 0,
                      image: ico_add,
                      name: 'Chat Builder',
                      user_key: 0,
                    }}
                    to="/chatbuilder"
                    imgClassName="max-w-[2.5rem] max-h-[2.5rem] object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {userAuthority && (
            <div className="pt-28">
              <div className="flex justify-between text-2xl font-bold">
                Functions
                <div className="flex justify-end">
                  {userAuthority && (
                    <>
                      <EditToggle
                        title="내가 만든 Functions 보기"
                        id="functions_mine"
                        value={toggleState[1]}
                        onChange={(val) => handleToggleIsMine('functions', val)}
                      />
                      <button
                        className="btn_type black w-[6.25rem] h-[2.5rem] rounded-[0.5rem] text-[1rem] py-[0.375rem] px-[0.9375rem] flex items-center justify-center"
                        onClick={handleCreateFunctions}
                      >
                        <img src={ico_new_create} alt="create" className="btn-icon" />
                        Create
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-[1.875rem] result-wrap">
                <div className="max-w-[92.8125rem] mx-auto">
                  <div className="gap-5 grid grid-cols-4 desktop:grid-cols-4 mobile:grid-cols-1 gap-[0.9375rem] justify-center">
                    {functionList.map((card, index) => (
                      <div key={index} className="flex justify-center">
                        <div className="w-full max-w-[22.5rem]">
                          <RoundCard
                            cardItem={{
                              id: card.id,
                              name: card.name,
                              image: ICONS_LIBRARY_URL + card.img_path,
                              user_key: card.user_key,
                              user_id: card.user_id,
                              user_name: card.user_name,
                              updated_at: card.updated_at,
                            }}
                            imgClassName="max-w-[2.5rem] max-h-[2.5rem]"
                            to="/function"
                            navigateOptions={{ id: card.id }}
                          />
                        </div>
                      </div>
                    ))}
                    {userAuthority && (
                      <div className="flex justify-center">
                        <div className="w-full max-w-[22.5rem]">
                          <RoundCard
                            cardItem={{
                              id: 99999,
                              name: 'Add Dialogue Bot',
                              image: ico_add,
                              user_key: 0,
                            }}
                            to="/function"
                            imgClassName="max-w-[2.5rem] max-h-[2.5rem]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isShow={isModalVisible}
        title={
          chatbotItemState.id
            ? `Delete ${chatbotItemState.name.length > 20 ? chatbotItemState.name.slice(0, 19) + '...' : chatbotItemState.name} Chatbot`
            : ''
        }
        width={400}
        onClose={handleModalClose}
        okButtonText="Delete"
        okButtonClick={handleModalSave}
        cancelButtonText="Close"
        cancleButtonClick={handleModalClose}
      >
        <div className="text-center mb-2 px-[0.625rem] break-keep">
          {chatbotItemState.id && (
            <div>
              <p className="max-w-full truncate" title={chatbotItemState.name}>
                {chatbotItemState.name.length > 36 ? `${chatbotItemState.name.slice(0, 35)}...` : chatbotItemState.name}
              </p>
              <p>챗봇을 지우신다면 되돌릴 수 없습니다.</p>
            </div>
          )}
        </div>
        <div className="file_list_box">
          <div className="txt_center text-[#fe4336]">
            <p className="mb-2">
              {chatbotItemState.id && (
                <span className="inline-block max-w-full truncate" title={chatbotItemState.name}>
                  {chatbotItemState.name.length > 36
                    ? `${chatbotItemState.name.slice(0, 35)}...`
                    : chatbotItemState.name}
                </span>
              )}
            </p>
            <p>챗봇을 지우시겠습니까?</p>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default PageChathub;

export const Container = tw.div`
  w-full
  h-full
  flex
  flex-col
  gap-[5rem]
  items-center
  text-black
  max-w-default
  xl:max-w-xl
  xxl:max-w-xxl
`;
