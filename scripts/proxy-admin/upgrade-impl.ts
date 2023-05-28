// eslint-disable-next-line node/no-missing-import
import { upgrade } from "./proxy-admin-common"
import {ethers} from "hardhat";

const needToUpgradeAddr = ""
const newImpContractName = ""

async function main() {
  const signer = (await ethers.getSigners())[0]
  await upgrade(signer,needToUpgradeAddr, newImpContractName)
}

main().catch((error: any) => {
  console.error(error)
  process.exitCode = 1
})
