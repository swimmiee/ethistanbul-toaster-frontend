/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export interface ToasterZapInterface extends utils.Interface {
  functions: {
    "zap(address,int24,int24,uint256,uint256)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "zap"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "zap",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "zap", data: BytesLike): Result;

  events: {};
}

export interface ToasterZap extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ToasterZapInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    zap(
      pool: string,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, boolean, BigNumber] & {
        amountIn: BigNumber;
        amountOut: BigNumber;
        zeroForOne: boolean;
        sqrtPriceX96: BigNumber;
      }
    >;
  };

  zap(
    pool: string,
    tickLower: BigNumberish,
    tickUpper: BigNumberish,
    amount0Desired: BigNumberish,
    amount1Desired: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, boolean, BigNumber] & {
      amountIn: BigNumber;
      amountOut: BigNumber;
      zeroForOne: boolean;
      sqrtPriceX96: BigNumber;
    }
  >;

  callStatic: {
    zap(
      pool: string,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, boolean, BigNumber] & {
        amountIn: BigNumber;
        amountOut: BigNumber;
        zeroForOne: boolean;
        sqrtPriceX96: BigNumber;
      }
    >;
  };

  filters: {};

  estimateGas: {
    zap(
      pool: string,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    zap(
      pool: string,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
