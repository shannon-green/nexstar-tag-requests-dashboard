(function () {
  const tbody = document.getElementById("requestTableBody");
  const emptyState = document.getElementById("emptyState");
  const filterLabel = document.getElementById("filterLabel");
  const downloadBtn = document.getElementById("downloadBtn");
  const toast = document.getElementById("toast");
  const statusSummary = document.getElementById("statusSummary");
  const marketFilterBtn = document.getElementById("marketFilterBtn");
  const marketFilterCount = document.getElementById("marketFilterCount");
  const marketFilterPanel = document.getElementById("marketFilterPanel");
  const marketFilterList = document.getElementById("marketFilterList");
  const marketFilterSelectAll = document.getElementById("marketFilterSelectAll");
  const marketFilterClear = document.getElementById("marketFilterClear");

  const STATUSES = ["New Request", "In Progress", "Installed", "Canceled"];
  const PILL_CLASS = {
    "New Request": "status-pill--new",
    "In Progress": "status-pill--progress",
    "Installed": "status-pill--installed",
    "Canceled": "status-pill--canceled",
  };

  let allRequests = [];
  let activeFilter = "all";
  let selectedMarkets = new Set();

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function updateCounts() {
    document.getElementById("countAll").textContent = allRequests.length;
    document.getElementById("countNew").textContent = allRequests.filter(r => r.status === "New Request").length;
    document.getElementById("countProgress").textContent = allRequests.filter(r => r.status === "In Progress").length;
    document.getElementById("countInstalled").textContent = allRequests.filter(r => r.status === "Installed").length;
    document.getElementById("countCanceled").textContent = allRequests.filter(r => r.status === "Canceled").length;
  }

  function getFilteredRequests() {
    return allRequests.filter((r) => {
      const statusOk = activeFilter === "all" || r.status === activeFilter;
      const marketOk = selectedMarkets.size === 0 || selectedMarkets.has(r.market);
      return statusOk && marketOk;
    });
  }

  function render() {
    updateCounts();
    buildMarketFilterList();

    const filtered = getFilteredRequests();

    const statusLabel = activeFilter === "all" ? "all requests" : `"${activeFilter}"`;
    const marketLabel = selectedMarkets.size > 0 ? ` in ${selectedMarkets.size} market${selectedMarkets.size > 1 ? "s" : ""}` : "";
    filterLabel.textContent = `Showing ${statusLabel}${marketLabel} (${filtered.length})`;

    tbody.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";

    const sorted = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    for (const r of sorted) {
      const tr = document.createElement("tr");
      const options = STATUSES.map(s =>
        `<option value="${s}" ${s === r.status ? "selected" : ""}>${s}</option>`
      ).join("");

      tr.innerHTML = `
        <td class="cell-primary">${escapeHtml(r.clientName)}</td>
        <td class="cell-dim">${escapeHtml(r.market)}</td>
        <td class="cell-dim">${escapeHtml(r.siteUrl)}</td>
        <td>
          <div class="status-select-wrap">
            <select class="status-select ${PILL_CLASS[r.status] || ""}" data-id="${r.id}">
              ${options}
            </select>
          </div>
        </td>
        <td>
          <div class="script-field-wrap">
            <input type="text" class="script-input" data-id="${r.id}" value="${escapeHtml(r.script || "")}" placeholder="Paste script tag…" spellcheck="false" />
            <button type="button" class="script-copy-btn" data-id="${r.id}" title="Copy script" aria-label="Copy script">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </td>
        <td class="cell-dim">${escapeHtml(r.contactName)}<br>${escapeHtml(r.contactEmail)}</td>
        <td class="cell-dim">${fmtDate(r.created_at)}</td>
        <td class="cell-dim">${fmtDate(r.installed_at)}</td>
        <td>
          <button type="button" class="delete-btn" data-id="${r.id}" title="Delete this request" aria-label="Delete this request">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
            </svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    }

    tbody.querySelectorAll(".status-select").forEach(sel => {
      sel.addEventListener("change", onStatusChange);
    });

    tbody.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", onDeleteClick);
    });

    tbody.querySelectorAll(".script-input").forEach(input => {
      input.addEventListener("blur", onScriptBlur);
    });

    tbody.querySelectorAll(".script-copy-btn").forEach(btn => {
      btn.addEventListener("click", onScriptCopy);
    });
  }

  async function onScriptBlur(e) {
    const input = e.target;
    const id = input.getAttribute("data-id");
    const req = allRequests.find(r => r.id === id);
    const newValue = input.value;

    if (req && req.script === newValue) return; // unchanged, skip save

    input.disabled = true;
    try {
      const res = await fetch(`/api/requests/${id}/script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: newValue }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed");
      if (req) req.script = newValue;
      showToast("Script saved");
    } catch (err) {
      showToast(err.message || "Couldn't save script");
    } finally {
      input.disabled = false;
    }
  }

  function onScriptCopy(e) {
    const btn = e.currentTarget;
    const id = btn.getAttribute("data-id");
    const input = tbody.querySelector(`.script-input[data-id="${id}"]`);
    const value = input ? input.value : "";

    if (!value) {
      showToast("Nothing to copy yet");
      return;
    }

    navigator.clipboard.writeText(value)
      .then(() => showToast("Script copied"))
      .catch(() => showToast("Couldn't copy — select and copy manually"));
  }

  async function onDeleteClick(e) {
    const btn = e.currentTarget;
    const id = btn.getAttribute("data-id");
    const req = allRequests.find(r => r.id === id);
    const label = req ? req.clientName : "this request";

    if (!window.confirm(`Delete the tag request for "${label}"? This can't be undone.`)) {
      return;
    }

    btn.disabled = true;
    try {
      const res = await fetch(`/api/requests/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Delete failed");
      allRequests = allRequests.filter(r => r.id !== id);
      showToast("Request deleted");
      render();
    } catch (err) {
      showToast(err.message || "Couldn't delete request");
      btn.disabled = false;
    }
  }

  async function onStatusChange(e) {
    const id = e.target.getAttribute("data-id");
    const newStatus = e.target.value;
    e.target.disabled = true;
    try {
      const res = await fetch(`/api/requests/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed");
      const req = allRequests.find(r => r.id === id);
      if (req) req.status = newStatus;
      showToast("Status updated");
      render();
    } catch (err) {
      showToast(err.message || "Couldn't update status");
      await loadRequests();
    } finally {
      e.target.disabled = false;
    }
  }

  async function loadRequests() {
    try {
      const res = await fetch("/api/requests");
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      allRequests = data.requests || [];
      render();
    } catch (err) {
      showToast("Couldn't load requests");
    }
  }

  statusSummary.addEventListener("click", (e) => {
    const card = e.target.closest(".status-count");
    if (!card) return;
    activeFilter = card.getAttribute("data-filter");
    statusSummary.querySelectorAll(".status-count").forEach(c => c.classList.remove("is-active"));
    card.classList.add("is-active");
    render();
  });

  function buildMarketFilterList() {
    const distinctMarkets = [...new Set(allRequests.map(r => r.market).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b)
    );

    // drop selections for markets that no longer exist in the data
    selectedMarkets.forEach((m) => {
      if (!distinctMarkets.includes(m)) selectedMarkets.delete(m);
    });

    marketFilterCount.textContent = selectedMarkets.size > 0 ? ` (${selectedMarkets.size})` : "";

    if (distinctMarkets.length === 0) {
      marketFilterList.innerHTML = '<p class="market-filter-empty">No markets yet</p>';
      return;
    }

    marketFilterList.innerHTML = "";
    distinctMarkets.forEach((m) => {
      const label = document.createElement("label");
      label.className = "market-filter-option";
      label.innerHTML = `
        <input type="checkbox" value="${m}" ${selectedMarkets.has(m) ? "checked" : ""} />
        <span>${m}</span>
      `;
      label.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) {
          selectedMarkets.add(m);
        } else {
          selectedMarkets.delete(m);
        }
        render();
      });
      marketFilterList.appendChild(label);
    });
  }

  marketFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    marketFilterPanel.hidden = !marketFilterPanel.hidden;
  });

  marketFilterPanel.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", () => {
    marketFilterPanel.hidden = true;
  });

  marketFilterSelectAll.addEventListener("click", () => {
    const distinctMarkets = [...new Set(allRequests.map(r => r.market).filter(Boolean))];
    distinctMarkets.forEach((m) => selectedMarkets.add(m));
    render();
  });

  marketFilterClear.addEventListener("click", () => {
    selectedMarkets.clear();
    render();
  });

  // Auto-refresh so the dashboard always reflects the latest submissions
  // without needing a manual refresh click.
  const POLL_INTERVAL_MS = 20000;
  setInterval(loadRequests, POLL_INTERVAL_MS);

  function csvEscape(value) {
    const str = String(value ?? "");
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  function downloadCsv() {
    const rows = getFilteredRequests();

    if (rows.length === 0) {
      showToast("No requests to download");
      return;
    }

    const headers = ["Client", "Market", "Site URL", "Status", "Script", "Contact Name", "Contact Email", "Submitted", "Installed Date"];
    const lines = [headers.join(",")];

    const sorted = [...rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    for (const r of sorted) {
      lines.push([
        csvEscape(r.clientName),
        csvEscape(r.market),
        csvEscape(r.siteUrl),
        csvEscape(r.status),
        csvEscape(r.script),
        csvEscape(r.contactName),
        csvEscape(r.contactEmail),
        csvEscape(fmtDate(r.created_at)),
        csvEscape(fmtDate(r.installed_at)),
      ].join(","));
    }

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    const scope = activeFilter === "all" ? "all" : activeFilter.toLowerCase().replace(/\s+/g, "-");
    a.href = url;
    a.download = `tag-requests-${scope}-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  downloadBtn.addEventListener("click", downloadCsv);

  loadRequests();
  statusSummary.querySelector('[data-filter="all"]').classList.add("is-active");
})();
