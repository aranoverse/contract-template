import {BigNumber} from "ethers"

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function bigNumber(num: string | number, decimals: number = 18): BigNumber {
  return BigNumber.from(10).pow(decimals).mul(BigNumber.from(num))
}

export function capitalizeFirstLetter(input: string): string {
  if (input.length === 0) {
    return input;
  }
  return input.charAt(0).toLowerCase() + input.slice(1);
}
