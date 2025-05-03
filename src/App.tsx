import { useEffect, useState } from "react";
import WalletConnect from "./components/WalletConnect";
import HomePage from "./components/HomePage";
import { Toaster } from "sonner";

function App() {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("walletAddress");
    if (stored) setConnectedAddress(stored);
  }, []);

  const handleConnected = (address: string) => {
    setConnectedAddress(address);
    localStorage.setItem("walletAddress", address);
  };

  const handleDisconnect = () => {
    setConnectedAddress(null);
    localStorage.removeItem("walletAddress");
  };

  return (
    <>
      {connectedAddress ? (
        <>
          <Toaster richColors position="top-center" />
          <HomePage owner={connectedAddress} onDisconnect={handleDisconnect} />
        </>
      ) : (
        <WalletConnect onConnected={handleConnected} />
      )}
    </>
  );
}

export default App;
