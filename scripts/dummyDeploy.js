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
const MAX_VARIABLE_INTEREST = Math.round(INTEREST_WEI_PER_ETH_PER_YEAR / SECONDS_PER_YEAR);
const DEADLINE = Math.round(Date.now() / 1000) + 1000;
const MINIMUM_INTEREST = "12683916793"; // 40%
const LTV = "500000000000000000"; // 50%
const PRICE = TWO_HUNDREDTH_OF_AN_AVAX;
const MAX_PRICE = TWO_TENTHS_OF_AN_AVAX;

async function main(hre) {
    if(process.env.DEPLOY !== "true"){
        throw new Error("DEPLOY env var must be true")
      }
    
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    // Deploy First
    const PeonNFT = await ethers.getContractFactory("MockNFT");
    const peonNFT = await PeonNFT.deploy();
    await peonNFT.deployed();
    console.log("Mock Peon NFT deployed at: ", peonNFT.address);

    const feeCollector = await (await ethers.getContractFactory("FeeCollector")).deploy();
    await feeCollector.deployed();
    console.log("Fee collector deployed at: ", feeCollector.address);

    const LendingPoolImplementation = await ethers.getContractFactory("LendingPool");
    const lendingPoolImplementation = await LendingPoolImplementation.deploy(feeCollector.address);
    await lendingPoolImplementation.deployed();
    console.log("Lending pool implementation deployed at: ", lendingPoolImplementation.address)

    const Factory = await ethers.getContractFactory("LlamaLendFactory");
    const factory = await Factory.deploy(lendingPoolImplementation.address);
    await factory.deployed();
    console.log("Factory deployed at: ", factory.address);

    await factory.createPool(
        PRICE,
        startMaxDailyBorrows,
        "Peon Loan",
        "PL",
        [
          {
            maxPrice: MAX_PRICE,
            maxLoanLength: 14*SECONDS_PER_DAY,
            nftContract: peonNFT.address,
            MAX_VARIABLE_INTEREST,
            MINIMUM_INTEREST,
            LTV,
          }
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