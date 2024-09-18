// User and cart data initialization
const users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
const cart = [];

document.addEventListener("DOMContentLoaded", () => {
  const aboutUsLink = document.querySelector('a[href="index.html#about-us"]');
  if (aboutUsLink) {
    aboutUsLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "index.html";
      setTimeout(() => {
        document.getElementById("about-us").scrollIntoView({ behavior: "smooth" });
      }, 500);
    });
  }
});

// User signup
document.getElementById("signup-form")?.addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("loading-overlay").style.display = "flex";

  setTimeout(() => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users.find((user) => user.username === username)) {
      document.getElementById("loading-overlay").style.display = "none";
      alert("Username already exists");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("loading-overlay").style.display = "none";
    alert("Account created successfully! Please login.");
    window.location.href = "login.html";
  }, 2000);
});

// User login
document.getElementById("login-form")?.addEventListener("submit", function (event) {
  event.preventDefault();
  document.getElementById("loading-overlay").style.display = "flex";

  setTimeout(() => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users.length === 0) {
      document.getElementById("loading-overlay").style.display = "none";
      alert("No accounts registered yet. Please sign up first.");
      return;
    }

    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      document.getElementById("loading-overlay").style.display = "none";
      alert("Login successful");
      window.location.href = "index.html";
    } else {
      document.getElementById("loading-overlay").style.display = "none";
      alert("Incorrect username or password.");
    }
  }, 2000);
});

// Store previous page URL in localStorage
document.addEventListener("DOMContentLoaded", function () {
  const previousPage = document.referrer;
  localStorage.setItem("previousPage", previousPage);
  updateAuthButton();
});

// Update authentication button based on login status
function updateAuthButton() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const authContainer = document.getElementById("auth-container");

  if (isLoggedIn) {
    authContainer.innerHTML = `
      <div class="dropdown">
        <i class="fas fa-user-circle profile-icon"></i>
        <div class="dropdown-content">
          <a href="profile.html">My Profile</a>
          <a href="settings.html">Settings</a>
          <a href="#" id="logout-btn">Logout</a>
        </div>
      </div>
    `;
    document.getElementById("logout-btn").addEventListener("click", logout);
  } else {
    authContainer.innerHTML = '<a href="#" id="auth-btn" class="auth-btn">Login</a>';
    document.getElementById("auth-btn").addEventListener("click", openLoginModal);
  }
}

// Logout function
function logout(event) {
  event.preventDefault();
  document.getElementById("loading-overlay").style.display = "flex";

  setTimeout(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    document.getElementById("loading-overlay").style.display = "none";
    alert("Logout successfully");
    window.location.href = "index.html";
  }, 1000);
}

// Open login modal
function openLoginModal() {
  const modal = document.getElementById("login-modal");
  modal.style.display = "block";
}

// Close login modal
function closeLoginModal() {
  const modal = document.getElementById("login-modal");
  modal.style.display = "none";
}

// Update auth button and attach event listeners on DOM load
document.addEventListener("DOMContentLoaded", function () {
  updateAuthButton();

  // Attach checkLogin function to the cart button
  const cartButton = document.getElementById("cart-btn");
  if (cartButton) {
    cartButton.addEventListener("click", checkLoginForCart);
  }

  // Attach checkLogin function to navigation and product elements
  const navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach((link) => {
    link.removeEventListener("click", checkLogin)
    link.addEventListener("click", checkLogin);
  });

  const products = document.querySelectorAll(".product");
  products.forEach((product) => {
    product.removeEventListener("click", checkLogin);
    product.addEventListener("click", checkLogin);
  });

  const shopNowButton = document.querySelector(".cover-button");
  if (shopNowButton) {
    shopNowButton.removeEventListener("click", checkLogin);
    shopNowButton.addEventListener("click", checkLogin);
  }
});

// Check login status before opening cart
function checkLoginForCart(event) {
  event.preventDefault();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    alert("You must be logged in to continue");
    openLoginModal();
  } else {
    openCartModal();
  }
}

// Open cart modal
function openCartModal() {
  const modal = document.getElementById("cart-container");
  const cartContent = document.getElementById("cart-content");

  // Display the cart items
  cartContent.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <p>${item.name} - $${item.price.toFixed(2)}</p>
      <button class="remove-item" onclick="removeFromCart('${item.name}')">Remove</button>
    </div>
  `
    )
    .join("");

  modal.style.display = "block";
}

// Close cart modal
function closeCartModal() {
  const modal = document.getElementById("cart-container");
  modal.style.display = "none";
}

// Script for index cover-image
document.addEventListener("DOMContentLoaded", function () {
  var coverText = document.querySelector(".cover-text");
  var coverSection = document.querySelector(".cover-section");

  window.addEventListener("scroll", function () {
    var scrollPos = window.scrollY;
    var windowHeight = window.innerHeight;

    if (scrollPos > coverSection.offsetTop - windowHeight / 1.5) {
      coverText.classList.add("visible");
    }

    var offset = scrollPos * 0.5;
    coverSection.style.backgroundPositionY = `${offset}px`;
  });
});

// Script for main-nav sticky
document.addEventListener("DOMContentLoaded", function () {
  const mainNav = document.querySelector(".main-nav");
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;

  function handleScroll() {
    if (window.scrollY >= headerHeight) {
      mainNav.classList.add("sticky");
      document.body.classList.add("has-sticky-nav");
    } else {
      mainNav.classList.remove("sticky");
      document.body.classList.remove("has-sticky-nav");
    }
  }

  window.addEventListener("scroll", handleScroll);
});
// Load and display featured products and products
let products = [];
let featuredProducts = [];
let currentVariant = null;
let selectedColor = null;
let selectedStorage = null;

fetch("featuredproducts.json")
  .then((response) => response.json())
  .then((data) => {
    featuredProducts = data;
    displayFeaturedProducts(featuredProducts);
  })
  .catch((error) => console.error("Error loading featured products:", error));

fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    phones = data;
    displayProducts(Object.values(phones)); 
  })
  .catch((error) => console.error("Error loading phones:", error));

function displayFeaturedProducts(products) {
  const container = document.querySelector(".featured-products .container");
  container.innerHTML = ""; // Clear the container

  products.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.dataset.index = index;
    productDiv.innerHTML = `
      <img src="image/${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name.toUpperCase()}</h3>
        <p class="product-title">${product.description}</p>
        <p class="product-price">From $${product.price.toLocaleString()}</p>
      </div>
    `;
    productDiv.addEventListener("click", () => openProductModal(product));
    container.appendChild(productDiv);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  let products = [];
  let currentVariant = null;
  let selectedColor = null;
  let selectedStorage = null;

  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      displayProducts(products);
    })
    .catch((error) => console.error("Error loading products:", error));

  function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    products.forEach((product, index) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.dataset.index = index;
      productDiv.innerHTML = `
        <img src="image/${product.image}" alt="${product.name}" class="product-image">
        <div class="product-details">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>`;
      productDiv.addEventListener("click", () => openProductModal(product));
      productList.appendChild(productDiv);
    });
  }


  document.getElementById("category-filter")?.addEventListener("change", searchProducts);
  document.getElementById("price-filter")?.addEventListener("change", searchProducts);
  document.getElementById("sort-filter")?.addEventListener("change", searchProducts);
  document.getElementById("search-button")?.addEventListener("click", () => {
    searchProducts();
  });
  document.getElementById("reset-button")?.addEventListener("click", () => {
    resetFilters();
    reattachProductEventListeners();
  });

  function resetFilters() {
    // Reset the search bar and filters
    document.getElementById("search-bar").value = "";
    document.getElementById("category-filter").value = "all";
    document.getElementById("price-filter").value = "all";
    document.getElementById("sort-filter").value = "name-asc";

    // Re-display all products
    displayProducts(Object.values(phones));

    // Reattach event listeners for product modals
    const products = document.querySelectorAll(".product");
    products.forEach((product) => {
      product.removeEventListener("click", openProductModal);
      product.addEventListener("click", () => openProductModal(product));
    });
  }
  function reattachProductEventListeners() {
    const products = document.querySelectorAll(".product");
    products.forEach((product) => {
      product.removeEventListener("click", openProductModal);
      product.addEventListener("click", () => openProductModal(product));
    });
  }

  function searchProducts() {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();
    const selectedCategory = document.getElementById("category-filter").value.toLowerCase();
    const selectedPriceRange = document.getElementById("price-filter").value.split("-");
    const minPrice = parseFloat(selectedPriceRange[0]) || 0;
    const maxPrice = parseFloat(selectedPriceRange[1]) || Infinity;
    const sortOption = document.getElementById("sort-filter").value;

    let filteredProducts = Object.values(phones).filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting logic
    filteredProducts = filteredProducts.sort((a, b) => {
      if (sortOption === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortOption === "price-low-high") {
        return a.price - b.price;
      } else if (sortOption === "price-high-low") {
        return b.price - a.price;
      }
      return 0;
    });

    displayProducts(filteredProducts);
    reattachProductEventListeners(); 
  }
  function openProductModal(product) {
    const modal = document.getElementById("product-modal");
    const displayImage = document.getElementById("product-display");
    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productPriceBottom = document.getElementById("product-price-bottom");
    const addToCartButton = document.getElementById("add-to-cart-button");

    productName.textContent = product.name;
    productPrice.textContent = `From $${product.price.toFixed(2)}`;
    productPriceBottom.textContent = `$${product.price.toFixed(2)}`;
    displayImage.src = `image/${product.displayImage}`;
    currentVariant = null;
    selectedColor = null;
    selectedStorage = null;
    addToCartButton.classList.add("disabled");

    product.variants.forEach((variant, index) => {
      const modelButton = document.getElementById(`option${index + 1}`);
      modelButton.textContent = variant.name;
      modelButton.classList.remove("disabled");
      modelButton.onclick = () => selectVariant(variant);
    });

    const colorOptions = document.querySelectorAll(".color-option");
    colorOptions.forEach((colorOption) => {
      colorOption.classList.add("disabled");
      colorOption.style.backgroundColor = "#ddd";
      colorOption.onclick = null;
    });

    const storageOptions = document.querySelectorAll(".storage-option");
    storageOptions.forEach((storageOption) => {
      storageOption.classList.add("disabled");
      storageOption.onclick = null;
    });

    modal.style.display = "block";
  }

  function selectVariant(variant) {
    const displayImage = document.getElementById("product-display");
    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productPriceBottom = document.getElementById("product-price-bottom");

    displayImage.src = `image/${variant.image}`;
    productName.textContent = variant.name;
    productPrice.textContent = `From $${variant.price.toFixed(2)}`;
    productPriceBottom.textContent = `$${variant.price.toFixed(2)}`;
    currentVariant = variant;
    selectedColor = null;
    selectedStorage = null;
    updateAddToCartButton();

    const colorOptions = document.querySelectorAll(".color-option");
    colorOptions.forEach((colorOption, index) => {
      if (index < variant.colors.length) {
        colorOption.classList.remove("disabled");
        colorOption.style.backgroundColor = variant.colors[index].hex;
        colorOption.onclick = () => selectColor(colorOption, variant.colors[index]);
      } else {
        colorOption.classList.add("disabled");
        colorOption.style.backgroundColor = "#ddd";
        colorOption.onclick = null;
      }
    });

    const storageOptions = document.querySelectorAll(".storage-option");
    storageOptions.forEach((storageOption, index) => {
      if (index < variant.storages.length) {
        const storage = variant.storages[index];
        storageOption.classList.remove("disabled");
        storageOption.textContent = storage.size;
        storageOption.onclick = storage.available
          ? () => selectStorage(storageOption, storage)
          : null;
        if (!storage.available) {
          storageOption.classList.add("disabled");
        }
      } else {
        storageOption.classList.add("disabled");
        storageOption.textContent = "";
        storageOption.onclick = null;
      }
    });
  }

  function selectColor(colorOption, color) {
    document.querySelectorAll(".color-option").forEach((option) => {
      option.classList.remove("selected");
    });
    colorOption.classList.add("selected");
    selectedColor = color;
    document.getElementById("product-display").src = `image/${color.image}`;
    updateAddToCartButton();
  }

  function selectStorage(storageOption, storage) {
    document.querySelectorAll(".storage-option").forEach((option) => {
      option.classList.remove("selected");
    });
    storageOption.classList.add("selected");
    selectedStorage = storage;
    document.getElementById("product-price").textContent = `From $${storage.price.toFixed(2)}`;
    document.getElementById("product-price-bottom").textContent = `$${storage.price.toFixed(2)}`;
    updateAddToCartButton();
  }

  function updateAddToCartButton() {
    const addToCartButton = document.getElementById("add-to-cart-button");
    if (currentVariant && selectedColor && selectedStorage) {
      addToCartButton.classList.remove("disabled");
      addToCartButton.onclick = () => addToCart(currentVariant, selectedColor, selectedStorage);
    } else {
      addToCartButton.classList.add("disabled");
      addToCartButton.onclick = null;
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
function closeProductModal() {
  document.getElementById("product-modal").style.display = "none";
}

function closeProductDetailModal() {
  document.getElementById("product-detail-modal").style.display = "none";
}

function closeCartModal() {
  document.getElementById("cart-container").style.display = "none";
}

  window.onclick = function (event) {
    const productModal = document.getElementById("product-modal");
    const productDetailModal = document.getElementById("product-detail-modal");
    const cartModal = document.getElementById("cart-container");

    if (event.target == productModal) {
      closeProductModal();
    }
    if (event.target == productDetailModal) {
      closeProductDetailModal();
    }
    if (event.target == cartModal) {
      closeCartModal();
    }
  }
});

// NEEDED FOR BOTH FEATURED AND PRODUCTS
function openProductModal(product) {
  const modal = document.getElementById("product-detail-modal");
  const displayImage = document.getElementById("product-display");
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productPriceBottom = document.getElementById("product-price-bottom");
  const addToCartButton = document.getElementById("add-to-cart-button");

  productName.textContent = product.name;
  productPrice.textContent = `From $${product.price.toLocaleString()}`;
  productPriceBottom.textContent = `$${product.price.toLocaleString()}`;
  displayImage.src = `image/${product.displayImage}`;
  currentVariant = null;
  selectedColor = null;
  selectedStorage = null;
  addToCartButton.classList.add("disabled");

  product.variants.forEach((variant, index) => {
    const modelButton = document.getElementById(`option${index + 1}`);
    modelButton.textContent = variant.name;
    modelButton.classList.remove("disabled");
    modelButton.onclick = () => selectVariant(variant);
  });

  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach((colorOption) => {
    colorOption.classList.add("disabled");
    colorOption.style.backgroundColor = "#ddd";
    colorOption.onclick = null;
  });

  const storageOptions = document.querySelectorAll(".storage-option");
  storageOptions.forEach((storageOption) => {
    storageOption.classList.add("disabled");
    storageOption.onclick = null;
  });

  modal.style.display = "block";
}

function selectVariant(variant) {
  const displayImage = document.getElementById("product-display");
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productPriceBottom = document.getElementById("product-price-bottom");

  displayImage.src = `image/${variant.image}`;
  productName.textContent = variant.name;
  productPrice.textContent = `From $${variant.price.toLocaleString()}`;
  productPriceBottom.textContent = `$${variant.price.toLocaleString()}`;
  currentVariant = variant;
  selectedColor = null;
  selectedStorage = null;
  updateAddToCartButton();

  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach((colorOption, index) => {
    if (index < variant.colors.length) {
      colorOption.classList.remove("disabled");
      colorOption.style.backgroundColor = variant.colors[index].hex;
      colorOption.onclick = () =>
        selectColor(colorOption, variant.colors[index]);
    } else {
      colorOption.classList.add("disabled");
      colorOption.style.backgroundColor = "#ddd";
      colorOption.onclick = null;
    }
  });

  const storageOptions = document.querySelectorAll(".storage-option");
  storageOptions.forEach((storageOption, index) => {
    if (index < variant.storages.length) {
      const storage = variant.storages[index];
      storageOption.classList.remove("disabled");
      storageOption.textContent = storage.size;
      storageOption.onclick = storage.available
        ? () => selectStorage(storageOption, storage)
        : null;
      if (!storage.available) {
        storageOption.classList.add("disabled");
      }
    } else {
      storageOption.classList.add("disabled");
      storageOption.textContent = "";
      storageOption.onclick = null;
    }
  });
}

function selectColor(colorOption, color) {
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("selected");
  });
  colorOption.classList.add("selected");
  selectedColor = color;
  document.getElementById("product-display").src = `image/${color.image}`;
  updateAddToCartButton();
}

function selectStorage(storageOption, storage) {
  document.querySelectorAll(".storage-option").forEach((option) => {
    option.classList.remove("selected");
  });
  storageOption.classList.add("selected");
  selectedStorage = storage;
  document.getElementById("product-price").textContent = `From $${storage.price.toLocaleString()}`;
  document.getElementById("product-price-bottom").textContent = `$${storage.price.toLocaleString()}`;
  updateAddToCartButton();
}

function updateAddToCartButton() {
  const addToCartButton = document.getElementById("add-to-cart-button");
  if (currentVariant && selectedColor && selectedStorage) {
    addToCartButton.classList.remove("disabled");
    addToCartButton.onclick = () =>
      addToCart(currentVariant, selectedColor, selectedStorage);
  } else {
    addToCartButton.classList.add("disabled");
    addToCartButton.onclick = null;
  }
}

function addToCart(variant, color, storage) {
  cart.push({ variant, color, storage });
  updateCartCount();
  saveCartToLocalStorage();
  showNotification(variant, color, storage);
}

function showNotification(variant, color, storage) {
  const notificationContainer = document.getElementById(
    "notification-container"
  );

  const notification = document.createElement("div");
  notification.className = "notification";

  const productImage = document.createElement("img");
  productImage.src = `image/${color.image}`;
  productImage.alt = variant.name;
  productImage.className = "notification-image";

  const productInfo = document.createElement("div");
  productInfo.className = "notification-info";
  productInfo.innerHTML = `
    <p>${variant.name} (${color.name}, ${storage.size})</p>
    <p>$${storage.price.toLocaleString()}</p>
    <p>${variant.name} has been added to the cart</p>
  `;

  const closeBtn = document.createElement("button");
  closeBtn.className = "notification-close";
  closeBtn.textContent = "Close";
  closeBtn.onclick = () => {
    notificationContainer.removeChild(notification);
  };

  notification.appendChild(productImage);
  notification.appendChild(productInfo);
  notification.appendChild(closeBtn);
  notificationContainer.appendChild(notification);

  setTimeout(() => {
    if (notificationContainer.contains(notification)) {
      notificationContainer.removeChild(notification);
    }
  }, 5000);
}

function updateCartCount() {
  const cartQty = document.querySelector('.cart-qty');
  const currentQuantity = cart.length;
  setCartQuantity(currentQuantity);
}

// Open cart modal
function openCartModal() {
  const modal = document.getElementById("cart-container");
  const cartContent = document.getElementById("cart-content");
  const totalAmountElement = document.getElementById("total-amount");

  // Calculate total amount
  let totalAmount = cart.reduce((sum, item) => sum + item.storage.price, 0);

  // Display the cart items
  cartContent.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="image/${item.color.image}" alt="${item.variant.name}">
      <div class="cart-item-details">
        <p>${item.variant.name} (${item.color.name}, ${item.storage.size})</p>
        <p class="price">$${item.storage.price.toLocaleString()}</p>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.variant.name}', '${item.color.name
        }', '${item.storage.size}')">Remove</button>
    </div>
  `
    )
    .join("");

  // Display total amount
  totalAmountElement.textContent = `Total: $${totalAmount.toLocaleString()}`;

  modal.style.display = "block";
  modal.classList.add("slide-in");
}

function closeCartModal() {
  const modal = document.getElementById("cart-container");
  modal.style.display = "none";
  modal.classList.remove("slide-in");
}

function removeFromCart(variantName, colorName, storageSize) {
  const index = cart.findIndex(
    (item) =>
      item.variant.name === variantName &&
      item.color.name === colorName &&
      item.storage.size === storageSize
  );
  if (index !== -1) {
    cart.splice(index, 1);
    updateCartCount();
    saveCartToLocalStorage();
    openCartModal();
  }
}

// PROFILE JS
document.addEventListener("DOMContentLoaded", () => {
  // Ensure all required elements are available
  const profilePicImg = document.getElementById("profile-pic-img");
  const profilePicInput = document.getElementById("profile-pic-input");
  const profileForm = document.getElementById("profile-form");
  const ordersList = document.getElementById("orders-list");
  const mainCurrency = document.getElementById("main-currency");

  // Add event listeners and handle logic
  if (profilePicImg && profilePicInput) {
    profilePicInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          profilePicImg.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (profileForm) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveProfile();
    });

    function saveProfile() {
      const profileData = {
        username: document.getElementById("username").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        gender: document.querySelector("input[name='gender']:checked").value,
        dob: document.getElementById("dob").value,
        profilePic: profilePicImg.src,
        street: document.getElementById("street").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        country: document.getElementById("country").value,
        zip: document.getElementById("zip").value
      };

      localStorage.setItem("profileData", JSON.stringify(profileData));
      alert("Profile saved successfully!");
    }

    function loadProfile() {
      const savedProfile = localStorage.getItem("profileData");
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        document.getElementById("username").value = profileData.username;
        document.getElementById("name").value = profileData.name;
        document.getElementById("email").value = profileData.email;
        document.getElementById("phone").value = profileData.phone;
        document.querySelector(`input[name='gender'][value='${profileData.gender}']`).checked = true;
        document.getElementById("dob").value = profileData.dob;
        if (profileData.profilePic) {
          profilePicImg.src = profileData.profilePic;
        }
        document.getElementById("street").value = profileData.street;
        document.getElementById("city").value = profileData.city;
        document.getElementById("state").value = profileData.state;
        document.getElementById("country").value = profileData.country;
        document.getElementById("zip").value = profileData.zip;
      }
    }

    loadProfile();
  }

  // Load and display orders
  function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (ordersList) {
      ordersList.innerHTML = orders.map((order, index) => `
              <tr>
                  <td>${order.orderId}</td>
                  <td>${order.status || 'Pending'}</td>
                  <td>${order.items.map(item => `${item.variant.name} (${item.color.name}, ${item.storage.size})`).join(', ')}</td>
                  <td>${order.items.length}</td>
                  <td>${order.date}</td>
                  <td><button onclick="viewOrderDetails(${index})">View</button></td>
              </tr>
          `).join('');
    }
  }

  function viewOrderDetails(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    alert(`Order Details:\n\n${JSON.stringify(order, null, 2)}`);
  }

  loadOrders();
});

document.addEventListener("DOMContentLoaded", () => {
  const proceedToCheckoutBtn = document.getElementById("proceed-to-checkout-btn");

  if (proceedToCheckoutBtn) {
    proceedToCheckoutBtn.addEventListener("click", function () {
      window.location.href = "checkout.html"; 
    });
  }
});

// Additional code to persist cart data for checkout
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = JSON.parse(localStorage.getItem('cart'));
  if (savedCart) {
    cart.length = 0;
    cart.push(...savedCart);
  }
}

// Save cart data whenever items are added or removed
function addToCart(variant, color, storage) {
  cart.push({ variant, color, storage });
  updateCartCount();
  saveCartToLocalStorage();
  showNotification(variant, color, storage);
}

function removeFromCart(variantName, colorName, storageSize) {
  const index = cart.findIndex(
    (item) =>
      item.variant.name === variantName &&
      item.color.name === colorName &&
      item.storage.size === storageSize
  );
  if (index !== -1) {
    cart.splice(index, 1);
    updateCartCount();
    saveCartToLocalStorage();
    openCartModal();
  }
}

function updateCartCount() {
  const cartQty = document.querySelector('.cart-qty');
  const currentQuantity = cart.length;
  setCartQuantity(currentQuantity);
}

// Load cart data when the page loads
document.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);

// Functions to handle cart quantity in localStorage
function getCartQuantity() {
  return parseInt(localStorage.getItem('cartQuantity')) || 0;
}

function setCartQuantity(quantity) {
  localStorage.setItem('cartQuantity', quantity);
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartQtyElement = document.querySelector('.cart-qty');
  if (cartQtyElement) {
    cartQtyElement.textContent = getCartQuantity();
  }
}

// Initialize cart quantity display on page load
document.addEventListener("DOMContentLoaded", function () {
  updateCartDisplay();
});

function addToCart(variant, color, storage) {
  cart.push({ variant, color, storage });
  updateCartCount();
  saveCartToLocalStorage();
  showNotification(variant, color, storage);
}

function removeFromCart(variantName, colorName, storageSize) {
  const index = cart.findIndex(
    (item) =>
      item.variant.name === variantName &&
      item.color.name === colorName &&
      item.storage.size === storageSize
  );
  if (index !== -1) {
    cart.splice(index, 1);
    updateCartCount();
    saveCartToLocalStorage();
    openCartModal();
  }
}

function updateCartCount() {
  const cartQty = document.querySelector('.cart-qty');
  const currentQuantity = cart.length;
  setCartQuantity(currentQuantity);
}

// Load cart data when the page loads
document.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);

