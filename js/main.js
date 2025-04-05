// Main JavaScript file for common functionality across all pages

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Mobile menu toggle
  const mobileMenuButton = document.querySelector(".mobile-menu-button")
  const mobileMenu = document.querySelector(".mobile-menu")

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("open")

      // Toggle icon between bars and times
      const icon = this.querySelector("i")
      if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // Dark mode toggle
  const themeToggle = document.getElementById("theme-toggle")

  if (themeToggle) {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme") || "light"

    // Apply the saved theme
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      themeToggle.querySelector("i").classList.remove("fa-moon")
      themeToggle.querySelector("i").classList.add("fa-sun")
    }

    // Theme toggle click handler
    themeToggle.addEventListener("click", function () {
      const isDark = document.documentElement.classList.toggle("dark")

      // Update icon
      const icon = this.querySelector("i")
      if (isDark) {
        icon.classList.remove("fa-moon")
        icon.classList.add("fa-sun")
        localStorage.setItem("theme", "dark")
      } else {
        icon.classList.remove("fa-sun")
        icon.classList.add("fa-moon")
        localStorage.setItem("theme", "light")
      }
    })
  }

  // Header scroll effect
  const header = document.querySelector(".header")

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  }

  // Rotating quotes on homepage
  const quoteDisplay = document.getElementById("quote-display")

  if (quoteDisplay) {
    const quotes = [
      {
        text: "The ballot is stronger than the bullet.",
        author: "Abraham Lincoln",
      },
      {
        text: "Democracy is not just the right to vote, it is the right to live in dignity.",
        author: "Naomi Klein",
      },
      {
        text: "The ignorance of one voter in a democracy impairs the security of all.",
        author: "John F. Kennedy",
      },
      {
        text: "Every election is determined by the people who show up.",
        author: "Larry J. Sabato",
      },
      {
        text: "Voting is your right, make sure to exercise it.",
        author: "Election Commission of India",
      },
    ]

    let currentQuoteIndex = 0

    function rotateQuotes() {
      quoteDisplay.classList.remove("fade-in")
      quoteDisplay.classList.add("fade-out")

      setTimeout(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length
        quoteDisplay.innerHTML = `"${quotes[currentQuoteIndex].text}"
                    <footer class="quote-author">— ${quotes[currentQuoteIndex].author}</footer>`
        quoteDisplay.classList.remove("fade-out")
        quoteDisplay.classList.add("fade-in")
      }, 500)
    }

    // Change quote every 8 seconds
    setInterval(rotateQuotes, 8000)
  }

  // Check authentication status and update UI
  function updateAuthUI() {
    const user = localStorage.getItem("user")

    if (user) {
      // User is logged in
      const userData = JSON.parse(user)
      const userType = userData.userType || "voter"

      // Hide auth buttons and show user menu
      document.querySelectorAll(".auth-buttons").forEach((el) => el.classList.add("hidden"))
      document.querySelectorAll(".user-menu").forEach((el) => el.classList.remove("hidden"))

      // Show auth-only nav items
      document.querySelectorAll(".nav-item-auth").forEach((el) => el.classList.remove("hidden"))
      document.querySelectorAll(".mobile-nav-item-auth").forEach((el) => el.classList.remove("hidden"))

      // Show voter-only nav items if user is a voter
      if (userType === "voter") {
        document.querySelectorAll(".nav-item-voter").forEach((el) => el.classList.remove("hidden"))
        document.querySelectorAll(".mobile-nav-item-voter").forEach((el) => el.classList.remove("hidden"))
      }
    } else {
      // User is not logged in
      document.querySelectorAll(".auth-buttons").forEach((el) => el.classList.remove("hidden"))
      document.querySelectorAll(".user-menu").forEach((el) => el.classList.add("hidden"))

      // Hide auth-only nav items
      document.querySelectorAll(".nav-item-auth").forEach((el) => el.classList.add("hidden"))
      document.querySelectorAll(".mobile-nav-item-auth").forEach((el) => el.classList.add("hidden"))

      // Hide voter-only nav items
      document.querySelectorAll(".nav-item-voter").forEach((el) => el.classList.add("hidden"))
      document.querySelectorAll(".mobile-nav-item-voter").forEach((el) => el.classList.add("hidden"))
    }
  }

  // Update auth UI on page load
  updateAuthUI()

  // Logout functionality
  const logoutButtons = document.querySelectorAll("#logout-btn, #mobile-logout-btn")

  logoutButtons.forEach((button) => {
    if (button) {
      button.addEventListener("click", () => {
        localStorage.removeItem("user")
        alert("You have been logged out successfully.")
        updateAuthUI()
        window.location.href = "index.html"
      })
    }
  })
})

