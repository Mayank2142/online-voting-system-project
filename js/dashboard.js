document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const user = localStorage.getItem("user")
  if (!user) {
    window.location.href = "login.html?redirect=dashboard.html"
    return
  }

  // Parse user data
  const userData = JSON.parse(user)
  const userType = userData.userType || "voter"

  // Check if user has voted
  const hasVoted = localStorage.getItem("userVote") ? true : false

  // Render dashboard
  const mainContent = document.querySelector(".main-content")
  renderDashboard(userData, userType, hasVoted)

  // Function to render dashboard
  function renderDashboard(userData, userType, hasVoted) {
    const dashboardHTML = `
            <div class="dashboard">
                <div class="dashboard-header">
                    <h1 class="dashboard-title">Welcome, ${userData.fullName}</h1>
                    <p class="dashboard-subtitle">${userType === "voter" ? "Voter Dashboard" : "Candidate Dashboard"}</p>
                </div>

                <!-- Dashboard banner -->
                <div class="relative w-full h-48 mb-8 rounded-lg overflow-hidden">
                    <img style="width: 100%;height: 250px;border-radius: 10px;" 
                        src="LoksabhaelectionBanner.jpg"
                        alt="Dashboard Banner"
                        class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                        <div class="text-white p-8">
                            <h2 class="text-2xl font-bold mb-2">Lok Sabha Elections 2024</h2>
                            <p class="mb-4">Your participation matters in shaping the future of our nation.</p>
                        </div>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <!-- Profile Card -->
                    <div class="dashboard-card">
                        <div class="dashboard-card-header">
                            <h2 class="dashboard-card-title">
                                <i class="fas fa-user card-icon"></i> Profile
                            </h2>
                        </div>
                        <div class="dashboard-card-content">
                            <div class="flex items-center mb-4">
                                <div>
                                    <h3 class="text-lg font-semibold">${userData.fullName}</h3>
                                    <p class="text-muted-foreground">${userType === "voter" ? "Voter" : "Candidate"}</p>
                                </div>
                            </div>
                            <div class="profile-info">
                                <p>
                                    <strong>Email:</strong> ${userData.email}
                                </p>
                                <p>
                                    <strong>Account Type:</strong> ${userType === "voter" ? "Voter" : "Candidate"}
                                </p>
                            </div>
                            <a href="profile.html" class="btn btn-outline btn-sm mt-4">
                                Edit Profile
                            </a>
                        </div>
                    </div>

                    <!-- Voting Status Card -->
                    ${
                      userType === "voter"
                        ? `
                    <div class="dashboard-card">
                        <div class="dashboard-card-header">
                            <h2 class="dashboard-card-title">
                                <i class="fas fa-vote-yea card-icon"></i> Voting Status
                            </h2>
                        </div>
                        <div class="dashboard-card-content">
                            <div class="voting-status">
                                <div class="status-indicator mb-4">
                                    ${
                                      hasVoted
                                        ? `
                                    <div class="status-voted flex items-center p-3 bg-green/10 text-green rounded-md">
                                        <i class="fas fa-check-circle status-icon mr-2"></i>
                                        <span>You have voted</span>
                                    </div>
                                    `
                                        : `
                                    <div class="status-not-voted flex items-center p-3 bg-destructive/10 text-destructive rounded-md">
                                        <i class="fas fa-info-circle status-icon mr-2"></i>
                                        <span>You have not voted yet</span>
                                    </div>
                                    `
                                    }
                                </div>

                                <div class="election-info mb-4">
                                    <p>
                                        <strong>Current Election:</strong> Lok Sabha Election 2024
                                    </p>
                                    <p>
                                        <strong>Voting Deadline:</strong> May 15, 2024
                                    </p>
                                </div>

                                ${
                                  !hasVoted
                                    ? `
                                <a href="vote.html" class="btn btn-primary btn-sm">
                                    Cast Your Vote
                                </a>
                                `
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                    `
                        : `
                    <div class="dashboard-card">
                        <div class="dashboard-card-header">
                            <h2 class="dashboard-card-title">
                                <i class="fas fa-clipboard-list card-icon"></i> Campaign Status
                            </h2>
                        </div>
                        <div class="dashboard-card-content">
                            <div class="campaign-status">
                                <p>
                                    <strong>Constituency:</strong> Central Delhi
                                </p>
                                <p>
                                    <strong>Party:</strong> Bharatiya Janata Party
                                </p>
                                <p>
                                    <strong>Campaign Status:</strong> Active
                                </p>
                                <p>
                                    <strong>Nomination Status:</strong> Approved
                                </p>
                            </div>
                            <a href="campaign.html" class="btn btn-primary btn-sm mt-4">
                                Manage Campaign
                            </a>
                        </div>
                    </div>
                    `
                    }

                    <!-- Election Updates Card -->
                    <div class="dashboard-card">
                        <div class="dashboard-card-header">
                            <h2 class="dashboard-card-title">
                                <i class="fas fa-chart-bar card-icon"></i> Election Updates
                            </h2>
                        </div>
                        <div class="dashboard-card-content">
                            <div class="election-updates">
                                <div class="update-item p-3 border-b border-border">
                                    <span class="update-date text-sm text-muted-foreground">May 1, 2024</span>
                                    <p class="update-text">Phase 3 of Lok Sabha elections completed with 67% voter turnout</p>
                                </div>
                                <div class="update-item p-3 border-b border-border">
                                    <span class="update-date text-sm text-muted-foreground">April 26, 2024</span>
                                    <p class="update-text">Phase 2 of Lok Sabha elections completed with 65% voter turnout</p>
                                </div>
                                <div class="update-item p-3">
                                    <span class="update-date text-sm text-muted-foreground">April 19, 2024</span>
                                    <p class="update-text">Phase 1 of Lok Sabha elections completed with 66% voter turnout</p>
                                </div>
                            </div>
                            <a href="results.html" class="btn btn-outline btn-sm mt-4">
                                View All Updates
                            </a>
                        </div>
                    </div>

                    <!-- Upcoming Elections Card -->
                    <div class="dashboard-card">
                        <div class="dashboard-card-header">
                            <h2 class="dashboard-card-title">
                                <i class="fas fa-vote-yea card-icon"></i> Upcoming Elections
                            </h2>
                        </div>
                        <div class="dashboard-card-content">
                            <div class="mb-4">
                                <h3 class="font-semibold mb-2">Lok Sabha Elections 2024</h3>
                                <div class="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p class="text-muted-foreground">Phase 4</p>
                                        <p class="font-medium">May 13, 2024</p>
                                    </div>
                                    <div>
                                        <p class="text-muted-foreground">Phase 5</p>
                                        <p class="font-medium">May 20, 2024</p>
                                    </div>
                                    <div>
                                        <p class="text-muted-foreground">Phase 6</p>
                                        <p class="font-medium">May 25, 2024</p>
                                    </div>
                                    <div>
                                        <p class="text-muted-foreground">Phase 7</p>
                                        <p class="font-medium">June 1, 2024</p>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-4">
                                <h3 class="font-semibold mb-2">State Assembly Elections</h3>
                                <div class="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p class="text-muted-foreground">Maharashtra</p>
                                        <p class="font-medium">October 2024</p>
                                    </div>
                                    <div>
                                        <p class="text-muted-foreground">Haryana</p>
                                        <p class="font-medium">October 2024</p>
                                    </div>
                                </div>
                            </div>
                            <a href="elections.html" class="btn btn-outline btn-sm">
                                View Election Schedule
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `

    mainContent.innerHTML = dashboardHTML
  }
})

