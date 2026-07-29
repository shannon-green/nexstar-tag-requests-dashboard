(function () {
  const tbody = document.getElementById("requestTableBody");
  const emptyState = document.getElementById("emptyState");
  const filterLabel = document.getElementById("filterLabel");
  const downloadBtn = document.getElementById("downloadBtn");
  const toast = document.getElementById("toast");
  const statusSummary = document.getElementById("statusSummary");

  const STATUSES = ["New Request", "In Progress", "Installed", "Canceled"];
  const PILL_CLASS = {
    "New Request": "status-pill--new",
    "In Progress": "status-pill--progress",
    "Installed": "status-pill--installed",
    "Canceled": "status-pill--canceled",
  };

  let allRequests = [];
  let activeFilter = "all";

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

  function render() {
    updateCounts();

    const filtered = activeFilter === "all"
      ? allRequests
      : allRequests.filter(r => r.status === activeFilter);

    filterLabel.textContent = activeFilter === "all"
      ? `Showing all requests (${filtered.length})`
      : `Showing "${activeFilter}" (${filtered.length})`;

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
        <td class="cell-dim">${escapeHtml(r.siteUrl)}</td>
        <td>
          <div class="status-select-wrap">
            <select class="status-select ${PILL_CLASS[r.status] || ""}" data-id="${r.id}">
              ${options}
            </select>
          </div>
        </td>
        <td class="cell-dim">${escapeHtml(r.contactName)}<br>${escapeHtml(r.contactEmail)}</td>
        <td class="cell-dim">${fmtDate(r.created_at)}</td>
        <td class="cell-dim">${fmtDate(r.installed_at)}</td>
      `;
      tbody.appendChild(tr);
    }

    tbody.querySelectorAll(".status-select").forEach(sel => {
      sel.addEventListener("change", onStatusChange);
    });
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
    const rows = activeFilter === "all"
      ? allRequests
      : allRequests.filter(r => r.status === activeFilter);

    if (rows.length === 0) {
      showToast("No requests to download");
      return;
    }

    const headers = ["Client", "Site URL", "Status", "Contact Name", "Contact Email", "Submitted", "Installed Date"];
    const lines = [headers.join(",")];

    const sorted = [...rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    for (const r of sorted) {
      lines.push([
        csvEscape(r.clientName),
        csvEscape(r.siteUrl),
        csvEscape(r.status),
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
