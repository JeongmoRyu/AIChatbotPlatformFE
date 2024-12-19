import { replaceWithBr } from '@/shared/utils/chat-play-helper';

import useChatPlayUserChatViewModel from '../viewModel/useChatPlayUserChatViewModel';

import DeleteIcon from '@/shared/assets/images/image/chatplay/ico_delete_chat.svg';

function ChatPlayUserChat({ index, chatData, isMarginTop }: ChatPlayUserChatProps) {
  const {
    editorRef,
    isEditing,
    textareaRef,
    editableText,
    handleContentChange,
    toggleEditing,
    roomInfo,
    setChatPlayChatHistoryState,
  } = useChatPlayUserChatViewModel({ index, chatData });

  return (
    <li
      className={`relative w-[40rem] ml-auto tablet:w-full tablet:max-w-[40rem] ${isMarginTop ? 'mt-10' : ''}`}
      ref={editorRef}
    >
      <div className="flex items-center font-bold h-8 mb-2.5 pl-10 bg-[url(@/shared/assets/images/image/chatplay/ico_maumGPT.svg)] bg-no-repeat bg-[left_center]">
        User
      </div>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editableText}
          onChange={handleContentChange}
          onBlur={toggleEditing}
          className="w-full h-full p-8 bg-[#dce7f5] border-none rounded-3xl focus:outline-none focus:ring-0 resize-none"
        />
      ) : (
        <p
          className="bg-[#dce7f5] p-8 rounded-3xl"
          onClick={toggleEditing}
          dangerouslySetInnerHTML={{ __html: replaceWithBr(editableText) }}
        />
      )}
      {roomInfo.state === 'EDITABLE' && (
        <img
          src={DeleteIcon}
          alt="delete_chat"
          className="absolute top-[70px] right-[-30px] cursor-pointer"
          onClick={() =>
            setChatPlayChatHistoryState((prev: any) => ({
              ...prev,
              history: prev.history.filter((_: any, i: number) => i !== index),
            }))
          }
        />
      )}
    </li>
  );
}
export default ChatPlayUserChat;
