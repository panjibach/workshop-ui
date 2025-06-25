function toggleSidebar() {
  const sidebar = document.getElementById("adminSidebar")
  sidebar.style.transform = sidebar.style.transform === "translateX(0px)" ? "translateX(-100%)" : "translateX(0px)"
}

function openAddModal() {
  document.getElementById("modalTitle").textContent = "Tambah Produk Baru"
  document.getElementById("productForm").reset()
  document.getElementById("productModal").classList.add("show")
}

function editProduct(id) {
  document.getElementById("modalTitle").textContent = "Edit Produk"
  // Load product data here
  document.getElementById("productModal").classList.add("show")
}

function deleteProduct(id) {
  if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
    // Delete product logic here
    console.log("Deleting product:", id)
  }
}

function closeModal() {
  document.getElementById("productModal").classList.remove("show")
}

// Form submission
document.getElementById("productForm").addEventListener("submit", (e) => {
  e.preventDefault()
  // Save product logic here
  console.log("Saving product...")
  closeModal()
})

// Search and filter functionality
document.getElementById("searchInput").addEventListener("input", () => {
  // Search logic here
})

document.getElementById("categoryFilter").addEventListener("change", () => {
  // Filter by category logic here
})

document.getElementById("stockFilter").addEventListener("change", () => {
  // Filter by stock logic here
})

// Close modal when clicking outside
document.getElementById("productModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal()
  }
})
