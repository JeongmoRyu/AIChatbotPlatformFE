import React from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/shared/components/chatplayModal/view/Modal';
import ModalChatbotDelete from '@/shared/components/chatplayModal/view/ModalChatbotDelete';
import Backdrop from '@/shared/components/chatplayModal/view/Backdrop';

import useChatPlayNameSelectBoxViewModel from '../viewModel/useChatPlayNameSelectBoxViewModel';

import GarbageCan from '@/shared/assets/images/image/chatplay/ico_delete.png';
import Check from '@/shared/assets/images/image/chatplay/ico_check_on.png';

const ChatPlayNameSelectBox = (props: ChatPlayNameSelectBoxProps) => {
  const { t } = useTranslation('chatplay');

  const {
    selectedValue,
    chatbotList,
    selectedBtnRef,
    handleSelectList,
    selectedchatbotLabel,
    isSelectOpen,
    handleOnChangeSelect,
    handleDeleteModal,
    isShowLocalModal,
    handleDeleteChatbot,
    selectboxClass,
    selectboxRef,
    closeModal,
  } = useChatPlayNameSelectBoxViewModel({
    boxClassName: props.boxClassName,
    defaultValue: props.defaultValue,
    error: props.error,
    placeholder: props.placeholder,
    socket: props.socket,
  });

  return (
    <div
      ref={selectboxRef}
      className={`selectbox ${selectboxClass} `}
      style={{
        border: props.borderValue || 'none',
        position: 'relative',
      }}
    >
      <select
        {...props.register}
        id={props.id}
        name={props.name}
        defaultValue={selectedValue}
        style={{ borderColor: 'red' }}
      >
        {props.placeholder && <option value="">{props.placeholder}</option>}
        {chatbotList &&
          chatbotList.map((type) => {
            return (
              <option key={`select_${type.chatbot_id}`} value={type.chatbot_id}>
                {type.name}
              </option>
            );
          })}
      </select>
      <button
        ref={selectedBtnRef}
        type="button"
        name={props.name}
        className={`select-selected ${isSelectOpen.selectedBtnState} text-secondary-dark border-none !h-full outline-none focus:outline-none focus:ring-0 focus:ring-transparent !pl-7 !w-64 `}
        onClick={handleSelectList}
      >
        <div className="flex items-center justify-center">
          <div className="overflow-hidden text-xl whitespace-nowrap text-ellipsis">
            {selectedchatbotLabel && selectedchatbotLabel.length > 13
              ? `${selectedchatbotLabel.substring(0, 13)}...`
              : selectedchatbotLabel}
          </div>
        </div>
      </button>
      <div className={`select-items ${isSelectOpen.selectHide} border-none w-64`}>
        <button
          type="button"
          key="create_option"
          data-value="create_option"
          data-label={t('chatplay:생성하기')}
          name={props.btnName}
          onClick={handleOnChangeSelect}
          className="!text-primary-darkblue hover:!text-white hover:!bg-primary-darkblue !px-7"
        >
          {t('chatplay:챗봇_생성하기')}
        </button>

        <div className="border-b border-bd-default-line"></div>

        {chatbotList?.map((item) => (
          <React.Fragment key={`btn_${item.chatbot_id}`}>
            <button
              type="button"
              data-value={item.chatbot_id}
              data-label={item.name}
              name={props.btnName}
              onClick={handleOnChangeSelect}
              className={`flex justify-between w-full !px-6 hover:!bg-primary-darkblue ${
                selectedchatbotLabel === item.name ? 'bg-primary-darkblue text-white' : 'bg-white text-black'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`min-w-12 h-6 px-2 py-1 text-xs rounded-full ${
                    item.type === 'LLM' ? 'bg-black text-white' : 'bg-white text-blue-500 border border-blue-500'
                  }`}
                >
                  {item.type === 'LLM' ? 'LLM' : 'RAG'}
                </div>
                <div className="overflow-hidden text-left whitespace-nowrap text-ellipsis min-w-32 max-w-32">
                  {item.name}
                </div>
                {Number(selectedValue) === item.chatbot_id && chatbotList.length > 1 ? (
                  <img src={Check} alt="Check Icon" className="max-w-full max-h-full" />
                ) : (
                  <div
                    className="max-w-[100px] max-h-[20px] min-w-4 min-h-4 p-0 border-none bg-none"
                    data-value={item.chatbot_id}
                    onClick={handleDeleteModal}
                  >
                    <img src={GarbageCan} alt="Garbage Can Icon" className="object-contain w-full h-full " />
                  </div>
                )}
              </div>
            </button>
            <div className="border-b border-bd-default-line"></div>
          </React.Fragment>
        ))}
      </div>
      <>
        <Backdrop isShow={isShowLocalModal} onClick={closeModal} />
        <Modal isShow={isShowLocalModal} onClose={closeModal} centered className="w-96">
          <ModalChatbotDelete onClose={closeModal} onDelete={handleDeleteChatbot} />
        </Modal>
      </>
    </div>
  );
};

export default ChatPlayNameSelectBox;
