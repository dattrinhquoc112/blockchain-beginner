import { useEffect, useState } from "react";
import "./App.css";
import CreateTransactionComponent from "./components/CreateTransaction";
import TransactionInfoComponent from "./components/TransactionInfo";
import web3 from "./utils/web3";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const connectWallet = async () => {
    if (
      typeof window != "undefined" &&
      typeof window?.ethereum !== "undefined"
    ) {
      try {
        // Metamask is installed
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {}
    } else {
      // Metamask is not installed
      alert("Please install Metamask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (
      typeof window != "undefined" &&
      typeof window?.ethereum !== "undefined"
    ) {
      try {
        // Metamask is installed
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {}
    } else {
      // Metamask is not installed
      alert("Please install Metamask");
    }
  };

  const addWalletListener = async () => {
    if (
      typeof window != "undefined" &&
      typeof window?.ethereum !== "undefined"
    ) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0]);
      });
      try {
        // Metamask is installed
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {}
    } else {
      // Metamask is not installed
      setWalletAddress("");
      alert("Please install Metamask");
    }
  };

  const getBalance = async () => {
    if (walletAddress) {
      const balance = await web3.eth.getBalance(walletAddress);
      const balanceEther = await web3.utils.fromWei(balance, "ether")
      setWalletBalance(balanceEther);
    }
  };

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
    getBalance();
  });
  return (
    <div className="App">
      <button onClick={connectWallet}>Connect Wallet</button>
      <div
        style={{ border: "1px solid gray", margin: "20px", padding: "20px" }}
      >
        <h3>Wallet infomation</h3>
        {walletAddress && (
          <h5>
            Wallet Address: {walletAddress.substring(0, 5)}...
            {walletAddress.substring(38)}
          </h5>
        )}
        {walletBalance && <h5>Balance(ETH): {walletBalance}</h5>}
      </div>
      <CreateTransactionComponent walletAddress={walletAddress} />
      <TransactionInfoComponent walletAddress={walletAddress} />
    </div>
  );
}

export default App;
