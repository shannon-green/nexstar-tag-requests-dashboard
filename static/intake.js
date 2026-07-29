(function () {
  const form = document.getElementById("requestForm");
  const formCard = document.getElementById("formCard");
  const errorEl = document.getElementById("formError");
  const submitBtn = document.getElementById("submitBtn");
  const successPanel = document.getElementById("successPanel");
  const submitAnotherBtn = document.getElementById("submitAnotherBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const payload = {
      clientName: form.clientName.value.trim(),
      siteUrl: form.siteUrl.value.trim(),
      contactName: form.contactName.value.trim(),
      contactEmail: form.contactEmail.value.trim(),
    };

    if (!payload.clientName || !payload.siteUrl || !payload.contactName || !payload.contactEmail) {
      errorEl.textContent = "Please fill in all required fields.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      form.style.display = "none";
      successPanel.style.display = "flex";
    } catch (err) {
      errorEl.textContent = err.message || "Something went wrong. Please try again.";
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit Tag Request <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
    }
  });

  submitAnotherBtn.addEventListener("click", () => {
    form.reset();
    form.style.display = "";
    successPanel.style.display = "none";
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit Tag Request <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
  });
})();
