// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const icon = themeToggle.querySelector("i");

// Check for saved theme preference
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
    body.classList.add("dark-mode");
    icon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
        icon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "dark");
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "light");
    }
});

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

// Form submission with enhanced error handling
const contactForm = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI feedback
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusMessage.textContent = 'Sending your message...';
    statusMessage.className = 'loading';

    const formData = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        message: contactForm.message.value.trim()
    };

    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Server responded with status ${response.status}`);
        }

        // Success case
        statusMessage.textContent = 'Message sent successfully!';
        statusMessage.className = 'success';
        contactForm.reset();
    } catch (error) {
        console.error('Submission error:', error);

        // Special handling for network errors
        if (error.message.includes('Failed to fetch')) {
            statusMessage.innerHTML = `
    Could not connect to server. Please check:<br>
    1. Is the backend server running?<br>
    2. Are you using the correct URL?<br>
    3. Check browser console for details
  `;
        } else {
            statusMessage.textContent = `Error: ${error.message}`;
        }

        statusMessage.className = 'error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';

        // Clear message after 5 seconds
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = '';
        }, 5000);
    }

});