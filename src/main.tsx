import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiConfig } from "wagmi";
import wagmiConfig from "./configs/wagmi.config.ts";
import { ConnectKitProvider } from "connectkit";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WagmiConfig config={wagmiConfig}>
    <ConnectKitProvider>
      <App />
    </ConnectKitProvider>
  </WagmiConfig>
);
