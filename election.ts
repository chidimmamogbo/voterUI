// Define state structure
interface ElectionState {
  voters: Set<string>;
  votes: Record<string, number>;
  maxVoters: number;
}

const state: ElectionState = {
  voters: new Set<string>(),
  votes: {
    "Kosisochukwu": 0,
    "Austin": 0
  },
  maxVoters: 20
};

// DOM References with Type casting
const voteForm = document.getElementById("voteForm") as HTMLFormElement;
const voterNameInput = document.getElementById("voterName") as HTMLInputElement;
const candidateSelect = document.getElementById("candidateSelect") as HTMLSelectElement;
const voterProgress = document.getElementById("voterProgress") as HTMLSpanElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
const checkResultBtn = document.getElementById("checkResult") as HTMLButtonElement;

// Modal DOM References
const noVotesMessage = document.getElementById("noVotesMessage") as HTMLParagraphElement;
const winnerContent = document.getElementById("winnerContent") as HTMLDivElement;
const winnerNameElement = document.getElementById("winnerName") as HTMLHeadingElement;
const winnerVotesElement = document.getElementById("winnerVotes") as HTMLSpanElement;
const voteBreakdown = document.getElementById("voteBreakdown") as HTMLDivElement;

// Process Form Submissions
voteForm.addEventListener("submit", (event: Event) => {
  event.preventDefault();

  const rawName = voterNameInput.value.trim();
  const selectedCandidate = candidateSelect.value;

  // Clean data checking
  if (!rawName || !selectedCandidate) return;

  const normalizedName = rawName.toLowerCase();

  // 1. Guard against duplicate voting entries
  if (state.voters.has(normalizedName)) {
    alert("This person has already cast a vote!");
    return;
  }

  // 2. Guard against voting past maximum capacity
  if (state.voters.size >= state.maxVoters) {
    alert("Voting capacity has reached its limit of 20 people.");
    return;
  }

  // 3. Register vote state updates
  state.voters.add(normalizedName);
  state.votes[selectedCandidate] = (state.votes[selectedCandidate] ?? 0) + 1;

  // 4. Update the visual DOM metrics instantly
  const countElement = document.getElementById(`candidate-${selectedCandidate}`) as HTMLSpanElement | null;
  if (countElement) {
    countElement.textContent = state.votes[selectedCandidate]?.toString() ?? "0";
  }

  voterProgress.textContent = state.voters.size.toString();
  
  // Clear inputs safely
  voteForm.reset();

  // 5. If limit hit, lock form actions
  if (state.voters.size >= state.maxVoters) {
    lockVotingForm();
  }
});

// Calculate metrics upon requesting winner modal view
checkResultBtn.addEventListener("click", () => {
  const candidates = Object.keys(state.votes);
  const totalVotesCast = state.voters.size;

  if (totalVotesCast === 0) {
    noVotesMessage.classList.remove("hidden");
    winnerContent.classList.add("hidden");
    voteBreakdown.innerHTML = "<p class='text-gray-400 font-medium py-2'>Waiting for ballots...</p>";
    return;
  }

  // Active vote present handling
  noVotesMessage.classList.add("hidden");
  winnerContent.classList.remove("hidden");

  let maxVotes = -1;
  let winners: string[] = [];

  // Determine highest vote counts
  for (const candidate of candidates) {
    const currentCandidateVotes = state.votes[candidate] ?? 0;
    if (currentCandidateVotes > maxVotes) {
      maxVotes = currentCandidateVotes;
      winners = [candidate];
    } else if (currentCandidateVotes === maxVotes && maxVotes > 0) {
      winners.push(candidate);
    }
  }

  // Handle display logic profiles (Winner vs Draw vs No scores)
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

  // Build programmatic interactive breakdown grid items
  voteBreakdown.innerHTML = "";
  for (const [candidate, count] of Object.entries(state.votes)) {
    const percentage = totalVotesCast > 0 ? ((count / totalVotesCast) * 100).toFixed(1) : "0.0";
    const lineElement = document.createElement("p");
    lineElement.className = "flex justify-between px-2 py-1 bg-gray-50 rounded border border-gray-100 text-gray-700 font-medium";
    lineElement.innerHTML = `<span>${candidate}</span><span>${count} votes (${percentage}%)</span>`;
    voteBreakdown.appendChild(lineElement);
  }
});

function lockVotingForm(): void {
  voterNameInput.disabled = true;
  candidateSelect.disabled = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Voting Closed";
  submitBtn.className = "w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed";
}
