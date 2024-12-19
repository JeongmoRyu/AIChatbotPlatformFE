import useDragSliderViewModel from '../viewModel/useDragSliderViewModel';

interface Props {
  label: string;
  smallText: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
}

export default function DragSlider({ label, smallText, min, max, value, onChange, isDisabled }: Props) {
  const { handleSliderChange, sliderRef, spot1Ref, spot2Ref, spot3Ref, isActive, valueLabelRef } =
    useDragSliderViewModel({ value, min, max, isDisabled, onChange });
  return (
    <div className="drag_slider_box">
      <em className="txt_label">
        {label}
        <span>{smallText}</span>
      </em>
      <div className="drag">
        <div className="drag_bar">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleSliderChange}
            className="slider"
            step={50}
            ref={sliderRef}
          />
          <span ref={spot1Ref} className={`spot ${isActive[0] ? 'active' : ''}`}></span>
          <span ref={spot2Ref} className={`spot ${isActive[1] ? 'active' : ''}`}></span>
          <span ref={spot3Ref} className={`spot ${isActive[2] ? 'active' : ''}`}></span>
          <div className="drag_fill" ref={valueLabelRef}>
            {value}
          </div>
        </div>
        <span className="txt_min">{parseInt(String(min)).toLocaleString()}</span>
        <span className="txt_max">{parseInt(String(max)).toLocaleString()}</span>
      </div>
    </div>
  );
}
