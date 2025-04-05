document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // Reset error messages
      document.getElementById("email-error").textContent = ""
      document.getElementById("password-error").textContent = ""
      document.getElementById("email-error").style.display = "none"
      document.getElementById("password-error").style.display = "none"

      // Validate form
      let isValid = true

      if (!email) {
        document.getElementById("email-error").textContent = "Email is required"
        document.getElementById("email-error").style.display = "block"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        document.getElementById("email-error").textContent = "Email is invalid"
        document.getElementById("email-error").style.display = "block"
        isValid = false
      }

      if (!password) {
        document.getElementById("password-error").textContent = "Password is required"
        document.getElementById("password-error").style.display = "block"
        isValid = false
      }

      if (!isValid) {
        return
      }

      // Disable login button and show loading state
      const loginButton = document.getElementById("login-button")
      loginButton.disabled = true
      loginButton.textContent = "Logging in..."

      // Simulate API call with setTimeout
      setTimeout(() => {
        // Check if user exists in localStorage
        const registeredUserJSON = localStorage.getItem("registeredUser")

        if (registeredUserJSON) {
          const registeredUser = JSON.parse(registeredUserJSON)

          if (registeredUser.email === email) {
            // In a real app, you would verify the password hash
            // For demo purposes, we're just checking the email

            // Store logged in user
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: email,
                fullName: registeredUser.fullName,
                userType: registeredUser.userType || "voter",
              }),
            )

            // Show password save popup
            showPasswordSavePopup(email, password)

            // Get redirect URL from query parameter or default to dashboard
            const urlParams = new URLSearchParams(window.location.search)
            const redirectPath = urlParams.get("redirect") || "dashboard.html"

            // Delay redirect to show the password save popup
            setTimeout(() => {
              window.location.href = redirectPath
            }, 2000)
          } else {
            alert("Login failed: Invalid email or password.")
            loginButton.disabled = false
            loginButton.textContent = "Login"
          }
        } else {
          alert("Login failed: No account found with this email.")
          loginButton.disabled = false
          loginButton.textContent = "Login"
        }
      }, 1500)
    })
  }

  // Function to show password save popup
  function showPasswordSavePopup(email, password) {
    // Create popup element
    const popup = document.createElement("div")
    popup.className = "password-save-popup"
    popup.innerHTML = `
            <div class="password-save-header">
                <h3 class="password-save-title">Save Password?</h3>
                <button class="password-save-close">&times;</button>
            </div>
            <div class="password-save-content">
                <p>Would you like to save your password for ${email}?</p>
                <p class="text-muted">Your password will be securely saved for this site.</p>
            </div>
            <div class="password-save-actions">
                <button class="btn btn-outline" id="never-save">Never</button>
                <button class="btn btn-outline" id="not-now">Not Now</button>
                <button class="btn btn-primary" id="save-password">Save</button>
            </div>
        `

    // Add popup to body
    document.body.appendChild(popup)

    // Show popup with animation
    setTimeout(() => {
      popup.style.display = "block"
    }, 500)

    // Add event listeners
    popup.querySelector(".password-save-close").addEventListener("click", () => {
      closePopup(popup)
    })

    popup.querySelector("#never-save").addEventListener("click", () => {
      closePopup(popup)
    })

    popup.querySelector("#not-now").addEventListener("click", () => {
      closePopup(popup)
    })

    popup.querySelector("#save-password").addEventListener("click", () => {
      // Simulate saving password
      closePopup(popup)

      // Show confirmation
      const confirmPopup = document.createElement("div")
      confirmPopup.className = "password-save-popup"
      confirmPopup.innerHTML = `
                <div class="password-save-header">
                    <h3 class="password-save-title">Password Saved</h3>
                    <button class="password-save-close">&times;</button>
                </div>
                <div class="password-save-content">
                    <p>Your password has been saved successfully.</p>
                </div>
            `

      document.body.appendChild(confirmPopup)

      setTimeout(() => {
        confirmPopup.style.display = "block"
      }, 100)

      confirmPopup.querySelector(".password-save-close").addEventListener("click", () => {
        closePopup(confirmPopup)
      })

      setTimeout(() => {
        closePopup(confirmPopup)
      }, 2000)
    })
  }

  // Function to close popup
  function closePopup(popup) {
    popup.style.transform = "translateX(100%)"
    popup.style.opacity = "0"

    setTimeout(() => {
      popup.remove()
    }, 300)
  }
})

