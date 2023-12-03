import {cfg, getProp} from "../scripts/utils/config";
import {task} from "hardhat/config";

task("upgrades", "Upgrades contract")
    .addParam("factory", "Factory of contract")
    .addOptionalParam("contract", "Contract name in config")
    .setAction(async function (
            args,
            env
        ): Promise<any> {
            const ethers = env.ethers
            const network = env.network.name
            const upgrades = env.upgrades
            console.log(args)

            const c = cfg(network)
            const facName = args["factory"]
            if (facName == null || facName.length == 0) throw new Error("Require factory name")
            const contract = getProp(network, args["contract"] ? args["contract"] : facName.toLowerCase())
            if (contract == null || contract.length == 0) throw new Error(`Require ${facName} contract address`)

            const factory = await ethers.getContractFactory(facName)
            const newContract = await upgrades.upgradeProxy(
                contract,
                factory
            );
            await newContract.deployed()
            console.log(`tx: ${facName}:${contract}`)
        }
    )
;