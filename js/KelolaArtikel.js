function toggleSidebar() {
  const sidebar = document.getElementById("adminSidebar")
  sidebar.style.transform = sidebar.style.transform === "translateX(0px)" ? "translateX(-100%)" : "translateX(0px)"
}

function openAddModal() {
  document.getElementById("modalTitle").textContent = "Tambah Artikel Baru"
  document.getElementById("articleForm").reset()
  document.getElementById("articleModal").classList.add("show")
}

function viewArticle(id) {
  // View article details logic here
  console.log("Viewing article:", id)
  window.open(`DetailArtikel.html?id=${id}`, "_blank")
}

function editArticle(id) {
  document.getElementById("modalTitle").textContent = "Edit Artikel"
  // Load article data here
  document.getElementById("articleModal").classList.add("show")
}

function deleteArticle(id) {
  if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
    // Delete article logic here
    console.log("Deleting article:", id)
  }
}

function closeModal() {
  document.getElementById("articleModal").classList.remove("show")
}

// Form submission
document.getElementById("articleForm").addEventListener("submit", (e) => {
  e.preventDefault()
  // Save article logic here
  console.log("Saving article...")
  closeModal()
})

// Search and filter functionality
document.getElementById("searchInput").addEventListener("input", () => {
  // Search logic here
})

document.getElementById("categoryFilter").addEventListener("change", () => {
  // Filter by category logic here
})

document.getElementById("statusFilter").addEventListener("change", () => {
  // Filter by status logic here
})

// Close modal when clicking outside
document.getElementById("articleModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal()
  }
})
