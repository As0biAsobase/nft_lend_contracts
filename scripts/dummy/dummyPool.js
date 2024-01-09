const { ethers } = require("hardhat");

const ONE_AVAX = "1000000000000000000";
const ONE_TENTH_OF_AN_AVAX = "100000000000000000";
const TWO_TENTHS_OF_AN_AVAX = "200000000000000000";
const TWO_HUNDREDTH_OF_AN_AVAX = "200000000000000000";

const startMaxDailyBorrows = ONE_AVAX
const SECONDS_PER_DAY = 24 * 60 * 60
const DAYS_PER_YEAR = 365;
const SECONDS_PER_YEAR = DAYS_PER_YEAR * SECONDS_PER_DAY;
const INTEREST_WEI_PER_ETH_PER_YEAR = 0.8e18;
const MAX_INTEREST = "700000000000000000"; // 0.7e18
const MAX_VARIABLE_INTEREST = "25367833587";
const MAX_LOAN_LENGTH = "1209600";
const DEADLINE = Math.round(Date.now() / 1000) + 1000;
const MINIMUM_INTEREST = "12683916793"; // 40%
const LTV = "500000000000000000"; // 50%
const PRICE = TWO_HUNDREDTH_OF_AN_AVAX;
const MAX_PRICE = TWO_TENTHS_OF_AN_AVAX;

async function main(hre) {
    if (process.env.DEPLOY !== "true") {
        throw new Error("DEPLOY env var must be true")
    }

    const [deployer] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("LlamaLendFactory");
    const factory = await Factory.attach(
        "0x4e0B4F759BA00385cF2094F4b6e9C2dca043Ff45" // The deployed contract address
    );
    console.log("Interacting with Factory at: ", factory.address);

    poolParams = {
        maxPrice: MAX_PRICE,
        maxLoanLength: MAX_LOAN_LENGTH,
        nftContract: "0xa918502fd0873C498e18aeE6D9c95Fa38Bfe32e0",
        maxVariableInterestPerEthPerSecond: MAX_VARIABLE_INTEREST,
        minimumInterest: MINIMUM_INTEREST,
        ltv: LTV,
    }

    console.log([
        poolParams
    ]);

    await factory.createPool(
        PRICE,
        startMaxDailyBorrows,
        "Peon Loan",
        "PL",
        [
            poolParams
        ]
    );

    const pools = await factory.queryFilter(factory.filters.PoolCreated());
    const lendingPoolAddress = pools[0].args.pool
    const LendingPool = await ethers.getContractFactory("LendingPool");
    const lendingPool = await LendingPool.attach(lendingPoolAddress);

    console.log("Lending pool deployed at: ", lendingPoolAddress)
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
    })