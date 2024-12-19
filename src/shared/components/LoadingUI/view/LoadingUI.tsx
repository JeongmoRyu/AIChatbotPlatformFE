import { PropsWithChildren } from 'react';

interface LoadingUIProps {
  className?: string;
}

function LoadingUI(props: LoadingUIProps & PropsWithChildren) {
  return (
    <div id="pageldg" className={props.className}>
      <div>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {props.children}
    </div>
  );
}

export default LoadingUI;
