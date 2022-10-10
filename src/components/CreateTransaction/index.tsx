import { useEffect, useState } from "react";
import web3 from "../../utils/web3";

interface Props {
  walletAddress: string;
}
const CreateTransactionComponent: React.FC<Props> = (props) => {
  const { walletAddress } = props;
  const [gasPrice, setGasPrice] = useState("");
  const [transactionObject, setTransactionObject] = useState({
    from: walletAddress,
    to: "",
    value: "",
    // gas: "",
    nonce: 0,
  });

  const getGasPrice = async () => {
    await web3.eth.getGasPrice().then((res) => setGasPrice(res));
  };

  const onChangeInput = (field: string, value: any) => {
    setTransactionObject({ ...transactionObject, [field]: value });
  };

  const onCreateTransaction = async () => {
    await web3.eth.sendTransaction(transactionObject);
  };

  useEffect(() => {
    getGasPrice();
  }, []);

  useEffect(() => {
    setTransactionObject({ ...transactionObject, from: walletAddress });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);
  return (
    <div style={{ border: "1px solid gray", margin: "20px", padding: "20px" }}>
      <h3>Create A Transaction</h3>

      <h5>From: {walletAddress}</h5>
      <h5>
        to:{" "}
        <input
          value={transactionObject.to}
          onChange={(e) => onChangeInput("to", e.target.value)}
        />
      </h5>
      <h5>
        value(wei):{" "}
        <input
          value={transactionObject.value}
          onChange={(e) => onChangeInput("value", e.target.value)}
        />
      </h5>
      <h5>gasPrice(wei): {gasPrice}</h5>
      <h5>
        nonce:{" "}
        <input
          value={transactionObject.nonce}
          type={"number"}
          onChange={(e) => onChangeInput("nonce", e.target.value)}
        />
      </h5>
      <button onClick={onCreateTransaction}>Create Transaction</button>
    </div>
  );
};

export default CreateTransactionComponent;
