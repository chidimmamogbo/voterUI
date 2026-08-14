var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// election.ts
var require_election = __commonJS(() => {
  var state = {
    voters: new Set,
    votes: {
      Kosisochukwu: 0,
      Austin: 0
    },
    maxVoters: 20
  };
  var voteForm = document.getElementById("voteForm");
  var voterNameInput = document.getElementById("voterName");
  var candidateSelect = document.getElementById("candidateSelect");
  var voterProgress = document.getElementById("voterProgress");
  var submitBtn = document.getElementById("submitBtn");
  var checkResultBtn = document.getElementById("checkResult");
  var noVotesMessage = document.getElementById("noVotesMessage");
  var winnerContent = document.getElementById("winnerContent");
  var winnerNameElement = document.getElementById("winnerName");
  var winnerVotesElement = document.getElementById("winnerVotes");
  var voteBreakdown = document.getElementById("voteBreakdown");
  voteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const rawName = voterNameInput.value.trim();
    const selectedCandidate = candidateSelect.value;
    if (!rawName || !selectedCandidate)
      return;
    const normalizedName = rawName.toLowerCase();
    if (state.voters.has(normalizedName)) {
      alert("This person has already cast a vote!");
      return;
    }
    if (state.voters.size >= state.maxVoters) {
      alert("Voting capacity has reached its limit of 20 people.");
      return;
    }
    state.voters.add(normalizedName);
    state.votes[selectedCandidate] = (state.votes[selectedCandidate] ?? 0) + 1;
    const countElement = document.getElementById(`candidate-${selectedCandidate}`);
    if (countElement) {
      countElement.textContent = state.votes[selectedCandidate]?.toString() ?? "0";
    }
    voterProgress.textContent = state.voters.size.toString();
    voteForm.reset();
    if (state.voters.size >= state.maxVoters) {
      lockVotingForm();
    }
  });
  checkResultBtn.addEventListener("click", () => {
    const candidates = Object.keys(state.votes);
    const totalVotesCast = state.voters.size;
    if (totalVotesCast === 0) {
      noVotesMessage.classList.remove("hidden");
      winnerContent.classList.add("hidden");
      voteBreakdown.innerHTML = "<p class='text-gray-400 font-medium py-2'>Waiting for ballots...</p>";
      return;
    }
    noVotesMessage.classList.add("hidden");
    winnerContent.classList.remove("hidden");
    let maxVotes = -1;
    let winners = [];
    for (const candidate of candidates) {
      const currentCandidateVotes = state.votes[candidate] ?? 0;
      if (currentCandidateVotes > maxVotes) {
        maxVotes = currentCandidateVotes;
        winners = [candidate];
      } else if (currentCandidateVotes === maxVotes && maxVotes > 0) {
        winners.push(candidate);
      }
    }
    if (maxVotes === 0) {
      winnerNameElement.textContent = "Tie (No Votes)";
      winnerVotesElement.textContent = "0";
    } else if (winners.length > 1) {
      winnerNameElement.textContent = `Tie: ${winners.join(" & ")}`;
      winnerVotesElement.textContent = maxVotes.toString();
    } else {
      winnerNameElement.textContent = winners[0] ?? "No winner";
      winnerVotesElement.textContent = maxVotes.toString();
    }
    voteBreakdown.innerHTML = "";
    for (const [candidate, count] of Object.entries(state.votes)) {
      const percentage = totalVotesCast > 0 ? (count / totalVotesCast * 100).toFixed(1) : "0.0";
      const lineElement = document.createElement("p");
      lineElement.className = "flex justify-between px-2 py-1 bg-gray-50 rounded border border-gray-100 text-gray-700 font-medium";
      lineElement.innerHTML = `<span>${candidate}</span><span>${count} votes (${percentage}%)</span>`;
      voteBreakdown.appendChild(lineElement);
    }
  });
  function lockVotingForm() {
    voterNameInput.disabled = true;
    candidateSelect.disabled = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Voting Closed";
    submitBtn.className = "w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed";
  }
});
export default require_election();
