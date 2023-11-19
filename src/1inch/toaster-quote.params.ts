import { BigNumber } from "ethers";

export interface ToasterQuoteParams {
  toasterPool: string;
  // pool: string;
  baseToken: string
  baseAmount: BigNumber;
  // quoteAmount: bigint;
}
