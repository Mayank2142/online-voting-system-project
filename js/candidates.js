document.addEventListener("DOMContentLoaded", () => {
  // Candidate data with more details
  const candidatesData = [
    {
      id: 1,
      name: "Amit Sharma",
      age: 48,
      party: "Bharatiya Janata Party",
      position: "Lok Sabha Candidate",
      constituency: "New Delhi",
      education: "MBA, Delhi University",
      experience: "Former Minister of Urban Development",
      promises: [
        "Create 2 million jobs in the next 5 years",
        "Improve infrastructure in rural areas",
        "Strengthen national security",
      ],
      imageUrl: "modi-2.avif",
    },
    {
      id: 2,
      name: "Priya Patel",
      age: 42,
      party: "Indian National Congress",
      position: "Lok Sabha Candidate",
      constituency: "South Delhi",
      education: "PhD in Public Policy, JNU",
      experience: "Social Activist, Former MLA",
      promises: [
        "Universal healthcare for all citizens",
        "Education reforms and scholarships",
        "Women's safety and empowerment",
      ],
      imageUrl: "Priyanka-joining-the-congress-party-Article-Image.avif",
    },
    {
      id: 3,
      name: "Sunita Yadav",
      age: 39,
      party: "Aam Aadmi Party",
      position: "Lok Sabha Candidate",
      constituency: "East Delhi",
      education: "B.Tech, IIT Delhi",
      experience: "Anti-corruption Activist",
      promises: [
        "Free electricity up to 200 units",
        "Clean drinking water for all households",
        "Improved public transportation",
      ],
      imageUrl: "maxresdefault.jpg",
    },
    {
      id: 4,
      name: "Rajesh Kumar",
      age: 45,
      party: "Samajwadi Party",
      position: "Lok Sabha Candidate",
      constituency: "North East Delhi",
      education: "LLB, Delhi University",
      experience: "Human Rights Lawyer",
      promises: ["Social justice and equality", "Farmer welfare and subsidies", "Youth employment programs"],
      imageUrl: "v7tm2gkg_akhilesh-yadav_625x300_09_October_24.webp",
    },
  ]

  // Get unique party names for filter dropdown
  const parties = [...new Set(candidatesData.map((candidate) => candidate.party))]

  // Render search and filter UI
  const searchFilterContainer = document.getElementById("search-filter-container")
  if (searchFilterContainer) {
    searchFilterContainer.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4 mb-8">
                <div class="relative flex-1">
                    <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search candidates by name, party or constituency..."
                        class="form-input pl-10 w-full"
                    />
                </div>

                <div class="relative">
                    <i class="fas fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
                    <select id="party-filter" class="form-select pl-10">
                        <option value="">All Parties</option>
                        ${parties.map((party) => `<option value="${party}">${party}</option>`).join("")}
                    </select>
                </div>
            </div>
        `
  }

  // Render candidates grid
  const candidatesGrid = document.getElementById("candidates-grid")
  if (candidatesGrid) {
    renderCandidates(candidatesData)

    // Add event listeners for search and filter
    const searchInput = document.getElementById("search-input")
    const partyFilter = document.getElementById("party-filter")

    if (searchInput) {
      searchInput.addEventListener("input", filterCandidates)
    }

    if (partyFilter) {
      partyFilter.addEventListener("change", filterCandidates)
    }
  }

  // Function to filter candidates
  function filterCandidates() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase()
    const filterParty = document.getElementById("party-filter").value

    // Filter candidates based on search term and party filter
    const filteredCandidates = candidatesData.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm) ||
        candidate.party.toLowerCase().includes(searchTerm) ||
        candidate.constituency.toLowerCase().includes(searchTerm)

      const matchesParty = filterParty ? candidate.party === filterParty : true

      return matchesSearch && matchesParty
    })

    // Render filtered candidates
    renderCandidates(filteredCandidates)
  }

  // Function to render candidates
  function renderCandidates(candidates) {
    if (candidates.length > 0) {
      candidatesGrid.innerHTML = candidates
        .map(
          (candidate) => `
                <div class="candidate-card">
                    <div class="relative">
                        <img
                            src="${candidate.imageUrl}"
                            alt="${candidate.name}"
                            class="candidate-image"
                        />
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <span class="badge badge-saffron">${candidate.party}</span>
                        </div>
                    </div>

                    <div class="candidate-info">
                        <h3 class="candidate-name">${candidate.name}</h3>
                        <p class="candidate-party">
                            ${candidate.position} • ${candidate.constituency}
                        </p>

                        <div class="candidate-details">
                            <div class="candidate-detail">
                                <span class="detail-label">Age:</span>
                                <span>${candidate.age} years</span>
                            </div>
                            <div class="candidate-detail">
                                <span class="detail-label">Education:</span>
                                <span>${candidate.education}</span>
                            </div>
                            <div class="candidate-detail">
                                <span class="detail-label">Experience:</span>
                                <span>${candidate.experience}</span>
                            </div>
                        </div>

                        <div class="mb-4">
                            <h4 class="font-semibold mb-2">Key Promises:</h4>
                            <ul class="list-disc pl-5 text-sm">
                                ${candidate.promises.map((promise) => `<li>${promise}</li>`).join("")}
                            </ul>
                        </div>

                        <a href="candidate-detail.html?id=${candidate.id}" class="btn btn-outline btn-sm w-full">
                            View Full Profile
                        </a>
                    </div>
                </div>
            `,
        )
        .join("")
    } else {
      candidatesGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-lg text-muted-foreground">No candidates found matching your search criteria.</p>
                    <button
                        class="btn btn-outline mt-4"
                        id="clear-filters-btn"
                    >
                        Clear Filters
                    </button>
                </div>
            `

      // Add event listener to clear filters button
      document.getElementById("clear-filters-btn").addEventListener("click", () => {
        document.getElementById("search-input").value = ""
        document.getElementById("party-filter").value = ""
        renderCandidates(candidatesData)
      })
    }
  }
})

