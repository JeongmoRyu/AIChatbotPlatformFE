import { ColorRing } from 'react-loader-spinner';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import github from 'react-syntax-highlighter/dist/esm/styles/hljs/github';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';

import GeneralButton from '@/shared/components/GeneralButton/view/GeneralButton';

import icoInfo from '@/shared/assets/images/image/llm/ico_info_generate.svg';
import ico_copy from '@/shared/assets/images/image/llm/ico_copy_16.svg';
import ico_reset from '@/shared/assets/images/image/llm/ico_re_generate_16_2.svg';
import useResultCardViewModel from '../viewModel/useResultCardViewModel';

const ResultCard = ({
  title,
  createdSentence,
  regenerateLoading,
  onClickReCreate,
  nowGeneration,
  disabled,
  markdown = false,
  preview,
  regenerate = true,
  height = 22,
}: ResultCardCoreProps) => {
  const { t } = useTranslation(['llm']);

  const { length, byte, onClickCopyTitle } = useResultCardViewModel({ createdSentence, preview });

  const githubStyle = github as any;

  return (
    <>
      <div className="flex flex-row items-end justify-between w-full mb-2 ">
        <div className="flex flex-row items-end wf-form">
          <p className=" marketing-title">{title}</p>
          <div className="flex justify-start ml-4">
            <p className="text-[#75869b] text-sm ">
              ({length} {t('llm:자')} / {byte} Byte )
            </p>
          </div>
        </div>

        <div className="flex flex-row items-end justify-between ">
          <div className="flex flex-row gap-4">
            <GeneralButton
              type="button"
              className={`flex !px-3 items-center cursor-pointer bg-white border-set-border !h-8 ${preview ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={onClickCopyTitle}
              name="copyContent"
            >
              <div className="flex items-center">
                <img src={ico_copy} alt="delete" />
                <span className="mx-2 ml-2 text-sm "> {t('llm:복사')}</span>
              </div>
            </GeneralButton>
            {regenerate && (
              <GeneralButton
                type="button"
                name={title}
                className={`flex !px-3 items-center cursor-pointer bg-white border-set-border !h-8  ${disabled || preview ? ' !cursor-not-allowed' : ' cursor-pointer'} ${disabled ? 'bg-toggle-disabled' : 'bg-[#eaedee]'}`}
                onClick={(e) => {
                  !preview && onClickReCreate && onClickReCreate(e);
                }}
                disabled={disabled}
              >
                <div className={`flex items-center `}>
                  {regenerateLoading ? (
                    <ColorRing
                      visible={true}
                      height="30"
                      width="30"
                      ariaLabel="blocks-loading-interlock"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                      colors={['#75869b', '#75869b', '#75869b', '#75869b', '#75869b']}
                    />
                  ) : (
                    <img src={ico_reset} className="h-4 " alt="reset" />
                  )}
                  <span className="mx-2 ml-2 text-sm">{t('llm:다시_생성')}</span>
                </div>
              </GeneralButton>
            )}
          </div>
        </div>
      </div>

      <div
        className={` flex items-start overflow-y-auto w-full p-6 rounded-2xl bg-white border border-input-border border-dashed py-6 break-words`}
        style={{
          maxHeight: `${height}rem`,
          minHeight: `${height}rem`,
          // maxWidth: '38rem',
        }}
      >
        {createdSentence ? (
          <div>
            {markdown ? (
              <ReactMarkdown
                className="markdown-body"
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      // <SyntaxHighlighter
                      //   style={githubStyle}
                      //   customStyle={{
                      //     maxWidth: '100%',
                      //     overflowX: 'auto',
                      //     wordWrap: 'break-word',
                      //     whiteSpace: 'pre-wrap',
                      //     boxSizing: 'border-box',
                      //   }}
                      //   language={match[1]}
                      //   PreTag="div"
                      //   {...props}
                      // >
                      //   {String(children).replace(/\n$/, '')}
                      // </SyntaxHighlighter>

                      <SyntaxHighlighter style={githubStyle} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {createdSentence}
              </ReactMarkdown>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap' }}>{createdSentence}</div>
            )}
          </div>
        ) : nowGeneration ? (
          <div className={`flex flex-col h-full w-full justify-center items-center `}>
            <div role="status">
              <svg
                className="w-8 h-8 mr-3 -ml-1 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <div className="flex flex-col items-center mt-4 font-medium">
              <p>Generating...</p>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col h-full w-full justify-center items-center`}>
            <img src={icoInfo} className="object-contain w-10 h-14" />
            <div className="flex flex-col items-center mt-2 ">
              <p>{t('llm:생성_하기_버튼을_눌러주세요')}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultCard;
