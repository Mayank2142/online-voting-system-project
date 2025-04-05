document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "login.html?redirect=results.html";
      return;
    }
  
    // Get main content element
    const mainContent = document.querySelector(".main-content");
    
    // Initialize active tab
    let activeTab = "overview";
  
    // Fetch results from the API
    async function fetchResults() {
      try {
        const response = await fetch('/api/results');
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        renderResultsPage(data);
      } catch (error) {
        console.error('Error fetching results:', error);
        mainContent.innerHTML = `
          <div class="container mx-auto py-12 text-center">
            <div class="card max-w-md mx-auto p-8">
              <h2 class="text-2xl font-bold mb-4">Error Loading Results</h2>
              <p class="mb-6">There was an error loading the election results. Please try again later.</p>
              <a href="index.html" class="btn btn-primary">Return to Home</a>
            </div>
          </div>
        `;
      }
    }
  
    // Function to render results page
    function renderResultsPage(resultsData) {
      // Sort candidates by vote count
      const sortedCandidates = [...resultsData.candidates].sort((a, b) => b.vote_count - a.vote_count);
      
      // Get leading party
      const leadingParty = sortedCandidates.length > 0 ? sortedCandidates[0].party : "No votes yet";
      
      const resultsHTML = `
        <div class="container mx-auto py-8">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2">Election Results</h1>
            <p class="text-muted-foreground">Lok Sabha Elections 2024 - Live Results and Analysis</p>
          </div>
  
          <!-- Results banner -->
          <div class="results-banner">
            <img style="width: 100%; border-radius: 10px;"
              src="LoksabhaelectionBanner.jpg"
              alt="Election Results Banner"
              class="results-banner-image"
            />
            <div class="results-banner-overlay">
              <div>
                <h2 class="text-3xl font-bold mb-2">Live Results</h2>
                <div class="results-stats">
                  <div class="stat-card">
                    <div class="stat-label">Total Votes</div>
                    <div class="stat-value">${resultsData.totalVotes.toLocaleString()}</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-label">Voter Turnout</div>
                    <div class="stat-value">${resultsData.totalVotes > 0 ? "In Progress" : "No votes yet"}</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-label">Leading Party</div>
                    <div class="stat-value">${leadingParty}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Tabs -->
          <div class="tabs mb-6">
            <div class="tabs-list">
              <button class="tab-button ${activeTab === "overview" ? "active" : ""}" data-tab="overview">
                <i class="fas fa-chart-bar"></i> Overview
              </button>
              <button class="tab-button ${activeTab === "parties" ? "active" : ""}" data-tab="parties">
                <i class="fas fa-chart-pie"></i> Party-wise Results
              </button>
            </div>
  
            <div class="tab-content">
              <!-- Overview Tab -->
              <div id="overview-tab" class="tab-pane ${activeTab === "overview" ? "" : "hidden"}">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <!-- Leading candidates card -->
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title">Leading Candidates</h3>
                    </div>
                    <div class="card-content">
                      ${sortedCandidates.length > 0 ? 
                        sortedCandidates.slice(0, 3).map(candidate => `
                          <div class="mb-4 last:mb-0">
                            <div class="flex justify-between items-center mb-1">
                              <div class="flex items-center">
                                <span>${candidate.name}</span>
                              </div>
                              <span class="font-bold">${candidate.vote_count} votes</span>
                            </div>
                            <div class="progress-container">
                              <div
                                class="progress-bar"
                                style="width: ${candidate.percentage}%;"
                              ></div>
                            </div>
                            <div class="flex justify-between text-sm text-muted-foreground mt-1">
                              <span>${candidate.party}</span>
                              <span>${candidate.percentage}%</span>
                            </div>
                          </div>
                        `).join("")
                        : '<p class="text-center py-4">No votes recorded yet</p>'
                      }
                    </div>
                  </div>
  
                  <!-- Candidate results card -->
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title">All Candidates</h3>
                    </div>
                    <div class="card-content">
                      ${sortedCandidates.length > 0 ? 
                        sortedCandidates.map(candidate => `
                          <div class="mb-4 last:mb-0">
                            <div class="flex justify-between">
                              <h4 class="font-medium">${candidate.name}</h4>
                              <span class="text-sm font-medium">
                                ${candidate.vote_count} votes
                              </span>
                            </div>
                            <div class="text-sm text-muted-foreground">
                              ${candidate.party} • ${candidate.position}
                            </div>
                            <div class="progress-container mt-2">
                              <div
                                class="progress-bar"
                                style="width: ${candidate.percentage}%;"
                              ></div>
                            </div>
                          </div>
                        `).join("")
                        : '<p class="text-center py-4">No votes recorded yet</p>'
                      }
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Parties Tab -->
              <div id="parties-tab" class="tab-pane ${activeTab === "parties" ? "" : "hidden"}">
                <div class="card mb-6">
                  <div class="card-header">
                    <h3 class="card-title">Party-wise Vote Distribution</h3>
                  </div>
                  <div class="card-content">
                    ${sortedCandidates.length > 0 ? 
                      // Group by party and calculate total votes per party
                      (() => {
                        const partyVotes = {};
                        sortedCandidates.forEach(candidate => {
                          if (!partyVotes[candidate.party]) {
                            partyVotes[candidate.party] = 0;
                          }
                          partyVotes[candidate.party] += candidate.vote_count;
                        });
                        
                        // Convert to array and sort
                        const partyResults = Object.entries(partyVotes)
                          .map(([party, votes]) => ({
                            party,
                            votes,
                            percentage: ((votes / resultsData.totalVotes) * 100).toFixed(2)
                          }))
                          .sort((a, b) => b.votes - a.votes);
                        
                        return partyResults.map(party => `
                          <div class="mb-4 last:mb-0">
                            <div class="flex justify-between items-center mb-1">
                              <div class="flex items-center">
                                <span>${party.party}</span>
                              </div>
                              <span class="font-bold">${party.votes} votes</span>
                            </div>
                            <div class="progress-container">
                              <div
                                class="progress-bar"
                                style="width: ${party.percentage}%;"
                              ></div>
                            </div>
                            <div class="flex justify-between text-sm text-muted-foreground mt-1">
                              <span>${party.votes} votes</span>
                              <span>${party.percentage}%</span>
                            </div>
                          </div>
                        `).join("");
                      })()
                      : '<p class="text-center py-4">No votes recorded yet</p>'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  
      mainContent.innerHTML = resultsHTML;
  
      // Add event listeners to tabs
      document.querySelectorAll(".tab-button").forEach((button) => {
        button.addEventListener("click", function () {
          const tabName = this.dataset.tab;
          switchTab(tabName);
        });
      });
    }
  
    // Function to switch tabs
    function switchTab(tabName) {
      // Update active tab
      activeTab = tabName;
  
      // Update tab buttons
      document.querySelectorAll(".tab-button").forEach((button) => {
        if (button.dataset.tab === tabName) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      });
  
      // Show/hide tab content
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        if (pane.id === `${tabName}-tab`) {
          pane.classList.remove("hidden");
        } else {
          pane.classList.add("hidden");
        }
      });
    }
  
    // Fetch results
    fetchResults();
  });