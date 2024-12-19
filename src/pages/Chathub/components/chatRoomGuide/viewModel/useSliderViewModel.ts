import { useEffect, useRef, useState } from 'react';

const useSliderViewModel = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const checkIfAtStartOrEnd = () => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth);
    };

    checkIfAtStartOrEnd();
    const currentSlider = sliderRef.current;
    currentSlider?.addEventListener('scroll', checkIfAtStartOrEnd);

    return () => {
      currentSlider?.removeEventListener('scroll', checkIfAtStartOrEnd);
    };
  }, []);

  const handleRightClick = () => {
    if (sliderRef.current) {
      const { scrollLeft } = sliderRef.current;
      const newScrollPosition = scrollLeft + 300;
      sliderRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleLeftClick = () => {
    if (sliderRef.current) {
      const { scrollLeft } = sliderRef.current;
      const newScrollPosition = scrollLeft - 300;
      sliderRef.current.scrollTo({
        left: newScrollPosition > 0 ? newScrollPosition : 0,
        behavior: 'smooth',
      });
    }
  };
  return { handleLeftClick, handleRightClick, isAtStart, isAtEnd, sliderRef };
};

export default useSliderViewModel;
