// Elements
const leaderboardListingEl = document.getElementById("leaderboard-listing");

// Read data from localStorage to arrray
const scores = JSON.parse(localStorage.getItem("scores"));

// Sort the array by time

// Output scores array to leaderboard
const createLeaderRow = (rank, name, time) => {
  const leaderRow = document.createElement("tr");
  const leaderRank = document.createElement("th");
  leaderRank.setAttribute("scope", "row");
  leaderRank.textContent = rank;
  const leaderName = document.createElement("td");
  leaderName.textContent = name;
  const leaderTime = document.createElement("td");
  leaderTime.textContent = time;
  leaderRow.appendChild(leaderRank);
  leaderRow.appendChild(leaderName);
  leaderRow.appendChild(leaderTime);
  leaderboardListingEl.appendChild(leaderRow);
};

const displayScores = () => {
  scores.forEach((score, i) => {
    createLeaderRow(i + 1, score.name, score.time);
  });
};

const displayEmpty = () => {
  const emptyEl = document.createElement("p");
  emptyEl.textContent = "It's looking a little empty here :(";
  const lbColEl = document.getElementById("lb-col");
  lbColEl.appendChild(emptyEl);
};

// Check if any scores exist in localStorage otherwise let user know it's empty
scores ? displayScores() : displayEmpty();

// Clear scores routine
document.getElementById("clear").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});
