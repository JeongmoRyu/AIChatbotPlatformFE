import Slider from './Slider';
import Card from './Card';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ChatMessage } from '../../Chat/view/ChatMessage';
import useGPTGuideViewModel from '../viewModel/useGptGuideViewModel';

const GptGuide = () => {
  const { GuideInfo, connectionInfoState, handleSelectCardQuestion, isMakingQuestions } = useGPTGuideViewModel();
  return (
    <>
      <div className="flex flex-col item-center justify-evenly w-full h-full overflow-y-auto">
        <div className="flex flex-col justify-center items-center text-2xl my-8">
          {GuideInfo.title.text ? (
            <p className="font-bold">{GuideInfo?.title.text}</p>
          ) : (
            <Skeleton width={400} height={50} />
          )}
        </div>
        <div>
          <div className=" flex justify-center items-center mb-10">
            <div className="flex bg-white rounded-xl border-none px-14 py-7 min-w-[40rem]">
              {GuideInfo.comment.img ? (
                <img src={GuideInfo.comment.img} alt="icon" className="w-6 h-6 mr-10" />
              ) : (
                <Skeleton width={500} />
              )}
              <ChatMessage text={GuideInfo?.comment.text} />
            </div>
          </div>
          <div>
            <div className="flex ml-[6rem] text-[#475569] font-bold text-lg">
              <span>이런 질문은 어떠세요?</span>
            </div>
            <Slider>
              {GuideInfo.cards.length
                ? GuideInfo.cards.map((card, index) => (
                    <Card
                      key={index}
                      serverImg={card.img ? `${connectionInfoState.chathub.restful}/file/image/${card.img}` : ''}
                      img={card.img}
                      title={card.title}
                      text={card.text}
                      onClick={() => handleSelectCardQuestion(card.text)}
                      isDisabled={isMakingQuestions}
                    />
                  ))
                : Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="p-4">
                        <Skeleton width={250} height={280} />
                        <Skeleton count={2} />
                      </div>
                    ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default GptGuide;
