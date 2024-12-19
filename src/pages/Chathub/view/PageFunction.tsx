import { useLocation } from 'react-router-dom';
import EditTextInput from '../components/edit/view/EditTextInput';
import EditTextarea from '../components/edit/view/EditTextarea';
import EditButtonHead from '../components/edit/view/EditButtonHead';
import QuestionImageUpload from '../components/functionImage/view/QuestionImageUpload';
import Knowledge from '../components/functionImage/view/Knowledge';
import ico_chevron_left from '@/shared/assets/images/image/chevron-left@3x.png';
import ico_check_16 from '@/shared/assets/images/icons/ico_check_16.svg';
import Modal from '@/shared/components/modal/view/Modal';
import ico_new_create from '@/shared/assets/images/icons/ico_new_create.svg';
import FunctionImageUpload from '../components/functionImage/view/functionImageUpload';
import ModalFunctionsItem from '../components/modal/view/ModalFunctionItem';
import usePageFunctionViewModel from '../viewModel/usePageFunctionViewModel';
import { ICONS_LIBRARY_URL } from '@/shared/utils/pictogram';

const PageFunction = () => {
  const {
    libraryChecked,
    functionsTestReady,
    setTestMessage,
    handleBack,
    handleFunctionsSave,
    getFunctionsCheckAPI,
    handleFunctionChange,
    handleLibraryModalSave,
    handleFileChange,
    handleFileRemove,
    handleModalVisible,
    handleDeleteModalSave,
    handleChangeImage,
    handleFunctionCopy,
    functionsDetail,
    isModalVisible,
    isSave,
    handleModalClose,
    libraryAllList,
    connectionInfoState,
    testMessage,
    testResultMessage,
  } = usePageFunctionViewModel();
  const location = useLocation();
  const isCopyPage = location.state?.isCopy || false;
  const functionId = location.state?.id || null; // location.state?.id 가 있으면 수정

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
          {functionId && (
            <>
              <button className="btn_type white" onClick={() => handleModalVisible('test')}>
                Test 해보기
              </button>
              <button className="btn_type red" onClick={() => handleModalVisible('delete')}>
                Delete
              </button>
              <button className="btn_type blue" onClick={() => handleFunctionCopy(functionsDetail)}>
                Copy
              </button>
            </>
          )}
          <button className="btn_type blue" onClick={handleFunctionsSave}>
            <img src={ico_check_16} alt="" />
            {functionId ? 'Edit' : 'Save'}
          </button>
        </div>
      </div>
      <div className="builder_content">
        {/* chatBuilder */}
        <div className="chat_builder">
          <div className="chat_builder_inner">
            <em className="txt_label">Image</em>
            <FunctionImageUpload
              serverImg={functionsDetail.img_path ? `${ICONS_LIBRARY_URL}${functionsDetail.img_path}` : undefined}
              onImageChange={(url) => handleFunctionChange('img_path', url)}
            />
          </div>
          <div className="chat_builder_inner">
            <EditTextInput
              labelText="Name"
              id="instructionName"
              value={functionsDetail.name}
              onChange={(e: any) => handleFunctionChange('name', e.target.value)}
            />
          </div>
          <div className="chat_builder_inner">
            <EditTextarea
              labelText="Description"
              id="instructionDescription"
              value={functionsDetail.description}
              onChange={(e: any) => handleFunctionChange('description', e.target.value)}
            />
          </div>

          <div className="chat_builder_inner">
            <EditButtonHead
              title="Library"
              btnText="Edit"
              onClick={() => handleModalVisible('library')}
              icon={ico_new_create}
            />

            {libraryChecked.length > 0 && (
              <div className="list_check_wrap">
                {libraryChecked.map((item) => (
                  <div key={item.id} className="list_check_item">
                    <div className="list_check_inner list_check_img">
                      <img src={item.img_path} alt={item.labelText} />
                    </div>
                    <p className="list_check_inner">{item.labelText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Modal
            isShow={isModalVisible.library}
            title="Library"
            width={710}
            onClose={() => handleModalClose('library')}
            okButtonText="Save"
            okButtonClick={handleLibraryModalSave}
            okButtonDisabled={!isSave}
            cancelButtonText="Close"
            cancleButtonClick={() => handleModalClose('library')}
          >
            <div className="wrap_round_square">
              {libraryAllList.map((item, index) => (
                <ModalFunctionsItem
                  key={`dialog_${index}`}
                  imageUrl={item.img_path}
                  title={item.labelText}
                  text={item.description}
                  onClick={() => handleFunctionChange('pre_info_type', item.id)}
                  isSelected={item.isChecked}
                />
              ))}
            </div>
          </Modal>

          <Knowledge
            serverFiles={functionsDetail.file_list}
            onFileChange={handleFileChange}
            onFileRemove={handleFileRemove}
          />

          <div className="chat_builder_inner">
            <label className="txt_label" htmlFor="questionDetail">
              Question
            </label>

            <QuestionImageUpload
              serverImg={
                functionsDetail.question_image
                  ? `${connectionInfoState.chathub.restful}/file/image/${functionsDetail.question_image}`
                  : ''
              }
              onChangeImage={handleChangeImage}
            />

            <div className="chat_builder_value">
              <EditTextInput
                id="questionName"
                name="questionName"
                placeholder="function 질문 제목을 입력하세요"
                value={functionsDetail.question_name || ''}
                onChange={(e: any) => handleFunctionChange('question_name', e.target.value)}
              />
              <EditTextarea
                id="questionDetail"
                name="questionDetail"
                placeholder="function 질문 설명을 입력하세요"
                value={functionsDetail.question_detail}
                onChange={(e: any) => handleFunctionChange('question_detail', e.target.value)}
                isLengthVisible={false}
              />
            </div>
          </div>
        </div>

        {/* test chatting */}
        {/* <div className='test_chatting'>
          <TestChatting />
        </div> */}
      </div>

      <Modal
        isShow={isModalVisible.delete}
        title={`Delete ${functionsDetail.name} Function`}
        width={400}
        onClose={() => handleModalClose('delete')}
        okButtonText="Delete"
        okButtonClick={handleDeleteModalSave}
        cancelButtonText="Close"
        cancleButtonClick={() => handleModalClose('delete')}
      >
        <div className="text-center mb-2 px-[10px] break-keep">
          <p>{functionsDetail.name}</p>
          <p>Function을 지우신다면 되돌릴 수 없습니다.</p>
        </div>
        <div className="file_list_box">
          <p className="txt_center text-[#fe4336]">{functionsDetail.name} Function을 지우시겠습니까?</p>
        </div>
      </Modal>

      <Modal
        isShow={isModalVisible.test}
        title={`${functionsDetail.name} Function Test`}
        width={710}
        onClose={() => handleModalClose('test')}
        okButtonText={functionsTestReady ? 'Test' : 'Testing...'}
        okButtonClick={functionsTestReady ? getFunctionsCheckAPI : undefined}
        // okButtonText='Test'
        // okButtonClick={getFunctionsCheckAPI}
        cancelButtonText="Close"
        cancleButtonClick={() => handleModalClose('test')}
      >
        <EditTextInput
          labelText="테스트 할 메세지"
          id="functionTest"
          value={testMessage}
          onChange={(e: any) => setTestMessage(e.target.value)}
        />

        <EditTextarea
          labelText="테스트 결과"
          id="functionTestResult"
          value={testResultMessage}
          disabled
          onChange={() => {}}
          isLengthVisible={false}
        />
      </Modal>
    </div>
  );
};
export default PageFunction;
