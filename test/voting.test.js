const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  it("deploys and basic add/vote flow", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    const now = Math.floor(Date.now() / 1000);
    const voting = await Voting.deploy(now - 10, now + 1000);
    await voting.deployed();

    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");

    await voting.giveRightToVote(addr1.address, 1);
    await voting.connect(addr1).vote(1);

    const winner = await voting.winnerName();
    expect(winner).to.equal("Alice");
  });
});
