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
  const rdFilterBtn = document.getElementById("rdFilterBtn");
  const rdFilterCount = document.getElementById("rdFilterCount");
  const rdFilterPanel = document.getElementById("rdFilterPanel");
  const rdFilterList = document.getElementById("rdFilterList");
  const rdFilterSelectAll = document.getElementById("rdFilterSelectAll");
  const rdFilterClear = document.getElementById("rdFilterClear");
  const assigneeFilterBtn = document.getElementById("assigneeFilterBtn");
  const assigneeFilterCount = document.getElementById("assigneeFilterCount");
  const assigneeFilterPanel = document.getElementById("assigneeFilterPanel");
  const assigneeFilterList = document.getElementById("assigneeFilterList");
  const assigneeFilterSelectAll = document.getElementById("assigneeFilterSelectAll");
  const assigneeFilterClear = document.getElementById("assigneeFilterClear");
  const bulkUploadBtn = document.getElementById("bulkUploadBtn");
  const bulkModalOverlay = document.getElementById("bulkModalOverlay");
  const bulkModalClose = document.getElementById("bulkModalClose");
  const bulkPasswordStep = document.getElementById("bulkPasswordStep");
  const bulkPasswordInput = document.getElementById("bulkPasswordInput");
  const bulkPasswordError = document.getElementById("bulkPasswordError");
  const bulkPasswordSubmit = document.getElementById("bulkPasswordSubmit");
  const bulkUploadStep = document.getElementById("bulkUploadStep");
  const bulkDownloadTemplate = document.getElementById("bulkDownloadTemplate");
  const bulkFileInput = document.getElementById("bulkFileInput");
  const bulkUploadError = document.getElementById("bulkUploadError");
  const bulkUploadSummary = document.getElementById("bulkUploadSummary");
  const bulkUploadSubmit = document.getElementById("bulkUploadSubmit");

  const STATUSES = ["New Request", "In Progress", "Pending Install", "Installed", "Canceled"];
  const PILL_CLASS = {
    "New Request": "status-pill--new",
    "In Progress": "status-pill--progress",
    "Pending Install": "status-pill--pending",
    "Installed": "status-pill--installed",
    "Canceled": "status-pill--canceled",
  };

  let allRequests = [];
  let activeFilter = "all";
  let selectedMarkets = new Set();
  let selectedRDs = new Set();
  let selectedAssignees = new Set();

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
    document.getElementById("countPending").textContent = allRequests.filter(r => r.status === "Pending Install").length;
    document.getElementById("countInstalled").textContent = allRequests.filter(r => r.status === "Installed").length;
    document.getElementById("countCanceled").textContent = allRequests.filter(r => r.status === "Canceled").length;
  }

  function getFilteredRequests() {
    return allRequests.filter((r) => {
      const statusOk = activeFilter === "all" || r.status === activeFilter;
      const marketOk = selectedMarkets.size === 0 || selectedMarkets.has(r.market);
      const rdLabel = r.rd || "Unassigned";
      const rdOk = selectedRDs.size === 0 || selectedRDs.has(rdLabel);
      const assigneeLabel = r.assignee || "Unassigned";
      const assigneeOk = selectedAssignees.size === 0 || selectedAssignees.has(assigneeLabel);
      return statusOk && marketOk && rdOk && assigneeOk;
    });
  }

  function render() {
    updateCounts();
    buildMarketFilterList();
    buildRDFilterList();
    buildAssigneeFilterList();

    const filtered = getFilteredRequests();

    const statusLabel = activeFilter === "all" ? "all requests" : `"${activeFilter}"`;
    const marketLabel = selectedMarkets.size > 0 ? ` in ${selectedMarkets.size} market${selectedMarkets.size > 1 ? "s" : ""}` : "";
    const rdLabel = selectedRDs.size > 0 ? ` for ${selectedRDs.size} RD${selectedRDs.size > 1 ? "s" : ""}` : "";
    const assigneeLabel = selectedAssignees.size > 0 ? ` assigned to ${selectedAssignees.size} teammate${selectedAssignees.size > 1 ? "s" : ""}` : "";
    filterLabel.textContent = `Showing ${statusLabel}${marketLabel}${rdLabel}${assigneeLabel} (${filtered.length})`;

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
        <td class="cell-dim">${escapeHtml(r.siteUrl)}</td>
        <td>
          <div class="status-select-wrap">
            <select class="status-select ${PILL_CLASS[r.status] || ""}" data-id="${r.id}">
              ${options}
            </select>
          </div>
        </td>
        <td>
          <input type="text" class="assignee-input" data-id="${r.id}" value="${escapeHtml(r.assignee || "")}" placeholder="Unassigned" spellcheck="false" />
        </td>
        <td class="cell-dim">${escapeHtml(r.address) || "—"}</td>
        <td class="cell-dim">${escapeHtml(r.market)}</td>
        <td class="cell-dim">${escapeHtml(r.rd) || "—"}</td>
        <td class="cell-dim">${escapeHtml(r.contactName)}</td>
        <td class="cell-dim">${escapeHtml(r.contactEmail)}</td>
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

    tbody.querySelectorAll(".assignee-input").forEach(input => {
      input.addEventListener("blur", onAssigneeBlur);
    });

    tbody.querySelectorAll(".script-copy-btn").forEach(btn => {
      btn.addEventListener("click", onScriptCopy);
    });
  }

  async function onAssigneeBlur(e) {
    const input = e.target;
    const id = input.getAttribute("data-id");
    const req = allRequests.find(r => r.id === id);
    const newValue = input.value.trim();

    if (req && (req.assignee || "") === newValue) return; // unchanged, skip save

    input.disabled = true;
    try {
      const res = await fetch(`/api/requests/${id}/assignee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignee: newValue }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed");
      if (req) req.assignee = newValue;
      showToast("Assignee saved");
    } catch (err) {
      showToast(err.message || "Couldn't save assignee");
    } finally {
      input.disabled = false;
    }
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
    rdFilterPanel.hidden = true;
    assigneeFilterPanel.hidden = true;
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

  function buildRDFilterList() {
    const distinctRDs = [...new Set(allRequests.map(r => r.rd || "Unassigned"))].sort((a, b) => {
      if (a === "Unassigned") return 1;
      if (b === "Unassigned") return -1;
      return a.localeCompare(b);
    });

    selectedRDs.forEach((rd) => {
      if (!distinctRDs.includes(rd)) selectedRDs.delete(rd);
    });

    rdFilterCount.textContent = selectedRDs.size > 0 ? ` (${selectedRDs.size})` : "";

    if (distinctRDs.length === 0) {
      rdFilterList.innerHTML = '<p class="market-filter-empty">No RDs yet</p>';
      return;
    }

    rdFilterList.innerHTML = "";
    distinctRDs.forEach((rd) => {
      const label = document.createElement("label");
      label.className = "market-filter-option";
      label.innerHTML = `
        <input type="checkbox" value="${rd}" ${selectedRDs.has(rd) ? "checked" : ""} />
        <span>${rd}</span>
      `;
      label.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) {
          selectedRDs.add(rd);
        } else {
          selectedRDs.delete(rd);
        }
        render();
      });
      rdFilterList.appendChild(label);
    });
  }

  rdFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    rdFilterPanel.hidden = !rdFilterPanel.hidden;
  });

  rdFilterPanel.addEventListener("click", (e) => e.stopPropagation());

  rdFilterSelectAll.addEventListener("click", () => {
    const distinctRDs = [...new Set(allRequests.map(r => r.rd || "Unassigned"))];
    distinctRDs.forEach((rd) => selectedRDs.add(rd));
    render();
  });

  rdFilterClear.addEventListener("click", () => {
    selectedRDs.clear();
    render();
  });

  function buildAssigneeFilterList() {
    const distinctAssignees = [...new Set(allRequests.map(r => r.assignee || "Unassigned"))].sort((a, b) => {
      if (a === "Unassigned") return 1;
      if (b === "Unassigned") return -1;
      return a.localeCompare(b);
    });

    selectedAssignees.forEach((a) => {
      if (!distinctAssignees.includes(a)) selectedAssignees.delete(a);
    });

    assigneeFilterCount.textContent = selectedAssignees.size > 0 ? ` (${selectedAssignees.size})` : "";

    if (distinctAssignees.length === 0) {
      assigneeFilterList.innerHTML = '<p class="market-filter-empty">No assignees yet</p>';
      return;
    }

    assigneeFilterList.innerHTML = "";
    distinctAssignees.forEach((a) => {
      const label = document.createElement("label");
      label.className = "market-filter-option";
      label.innerHTML = `
        <input type="checkbox" value="${a}" ${selectedAssignees.has(a) ? "checked" : ""} />
        <span>${a}</span>
      `;
      label.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) {
          selectedAssignees.add(a);
        } else {
          selectedAssignees.delete(a);
        }
        render();
      });
      assigneeFilterList.appendChild(label);
    });
  }

  assigneeFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    assigneeFilterPanel.hidden = !assigneeFilterPanel.hidden;
  });

  assigneeFilterPanel.addEventListener("click", (e) => e.stopPropagation());

  assigneeFilterSelectAll.addEventListener("click", () => {
    const distinctAssignees = [...new Set(allRequests.map(r => r.assignee || "Unassigned"))];
    distinctAssignees.forEach((a) => selectedAssignees.add(a));
    render();
  });

  assigneeFilterClear.addEventListener("click", () => {
    selectedAssignees.clear();
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

    const headers = ["Client", "Script", "Site URL", "Status", "Assignee", "Address", "Market", "RD", "Contact Name", "Contact Email", "Submitted Date", "Installed Date"];
    const lines = [headers.join(",")];

    const sorted = [...rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    for (const r of sorted) {
      lines.push([
        csvEscape(r.clientName),
        csvEscape(r.script),
        csvEscape(r.siteUrl),
        csvEscape(r.status),
        csvEscape(r.assignee),
        csvEscape(r.address),
        csvEscape(r.market),
        csvEscape(r.rd || "Unassigned"),
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

  // ---------- Bulk Upload modal ----------
  let bulkPassword = "";

  function openBulkModal() {
    bulkModalOverlay.hidden = false;
    bulkPasswordStep.hidden = false;
    bulkUploadStep.hidden = true;
    bulkPasswordInput.value = "";
    bulkPasswordError.textContent = "";
    bulkUploadError.textContent = "";
    bulkUploadSummary.textContent = "";
    bulkFileInput.value = "";
    bulkPasswordInput.focus();
  }

  function closeBulkModal() {
    bulkModalOverlay.hidden = true;
    bulkPassword = "";
  }

  bulkUploadBtn.addEventListener("click", openBulkModal);
  bulkModalClose.addEventListener("click", closeBulkModal);
  bulkModalOverlay.addEventListener("click", (e) => {
    if (e.target === bulkModalOverlay) closeBulkModal();
  });

  bulkPasswordSubmit.addEventListener("click", () => {
    const val = bulkPasswordInput.value;
    if (!val) {
      bulkPasswordError.textContent = "Enter the password.";
      return;
    }
    // This only unlocks the upload UI — the server re-checks this password
    // for real when the file is actually submitted.
    bulkPassword = val;
    bulkPasswordError.textContent = "";
    bulkPasswordStep.hidden = true;
    bulkUploadStep.hidden = false;
  });

  bulkPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      bulkPasswordSubmit.click();
    }
  });

  bulkDownloadTemplate.addEventListener("click", () => {
    const csv =
      "Client Name,Site URL,Address,Market,Contact Name,Contact Email\n" +
      "Riverside Auto Group,https://riversideauto.com,123 Main St Sioux Falls SD,Sioux Falls,Jane Doe,jane.doe@nexstar.com\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-upload-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (inQuotes) {
        if (char === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\r") {
        // skip
      } else if (char === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows.filter((r) => r.some((c) => c.trim() !== ""));
  }

  const CSV_HEADER_MAP = {
    "client name": "clientName",
    "client / advertiser name": "clientName",
    "site url": "siteUrl",
    "client website url": "siteUrl",
    "address": "address",
    "market": "market",
    "contact name": "contactName",
    "your name": "contactName",
    "contact email": "contactEmail",
    "your email": "contactEmail",
  };

  function csvToRows(text) {
    const table = parseCsv(text);
    if (table.length < 2) return [];
    const headerRow = table[0].map((h) => h.trim().toLowerCase());
    const keys = headerRow.map((h) => CSV_HEADER_MAP[h] || null);
    const rows = [];
    for (let i = 1; i < table.length; i++) {
      const raw = table[i];
      const obj = {};
      keys.forEach((key, idx) => {
        if (key) obj[key] = (raw[idx] || "").trim();
      });
      rows.push(obj);
    }
    return rows;
  }

  bulkUploadSubmit.addEventListener("click", async () => {
    bulkUploadError.textContent = "";
    bulkUploadSummary.textContent = "";

    const file = bulkFileInput.files[0];
    if (!file) {
      bulkUploadError.textContent = "Choose a CSV file first.";
      return;
    }

    const text = await file.text();
    const rows = csvToRows(text);
    if (rows.length === 0) {
      bulkUploadError.textContent = "No rows found in that file.";
      return;
    }

    bulkUploadSubmit.disabled = true;
    bulkUploadSubmit.textContent = "Uploading…";

    try {
      const res = await fetch("/api/requests/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: bulkPassword, rows }),
      });
      const data = await res.json();

      if (res.status === 401) {
        bulkUploadStep.hidden = true;
        bulkPasswordStep.hidden = false;
        bulkPasswordError.textContent = "Incorrect password. Try again.";
        return;
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Upload failed");
      }

      let summary = `Added ${data.added} client${data.added === 1 ? "" : "s"}.`;
      if (data.errors && data.errors.length > 0) {
        summary += ` ${data.errors.length} row${data.errors.length === 1 ? "" : "s"} skipped — check for missing fields or an unrecognized market.`;
      }
      bulkUploadSummary.textContent = summary;
      showToast(`Bulk upload complete — ${data.added} added`);
      await loadRequests();
    } catch (err) {
      bulkUploadError.textContent = err.message || "Upload failed";
    } finally {
      bulkUploadSubmit.disabled = false;
      bulkUploadSubmit.textContent = "Upload";
    }
  });

  loadRequests();
  statusSummary.querySelector('[data-filter="all"]').classList.add("is-active");
})();
