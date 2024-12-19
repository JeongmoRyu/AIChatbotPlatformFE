import useToggleMenuViewModel from '../viewModel/useToggleMenuViewModel';

interface Props {
  handleEdit: (value: boolean) => void;
  chatbotImage: string;
}

const ToggleMenu = ({ handleEdit, chatbotImage }: Props) => {
  const { setIsToggled, isToggled, toggleRef, userAuthority, imageKey, moveChatRoom } = useToggleMenuViewModel();

  return (
    <div
      className="relative w-[56px] h-[56px] bg-[#e7ecf1] rounded-full mx-2 cursor-pointer"
      onClick={() => setIsToggled(!isToggled)}
    >
      <div className="overflow-hidden rounded-full w-[56px] h-[56px]">
        <img className="max-w-none w-full h-full object-cover" key={imageKey} src={chatbotImage} alt="" />
      </div>
      {isToggled && (
        <div
          className="overflow-hidden absolute top-14 flex flex-col justify-center w-36 bg-white rounded-2xl text-center shadow-lg"
          ref={toggleRef}
        >
          {userAuthority && (
            <>
              <div className="cursor-pointer hover:bg-primary hover:text-white py-2" onClick={() => handleEdit(true)}>
                Edit Chatbot
              </div>
            </>
          )}
          <div className="cursor-pointer hover:bg-primary hover:text-white py-2" onClick={moveChatRoom}>
            New Chat
          </div>
        </div>
      )}
    </div>
  );
};

export default ToggleMenu;
