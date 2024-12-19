import tw from 'tailwind-styled-components';

interface Props {
  title: string;
  id: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function EditToggle({ title, id, value, onChange }: Props) {
  return (
    <ToggleWrap>
      <Label htmlFor={id}>{title}</Label>
      <Checkbox type="checkbox" id={id} checked={!!value} onChange={(e) => onChange(e.target.checked)} />
    </ToggleWrap>
  );
}

const ToggleWrap = tw.div`
  flex items-center justify-between min-h-[1.875rem] pl-[0.8125rem] pr-[0.625rem]
`;

const Label = tw.label`
  p-0 mr-[0.625rem] text-[1rem]`;

const Checkbox = tw.input`
  relative m-0 w-[2.5rem] h-[1.25rem] rounded-[0.625rem] border border-[#d0d9e3] bg-[#e7ecf1] appearance-none align-middle cursor-pointer transition-colors duration-300
  before:content-[''] before:absolute before:top-[0.125rem] before:left-[0.125rem] before:w-[0.875rem] before:h-[0.875rem] before:bg-white before:border before:border-[#d0d9e3] before:rounded-full before:transition-left before:duration-300
  checked:bg-[#4262ff]
  checked:before:left-[calc(100%-1rem)] checked:before:bg-white
`;
