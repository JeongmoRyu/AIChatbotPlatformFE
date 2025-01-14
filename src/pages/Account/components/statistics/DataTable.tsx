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
              <td>{parseInt(item.success).toLocaleString()}</td>
              <td>{parseInt(item.failure).toLocaleString()}</td>
              <td>{parseInt(item.total).toLocaleString()}</td>
            </>
          )}
          {props.type === 'bar' && (
            <>
              <td>{parseInt(item.input).toLocaleString()}</td>
              <td>{parseInt(item.output).toLocaleString()}</td>
              <td>{parseInt(item.total).toLocaleString()}</td>
            </>
          )}
        </tr>
      );
    });
  };

  return (
    <table className="w-full h-auto border-y border-[#DDDDDD] text-center text-[.875rem]">
      <thead className="w-full h-[50px] text-[#7B8188]">
        <tr className="h-[50px] bg-[#F4F6F8]">
          <td className="w-[210px]">Model</td>
          {props.type === 'line' && (
            <>
              <td>Success</td>
              <td>Failure</td>
              <td>Total</td>
            </>
          )}
          {props.type === 'bar' && (
            <>
              <td>Input Tokens</td>
              <td>Output Tokens</td>
              <td>Total Tokens</td>
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
