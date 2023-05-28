// eslint-disable-next-line node/no-missing-import
import { transferProxyAdminOwnerShip } from "./proxy-admin-common"
import { ethers } from "hardhat"



const proxyAdminAddress = ""
const newProxyAdminOwner = ""
async function main() {
  const singer = (await ethers.getSigners())[0]
  await transferProxyAdminOwnerShip(singer, proxyAdminAddress, newProxyAdminOwner)
}

main().catch((error: any) => {
  console.error(error)
  process.exitCode = 1
})
