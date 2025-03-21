import { useMemo, useEffect } from 'react';
type Mode = 'rq' | 'rag' | 'llm';
interface UseEssentialCheckProps {
  userPrompt: string;
  requiredKeys: string[];
  valueCheck?: (mode: Mode, value: boolean) => void;
  mode: Mode;
}

export const useEssentailCheckViewModel = ({ userPrompt, requiredKeys, valueCheck, mode }: UseEssentialCheckProps) => {
  const { updatedKeys, hasRed } = useMemo(() => {
    const usingData = ['client_info', ...requiredKeys];
    const keyCounts: Record<string, number> = {};
    const processedContents = new Set<string>();

    usingData.forEach((key) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      while (regex.exec(userPrompt) !== null) {
        keyCounts[key] = (keyCounts[key] || 0) + 1;
      }
    });

    const tempKeys: { key: string; colorClass: string }[] = usingData.map((key) => {
      const count = keyCounts[key] || 0;
      let colorClass = 'text-[#9b9d9e]';

      if (count > 1) {
        colorClass = 'text-[#fe4336]';
      } else if (count === 1) {
        if (key === 'client_info') {
          colorClass = 'text-[#4262ff]';
        } else if (requiredKeys.includes(key)) {
          colorClass = 'text-[#4262ff]';
        }
      } else if (requiredKeys.includes(key)) {
        colorClass = 'text-[#fe4336]';
      }

      return { key, colorClass };
    });

    const regex = /\{([^}]+)\}/g;
    let match;
    while ((match = regex.exec(userPrompt)) !== null) {
      const content = match[1];
      if (!usingData.includes(content) && !processedContents.has(content)) {
        tempKeys.push({
          key: content.length > 10 ? `${content.substring(0, 10)}...` : content,
          colorClass: 'text-[#fe4336]',
        });
        processedContents.add(content);
      }
    }

    const hasRed = tempKeys.some(({ colorClass }) => colorClass === 'text-[#fe4336]');
    return { updatedKeys: tempKeys, hasRed };
  }, [userPrompt, requiredKeys]);

  useEffect(() => {
    if (valueCheck) {
      valueCheck(mode, !hasRed);
    }
  }, [hasRed, mode, valueCheck]);

  return { updatedKeys };
};
