document.addEventListener("DOMContentLoaded", () => {
  // Variables for registration steps
  let userType = ""
  let currentStep = 1

  // Step 1: User Type Selection
  const voterCard = document.getElementById("voter-card")
  const candidateCard = document.getElementById("candidate-card")
  const voterRadio = document.getElementById("voter")
  const candidateRadio = document.getElementById("candidate")

  if (voterCard && candidateCard) {
    // Voter card click handler
    voterCard.addEventListener("click", () => {
      voterRadio.checked = true
      voterCard.classList.add("selected")
      candidateCard.classList.remove("selected")
      userType = "voter"

      // Go to step 2
      goToStep(2)
    })

    // Candidate card click handler
    candidateCard.addEventListener("click", () => {
      candidateRadio.checked = true
      candidateCard.classList.add("selected")
      voterCard.classList.remove("selected")
      userType = "candidate"

      // Go to step 2
      goToStep(2)
    })
  }

  // Step navigation buttons
  const backToStep1Button = document.getElementById("back-to-step-1")
  const goToStep3Button = document.getElementById("go-to-step-3")
  const backToStep2Button = document.getElementById("back-to-step-2")
  const goToStep4Button = document.getElementById("go-to-step-4")
  const backToStep3Button = document.getElementById("back-to-step-3")
  const voterSubmitButton = document.getElementById("voter-submit")
  const candidateSubmitButton = document.getElementById("candidate-submit")

  // Step 1 to Step 2
  if (backToStep1Button) {
    backToStep1Button.addEventListener("click", () => {
      goToStep(1)
    })
  }

  // Step 2 to Step 3
  if (goToStep3Button) {
    goToStep3Button.addEventListener("click", () => {
      if (validateStep2()) {
        goToStep(3)

        // Show/hide voter-specific fields
        const voterOnlyFields = document.querySelectorAll(".voter-only")
        if (userType === "voter") {
          voterOnlyFields.forEach((field) => (field.style.display = "block"))
          voterSubmitButton.classList.remove("hidden")
          goToStep4Button.classList.add("hidden")
        } else {
          voterOnlyFields.forEach((field) => (field.style.display = "none"))
          voterSubmitButton.classList.add("hidden")
          goToStep4Button.classList.remove("hidden")
        }
      }
    })
  }

  // Step 3 to Step 2
  if (backToStep2Button) {
    backToStep2Button.addEventListener("click", () => {
      goToStep(2)
    })
  }

  // Step 3 to Step 4 (Candidate only)
  if (goToStep4Button) {
    goToStep4Button.addEventListener("click", () => {
      if (validateStep3()) {
        goToStep(4)
      }
    })
  }

  // Step 4 to Step 3
  if (backToStep3Button) {
    backToStep3Button.addEventListener("click", () => {
      goToStep(3)
    })
  }

  // Voter Submit (Step 3)
  if (voterSubmitButton) {
    voterSubmitButton.addEventListener("click", () => {
      if (validateStep3()) {
        submitRegistration()
      }
    })
  }

  // Candidate Submit (Step 4)
  if (candidateSubmitButton) {
    candidateSubmitButton.addEventListener("click", (e) => {
      e.preventDefault()
      if (validateStep4()) {
        submitRegistration()
      }
    })
  }

  // Function to navigate between steps
  function goToStep(step) {
    // Hide all steps
    document.querySelectorAll(".registration-step").forEach((el) => {
      el.classList.add("hidden")
    })

    // Show the target step
    document.getElementById(`step-${step}`).classList.remove("hidden")

    // Update current step
    currentStep = step
  }

  // Validate Step 2 (Basic Information)
  function validateStep2() {
    const fullName = document.getElementById("fullName").value
    const email = document.getElementById("email").value
    const age = document.getElementById("age").value
    const phone = document.getElementById("phone").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    // Reset error messages
    resetErrors("fullName", "email", "age", "phone", "password", "confirmPassword")

    let isValid = true

    // Full name validation - only alphabets and spaces
    if (!fullName.trim()) {
      showError("fullName", "Full name is required")
      isValid = false
    } else if (!/^[A-Za-z\s]+$/.test(fullName)) {
      showError("fullName", "Full name should only contain alphabets")
      isValid = false
    }

    // Email validation
    if (!email.trim()) {
      showError("email", "Email is required")
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showError("email", "Email is invalid")
      isValid = false
    }

    // Age validation - must be greater than 18
    if (!age) {
      showError("age", "Age is required")
      isValid = false
    } else if (Number.parseInt(age) < 18) {
      showError("age", "You must be at least 18 years old to register")
      isValid = false
    }

    // Phone validation
    if (!phone.trim()) {
      showError("phone", "Phone number is required")
      isValid = false
    } else if (!/^\d{10}$/.test(phone)) {
      showError("phone", "Phone number must be 10 digits")
      isValid = false
    }

    // Password validation
    if (!password) {
      showError("password", "Password is required")
      isValid = false
    } else if (password.length < 8) {
      showError("password", "Password must be at least 8 characters")
      isValid = false
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      showError("password", "Password must contain both letters and numbers")
      isValid = false
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      showError("confirmPassword", "Passwords do not match")
      isValid = false
    }

    return isValid
  }

  // Validate Step 3 (Address and ID Information)
  function validateStep3() {
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const state = document.getElementById("state").value
    const pincode = document.getElementById("pincode").value
    const aadharNumber = document.getElementById("aadharNumber").value

    // Reset error messages
    resetErrors("address", "city", "state", "pincode", "aadharNumber", "voterID")

    let isValid = true

    // Address validation
    if (!address.trim()) {
      showError("address", "Address is required")
      isValid = false
    }

    // City validation - only alphabets and spaces
    if (!city.trim()) {
      showError("city", "City is required")
      isValid = false
    } else if (!/^[A-Za-z\s]+$/.test(city)) {
      showError("city", "City should only contain alphabets")
      isValid = false
    }

    // State validation
    if (!state) {
      showError("state", "State is required")
      isValid = false
    }

    // Pincode validation
    if (!pincode.trim()) {
      showError("pincode", "PIN code is required")
      isValid = false
    } else if (!/^\d{6}$/.test(pincode)) {
      showError("pincode", "PIN code must be 6 digits")
      isValid = false
    }

    // Aadhar number validation
    if (!aadharNumber.trim()) {
      showError("aadharNumber", "Aadhar number is required")
      isValid = false
    } else if (!/^\d{12}$/.test(aadharNumber)) {
      showError("aadharNumber", "Aadhar number must be 12 digits")
      isValid = false
    }

    // Voter ID validation (only for voters)
    if (userType === "voter") {
      const voterID = document.getElementById("voterID").value
      if (!voterID.trim()) {
        showError("voterID", "Voter ID is required")
        isValid = false
      } else if (!/^\d{12}$/.test(voterID)) {
        showError("voterID", "Voter ID must be 12 digits")
        isValid = false
      }
    }

    return isValid
  }

  // Validate Step 4 (Candidate Information)
  function validateStep4() {
    const party = document.getElementById("party").value
    const constituency = document.getElementById("constituency").value
    const position = document.getElementById("position").value

    // Reset error messages
    resetErrors("party", "constituency", "position")

    let isValid = true

    // Party validation
    if (!party) {
      showError("party", "Party is required")
      isValid = false
    }

    // Constituency validation
    if (!constituency.trim()) {
      showError("constituency", "Constituency is required")
      isValid = false
    }

    // Position validation
    if (!position) {
      showError("position", "Position is required")
      isValid = false
    }

    return isValid
  }

  // Submit registration
  function submitRegistration() {
    // Collect all form data
    const formData = {
      userType: userType,
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      age: document.getElementById("age").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      pincode: document.getElementById("pincode").value,
      aadharNumber: document.getElementById("aadharNumber").value,
    }

    // Add voter-specific fields
    if (userType === "voter") {
      formData.voterID = document.getElementById("voterID").value
    }

    // Add candidate-specific fields
    if (userType === "candidate") {
      formData.party = document.getElementById("party").value
      formData.constituency = document.getElementById("constituency").value
      formData.position = document.getElementById("position").value
    }

    // Disable submit button and show loading state
    const submitButton = userType === "voter" ? voterSubmitButton : candidateSubmitButton
    submitButton.disabled = true
    submitButton.textContent = "Registering..."

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Store user data in localStorage
      localStorage.setItem("registeredUser", JSON.stringify(formData))

      alert("Registration successful! You can now log in with your credentials.")
      window.location.href = "login.html"
    }, 1500)
  }

  // Helper function to show error message
  function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
  }

  // Helper function to reset error messages
  function resetErrors(...fieldIds) {
    fieldIds.forEach((fieldId) => {
      const errorElement = document.getElementById(`${fieldId}-error`)
      if (errorElement) {
        errorElement.textContent = ""
        errorElement.style.display = "none"
      }
    })
  }
})

