import React from 'react';
import { useEssentailCheckViewModel } from '../viewModel/useEssentialCheckViewModel';

type Mode = 'rq' | 'rag' | 'llm';
interface EssentialCheckProps {
  userPrompt: string;
  requiredKeys: string[];
  valueCheck?: (mode: Mode, value: boolean) => void;
  mode: Mode;
}

const DynamicKeyDisplay: React.FC<EssentialCheckProps> = ({ userPrompt, requiredKeys, valueCheck, mode }) => {
  const { updatedKeys } = useEssentailCheckViewModel({ userPrompt, requiredKeys, valueCheck, mode });

  return (
    <div className="essential-check">
      {updatedKeys.map(({ key, colorClass }) => (
        <div key={`${mode}_${key}`} className={`${colorClass}`}>
          {key}
        </div>
      ))}
    </div>
  );
};

export default React.memo(DynamicKeyDisplay);
