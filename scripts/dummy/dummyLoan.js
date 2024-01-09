const { ethers } = require("hardhat");

const NFT_PRICE = "1000000000000000";
const MAX_VARIABLE_INTEREST = "25367833587";
const TOTAL_TO_BORROW = "100000000000000";

async function main(hre) {
    if (process.env.DEPLOY !== "true") {
        throw new Error("DEPLOY env var must be true")
    }

    const [deployer] = await ethers.getSigners();

    const Pool = await ethers.getContractFactory("LendingPool");
    const pool = await Pool.attach(
        "0x963ba793bf85b4ACb048B525A6EF31B2b169004C" // The deployed contract address
    );
    console.log("Interacting with Pool at: ", pool.address);


    poolData = { 
        nftContract: '0xa918502fd0873C498e18aeE6D9c95Fa38Bfe32e0',
        maxVariableInterestPerEthPerSecond: '25367833587',
        minimumInterest: '12683916793',
        ltv: '500000000000000000', 
        maxPrice: '200000000000000000',
        maxLoanLength: '1209600',
    }

    signature = {
        v: "0",
        r: "0x0000000000000000000000000000000000000000000000000000000000000000",
        s: "0x0000000000000000000000000000000000000000000000000000000000000000"
    }

    console.log(poolData)

    await pool.borrow([0], NFT_PRICE, MAX_VARIABLE_INTEREST, TOTAL_TO_BORROW, poolData);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
    })

