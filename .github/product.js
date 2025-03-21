let products = [];
let editingProductId = null;

// Load products from localStorage
function loadProducts() {
  const storedProducts = localStorage.getItem("products");
  products = storedProducts ? JSON.parse(storedProducts) : [];
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  if (mode === "edit") {
    editingProductId = urlParams.get("id");
    document.getElementById("formTitle").textContent = "Edit Product";
    const product = products.find((p) => p.id === editingProductId);
    if (product) {
      document.getElementById("productName").value = product.name;
      document.getElementById("productPrice").value = product.price;
      document.getElementById("productDescription").value = product.description;
      document.getElementById("imagePreview").src = product.image;
      document.getElementById("imagePreview").style.display = "block";
    }
  }
  document
    .getElementById("productForm")
    .addEventListener("submit", handleFormSubmit);
  document
    .getElementById("productImage")
    .addEventListener("change", previewImage);
});

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Handle the form submission
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const description = document
    .getElementById("productDescription")
    .value.trim();
  const fileInput = document.getElementById("productImage");

  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (event) {
      saveProduct(name, event.target.result, price, description);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else if (editingProductId) {
    const existingProduct = products.find((p) => p.id === editingProductId);
    saveProduct(name, existingProduct.image, price, description);
  }
}

// Save or update the product in the products array
function saveProduct(name, image, price, description) {
  if (editingProductId) {
    const index = products.findIndex((p) => p.id === editingProductId);
    if (index !== -1) {
      products[index] = {
        id: editingProductId,
        name,
        image,
        price,
        description,
      };
    }
  } else {
    products.push({
      id: Date.now().toString(),
      name,
      image,
      price,
      description,
    });
  }
  saveProducts();
  window.location.href = "index1.html";
}

// Preview the selected image file before form submission
function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.src = reader.result;
    imagePreview.style.display = "block";
  };
  reader.readAsDataURL(event.target.files[0]);
}
