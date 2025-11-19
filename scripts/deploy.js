const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const now = Math.floor(Date.now() / 1000);

  const voting = await Voting.deploy(now + 10, now + 86410);

  // ethers v6 deployment wait
  await voting.waitForDeployment();

  console.log("Voting deployed to:", await voting.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

