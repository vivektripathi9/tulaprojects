(function () {
/**
 * Career page logic (was inline <script> in career/index.html).
 * Loaded after navbar.js + footer-email.js by Next prepare config.
 */
async function submitCareerForm(payload, submitBtn, successMsg, errorMsg, formId) {
  submitBtn.disabled = true;
  submitBtn.innerHTML = "Submitting...";
  successMsg.style.display = "none";
  errorMsg.style.display = "none";

  try {
    const response = await fetch(
      "https://emailjsfuntions-428145106157.asia-south1.run.app/tula-career-form",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();

    if (response.ok && result.success) {
      successMsg.style.display = "block";
      document.getElementById(formId).reset();
    } else {
      errorMsg.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    errorMsg.style.display = "block";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Submit Application";
  }
}

const joinTeamForm = document.getElementById("joinTeamForm");
if (joinTeamForm) {
  joinTeamForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const role = document.getElementById("careerRole").value;
    const otherRole = document.getElementById("otherRole").value.trim();

    const payload = {
      form_source: "Join Our Team Form",
      name: document.getElementById("candidateName").value.trim(),
      country_code: document.getElementById("countryCode").value,
      mobile: document.getElementById("mobileNumber").value.trim(),
      email: document.getElementById("candidateEmail").value.trim(),
      role: role === "Other" ? otherRole : role,
      current_ctc: document.getElementById("currentCTC").value.trim(),
      expected_ctc: document.getElementById("expectedCTC").value.trim(),
    };

    await submitCareerForm(
      payload,
      document.getElementById("jtSubmitBtn"),
      document.getElementById("jtSuccess"),
      document.getElementById("jtError"),
      "joinTeamForm",
    );
  });
}

const careerPopupForm = document.getElementById("careerPopupForm");
if (careerPopupForm) {
  careerPopupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const role = document.getElementById("popupRole").value;
    const otherRole = document.getElementById("popupOtherRole").value.trim();

    const payload = {
      form_source: "Career Popup Form",
      name: document.getElementById("popupName").value.trim(),
      country_code: document.getElementById("popupCountryCode").value,
      mobile: document.getElementById("popupMobile").value.trim(),
      email: document.getElementById("popupEmail").value.trim(),
      role: role === "Other" ? otherRole : role,
      current_ctc: document.getElementById("popupCurrentCTC").value.trim(),
      expected_ctc: document.getElementById("popupExpectedCTC").value.trim(),
    };

    await submitCareerForm(
      payload,
      document.getElementById("cpSubmitBtn"),
      document.getElementById("cpSuccess"),
      document.getElementById("cpError"),
      "careerPopupForm",
    );
  });
}

function toggleOtherRole() {
  const role = document.getElementById("careerRole");
  const other = document.getElementById("otherRole");
  if (!role || !other) return;
  other.style.display = role.value === "Other" ? "block" : "none";
}

function togglePopupOtherRole() {
  const role = document.getElementById("popupRole");
  const other = document.getElementById("popupOtherRole");
  if (!role || !other) return;
  other.style.display = role.value === "Other" ? "block" : "none";
}

function openCareerPopup(roleName) {
  const popup = document.getElementById("careerPopup");
  const roleInput = document.getElementById("popupRole");
  if (!popup || !roleInput) return;
  popup.classList.add("active");
  roleInput.value = roleName;
}

function closeCareerPopup() {
  const popup = document.getElementById("careerPopup");
  if (popup) popup.classList.remove("active");
}

window.addEventListener("click", function (e) {
  const popup = document.getElementById("careerPopup");
  if (popup && e.target === popup) {
    closeCareerPopup();
  }
});

function toggleAccordion(element) {
  const item = element.parentElement;
  item.classList.toggle("active");

  const body = item.querySelector(".accordion-body");
  if (!body) return;

  if (item.classList.contains("active")) {
    body.style.maxHeight = body.scrollHeight + "px";
  } else {
    body.style.maxHeight = null;
  }
}

function handleContact() {
  window.location.assign("/contact");
}

const resumeUpload = document.getElementById("resumeUpload");
const resumeText = document.getElementById("resumeText");
if (resumeUpload && resumeText) {
  resumeUpload.addEventListener("change", function () {
    if (this.files.length > 0) {
      resumeText.textContent = this.files[0].name;
    } else {
      resumeText.textContent = "Upload Resume";
    }
  });
}

window.toggleOtherRole = toggleOtherRole;
window.togglePopupOtherRole = togglePopupOtherRole;
window.openCareerPopup = openCareerPopup;
window.closeCareerPopup = closeCareerPopup;
window.toggleAccordion = toggleAccordion;
window.handleContact = handleContact;

})();
