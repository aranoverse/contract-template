import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {Contract} from "ethers";


export const PROXY_ADMIN_ABI = [
  "function owner() external view returns (address)",
  "function upgrade(address proxy,address implementation) external",
  "function transferOwnership(address newOwner) public",
]

export const PROXY_ADMIN_SLOT = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"

export async function transferProxyAdminOwnerShip(
  signer: SignerWithAddress,
  proxyAdminAddress: string,
  newOwnerAddress: string
) {
  if (proxyAdminAddress.length === 0) {
    throw new Error("proxyAdminAddress is empty")
  }
  if (newOwnerAddress.length === 0) {
    throw new Error("newOwnerAddress is empty")
  }

  // check sum
  proxyAdminAddress = ethers.utils.getAddress(proxyAdminAddress)
  newOwnerAddress = ethers.utils.getAddress(newOwnerAddress)

  console.log("currentUser:", signer.address)

  const { proxyAdminContract, proxyAdminOwner } = await getProxyAdmin(proxyAdminAddress)

  console.log(`Transferring proxyAdminOwnerShip to ${newOwnerAddress}`)

  const tx = await proxyAdminContract.transferOwnership(newOwnerAddress)
  await tx.wait();

  console.log(`Done, old owner is ${proxyAdminOwner}, new owner is ${newOwnerAddress}`)
}

export async function getProxyAdmin(proxyAdminAddress: string):Promise<{proxyAdminContract:Contract,proxyAdminOwner:string}> {
  const proxyAdminContract:Contract = await ethers.getContractAt(PROXY_ADMIN_ABI, proxyAdminAddress)
  const proxyAdminOwner:string = await proxyAdminContract.owner()

  console.log(`ProxyAdmin Contract Owner: ${proxyAdminOwner}`)
  return {proxyAdminContract: proxyAdminContract, proxyAdminOwner: proxyAdminOwner}
}

export async function upgrade(signer:SignerWithAddress,preVersionImplAddress: string, newImpContractName: string) {
  console.log("signer:", signer.address)

  // check sum
  preVersionImplAddress = ethers.utils.getAddress(preVersionImplAddress)

  const proxyAdminAddress =
    "0x" + (await ethers.provider.getStorageAt(preVersionImplAddress, PROXY_ADMIN_SLOT)).substring(26)

  console.log(`ProxyAdmin Contract Addr: ${proxyAdminAddress}`)

  const { proxyAdminContract, proxyAdminOwner } = await getProxyAdmin(proxyAdminAddress)

  if (ethers.utils.getAddress(proxyAdminOwner) !== ethers.utils.getAddress(signer.address)) {
    throw new Error(`Bad Signer, should use ${proxyAdminOwner}`)
  }

  const Factory = await ethers.getContractFactory(newImpContractName)
  const newImpl = await Factory.deploy()
  await newImpl.deployed()
  console.log(`New ${newImpContractName}: ${newImpl.address}`)


  const tx = await proxyAdminContract.connect(signer).upgrade(preVersionImplAddress, newImpl.address);
  await tx.wait()
  console.log(
    `${newImpContractName} Contract ${preVersionImplAddress} success updated to new ${newImpContractName} impl ${newImpl.address}`
  )
}
