import { BigNumber, providers } from "ethers";
import { NetworkEnum, OrderInfo } from "@1inch/fusion-sdk";
import { useWalletClient } from "wagmi";
import { Web3ProviderConnector } from "../1inch/Web3ProviderConnector";
import { ToasterFusionSDK } from "../1inch/toaster-fusion-sdk";
import TC from "../configs/toaster.config";
import { useState } from "react";
import { OrderStatusResponse } from "@1inch/fusion-sdk/api/orders";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const use1InchSdk = () => {
  const { data: client } = useWalletClient();
  const [sdk, setSdk] = useState<ToasterFusionSDK>();

  const run = async () => {
    if (!client) return;

    const sdk = new ToasterFusionSDK({
      url: "https://fusion.1inch.io",
      network: NetworkEnum.POLYGON,
      blockchainProvider: new Web3ProviderConnector(
        new providers.Web3Provider(client.transport, {
          chainId: client.chain.id,
          name: client.chain.name,
          ensAddress: client.chain.contracts?.ensRegistry?.address,
        })
      ),
    });
    setSdk(sdk);

    const usdcAmount = BigNumber.from(200000); // 0.00001 USDC
    // 절반은 스왑, 절반은 그대로

    return sdk.placeOrder(
      {
        fromTokenAddress: TC.polygon.POL_USDC,
        toTokenAddress: TC.polygon.POL_WMATIC,
        amount: usdcAmount.div(2).toString(),
        walletAddress: client.account.address,
        // fee is an optional field
      },
      {
        toasterPool: TC.polygon.TOASTER_USDC_WMATIC_POOL,
        // USDC 주소
        baseToken: TC.polygon.POL_USDC,
        // WETH 주소
        // quoteToken: ARB_WETH,
        // Uniswap V3 pool fee
        // 투자할 USDC 양 / 2
        baseAmount: usdcAmount.div(2),
      }
    );
  };

  const getInfo = async (
    order: OrderInfo,
    onOrderChange: (r: OrderStatusResponse) => void
  ) => {
    if (!client) return;

    const sdk = new ToasterFusionSDK({
      url: "https://fusion.1inch.io",
      network: NetworkEnum.POLYGON,
      blockchainProvider: new Web3ProviderConnector(
        new providers.Web3Provider(client.transport, {
          chainId: client.chain.id,
          name: client.chain.name,
          ensAddress: client.chain.contracts?.ensRegistry?.address,
        })
      ),
    });

    let intervalId = setInterval(async () => {
      await sdk.getOrderStatus(order.orderHash).then((s) => {
        console.log(s);
        onOrderChange(s);
        if (s.status === "filled") {
          clearInterval(intervalId);
        }
      });
    }, 500);
  };

  return { run, getInfo };
};
