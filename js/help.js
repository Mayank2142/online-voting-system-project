document.addEventListener("DOMContentLoaded", () => {
  // Help page functionality
  const helpTopics = document.querySelectorAll(".help-topics li")
  const helpSections = document.querySelectorAll(".help-section")

  // Initialize FAQ items
  initFaqItems()

  // Add event listeners to help topics
  if (helpTopics.length > 0) {
    helpTopics.forEach((topic) => {
      topic.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target")

        // Update active topic
        helpTopics.forEach((t) => t.classList.remove("active"))
        this.classList.add("active")

        // Show target section
        helpSections.forEach((section) => {
          if (section.id === targetId) {
            section.classList.add("active")
          } else {
            section.classList.remove("active")
          }
        })
      })
    })
  }

  // Initialize FAQ items
  function initFaqItems() {
    const faqItems = document.querySelectorAll(".faq-item")

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")

      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active")

        // Close all other items
        faqItems.forEach((i) => i.classList.remove("active"))

        // Toggle current item
        if (!isActive) {
          item.classList.add("active")
        }
      })
    })
  }

  // Handle contact form submission
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Get form data
      const name = document.getElementById("contact-name").value
      const email = document.getElementById("contact-email").value
      const subject = document.getElementById("contact-subject").value
      const message = document.getElementById("contact-message").value

      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]')
      submitButton.disabled = true
      submitButton.textContent = "Submitting..."

      setTimeout(() => {
        // Show success message
        const successAlert = document.createElement("div")
        successAlert.className = "alert alert-success mb-4"
        successAlert.innerHTML = `
                    <i class="fas fa-check-circle alert-icon"></i>
                    <div>
                        <h3 class="alert-title">Message Sent!</h3>
                        <p class="alert-message">Thank you for contacting us. We will respond to your inquiry within 24-48 hours.</p>
                    </div>
                `

        contactForm.parentNode.insertBefore(successAlert, contactForm)

        // Reset form
        contactForm.reset()
        submitButton.disabled = false
        submitButton.textContent = "Submit Message"

        // Remove success message after 5 seconds
        setTimeout(() => {
          successAlert.remove()
        }, 5000)
      }, 1500)
    })
  }

  // Handle search functionality
  const searchInput = document.getElementById("help-search-input")
  const searchButton = document.querySelector(".search-button")

  if (searchInput && searchButton) {
    searchButton.addEventListener("click", performSearch)
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch()
      }
    })
  }

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim()

    if (!searchTerm) return

    // Find matching FAQ items
    const faqItems = document.querySelectorAll(".faq-item")
    let foundMatch = false

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question h3").textContent.toLowerCase()
      const answer = item.querySelector(".faq-answer").textContent.toLowerCase()

      if (question.includes(searchTerm) || answer.includes(searchTerm)) {
        // Find the section containing this FAQ
        const section = item.closest(".help-section")
        const sectionId = section.id

        // Activate the corresponding topic
        helpTopics.forEach((topic) => {
          if (topic.getAttribute("data-target") === sectionId) {
            topic.click()
          }
        })

        // Open the FAQ item
        item.classList.add("active")

        // Scroll to the item
        setTimeout(() => {
          item.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 300)

        // Highlight the search term
        highlightSearchTerm(item, searchTerm)

        foundMatch = true
        return
      }
    })

    if (!foundMatch) {
      alert('No results found for "' + searchTerm + '". Please try a different search term.')
    }
  }

  function highlightSearchTerm(item, term) {
    const answer = item.querySelector(".faq-answer")
    const originalHTML = answer.innerHTML

    // Create a regex that matches the search term (case insensitive)
    const regex = new RegExp("(" + term + ")", "gi")

    // Replace matches with highlighted version
    const highlightedHTML = originalHTML.replace(
      regex,
      '<span style="background-color: yellow; font-weight: bold;">$1</span>',
    )

    answer.innerHTML = highlightedHTML

    // Remove highlighting after 5 seconds
    setTimeout(() => {
      answer.innerHTML = originalHTML
    }, 5000)
  }
})

