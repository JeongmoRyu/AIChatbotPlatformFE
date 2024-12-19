import useFeedbackAreaViewModel from '../viewModel/useFeedbackAreaViewModel';

const FeedbackArea = ({ index, seq, isOpen, handleFeedbackArea }: FeedbackAreaProps) => {
  const { feedbackRef, feedbackContents, handleChangeFeedback, handleSendFeedback } = useFeedbackAreaViewModel({
    index,
    seq,
    isOpen,
    handleFeedbackArea,
  });
  return (
    <div className="mt-2 pr-1 w-full flex flex-col">
      <textarea
        ref={feedbackRef}
        className="w-full h-24 p-4 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
        placeholder="내용을 입력해 주세요."
        value={feedbackContents}
        onChange={handleChangeFeedback}
      ></textarea>
      <div className="flex justify-end">
        <span
          className="flex justify-end hover:underline cursor-pointer mt-1 text-sm w-fit"
          onClick={handleSendFeedback}
        >
          전송하기
        </span>
      </div>
    </div>
  );
};

export default FeedbackArea;
