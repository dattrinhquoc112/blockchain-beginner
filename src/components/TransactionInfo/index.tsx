import { useState } from "react";
import { Table } from "react-bootstrap";
import web3 from "../../utils/web3";

const TransactionInfoComponent: React.FC<{ walletAddress: string }> = ({
  walletAddress,
}) => {
  const [optionValue, setOptionValue] = useState("block_number");
  const [inputValue, setInputValue] = useState("");
  const [transactionInfo, setTransactionInfo] = useState<any>();
  const getTransactionByTransactionHash = async (transactionHash: string) => {
    await web3.eth.getTransaction(transactionHash, (_err, transaction) => {
      setTransactionInfo(transaction);
    });
  };

  const getTransactionByBlock = async (blockNumber: number) => {
    const block = await web3.eth.getBlock(blockNumber);
    if (block != null && block.transactions != null) {
      for (let txHash of block.transactions) {
        let tx = await web3.eth.getTransaction(txHash);
        if (
          walletAddress === tx?.to?.toLowerCase() ||
          walletAddress === tx?.from?.toLowerCase()
        ) {
          setTransactionInfo(tx);
        }
      }
    }
  };

  const onGetTransactionInfo = () => {
    switch (optionValue) {
      case "block_number":
        getTransactionByBlock(Number(inputValue));
        break;
      case "txn_hash":
        getTransactionByTransactionHash(inputValue);
        break;
      default:
    }
  };

  const columns = [
    "blockHash",
    "blockNumber",
    "chainId",
    "from",
    "gas",
    "gasPrice",
    "hash",
    "input",
    "maxFeePerGas",
    "maxPriorityFeePerGas",
    "nonce",
    "r",
    "s",
    "to",
    "transactionIndex",
    "type",
    "v",
    "value",
  ];

  const renderTable = () => {
    return (
      <Table className="table-responsive" striped bordered hover>
        <thead>
          <tr>
            {columns.map((column) => {
              return <th>{column}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map((column) => {
              return (
                <td style={{ wordBreak: "break-all" }}>
                  {transactionInfo ? transactionInfo[column] : ""}
                </td>
              );
            })}
          </tr>
        </tbody>
      </Table>
    );
  };

  return (
    <div style={{ border: "1px solid gray", margin: "20px", padding: "20px" }}>
      <select onChange={(e) => setOptionValue(e.target.value)}>
        <option value="block_number">Block Number</option>
        <option value="txn_hash">Txn Hash</option>
      </select>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={onGetTransactionInfo}>
        Get Transaction Information
      </button>
      <div>{transactionInfo && renderTable()}</div>
    </div>
  );
};

export default TransactionInfoComponent;
