(function () {
/**
 * Contact page "Send Message" (was referenced by onclick; no inline script in source HTML).
 * Same lead pipeline as footer-email.js; Subsource tags the contact form.
 */
async function sendMessage() {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const phoneEl = document.getElementById("phone");
  const messageEl = document.getElementById("message");
  const toast = document.getElementById("toast");
  const btn = document.querySelector(".contact-form-panel .btn-send");

  if (!nameEl || !phoneEl || !toast) return;

  const name = nameEl.value.trim();
  const email = emailEl ? emailEl.value.trim() : "";
  const phone = phoneEl.value.trim();
  const message = messageEl ? messageEl.value.trim() : "";

  if (!name || !phone) {
    alert("Name and phone number are required fields.");
    return;
  }
  if (!/^\d+$/.test(phone)) {
    alert("Phone number should contain only digits.");
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Sending...";
  }

  try {
    const payload = {
      name: name,
      country_code: "+91",
      phone: phone,
      email: email,
      message: message
    };

    const response = await fetch(
      "https://emailjsfuntions-428145106157.asia-south1.run.app/tula-footer-form",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();
    console.log("Lead API Response:", result);

    if (response.ok) {
      toast.classList.add("show");
      nameEl.value = "";
      if (emailEl) emailEl.value = "";
      phoneEl.value = "";
      if (messageEl) messageEl.value = "";
      window.setTimeout(() => toast.classList.remove("show"), 3500);
    } else {
      alert("Could not send your message. Please try again or email us directly.");
    }
  } catch (err) {
    console.error("API Error:", err);
    alert("Could not send your message. Please try again or email us directly.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Send Message";
    }
  }
}

window.sendMessage = sendMessage;

})();
