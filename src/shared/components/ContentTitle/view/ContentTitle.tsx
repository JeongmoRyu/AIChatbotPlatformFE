import { PropsWithChildren } from 'react';

interface ContentTitleProps {
  title: string;
  divClassName?: string;
}

function ContentTitle(props: ContentTitleProps & PropsWithChildren) {
  return (
    <div className="flex items-center justify-between laptop:mt-10">
      <h2 className="text-2xl">{props.title}</h2>
      {props.children && <div className={`${props.divClassName}`}>{props.children}</div>}
    </div>
  );
}

export default ContentTitle;
