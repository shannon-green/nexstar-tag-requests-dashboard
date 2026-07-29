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
