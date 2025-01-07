interface DataTableProps {
  type: string;
  data: any;
}

const DataTable = (props: DataTableProps) => {
  const renderTableBodyRow = () => {
    return props.data.map((item: any, index: number) => {
      return (
        <tr key={`${item.model}_${index}`} className="h-[50px] border-t border-[#DDDDDD]">
          <td>{item.model}</td>
          {props.type === 'line' && (
            <>
              <td>{item.success}</td>
              <td>{item.failure}</td>
              <td>{item.total}</td>
            </>
          )}
          {props.type === 'bar' && (
            <>
              <td>{item.input}</td>
              <td>{item.output}</td>
              <td>{item.total}</td>
            </>
          )}
        </tr>
      );
    });
  };

  return (
    <table className="w-full h-[9.375rem] border-y border-[#DDDDDD] text-center text-[.875rem]">
      <thead className="w-full h-[33.3%] text-[#7B8188]">
        <tr className="h-[50px] bg-[#F4F6F8]">
          <td className="w-[210px]">Model</td>
          {props.type === 'line' && (
            <>
              <td className="w-[140px]">Success</td>
              <td className="w-[140px]">Failure</td>
              <td className="w-[140px]">Total</td>
            </>
          )}
          {props.type === 'bar' && (
            <>
              <td className="w-[140px]">Input Tokens</td>
              <td className="w-[140px]">Output Tokens</td>
              <td className="w-[140px]">Total Tokens</td>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {renderTableBodyRow()}
        {/*</tr>*/}
      </tbody>
    </table>
  );
};

export default DataTable;
