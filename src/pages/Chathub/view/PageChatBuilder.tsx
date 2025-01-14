import ico_chevron_left from '@/shared/assets/images/image/chevron-left@3x.png';
import ico_check_16 from '@/shared/assets/images/icons/ico_check_16.svg';
import { useLocation } from 'react-router-dom';
// import { CHATBUILDER, HOME, LOGIN } from 'data/routers';
import SettingTab from '../components/settingTab/view/SettingTabMain';
import usePageChatBuilderViewModel from '../viewModel/usePageChatBuilderViewModel';

const PageChatBuilder = () => {
  const location = useLocation();
  const chatbotId = location.state?.id || null;
  const isCopyPage = location.state?.isCopy || false;
  const {
    handleBack,
    handleChatbotCopy,
    data,
    isSaving,
    handleClickSave,
    onValueChange,
    handleChangeImage,
    setValueCheck,
  } = usePageChatBuilderViewModel();

  return (
    <div className="page_builder">
      {/* content */}
      <div className="builder_header">
        {isCopyPage ? (
          <button type="button" className="btn_head_close" onClick={handleBack}>
            copy close
          </button>
        ) : (
          <button type="button" className="font-bold text-xl hover:underline" onClick={handleBack}>
            <img src={ico_chevron_left} alt="backtochat" className="inline-block w-6 h-7" />
            Chathub
          </button>
        )}

        <div className="flex">
          {chatbotId && (
            <button className="btn_type blue" onClick={() => handleChatbotCopy(data)}>
              Copy
            </button>
          )}
          <button className={`btn_type ${isSaving ? 'black' : 'blue'}`} onClick={handleClickSave} disabled={isSaving}>
            {/* <button className={`btn_type ${isSaving ? 'gray' : 'blue'}`} onClick={handleSave} disabled={isSaving}> */}
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <img src={ico_check_16} alt="save" />
                {chatbotId ? 'Edit' : 'Save'}
              </>
            )}
          </button>
        </div>
      </div>
      <div className="builder_content">
        {/* chatBuilder */}
        <div className="chat_builder">
          <SettingTab
            data={data}
            handleChange={onValueChange}
            handleChangeImage={handleChangeImage}
            valueCheck={setValueCheck}
          />
        </div>
      </div>
    </div>
  );
};

export default PageChatBuilder;
