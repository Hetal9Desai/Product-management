"use strict";

let products = [];
let deleteProductId = null;
let currentPage = 1;
const productsPerPage = 4;
let deleteModalInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  renderProductCards();

  // Show the "Add Product" button if it exists.
  const addBtn = document.getElementById("addProductBtn");
  if (addBtn) {
    addBtn.classList.remove("d-none");
  }

  // Attach event listeners to filters and sort controls so that changes trigger a re-render.
  document.getElementById("filterId").addEventListener("input", () => {
    currentPage = 1;
    renderProductCards();
  });
  document.getElementById("filterName").addEventListener("input", () => {
    currentPage = 1;
    renderProductCards();
  });
  document.getElementById("filterDescription").addEventListener("input", () => {
    currentPage = 1;
    renderProductCards();
  });
  document.getElementById("filterPrice").addEventListener("input", () => {
    currentPage = 1;
    renderProductCards();
  });
  document.getElementById("sortBy").addEventListener("change", () => {
    currentPage = 1;
    renderProductCards();
  });
  document.getElementById("sortOrder").addEventListener("change", () => {
    currentPage = 1;
    renderProductCards();
  });
});

// Load products from localStorage.
function loadProducts() {
  const storedProducts = localStorage.getItem("products");
  products = storedProducts ? JSON.parse(storedProducts) : [];
}

// Save products to localStorage.
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Render product cards with filtering, sorting, and pagination.
function renderProductCards() {
  const container = document.getElementById("productCardContainer");
  const noProductsMessage = document.getElementById("noProductsMessage");
  container.innerHTML = "";

  // Get filter values.
  const filterId = document.getElementById("filterId").value.trim();
  const filterName = document
    .getElementById("filterName")
    .value.trim()
    .toLowerCase();
  const filterDescription = document
    .getElementById("filterDescription")
    .value.trim()
    .toLowerCase();
  const filterPrice = document.getElementById("filterPrice").value.trim();

  // Filter products based on criteria.
  let filteredProducts = products.filter((product) => {
    return (
      (!filterId || product.id.toString().includes(filterId)) &&
      (!filterName || product.name.toLowerCase().includes(filterName)) &&
      (!filterDescription ||
        product.description.toLowerCase().includes(filterDescription)) &&
      (!filterPrice || parseFloat(product.price) === parseFloat(filterPrice))
    );
  });

  // Sorting (if a sort key is selected).
  const sortKey = document.getElementById("sortBy").value;
  const sortOrder = document.getElementById("sortOrder").value;
  if (sortKey) {
    filteredProducts.sort((a, b) => {
      let aValue =
        sortKey === "price" ? parseFloat(a[sortKey]) : a[sortKey].toLowerCase();
      let bValue =
        sortKey === "price" ? parseFloat(b[sortKey]) : b[sortKey].toLowerCase();
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });
  }

  // Show "no products" message if none found.
  if (filteredProducts.length === 0) {
    const filters = [
      { id: "filterId", label: "Product ID" },
      { id: "filterName", label: "Product Name" },
      { id: "filterDescription", label: "Description" },
      { id: "filterPrice", label: "Price" },
    ];
    const activeFilter = filters.find(
      (f) => document.getElementById(f.id).value.trim() !== ""
    );
    if (activeFilter) {
      const filterValue = document.getElementById(activeFilter.id).value.trim();
      noProductsMessage.innerText = `No products found for ${activeFilter.label} "${filterValue}".`;
    } else {
      noProductsMessage.innerText = "No products found.";
    }
    noProductsMessage.style.display = "block";
  } else {
    noProductsMessage.style.display = "none";
  }

  // Pagination calculations.
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Update header pagination info dynamically.
  const paginationInfo = document.getElementById("paginationInfo");
  if (paginationInfo) {
    const startCount = totalProducts > 0 ? startIndex + 1 : 0;
    const endCount = Math.min(startIndex + productsPerPage, totalProducts);
    paginationInfo.textContent = `Products ${startCount}-${endCount} of ${totalProducts}`;
  }

  // Render each product card for the current page.
  paginatedProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "col-md-6 mb-4";
    card.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="object-fit: cover; height: 200px;">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text"><strong>ID:</strong> ${product.id}</p>
          <p class="card-text"><strong>Price:</strong> $${product.price}</p>
          <p class="card-text">${product.description}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <a href="product.html?mode=edit&id=${product.id}" class="btn btn-sm btn-info">Edit</a>
          <button class="btn btn-sm btn-danger" onclick="confirmDelete('${product.id}')">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Update pagination controls.
  renderPaginationControls(totalProducts);
}

function renderPaginationControls(totalProducts) {
  const paginationContainer = document.querySelector("ul.pagination");
  if (!paginationContainer) return;

  if (totalProducts === 0) {
    paginationContainer.style.display = "none";
    return;
  } else {
    paginationContainer.style.display = "flex";
  }

  paginationContainer.classList.add("pagination-container");
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  paginationContainer.innerHTML = "";

  // Previous button.
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  const prevLink = document.createElement("a");
  prevLink.className = "page-link";
  prevLink.href = "#";
  prevLink.textContent = "Previous";
  prevLink.dataset.page = currentPage - 1;
  prevLi.appendChild(prevLink);
  paginationContainer.appendChild(prevLi);

  // Page number buttons.
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = i;
    a.dataset.page = i;
    li.appendChild(a);
    paginationContainer.appendChild(li);
  }

  // Next button.
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  const nextLink = document.createElement("a");
  nextLink.className = "page-link";
  nextLink.href = "#";
  nextLink.textContent = "Next";
  nextLink.dataset.page = currentPage + 1;
  nextLi.appendChild(nextLink);
  paginationContainer.appendChild(nextLi);

  // Attach event listeners to the pagination links.
  paginationContainer.querySelectorAll("a.page-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = parseInt(this.dataset.page);
      if (!isNaN(page)) {
        changePage(page);
      }
    });
  });
}
// Function to handle page change
function changePage(page) {
  currentPage = page;
  renderProductCards();
}

function confirmDelete(productId) {
  deleteProductId = productId;
  const modalEl = document.getElementById("deleteConfirmModal");
  if (modalEl) {
    deleteModalInstance = new bootstrap.Modal(modalEl);
    deleteModalInstance.show();
  }
}

const confirmBtn = document.getElementById("confirmDeleteBtn");
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    console.log("Confirm delete button clicked");
    if (deleteProductId) {
      console.log("Deleting product with ID:", deleteProductId);
      // Proceed with the deletion process
      products = products.filter((product) => product.id !== deleteProductId);
      saveProducts();
      renderProductCards();
      if (deleteModalInstance) {
        deleteModalInstance.hide(); // Close the delete modal
      }
      // Show success modal
      console.log("Showing success modal after deletion");
      showSuccessModal("Product deleted successfully!");
      deleteProductId = null;
    } else {
      console.log("No product to delete. deleteProductId is null.");
    }
  });
}

function showSuccessModal(message) {
  const successModal = new bootstrap.Modal(
    document.getElementById("successModal")
  );
  document.getElementById("successModalMessage").textContent = message;
  successModal.show();
}

function clearFilters() {
  document.getElementById("filterId").value = "";
  document.getElementById("filterName").value = "";
  document.getElementById("filterDescription").value = "";
  document.getElementById("filterPrice").value = "";
  document.getElementById("sortBy").value = "";
  document.getElementById("sortOrder").value = "asc";
  currentPage = 1;
  renderProductCards();
}

window.clearFilters = clearFilters;
window.confirmDelete = confirmDelete;
// window.showSuccessModal = showSuccessModal;
