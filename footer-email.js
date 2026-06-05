(function () {

    document.getElementById("footerContactForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById("footerSubmitBtn");
        const successMsg = document.getElementById("footerSuccess");
        const errorMsg = document.getElementById("footerError");

        successMsg.style.display = "none";
        errorMsg.style.display = "none";

        const payload = {
            name: document.getElementById("footer-name").value.trim(),
            country_code: document.getElementById("footer-country-code").value,
            phone: document.getElementById("footer-phone").value.trim(),
            email: document.getElementById("footer-email").value.trim(),
            message: document.getElementById("footer-message").value.trim()
        };

        submitBtn.disabled = true;
        submitBtn.innerHTML = "SENDING...";

        if (!payload.name || !payload.phone) {
            alert("Name and Mobile are required fields.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = "GET IN TOUCH";
            return;
        }
        if (!/^\d+$/.test(payload.phone)) {
            alert("Mobile number should contain only digits.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = "GET IN TOUCH";
            return;
        }

        try {
            const response = await fetch("https://emailjsfuntions-428145106157.asia-south1.run.app/tula-footer-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log("Lead API Response:", result);

            if (response.ok) {
                successMsg.style.display = "block";
                document.getElementById("footerContactForm").reset();
            } else {
                errorMsg.style.display = "block";
            }
        } catch (err) {
            console.error("API Error:", err);
            errorMsg.style.display = "block";
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "GET IN TOUCH";
        }
    });

})();