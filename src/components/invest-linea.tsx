import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { ERC20__factory, ToasterPool__factory } from "../typechain";
import { useAccount } from "wagmi";
import { useGetSigner } from "../hooks/useGetSigner";
import TC from "../configs/toaster.config";
import { PoolState, tick2price } from "./invest-1inch";

export const InvestLinea = () => {
  const [wethBalance, setWethBalance] = useState("0");
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [userShare, setUserShare] = useState("0");

  const [poolState, setPoolState] = useState<PoolState>();

  const { address } = useAccount();
  const getSigner = useGetSigner();
  const [finish, setFinish] = useState(false);

  const fetchBal = async () => {
    if (!address) return;

    const provider = new JsonRpcProvider(TC.local.node);
    ERC20__factory.connect(TC.local.ARB_WETH, provider)
      .balanceOf(address)
      .then((balance) => {
        setWethBalance(formatEther(balance));
      });
    ERC20__factory.connect(TC.local.ARB_USDC, provider)
      .balanceOf(address)
      .then((balance) => {
        setUsdcBalance(formatUnits(balance, 6));
      });

    const tpool = ToasterPool__factory.connect(
      TC.local.TOASTER_USDC_WETH_POOL,
      provider
    );
    tpool.userShare(address).then((share) => {
      setUserShare(share.toString());
    });
    tpool.state().then((state) => {
      setPoolState(state);
    });
  };
  useEffect(() => {
    fetchBal();
  }, []);

  const onInvest = async () => {
    const signer = await getSigner(1337);
    if (!signer) return;

    const toaster = ToasterPool__factory.connect(
      TC.local.TOASTER_USDC_WETH_POOL,
      signer
    );

    await toaster
      .zapLiquidity(parseEther("0.0000005"), parseUnits("0.01", 6))
      .then((tx) => tx.wait());
    fetchBal().then(() => setFinish(true));
  };

  return (
    <div className="p-4 flex flex-col border rounded-lg bg-white">
      <div className="flex items-center gap-2">
        <p className="text-3xl font-medium">With Snap</p>
        <img src="/img/flask_fox.svg" width={32} />
      </div>

      <p className="text-xl">Pancakeswap V3 ETH+USDC</p>

      <div className="my-4 p-3 h-40 border rounded">
        <div className="flex">
          <p className="bg-neutral-100 px-3 py-0.5 rounded-lg mb-2">
            Current Pool Info
          </p>
        </div>
        {poolState && (
          <>
            <a
              target="_blank"
              className="text-blue-500"
              href={`https://app.uniswap.org/pools/${poolState.tokenId.toString()}`}
            >
              <p>Position ID: {poolState.tokenId.toString()}</p>
            </a>
            <p>Total Liquidity {poolState.liquidity.toString()}</p>
            <p className="font-semibold">Pool Price range</p>
            <p>
              {tick2price(poolState.tickLower)} USDC/MATIC ~{" "}
              {tick2price(poolState.tickUpper)} USDC/MATIC
            </p>
          </>
        )}
      </div>

      <div className="my-2 p-3 border rounded">
        <div className="flex">
          <p className="bg-neutral-100 px-3 py-0.5 rounded-lg mb-2">
            Your Balances
          </p>
        </div>
        <p>WETH Balance: {wethBalance}</p>
        <p>USDC Balance: {usdcBalance}</p>
        <p>
          <b>Your Liquidity Share:</b> {userShare}
        </p>
      </div>

      <button
        onClick={onInvest}
        className="p-2 text-lg text-white rounded-lg mt-4 bg-purple-400 hover:bg-purple-500"
      >
        Invest with MetaMask Snap
      </button>
      {finish && (
        <div className="mt-4 flex rounded-lg py-1 justify-center bg-purple-200">
          <p className="text-xl">Invest completed!</p>
        </div>
      )}
    </div>
  );
};
