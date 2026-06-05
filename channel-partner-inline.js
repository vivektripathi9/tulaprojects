(function () {
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  function setupFileInput(inputId, labelId) {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    if (input && label) {
      input.addEventListener("change", function () {
        if (this.files.length > 0) {
          label.textContent = this.files[0].name;
        } else {
          label.textContent = "No file uploaded";
        }
      });
    }
  }

  setupFileInput("rera-file", "rera-file-name");
  setupFileInput("pan-file", "pan-file-name");
  setupFileInput("gst-file", "gst-file-name");

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById("regSubmitBtn");
      const successMsg = document.getElementById("regSuccess");
      const errorMsg = document.getElementById("regError");

      if (successMsg) successMsg.style.display = "none";
      if (errorMsg) errorMsg.style.display = "none";

      const privacy = document.getElementById("privacy");
      if (privacy && !privacy.checked) {
        if (errorMsg) {
          errorMsg.textContent = "❌ Please accept the Privacy Policy to continue.";
          errorMsg.style.display = "block";
        }
        return;
      }

      const payload = {
        company: document.getElementById("reg-company")?.value.trim() || "",
        off_email: document.getElementById("reg-off-email")?.value.trim() || "",
        address: document.getElementById("reg-address")?.value.trim() || "",
        owner: document.getElementById("reg-owner")?.value.trim() || "",
        phone: document.getElementById("reg-phone")?.value.trim() || "",
        office: document.getElementById("reg-office")?.value.trim() || "",
        website: document.getElementById("reg-website")?.value.trim() || "",
        rera: document.getElementById("reg-rera")?.value.trim() || "",
        rera_expiry: document.getElementById("reg-rera-expiry")?.value.trim() || "",
        pan: document.getElementById("reg-pan")?.value.trim() || "",
        gst: document.getElementById("reg-gst")?.value.trim() || ""
      };

      const reraFile = document.getElementById("rera-file")?.files?.[0];
      if (reraFile) {
        payload.rera_file_name = reraFile.name;
        payload.rera_file_base64 = await fileToBase64(reraFile);
      }

      const panFile = document.getElementById("pan-file")?.files?.[0];
      if (panFile) {
        payload.pan_file_name = panFile.name;
        payload.pan_file_base64 = await fileToBase64(panFile);
      }

      const gstFile = document.getElementById("gst-file")?.files?.[0];
      if (gstFile) {
        payload.gst_file_name = gstFile.name;
        payload.gst_file_base64 = await fileToBase64(gstFile);
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Submitting...";
      }

      try {
        const response = await fetch("https://emailjsfuntions-428145106157.asia-south1.run.app/tula-channel-partner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          if (successMsg) successMsg.style.display = "block";
          registerForm.reset();
          // Reset labels
          const reraLabel = document.getElementById("rera-file-name");
          if (reraLabel) reraLabel.textContent = "No file uploaded";
          const panLabel = document.getElementById("pan-file-name");
          if (panLabel) panLabel.textContent = "No file uploaded";
          const gstLabel = document.getElementById("gst-file-name");
          if (gstLabel) gstLabel.textContent = "No file uploaded";
        } else {
          if (errorMsg) {
            errorMsg.textContent = "❌ Something went wrong. Please try again.";
            errorMsg.style.display = "block";
          }
        }
      } catch (err) {
        console.error(err);
        if (errorMsg) {
          errorMsg.textContent = "❌ Something went wrong. Please try again.";
          errorMsg.style.display = "block";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Submit";
        }
      }
    });
  }
})();
