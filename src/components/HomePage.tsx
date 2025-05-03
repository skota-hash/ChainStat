import React from "react";
import { Navbar } from "./Navbar";
import Balance from "./Balance";
import Dashboard from "./Dashboard";

interface HomePageProps {
  owner: string;
  onDisconnect: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ owner, onDisconnect }) => {
  return (
    <div className="font-geist">
      <Navbar walletAddress={owner} onDisconnect={onDisconnect} />
      <Balance walletAddress={owner} />
      <Dashboard />
    </div>
  );
};

export default HomePage;
