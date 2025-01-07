import React from 'react';
import { Controller } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';

import useEngineParameterInputChatPlayViewModel from '../viewModel/useEngineParameterInputChatPlayViewModel';

import InfoIcon from '@/shared/assets/images/icons/ico_info.svg';

interface EngineParameterInputProps {
  engineParams: Record<string, IEngineParameterChatPlay> | undefined;
  engineInfo: any;
  paramType: 'llm' | 'rag';
  setValue: (field: string, value: any) => void;
  control?: any;
  language: string;

  watch?: any;
  getValue?: any;
}

export const EngineParameterInputChatPlay: React.FC<EngineParameterInputProps> = ({
  engineParams,
  paramType,
  setValue,
  control,
  language,
  engineInfo,
  watch,
  getValue,
}) => {
  const viewModel = useEngineParameterInputChatPlayViewModel({
    engineParams,
    paramType,
    setValue,
    watch,
    getValue,
  });

  if (!viewModel) return null;

  const { llmEngineIdValue, handleInputChange } = viewModel;

  return (
    <>
      {engineParams && (
        <div>
          {Object.entries(engineParams).map(([key, param]) => {
            if (!param && !engineInfo) return null;

            const llmFiltered = engineInfo.llm.filter((item: any) => {
              return item.llm_workflow_id === llmEngineIdValue;
            });

            const selectedEngineInfo = paramType === 'llm' ? llmFiltered[0].config : '';

            return (
              <div className="flex items-center my-5" key={`llm_configs[${key}]`}>
                <div className="flex items-center">
                  <img
                    src={InfoIcon}
                    alt="info"
                    className="w-5 h-5 mr-1.5 cursor-help"
                    data-tooltip-id={`tooltip-${paramType}-${key}`}
                  />
                  <Tooltip
                    id={`tooltip-${paramType}-${key}`}
                    content={
                      language === 'ko'
                        ? selectedEngineInfo[key]?.info
                        : selectedEngineInfo[key]?.engInfo || selectedEngineInfo[key]?.info
                    }
                  />
                </div>
                {selectedEngineInfo[key]?.name} ({selectedEngineInfo[key]?.range?.from} ~&nbsp;
                {selectedEngineInfo[key]?.range?.to})
                {selectedEngineInfo[key]?.required && <span className="ml-1 text-red-500">*</span>}
                <Controller
                  name={`llm_configs[${key}]`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <input
                        {...field}
                        type="text"
                        className="ml-auto w-[100px] text-right border !h-[40px] px-2 border-solid border-set-border rounded"
                        value={
                          field.value !== undefined && field.value !== null && field.value !== ''
                            ? field.value
                            : typeof engineParams[key] === 'object'
                              ? param
                              : 0
                        }
                        onChange={(e) => {
                          handleInputChange(e, setValue, selectedEngineInfo, key);

                          field.onChange(e);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                      />
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
