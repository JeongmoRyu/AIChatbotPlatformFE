declare module 'react-syntax-highlighter/dist/esm/styles/hljs/github' {
  const github: { [key: string]: React.CSSProperties };
  export default github;
}

declare module 'react-syntax-highlighter/dist/esm/styles/hljs/*' {
  const style: { [key: string]: React.CSSProperties };
  export default style;
}

declare module 'react-syntax-highlighter' {
  import * as React from 'react';

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: { [key: string]: React.CSSProperties };
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    PreTag?: React.ElementType;
    wrapLongLines?: boolean;
    children?: React.ReactNode;
    customStyle?: any;
  }

  export const Prism: React.FC<SyntaxHighlighterProps>;
  export const Light: React.FC<SyntaxHighlighterProps>;
  export const Highlight: React.FC<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const style: { [key: string]: React.CSSProperties };
  export default style;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const dracula: { [key: string]: React.CSSProperties };
}
