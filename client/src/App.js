import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingAbi from "./VotingAbi.json";
import { CONTRACT_ADDRESS } from "./config";

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  async function connect() {
    if (!window.ethereum) return alert("Install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const ctr = new ethers.Contract(CONTRACT_ADDRESS, VotingAbi, signer);

    setProvider(provider);
    setContract(ctr);
  }

  async function fetchCandidates() {
    if (!contract) return alert("Connect wallet first");
    setLoading(true);

    const list = [];
    for (let i = 1; i <= 30; i++) {
      try {
        const c = await contract.candidates(i);
        if (c.exists) {
          list.push({
            id: Number(c.id),
            name: c.name,
            votes: Number(c.voteCount),
          });
        }
      } catch (e) {
        break;
      }
    }

    setCandidates(list);
    setLoading(false);
  }

  async function vote(id) {
    if (!contract) return alert("Connect wallet first");
    try {
      const tx = await contract.vote(id);
      await tx.wait();
      fetchCandidates();
    } catch (e) {
      alert("Vote failed: " + e.message);
    }
  }

  async function addCandidate() {
    if (!contract) return alert("Connect wallet first");
    if (!newCandidateName.trim()) return alert("Enter name");
    try {
      const tx = await contract.addCandidate(newCandidateName);
      await tx.wait();
      setNewCandidateName("");
      fetchCandidates();
    } catch (e) {
      alert("Add failed: " + e.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f2f2f7",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          background: "#fff",
          padding: "30px 25px",
          borderRadius: 12,
          boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 25 }}>
          🗳️ Voting DApp{" "}
          <span
            style={{
              fontSize: 14,
              background: "#5b8dfd",
              color: "white",
              padding: "3px 8px",
              borderRadius: 6,
              marginLeft: 10,
            }}
          >
            Sepolia
          </span>
        </h2>

        {!account && (
          <button
            onClick={connect}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              background: "#5b8dfd",
              color: "white",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Connect Wallet
          </button>
        )}

        {account && (
          <div
            style={{
              marginBottom: 20,
              padding: 10,
              background: "#e9f0ff",
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            Connected: <b>{account}</b>
          </div>
        )}

        <button
          onClick={fetchCandidates}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "#333",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          {loading ? "Loading..." : "Load Candidates"}
        </button>

        <div style={{ display: "flex", gap: 10, marginBottom: 25 }}>
          <input
            placeholder="New candidate (Admin only)"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          />
          <button
            onClick={addCandidate}
            style={{
              padding: "10px 14px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Add
          </button>
        </div>

        <div>
          {candidates.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No candidates loaded.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {candidates.map((c) => (
                <li
                  key={c.id}
                  style={{
                    padding: "12px 14px",
                    marginBottom: 12,
                    borderRadius: 8,
                    background: "#fafafa",
                    border: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 16 }}>{c.name}</strong>
                    <div style={{ color: "#555" }}>{c.votes} votes</div>
                  </div>

                  <button
                    onClick={() => vote(c.id)}
                    style={{
                      padding: "8px 12px",
                      background: "#FF7F50",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Vote
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

