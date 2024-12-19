import right_arrow from '@/shared/assets/images/icons/ico_right_arrow_fill.svg';
import left_arrow from '@/shared/assets/images/icons/ico_left_arrow_fill.svg';
import left_arrow_inactive from '@/shared/assets/images/icons/ico_left_arrow.svg';
import right_arrow_inactive from '@/shared/assets/images/icons/ico_right_arrow.svg';
import useSliderViewModel from '../viewModel/useSliderViewModel';

function Slider({ children, width }: ISliderProps) {
  const { handleLeftClick, isAtStart, sliderRef, handleRightClick, isAtEnd } = useSliderViewModel();

  return (
    <div className="flex items-center w-full justify-between min-w-0">
      <button className="flex items-center justify-center w-5 h-5" onClick={handleLeftClick}>
        <img
          src={isAtStart ? left_arrow_inactive : left_arrow}
          alt="left"
          style={{
            filter: isAtStart ? 'brightness(74%) contrast(10%)' : 'brightness(0%)',
          }}
        />
      </button>
      <div
        className={`slider-container flex items-center overflow-x-auto scrollbar-hide relative p-5 ${width}`}
        ref={sliderRef}
      >
        <div className="slider flex space-x-8">{children}</div>
      </div>
      <button className="flex items-center justify-center w-5 h-5" onClick={handleRightClick}>
        <img
          src={isAtEnd ? right_arrow_inactive : right_arrow}
          alt="right"
          style={{
            filter: isAtEnd ? 'brightness(74%) contrast(10%)' : 'brightness(0%)',
          }}
        />
      </button>
    </div>
  );
}

export default Slider;
