document.addEventListener("DOMContentLoaded", () => {
  // First get the main content element
  const mainContent = document.querySelector(".main-content");
  if (!mainContent) {
    console.error("Error: .main-content element not found!");
    return;
  }

  // Check if user is logged in
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "login.html?redirect=vote.html";
    return;
  }

  let candidates = [];
  let selectedCandidate = null;
  let isSubmitting = false;
  let confirmationStep = false;

  // Fetch candidates from the API
  async function fetchCandidates() {
    try {
      const response = await fetch('/api/candidates');
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      candidates = await response.json();
      renderVotingForm();
    } catch (error) {
      console.error('Error fetching candidates:', error);
      mainContent.innerHTML = `
        <div class="container mx-auto py-12 text-center">
          <div class="card max-w-md mx-auto p-8">
            <h2 class="text-2xl font-bold mb-4">Error Loading Candidates</h2>
            <p class="mb-6">There was an error loading the candidate list. Please try again later.</p>
            <a href="index.html" class="btn btn-primary">Return to Home</a>
          </div>
        </div>
      `;
    }
  }

  // Function to render the voting form
  function renderVotingForm() {
    const votingFormHTML = `
      <div class="vote-container">
        <div class="glass-card">
          <h1 class="page-title">Cast Your Vote</h1>
          <p class="page-subtitle">Select your preferred candidate and submit your vote</p>
          
          <div class="voting-form">
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle alert-icon"></i>
              <div>
                <h3 class="alert-title">Important Information</h3>
                <p class="alert-message">You can only vote once. Your vote is confidential and secure.</p>
              </div>
            </div>
            
            <div class="candidate-options">
              ${candidates.map((candidate) => 
                `<div class="voting-option" data-candidate-id="${candidate.id}">
                  <div class="voting-option-radio">
                    <input type="radio" id="candidate-${candidate.id}" name="candidate" value="${candidate.id}">
                  </div>
                  <div class="voting-option-content">
                    <h3 class="voting-option-name">${candidate.name}</h3>
                    <p class="voting-option-party">${candidate.party} • ${candidate.position}</p>
                  </div>
                </div>`
              ).join("")}
            </div>
            
            <div class="voting-actions">
              <button class="btn btn-primary btn-lg" id="continue-btn" disabled>Continue</button>
            </div>
          </div>
        </div>
      </div>` 
    mainContent.innerHTML = votingFormHTML;

    // Add event listeners to voting options
    document.querySelectorAll(".voting-option").forEach((option) => {
      option.addEventListener("click", function () {
        // Update selected candidate
        selectedCandidate = parseInt(this.dataset.candidateId);

        // Update UI
        document.querySelectorAll(".voting-option").forEach((opt) => {
          opt.classList.remove("selected");
        });
        this.classList.add("selected");

        // Check the radio button
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;

        // Enable continue button
        document.getElementById("continue-btn").disabled = false;
      });
    });

    // Add event listener to continue button
    document.getElementById("continue-btn").addEventListener("click", () => {
      if (selectedCandidate) {
        renderConfirmationStep();
      } else {
        alert("Please select a candidate to vote.");
      }
    });
  }

  // Function to render the confirmation step
  function renderConfirmationStep() {
    confirmationStep = true;
    const selectedCandidateData = candidates.find((c) => c.id === selectedCandidate);

    const confirmationHTML = `
      <div class="vote-container">
        <div class="voting-confirmation">
          <h2 class="confirmation-title">Confirm Your Vote</h2>
          
          <div class="confirmation-details">
            <p>You are about to vote for:</p>
            <div class="selected-candidate">
              <h3>${selectedCandidateData.name}</h3>
              <p>${selectedCandidateData.party}</p>
            </div>
            
            <div class="confirmation-warning">
              <i class="fas fa-exclamation-triangle"></i>
              <p>This action cannot be undone. Please confirm your selection.</p>
            </div>
          </div>
          
          <div class="confirmation-actions">
            <button class="btn btn-outline" id="back-btn">Go Back</button>
            <button class="btn btn-primary" id="confirm-btn">Confirm Vote</button>
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = confirmationHTML;

    // Add event listeners
    document.getElementById("back-btn").addEventListener("click", () => {
      confirmationStep = false;
      renderVotingForm();
    });

    document.getElementById("confirm-btn").addEventListener("click", () => {
      submitVote();
    });
  }

  // Function to submit the vote
  async function submitVote() {
    if (isSubmitting) return;

    isSubmitting = true;
    const confirmBtn = document.getElementById("confirm-btn");
    const backBtn = document.getElementById("back-btn");

    confirmBtn.disabled = true;
    backBtn.disabled = true;
    confirmBtn.textContent = "Submitting Vote...";

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidateId: selectedCandidate }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      // Store vote in localStorage to prevent multiple votes
      localStorage.setItem("userVote", selectedCandidate.toString());

      // Show success message
      showVoteSuccess();
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('There was an error submitting your vote. Please try again.');
      
      confirmBtn.disabled = false;
      backBtn.disabled = false;
      confirmBtn.textContent = "Confirm Vote";
    } finally {
      isSubmitting = false;
    }
  }

  // Function to show vote success message
  function showVoteSuccess() {
    const successHTML = `
      <div class="vote-success">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2 class="success-title">Vote Submitted!</h2>
        <p class="success-message">Thank you for participating in the election. Your vote has been recorded securely.</p>
        <div class="success-details">
          <p>Your vote has been encrypted and anonymized to ensure ballot secrecy.</p>
          <p>The results will be available after the voting period ends.</p>
        </div>
        <a href="results.html" class="btn btn-primary">View Results</a>
      </div>
    `;

    mainContent.innerHTML = successHTML;
  }

  // Check if user has already voted
  const userVote = localStorage.getItem("userVote");
  if (userVote) {
    showVoteSuccess();
  } else {
    // Fetch candidates and render voting form
    fetchCandidates();
  }
});