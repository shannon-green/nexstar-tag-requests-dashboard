(function () {
  const MARKETS = [
    "Abilene", "Albany", "Albuquerque", "Alexandria", "Altoona", "Amarillo",
    "Augusta", "Austin", "Bakersfield", "Baton Rouge", "Billings", "Binghamton",
    "Birmingham", "Bismarck", "Bluefield", "Brownsville", "Buffalo", "Burlington",
    "Champaign", "Charleston, SC", "Charleston, WV", "Charlotte", "Chicago",
    "Clarksburg", "Cleveland", "Colorado Springs", "Columbus, GA", "Columbus, OH",
    "Dallas", "Dayton", "Denver", "Des Moines", "Dothan", "El Paso", "Elmira",
    "Erie", "Evansville", "Fayetteville", "Fort Wayne", "Fresno", "Grand Junction",
    "Grand Rapids", "Green Bay", "Greensboro", "Greenville, NC", "Harrisburg",
    "Hattiesburg", "Honolulu", "Houston", "Huntsville", "Indianapolis",
    "Jackson, MS", "Joplin", "Kansas City", "Knoxville", "LaCrosse",
    "Lafayette, LA", "Lansing", "Las Vegas", "Lexington", "Little Rock",
    "Los Angeles", "Lubbock", "Memphis", "Midland", "Mobile", "Monroe",
    "Myrtle Beach", "Nashville", "New Haven", "New Orleans", "New York",
    "Norfolk", "Oklahoma City", "Panama City", "Peoria", "Philadelphia",
    "Phoenix", "Portland", "Providence", "Quad Cities", "Raleigh", "Richmond",
    "Roanoke", "Rochester", "Rockford", "Sacramento", "Salt Lake City",
    "San Angelo", "San Diego", "San Francisco", "Savannah", "Shreveport",
    "Sioux City", "Sioux Falls", "Spartanburg", "Springfield, MA",
    "Springfield, MO", "St Louis", "Syracuse", "Tampa", "Terre Haute", "Topeka",
    "Tri Cities", "Tyler", "Utica", "Waco", "Washington DC", "Watertown",
    "Wheeling", "Wichita", "Wichita Falls", "Wilkes Barre", "Youngstown",
  ];

  const form = document.getElementById("requestForm");
  const formCard = document.getElementById("formCard");
  const errorEl = document.getElementById("formError");
  const submitBtn = document.getElementById("submitBtn");
  const successPanel = document.getElementById("successPanel");
  const submitAnotherBtn = document.getElementById("submitAnotherBtn");

  const marketInput = document.getElementById("marketInput");
  const marketHidden = document.getElementById("market");
  const marketList = document.getElementById("marketList");
  let marketHighlightIndex = -1;

  function renderMarketOptions(query) {
    const q = (query || "").trim().toLowerCase();
    const matches = q
      ? MARKETS.filter((m) => m.toLowerCase().includes(q))
      : MARKETS;

    marketList.innerHTML = "";
    marketHighlightIndex = -1;

    if (matches.length === 0) {
      const li = document.createElement("li");
      li.className = "combobox-empty";
      li.textContent = "No matching markets";
      marketList.appendChild(li);
      marketList.hidden = false;
      return;
    }

    matches.forEach((m, i) => {
      const li = document.createElement("li");
      li.className = "combobox-option";
      li.setAttribute("role", "option");
      li.dataset.value = m;
      li.textContent = m;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault(); // keep focus in input until we've read the value
        selectMarket(m);
      });
      marketList.appendChild(li);
    });
    marketList.hidden = false;
  }

  function selectMarket(value) {
    marketInput.value = value;
    marketHidden.value = value;
    marketList.hidden = true;
    marketInput.classList.remove("is-invalid");
  }

  function highlightOption(index) {
    const options = marketList.querySelectorAll(".combobox-option");
    options.forEach((el) => el.classList.remove("is-highlighted"));
    if (index >= 0 && index < options.length) {
      options[index].classList.add("is-highlighted");
      options[index].scrollIntoView({ block: "nearest" });
    }
  }

  marketInput.addEventListener("focus", () => {
    renderMarketOptions(marketInput.value);
  });

  marketInput.addEventListener("input", () => {
    marketHidden.value = ""; // typing invalidates any prior selection until re-picked
    renderMarketOptions(marketInput.value);
  });

  marketInput.addEventListener("keydown", (e) => {
    const options = marketList.querySelectorAll(".combobox-option");
    if (marketList.hidden || options.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      marketHighlightIndex = Math.min(marketHighlightIndex + 1, options.length - 1);
      highlightOption(marketHighlightIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      marketHighlightIndex = Math.max(marketHighlightIndex - 1, 0);
      highlightOption(marketHighlightIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = marketHighlightIndex >= 0 ? options[marketHighlightIndex] : options[0];
      if (target) selectMarket(target.dataset.value);
    } else if (e.key === "Escape") {
      marketList.hidden = true;
    }
  });

  marketInput.addEventListener("blur", () => {
    // slight delay so a mousedown selection on the list registers first
    setTimeout(() => {
      marketList.hidden = true;
      if (marketInput.value && !marketHidden.value) {
        // user typed something that was never selected from the list
        marketInput.classList.add("is-invalid");
      }
    }, 120);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const payload = {
      clientName: form.clientName.value.trim(),
      siteUrl: form.siteUrl.value.trim(),
      address: form.address.value.trim(),
      clientContactName: form.clientContactName.value.trim(),
      clientContactEmail: form.clientContactEmail.value.trim(),
      market: marketHidden.value,
      contactName: form.contactName.value.trim(),
      contactEmail: form.contactEmail.value.trim(),
    };

    if (!payload.clientName || !payload.siteUrl || !payload.address || !payload.clientContactName || !payload.clientContactEmail || !payload.contactName || !payload.contactEmail) {
      errorEl.textContent = "Please fill in all required fields.";
      return;
    }

    if (!payload.market || !MARKETS.includes(payload.market)) {
      errorEl.textContent = "Please select a market from the list.";
      marketInput.classList.add("is-invalid");
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
    marketHidden.value = "";
    marketInput.classList.remove("is-invalid");
    form.style.display = "";
    successPanel.style.display = "none";
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit Tag Request <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
  });
})();
