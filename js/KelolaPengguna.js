function toggleSidebar() {
  const sidebar = document.getElementById("adminSidebar")
  const overlay = document.getElementById("sidebarOverlay") // Pastikan elemen ini ada di HTML Anda
  const body = document.body

  const isOpen = sidebar.classList.contains("open")

  if (isOpen) {
    sidebar.classList.remove("open")
    if (overlay) overlay.classList.remove("active")
    body.classList.remove("sidebar-open")
  } else {
    sidebar.classList.add("open")
    if (overlay) overlay.classList.add("active")
    body.classList.add("sidebar-open")
  }
}

function openAddModal() {
  document.getElementById("modalTitle").textContent = "Tambah Pengguna Baru"
  document.getElementById("userForm").reset()
  document.getElementById("userModal").classList.add("show")
}

function viewUser(id) {
  // View user details logic here
  console.log("Viewing user:", id)
}

function editUser(id) {
  document.getElementById("modalTitle").textContent = "Edit Pengguna"
  // Load user data here
  document.getElementById("userModal").classList.add("show")
}

function deleteUser(id) {
  if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
    // Delete user logic here
    console.log("Deleting user:", id)
  }
}

function closeModal() {
  document.getElementById("userModal").classList.remove("show")
}

// Form submission
document.getElementById("userForm").addEventListener("submit", (e) => {
  e.preventDefault()
  // Save user logic here
  console.log("Saving user...")
  closeModal()
})

// Search and filter functionality
document.getElementById("searchInput").addEventListener("input", () => {
  // Search logic here
})

document.getElementById("statusFilter").addEventListener("change", () => {
  // Filter by status logic here
})

document.getElementById("roleFilter").addEventListener("change", () => {
  // Filter by role logic here
})

// Close modal when clicking outside
document.getElementById("userModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal()
  }
})
