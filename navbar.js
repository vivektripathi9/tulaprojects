(function () {
const hamburgerBtn = document.getElementById("hamburgerBtn");
const overlay = document.getElementById("overlay");
const menuPanel = document.getElementById("menuPanel");

const closeBtn = document.getElementById("closeBtn");

const whoWeAre = document.getElementById("whoWeAre");
const projectsMenu = document.getElementById("projectsMenu");

const subPanel = document.getElementById("subPanel");
const projectsSubPanel = document.getElementById("projectsSubPanel");

// OPEN MENU
function openMenu() {
  menuPanel.classList.add("open");
  overlay.classList.add("active");
}

// CLOSE EVERYTHING
function closeAll() {
  menuPanel.classList.remove("open");

  subPanel.classList.remove("open");
  projectsSubPanel.classList.remove("open");

  overlay.classList.remove("active");
}

// EVENTS
if (hamburgerBtn) hamburgerBtn.addEventListener("click", openMenu);

if (closeBtn) closeBtn.addEventListener("click", closeAll);

if (overlay) overlay.addEventListener("click", closeAll);

// ====================================
// WHO WE ARE HOVER
// ====================================

if (whoWeAre) {
  whoWeAre.addEventListener("mouseenter", () => {
    projectsSubPanel.classList.remove("open");

    subPanel.classList.add("open");
  });
}

// ====================================
// PROJECTS HOVER
// ====================================

if (projectsMenu) {
  projectsMenu.addEventListener("mouseenter", () => {
    subPanel.classList.remove("open");

    projectsSubPanel.classList.add("open");
  });
}

// ====================================
// HIDE PANELS WHEN LEAVING MENU
// ====================================

menuPanel.addEventListener("mouseleave", (e) => {
  if (
    !subPanel.contains(e.relatedTarget) &&
    !projectsSubPanel.contains(e.relatedTarget)
  ) {
    subPanel.classList.remove("open");
    projectsSubPanel.classList.remove("open");
  }
});

// ====================================
// WHO WE ARE PANEL LEAVE
// ====================================

subPanel.addEventListener("mouseleave", (e) => {
  if (!menuPanel.contains(e.relatedTarget)) {
    subPanel.classList.remove("open");
  }
});

// ====================================
// PROJECT PANEL LEAVE
// ====================================

projectsSubPanel.addEventListener("mouseleave", (e) => {
  if (!menuPanel.contains(e.relatedTarget)) {
    projectsSubPanel.classList.remove("open");
  }
});

// =========================
// APARTMENT POPUP
// =========================

const apartmentModal = document.getElementById("apartmentModal");

const apartmentClose = document.getElementById("apartmentClose");

const apartmentButtons = document.querySelectorAll(".apartment-popup-btn");

// Open popup from ANY button

apartmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    apartmentModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

// Close button

apartmentClose.addEventListener("click", () => {
  apartmentModal.classList.remove("active");
  document.body.style.overflow = "";
});

// Click outside popup

apartmentModal.addEventListener("click", (e) => {
  if (e.target === apartmentModal) {
    apartmentModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ESC key support

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    apartmentModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

const enquiryPopup = document.getElementById("projectEnquiryPopup");

const enquiryClose = document.getElementById("projectEnquiryClose");

const enquiryButtons = document.querySelectorAll(".project-enquiry-btn");

// OPEN POPUP

enquiryButtons.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    enquiryPopup.classList.add("active");
  });
});

// CLOSE BUTTON

enquiryClose.addEventListener("click", function () {
  enquiryPopup.classList.remove("active");
});

// CLICK OUTSIDE

enquiryPopup.addEventListener("click", function (e) {
  if (e.target === enquiryPopup) {
    enquiryPopup.classList.remove("active");
  }
});

// Project Enquiry

document
  .getElementById("projectEnquiryForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("peSubmitBtn");
    const successMsg = document.getElementById("peSuccess");
    const errorMsg = document.getElementById("peError");

    successMsg.style.display = "none";
    errorMsg.style.display = "none";

    const payload = {
      name: document.getElementById("pe-name").value.trim(),
      country_code: document.getElementById("pe-country-code").value,
      mobile: document.getElementById("pe-mobile").value.trim(),
      email: document.getElementById("pe-email").value.trim(),
      project: document.getElementById("pe-project").value,
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";

    if (!payload.name || !payload.mobile) {
      alert("Name and Mobile are required fields.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit Enquiry";
      return;
    }
    if (!/^\d+$/.test(payload.mobile)) {
      alert("Mobile number should contain only digits.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit Enquiry";
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const leadPayload = {
        "Name": payload.name,
        "Email": payload.email,
        "Mobile": payload.mobile,
        "Site": "Tula Properties",
        "Source": "Website",
        "Subsource": "Landing Page",
        "TypeOfUnit": "",
        "Keyword": "",
        "MatchType": "",
        "Creative": "",
        "Placement": "",
        "Model": "",
        "CampaignType": "",
        "UTM_Source": urlParams.get('utm_source') || "",
        "UTM_Medium": urlParams.get('utm_medium') || "",
        "GCLID": urlParams.get('gclid') || "",
        "Remark": "Project: " + payload.project,
        "Text1": "",
        "Text2": "",
        "Text3": "",
        "Text4": "",
        "Text5": "",
        "Portal_ID": "",
        "Enquiry_Id": "",
        "Adset_Name": "",
        "Campaign_Name": ""
      };

      const response = await fetch("https://tulaproperties.in/HighriseLeadsIntegrationAPi/OnlinEnquiry/Enquiry_InsertAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain"
        },
        body: JSON.stringify(leadPayload)
      });

      const responseText = await response.text();
      console.log("Lead API Response:", responseText);

      if (response.ok) {
        successMsg.style.display = "block";
        document.getElementById("projectEnquiryForm").reset();
      } else {
        errorMsg.style.display = "block";
      }
    } catch (err) {
      console.error(err);
      errorMsg.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit Enquiry";
    }
  });

document
  .getElementById("apartmentForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("aptSubmitBtn");
    const successMsg = document.getElementById("aptSuccess");
    const errorMsg = document.getElementById("aptError");

    successMsg.style.display = "none";
    errorMsg.style.display = "none";

    const payload = {
      name: document.getElementById("apt-name").value.trim(),
      country_code: document.getElementById("apartment-country-code").value,
      mobile: document.getElementById("apartment-mobile").value.trim(),
      email: document.getElementById("apt-email").value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";

    if (!payload.name || !payload.mobile) {
      alert("Name and Mobile are required fields.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit Interest";
      return;
    }
    if (!/^\d+$/.test(payload.mobile)) {
      alert("Mobile number should contain only digits.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit Interest";
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const leadPayload = {
        "Name": payload.name,
        "Email": payload.email,
        "Mobile": payload.mobile,
        "Site": "Tula Properties",
        "Source": "Website",
        "Subsource": "Landing Page",
        "TypeOfUnit": "",
        "Keyword": "",
        "MatchType": "",
        "Creative": "",
        "Placement": "",
        "Model": "",
        "CampaignType": "",
        "UTM_Source": urlParams.get('utm_source') || "",
        "UTM_Medium": urlParams.get('utm_medium') || "",
        "GCLID": urlParams.get('gclid') || "",
        "Remark": "",
        "Text1": "",
        "Text2": "",
        "Text3": "",
        "Text4": "",
        "Text5": "",
        "Portal_ID": "",
        "Enquiry_Id": "",
        "Adset_Name": "",
        "Campaign_Name": ""
      };

      const response = await fetch("https://tulaproperties.in/HighriseLeadsIntegrationAPi/OnlinEnquiry/Enquiry_InsertAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain"
        },
        body: JSON.stringify(leadPayload)
      });

      const responseText = await response.text();
      console.log("Lead API Response:", responseText);

      if (response.ok) {
        successMsg.style.display = "block";
        document.getElementById("apartmentForm").reset();
      } else {
        errorMsg.style.display = "block";
      }
    } catch (err) {
      console.error(err);
      errorMsg.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit Interest";
    }
  });

// ====================================
// MOBILE PROJECTS SUBMENU
// ====================================

// if (window.innerWidth <= 992) {
//   projectsMenu.addEventListener("click", function (e) {
//     if (e.target.classList.contains("arrow-icon")) {
//       e.preventDefault();

//       subPanel.classList.remove("open");

//       projectsSubPanel.classList.toggle("open");
//     }
//   });
// }

const navbar = document.querySelector(".navbar");

let lastScrollTop = 0;
const scrollThreshold = 10;

/** Home uses `home-inline.js` (class + CSS) for hide-on-scroll; skip or we fight and flicker content below. */
function legacyHomeNavbarScrollActive() {
  try {
    const p = window.location.pathname || "";
    return p === "/" || p === "";
  } catch {
    return false;
  }
}

if (navbar && !legacyHomeNavbarScrollActive()) {
  window.addEventListener("scroll", () => {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll <= 20) {
      navbar.style.transform = "translateY(0)";
      return;
    }

    if (
      currentScroll > lastScrollTop &&
      currentScroll - lastScrollTop > scrollThreshold
    ) {
      navbar.style.transform = "translateY(-100%)";
    } else if (lastScrollTop - currentScroll > scrollThreshold) {
      navbar.style.transform = "translateY(0)";
    }

    lastScrollTop = currentScroll;
  });
}

})();
