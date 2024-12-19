export const findIndexByName = <T extends { name: string }>(dataList: T[], selectedLabel: string): number | null => {
  for (let engineindex = 0; engineindex < dataList.length; engineindex++) {
    if (dataList[engineindex].name === selectedLabel) {
      return engineindex;
    }
  }
  return null;
};

export const getByteSize = (size: number) => {
  const byteUnits = ['KB', 'MB', 'GB', 'TB'];
  for (let i = 0; i < byteUnits.length; i++) {
    size = Math.floor(size / 1024);
    if (size < 1024) return size.toFixed(1) + byteUnits[i];
  }
};

export const findEngineById = (engineData: any[], engineId: any) => {
  return engineData.find((engine) => engine.llm_workflow_id === Number(engineId));
};

export const replaceWithBr = (chatData: string) => {
  if (typeof chatData === 'string') {
    return chatData.replace(/\n/g, '<br />');
  } else {
    return '';
  }
};
