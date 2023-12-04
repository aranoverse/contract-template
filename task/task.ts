import {cfg, getProp} from "../scripts/utils/config";
import {task} from "hardhat/config";
import {capitalizeFirstLetter} from "../scripts/utils";

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

            const c = cfg(network)
            const facName = args["factory"]
            if (facName == null || facName.length == 0) throw new Error("Require factory name")
            const contract = getProp(network, args["contract"] ? args["contract"] : capitalizeFirstLetter(facName))
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
task("deploy", "Deploy")
    .setAction(async function (args, hre) {
        await hre.run("run", {script: "./scripts/deploy/01.ts"});
        await hre.run("run", {script: "./scripts/deploy/02.ts"});
    });
