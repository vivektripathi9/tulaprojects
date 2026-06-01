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
            const urlParams = new URLSearchParams(window.location.search);
            const leadPayload = {
                "Name": payload.name,
                "Email": payload.email,
                "Mobile": payload.phone,
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
                "Remark": payload.message || "",
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