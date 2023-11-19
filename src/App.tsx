import { ConnectKitButton } from "connectkit";
import { Invest1inch } from "./components/invest-1inch";
import { InvestLinea } from "./components/invest-linea";

function App() {
  return (
    <div>
      <header className="flex justify-between items-center p-6">
        <p className="font-semibold text-2xl">
          Toaster Liquidity Management 🍞
        </p>
        <div className="flex gap-4">
          <button className="flex gap-2 px-4 rounded-lg py-2 items-center bg-black text-white">
            <img src="/img/flask_fox.svg" width={20} />
            Reconnect
          </button>
          <ConnectKitButton />
        </div>
      </header>
      <div className="h-screen p-12 bg-neutral-50 grid grid-cols-2 gap-12">
        <div>
          <Invest1inch />
        </div>
        <div>
          <InvestLinea />
        </div>
      </div>
    </div>
  );
}

export default App;
