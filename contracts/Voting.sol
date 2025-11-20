// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    address public admin;
    bool public paused;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
        bool exists;
    }

    struct Voter {
        bool voted;
        uint vote; // candidate id
        uint weight;
    }

    uint public startTimestamp;
    uint public endTimestamp;

    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    mapping(address => Voter) public voters;

    event CandidateAdded(uint id, string name);
    event Voted(address voter, uint candidateId);
    event Paused(bool paused);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Paused");
        _;
    }

    modifier duringVoting() {
        require(block.timestamp >= startTimestamp && block.timestamp <= endTimestamp, "Voting not active");
        _;
    }

    constructor(uint _startTimestamp, uint _endTimestamp) {
        require(_endTimestamp > _startTimestamp, "End must be > start");
        admin = msg.sender;
        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        paused = false;
    }

    function addCandidate(string memory _name) public onlyAdmin whenNotPaused {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0, true);
        emit CandidateAdded(candidatesCount, _name);
    }

    function setPause(bool _pause) public onlyAdmin {
        paused = _pause;
        emit Paused(_pause);
    }    

    function giveRightToVote(address voter, uint weight) public onlyAdmin {
        require(!voters[voter].voted, "Already voted");
        voters[voter].weight = weight;
    }

    function vote(uint candidateId) public whenNotPaused duringVoting {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted");
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate");
        uint w = sender.weight;
        if (w == 0) { w = 1; }
        sender.voted = true;
        sender.vote = candidateId;
        candidates[candidateId].voteCount += w;
        emit Voted(msg.sender, candidateId);
    }

    function winningCandidate() public view returns (uint winningId) {
        uint highest = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > highest) {
                highest = candidates[i].voteCount;
                winningId = i;
            }
        }
    }

    function winnerName() public view returns (string memory) {
        uint id = winningCandidate();
        return candidates[id].name;
    }
}
