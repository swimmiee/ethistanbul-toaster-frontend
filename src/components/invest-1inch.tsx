import { formatEther, formatUnits } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { ERC20__factory, ToasterPool__factory } from "../typechain";
import { useAccount } from "wagmi";
import TC from "../configs/toaster.config";
import { use1InchSdk } from "./use1InchSDK";
import { OrderInfo } from "@1inch/fusion-sdk";
import { OrderStatusResponse } from "@1inch/fusion-sdk/api/orders";
import { BigNumber } from "ethers";
import { ImSpinner3 } from "react-icons/im";

export interface PoolState {
  tokenId: BigNumber;
  tickLower: number;
  tickUpper: number;
  liquidity: BigNumber;
  totalShare: BigNumber;
}

export const tick2price = (tick: number) =>
  Math.floor(1.0001 ** tick * 10 ** 12 * 10000) / 10000;

export const Invest1inch = () => {
  const [wethBalance, setWethBalance] = useState("0");
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [userShare, setUserShare] = useState("0");
  const [poolState, setPoolState] = useState<PoolState>();
  const { address } = useAccount();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>();
  const [orderRes, setOrderRes] = useState<OrderStatusResponse>();

  const fetchBal = async () => {
    if (!address) return;

    const provider = new JsonRpcProvider(TC.polygon.node);
    ERC20__factory.connect(TC.polygon.POL_WMATIC, provider)
      .balanceOf(address)
      .then((balance) => {
        setWethBalance(formatEther(balance));
      });
    ERC20__factory.connect(TC.polygon.POL_USDC, provider)
      .balanceOf(address)
      .then((balance) => {
        setUsdcBalance(formatUnits(balance, 6));
      });
    const tpool = ToasterPool__factory.connect(
      TC.polygon.TOASTER_USDC_WMATIC_POOL,
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

  const { run, getInfo } = use1InchSdk();
  const onInvest = async () => {
    const o = await run();
    setOrderInfo(o);
    await getInfo(o!, (orderRes) => {
      setOrderRes(orderRes);
      fetchBal();
    });
  };

  return (
    <div className="p-4 flex flex-col border rounded-lg bg-white">
      <div className="flex items-center gap-2">
        <p className="text-3xl font-medium">Using </p>
        <img className="w-10 h-10" src="/img/1inch.png" />
        <p className="text-3xl font-medium">1inch</p>
        <p className="text-3xl font-medium">✖️</p>
        <p className="text-3xl font-medium">Chainlink</p>
        <img className="w-10 h-10" src="/img/chainlink.png" />
      </div>

      <p className="text-xl">Uniswap V3 MATIC+USDC</p>

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
        <p>WMATIC Balance: {wethBalance}</p>
        <p>USDC Balance: {usdcBalance}</p>
        <p>
          <b>Your Liquidity Share:</b> {userShare}
        </p>
      </div>

      <button
        onClick={onInvest}
        className="p-2 text-lg rounded-lg mt-4 bg-yellow-400 hover:bg-yellow-500"
      >
        Invest with 0.2 USDC
      </button>

      {orderInfo && (
        <div className="border rounded-lg my-4 p-2">
          <p className="mt-1">OrderHash: {orderInfo.orderHash}</p>
          <p className="mt-1">Quote ID: {orderInfo.quoteId}</p>

          {orderRes && (
            <div>
              {orderRes.fills.map((f, i) => (
                <div className="mt-2 py-2 border-t">
                  <p className="font-semibold">Fill #{i + 1}</p>
                  <a
                    href={`https://polygonscan.com/tx/${f.txHash}`}
                    target="_blank"
                    className="text-blue-500"
                  >
                    <p>Transaction Hash: {f.txHash}</p>
                  </a>
                  <p>
                    Swapped From {formatUnits(f.filledMakerAmount, 6)} USDC to{" "}
                    {formatEther(f.filledAuctionTakerAmount)} MATIC
                  </p>
                </div>
              ))}

              <hr className="my-2" />
              {orderRes.status === "filled" ? (
                <div className="flex rounded-lg py-1 justify-center bg-yellow-200">
                  <p className="text-xl">Invest completed!</p>
                </div>
              ) : (
                <div className="rounded-lg py-1 bg-red-200 animate-pulse flex justify-center gap-2 items-center">
                  <p className="text-xl">Now filling orders</p>
                  <ImSpinner3 className=" animate-spin" size={22} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
