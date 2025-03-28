import { Product } from "./types";
import { loadProducts, saveProducts } from "./storage";
import bootstrap, { Modal } from "bootstrap";

let products: Product[] = [];
let deleteProductId: string | null = null;
let deleteModalInstance: Modal | null = null;
let currentPage: number = 1;
const productsPerPage: number = 4;

type SortableKey = "id" | "name" | "price";
// Show the "Add Product" button if it exists.
document.addEventListener("DOMContentLoaded", () => {
  products = loadProducts();
  renderProductCards();

  const addBtn = document.getElementById("addProductBtn") as HTMLElement | null;
  if (addBtn) {
    addBtn.classList.remove("d-none");
  }

  const confirmDeleteBtn = document.getElementById(
    "confirmDeleteBtn"
  ) as HTMLElement | null;
  confirmDeleteBtn?.addEventListener("click", handleDelete);
});
// Attach event listeners to filters and sort controls so that changes trigger a re-render.
document.addEventListener("DOMContentLoaded", () => {
  // Attach event listeners to filters and sort controls so that changes trigger a re-render.
  const filterId = document.getElementById(
    "filterId"
  ) as HTMLInputElement | null;
  const filterName = document.getElementById(
    "filterName"
  ) as HTMLInputElement | null;
  const filterDescription = document.getElementById(
    "filterDescription"
  ) as HTMLInputElement | null;
  const filterPrice = document.getElementById(
    "filterPrice"
  ) as HTMLInputElement | null;
  const sortBy = document.getElementById("sortBy") as HTMLSelectElement | null;
  const sortOrder = document.getElementById(
    "sortOrder"
  ) as HTMLSelectElement | null;

  // Ensure all elements are found before adding event listeners
  if (filterId) {
    filterId.addEventListener("input", () => {
      currentPage = 1;
      renderProductCards();
    });
  }

  if (filterName) {
    filterName.addEventListener("input", () => {
      currentPage = 1;
      renderProductCards();
    });
  }

  if (filterDescription) {
    filterDescription.addEventListener("input", () => {
      currentPage = 1;
      renderProductCards();
    });
  }

  if (filterPrice) {
    filterPrice.addEventListener("input", () => {
      currentPage = 1;
      renderProductCards();
    });
  }

  if (sortBy) {
    sortBy.addEventListener("change", () => {
      currentPage = 1;
      renderProductCards();
    });
  }

  if (sortOrder) {
    sortOrder.addEventListener("change", () => {
      currentPage = 1;
      renderProductCards();
    });
  }
});

// Render product cards with filtering, sorting, and pagination
function renderProductCards(): void {
  const container = document.getElementById(
    "productCardContainer"
  ) as HTMLElement;
  const noProductsMessage = document.getElementById(
    "noProductsMessage"
  ) as HTMLElement;
  container.innerHTML = "";

  // Get filter values
  const filterId = (document.getElementById("filterId") as HTMLInputElement)
    .value;
  const filterName = (
    document.getElementById("filterName") as HTMLInputElement
  ).value.toLowerCase();
  const filterDescription = (
    document.getElementById("filterDescription") as HTMLInputElement
  ).value.toLowerCase();
  const filterPrice = (
    document.getElementById("filterPrice") as HTMLInputElement
  ).value;

  // Filter products based on criteria
  let filteredProducts = products.filter((product) => {
    return (
      (!filterId || product.id.includes(filterId)) &&
      (!filterName || product.name.toLowerCase().includes(filterName)) &&
      (!filterDescription ||
        product.description.toLowerCase().includes(filterDescription)) &&
      (!filterPrice || parseFloat(product.price) === parseFloat(filterPrice))
    );
  });

  // Sorting (if a sort key is selected)
  const sortKey = (document.getElementById("sortBy") as HTMLSelectElement)
    .value as SortableKey;
  const sortOrder = (document.getElementById("sortOrder") as HTMLSelectElement)
    .value;
  if (sortKey) {
    filteredProducts.sort((a, b) => {
      const aVal =
        sortKey === "price"
          ? parseFloat(String(a[sortKey]))
          : (a[sortKey] as string).toLowerCase();
      const bVal =
        sortKey === "price"
          ? parseFloat(String(b[sortKey]))
          : (b[sortKey] as string).toLowerCase();

      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });
  }

  // Show "no products" message if none found
  if (filteredProducts.length === 0) {
    const filters = [
      { id: "filterId", label: "Product ID" },
      { id: "filterName", label: "Product Name" },
      { id: "filterDescription", label: "Description" },
      { id: "filterPrice", label: "Price" },
    ];
    const activeFilter = filters.find(
      (f) =>
        (
          (document.getElementById(f.id) as HTMLInputElement).value || ""
        ).trim() !== ""
    );
    if (activeFilter) {
      const filterValue = (
        document.getElementById(activeFilter.id) as HTMLInputElement
      ).value.trim();
      noProductsMessage.innerText = `No products found for ${activeFilter.label} "${filterValue}".`;
    } else {
      noProductsMessage.innerText = "No products found.";
    }
    noProductsMessage.style.display = "block";
  } else {
    noProductsMessage.style.display = "none";
  }

  // Pagination calculations.
  const totalProducts: number = filteredProducts.length;
  const totalPages: number = Math.ceil(totalProducts / productsPerPage);

  // Ensure currentPage stays within the valid range.
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex: number = (currentPage - 1) * productsPerPage;
  const paginatedProducts: Product[] = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Update header pagination info dynamically.
  const paginationInfo = document.getElementById(
    "paginationInfo"
  ) as HTMLElement | null;
  if (paginationInfo) {
    const startCount: number = totalProducts > 0 ? startIndex + 1 : 0;
    const endCount: number = Math.min(
      startIndex + productsPerPage,
      totalProducts
    );
    paginationInfo.textContent = `Products ${startCount}-${endCount} of ${totalProducts}`;
  }

  // Render each product card for the current page
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
          <a href="product2.html?mode=edit&id=${product.id}" class="btn btn-sm btn-info">Edit</a>
          <button class="btn btn-sm btn-danger" onclick="confirmDelete('${product.id}')">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Update pagination controls
  renderPaginationControls(filteredProducts.length);
}

function renderPaginationControls(totalProducts: number): void {
  const paginationContainer = document.querySelector(
    "ul.pagination"
  ) as HTMLElement;
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

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  const prevLink = document.createElement("a");
  prevLink.className = "page-link";
  prevLink.href = "#";
  prevLink.textContent = "Previous";
  prevLink.dataset.page = (currentPage - 1).toString();
  prevLi.appendChild(prevLink);
  paginationContainer.appendChild(prevLi);

  // Page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = i.toString();
    a.dataset.page = i.toString();
    li.appendChild(a);
    paginationContainer.appendChild(li);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  const nextLink = document.createElement("a");
  nextLink.className = "page-link";
  nextLink.href = "#";
  nextLink.textContent = "Next";
  nextLink.dataset.page = (currentPage + 1).toString();
  nextLi.appendChild(nextLink);
  paginationContainer.appendChild(nextLi);

  // Attach event listeners to the pagination links.
  paginationContainer.querySelectorAll("a.page-link").forEach((link) => {
    link.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const page = parseInt((link as HTMLAnchorElement).dataset.page || "1");
      if (!isNaN(page)) {
        changePage(page);
      }
    });
  });
}

// Function to handle page change
function changePage(page: number): void {
  currentPage = page;
  renderProductCards();
}

function confirmDelete(id: string): void {
  deleteProductId = id;
  const deleteModal = document.getElementById("deleteModal") as HTMLElement;
  if (deleteModal) {
    deleteModalInstance = new bootstrap.Modal(deleteModal);
    deleteModalInstance.show();
  }
}

function handleDelete() {
  if (deleteProductId) {
    products = products.filter((product) => product.id !== deleteProductId);
    saveProducts(products);
    renderProductCards();
    deleteModalInstance?.hide();
  }
}

// Function to handle confirming deletion
const confirmBtn = document.getElementById(
  "confirmDeleteBtn"
) as HTMLElement | null;
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    console.log("Confirm delete button clicked");
    if (deleteProductId) {
      console.log("Deleting product with ID:", deleteProductId);
      // Proceed with the deletion process
      products = products.filter((product) => product.id !== deleteProductId);
      saveProducts(products); // Pass the updated products array to saveProducts
      renderProductCards(); // Assuming renderProductCards function is defined elsewhere
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

// Function to show a success modal with a message
function showSuccessModal(message: string): void {
  const successModal = new bootstrap.Modal(
    document.getElementById("successModal") as HTMLElement
  );
  const successMessageElement = document.getElementById(
    "successModalMessage"
  ) as HTMLElement;
  if (successMessageElement) {
    successMessageElement.textContent = message;
  }
  successModal.show();
}

// Function to clear all filters and reset the view
function clearFilters(): void {
  const filterId = document.getElementById(
    "filterId"
  ) as HTMLInputElement | null;
  const filterName = document.getElementById(
    "filterName"
  ) as HTMLInputElement | null;
  const filterDescription = document.getElementById(
    "filterDescription"
  ) as HTMLInputElement | null;
  const filterPrice = document.getElementById(
    "filterPrice"
  ) as HTMLInputElement | null;
  const sortBy = document.getElementById("sortBy") as HTMLSelectElement | null;
  const sortOrder = document.getElementById(
    "sortOrder"
  ) as HTMLSelectElement | null;

  if (filterId) filterId.value = "";
  if (filterName) filterName.value = "";
  if (filterDescription) filterDescription.value = "";
  if (filterPrice) filterPrice.value = "";
  if (sortBy) sortBy.value = "";
  if (sortOrder) sortOrder.value = "asc";

  currentPage = 1;
  renderProductCards(); // Assuming renderProductCards function is defined elsewhere
}

(window as any).clearFilters = clearFilters;
(window as any).confirmDelete = confirmDelete;
(window as any).showSuccessModal = showSuccessModal;
