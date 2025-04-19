// Store data in localStorage
if (!localStorage.getItem("users")) {
    localStorage.setItem(
      "users",
      JSON.stringify([
        {
          name: "Test User",
          username: "user",
          password: "password",
        },
      ])
    );
  }
  
  if (!localStorage.getItem("menuItems")) {
    localStorage.setItem(
      "menuItems",
      JSON.stringify([
        {
          id: 1,
          name: "Margherita Pizza",
          category: "pizza",
          price: 14.99,
          description: "Classic pizza with fresh tomatoes, mozzarella, and basil.",
          image: "public/images/pizza.jpg",
          featured: true,
        },
        {
          id: 2,
          name: "Spaghetti Carbonara",
          category: "pasta",
          price: 16.99,
          description: "Traditional pasta with eggs, cheese, pancetta, and black pepper.",
          image: "public/images/pasta.jpg",
          featured: true,
        },
        {
          id: 3,
          name: "Tiramisu",
          category: "dessert",
          price: 8.99,
          description: "Classic Italian dessert made with coffee-soaked ladyfingers and mascarpone cream.",
          image: "/placeholder.svg?height=300&width=300",
          featured: false,
        },
        {
          id: 4,
          name: "Risotto ai Funghi",
          category: "risotto",
          price: 18.99,
          description: "Creamy risotto with mushrooms, parmesan cheese and a touch of white wine.",
          image: "/placeholder.svg?height=300&width=300",
          featured: true,
        },
      ])
    );
  }
  
  if (!localStorage.getItem("reservations")) {
    localStorage.setItem("reservations", JSON.stringify([]));
  }
  
  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]));
  }
  
  // Global cart array
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  
  // Check if user is logged in
  function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const authLinks = document.querySelectorAll("#auth-link");
  
    if (user) {
      authLinks.forEach((link) => {
        link.textContent = "Logout";
        link.href = "#";
        link.addEventListener("click", (e) => {
          e.preventDefault();
          sessionStorage.removeItem("user");
          showAlert("Logged out successfully!", "success");
          window.location.href = "index.html";
        });
      });
  
      // Add the user name to the navigation
      const navList = document.querySelector(".nav-list");
      if (navList) {
        const userItem = document.createElement("li");
        userItem.className = "nav-item";
        userItem.innerHTML = `<a href="account.html">Welcome, ${user.name}</a>`;
        navList.appendChild(userItem);
      }
  
      // Show reservation button if it exists
      const reserveBtn = document.getElementById("reserve-btn");
      if (reserveBtn) {
        reserveBtn.style.display = "inline-block";
      }
    } else {
      authLinks.forEach((link) => {
        link.textContent = "Sign In";
        link.href = "signin.html";
      });
  
      // Hide reservation button if it exists
      const reserveBtn = document.getElementById("reserve-btn");
      if (reserveBtn) {
        reserveBtn.style.display = "none";
      }
    }
  }
  
  // Mobile menu toggle
  function setupMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");
  
    if (menuToggle && navList) {
      menuToggle.addEventListener("click", () => {
        navList.classList.toggle("active");
      });
    }
  }
  
  // Sign Up Form
  function setupSignupForm() {
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const name = document.getElementById("fullname").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        const users = JSON.parse(localStorage.getItem("users"));
  
        // Check if username already exists
        if (users.find((u) => u.username === username)) {
          showAlert("Username already exists. Please choose another one.", "danger");
          return;
        }
  
        // Add new user
        users.push({ name, username, password });
        localStorage.setItem("users", JSON.stringify(users));
  
        showAlert("Account created successfully! Please sign in.", "success");
  
        // Redirect to sign in page after a short delay
        setTimeout(() => {
          window.location.href = "signin.html";
        }, 2000);
      });
    }
  }
  
  // Sign In Form
  function setupSigninForm() {
    const signinForm = document.getElementById("signin-form");
    if (signinForm) {
      signinForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        const users = JSON.parse(localStorage.getItem("users"));
        const user = users.find((u) => u.username === username && u.password === password);
  
        if (user) {
          // Store user in session storage
          sessionStorage.setItem("user", JSON.stringify(user));
          showAlert("Signed in successfully!", "success");
  
          // Redirect to homepage after a short delay
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        } else {
          showAlert("Invalid username or password.", "danger");
        }
      });
    }
  }
  
  // Admin Login
  function setupAdminLogin() {
    const adminForm = document.getElementById("admin-form");
    if (adminForm) {
      adminForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const username = document.getElementById("admin-username").value;
        const password = document.getElementById("admin-password").value;
  
        // Simple admin authentication
        if (username === "admin" && password === "admin123") {
          sessionStorage.setItem("admin", "true");
          showAlert("Admin logged in successfully!", "success");
  
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1500);
        } else {
          showAlert("Invalid admin credentials.", "danger");
        }
      });
    }
  }
  
  // Admin Dashboard
  function setupAdminDashboard() {
    if (!sessionStorage.getItem("admin") && window.location.pathname.includes("dashboard")) {
      window.location.href = "admin.html";
      return;
    }
  
    // Mobile sidebar toggle
    document.querySelector(".toggle-sidebar")?.addEventListener("click", () => {
      document.querySelector(".dashboard-sidebar").classList.toggle("active");
    });
  
    // Tab navigation
    const tabLinks = document.querySelectorAll(".dashboard-menu a[data-tab]");
    tabLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const tabId = link.dataset.tab;
        document.querySelectorAll(".tab-content").forEach((tab) => {
          tab.classList.remove("active");
        });
        document.getElementById(tabId).classList.add("active");
        tabLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  
    // Setup logout
    const logoutBtn = document.getElementById("admin-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("admin");
        window.location.href = "admin.html";
      });
    }
  
    // Load dashboard data
    loadDashboardData();
  
    // Setup management sections
    setupMenuManagement();
    setupReservationManagement();
    setupOrderManagement();
  }
  
  // Load dashboard data
  function loadDashboardData() {
    try {
      const ordersCount = document.getElementById("orders-count");
      const reservationsCount = document.getElementById("reservations-count");
      const menuItemsCount = document.getElementById("menu-items-count");
      const usersCount = document.getElementById("users-count");
  
      if (ordersCount) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        ordersCount.textContent = orders.length;
      }
  
      if (reservationsCount) {
        const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
        reservationsCount.textContent = reservations.length;
      }
  
      if (menuItemsCount) {
        const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
        menuItemsCount.textContent = menuItems.length;
      }
  
      if (usersCount) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        usersCount.textContent = users.length;
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showAlert("Error loading dashboard data", "danger");
    }
  }
  
  // Menu Management
  function setupMenuManagement() {
    const menuTable = document.getElementById("menu-items-table");
    if (menuTable) {
      const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
  
      // Generate table rows
      let tableContent = "";
      menuItems.forEach((item) => {
        tableContent += `
          <tr data-id="${item.id}">
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td class="action-buttons">
              <button class="btn btn-sm edit-menu-item">Edit</button>
              <button class="btn btn-sm delete-menu-item">Delete</button>
            </td>
          </tr>
        `;
      });
  
      menuTable.querySelector("tbody").innerHTML = tableContent;
  
      // Add event listeners for edit and delete buttons
      document.querySelectorAll(".edit-menu-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.closest("tr").dataset.id);
          editMenuItem(id);
        });
      });
  
      document.querySelectorAll(".delete-menu-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.closest("tr").dataset.id);
          deleteMenuItem(id);
        });
      });
  
      // Add new menu item
      const addMenuItemForm = document.getElementById("add-menu-item-form");
      if (addMenuItemForm) {
        addMenuItemForm.addEventListener("submit", (e) => {
          e.preventDefault();
  
          const name = document.getElementById("menu-item-name").value;
          const category = document.getElementById("menu-item-category").value;
          const price = Number.parseFloat(document.getElementById("menu-item-price").value);
          const description = document.getElementById("menu-item-description").value;
          const featured = document.getElementById("menu-item-featured").checked;
  
          const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
  
          // Generate new ID
          const newId = menuItems.length > 0 ? Math.max(...menuItems.map((item) => item.id)) + 1 : 1;
  
          // Add new item
          menuItems.push({
            id: newId,
            name,
            category,
            price,
            description,
            image: "/placeholder.svg?height=300&width=300",
            featured,
          });
  
          localStorage.setItem("menuItems", JSON.stringify(menuItems));
  
          showAlert("Menu item added successfully!", "success");
  
          // Reload dashboard data
          loadDashboardData();
  
          // Reset form
          addMenuItemForm.reset();
  
          // Reload menu items table
          setupMenuManagement();
        });
      }
    }
  }
  
  function editMenuItem(id) {
    const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
    const item = menuItems.find((item) => item.id === id);
  
    if (item) {
      // Populate edit form
      const editForm = document.getElementById("edit-menu-item-form");
      if (editForm) {
        document.getElementById("edit-menu-item-id").value = item.id;
        document.getElementById("edit-menu-item-name").value = item.name;
        document.getElementById("edit-menu-item-category").value = item.category;
        document.getElementById("edit-menu-item-price").value = item.price;
        document.getElementById("edit-menu-item-description").value = item.description;
        document.getElementById("edit-menu-item-featured").checked = item.featured;
  
        // Show edit form modal
        const editModal = document.getElementById("edit-menu-item-modal");
        editModal.classList.add("active");
  
        // Handle form submission
        editForm.addEventListener("submit", (e) => {
          e.preventDefault();
  
          // Update item properties
          item.name = document.getElementById("edit-menu-item-name").value;
          item.category = document.getElementById("edit-menu-item-category").value;
          item.price = Number.parseFloat(document.getElementById("edit-menu-item-price").value);
          item.description = document.getElementById("edit-menu-item-description").value;
          item.featured = document.getElementById("edit-menu-item-featured").checked;
  
          // Save updated items
          localStorage.setItem("menuItems", JSON.stringify(menuItems));
  
          showAlert("Menu item updated successfully!", "success");
  
          // Hide modal
          editModal.classList.remove("active");
  
          // Reload menu items table
          setupMenuManagement();
        });
  
        // Close modal
        const closeBtn = document.querySelector("#edit-menu-item-modal .modal-close");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            editModal.classList.remove("active");
          });
        }
      }
    }
  }
  
  function deleteMenuItem(id) {
    if (confirm("Are you sure you want to delete this menu item?")) {
      let menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
  
      // Filter out the item to delete
      menuItems = menuItems.filter((item) => item.id !== id);
  
      // Save updated items
      localStorage.setItem("menuItems", JSON.stringify(menuItems));
  
      showAlert("Menu item deleted successfully!", "success");
  
      // Reload dashboard data
      loadDashboardData();
  
      // Reload menu items table
      setupMenuManagement();
    }
  }
  
  // Reservation Management
  function setupReservationManagement() {
    const reservationsTable = document.getElementById("reservations-table");
    if (reservationsTable) {
      const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
  
      // Generate table rows
      let tableContent = "";
      reservations.forEach((reservation) => {
        tableContent += `
          <tr data-id="${reservation.id}">
            <td>${reservation.id}</td>
            <td>${reservation.name}</td>
            <td>${reservation.date}</td>
            <td>${reservation.time}</td>
            <td>${reservation.guests}</td>
            <td>${reservation.status}</td>
            <td class="action-buttons">
              <button class="btn btn-sm approve-reservation" ${reservation.status !== "pending" ? "disabled" : ""}>Approve</button>
              <button class="btn btn-sm reject-reservation" ${reservation.status !== "pending" ? "disabled" : ""}>Reject</button>
            </td>
          </tr>
        `;
      });
  
      reservationsTable.querySelector("tbody").innerHTML = tableContent;
  
      // Add event listeners for approve and reject buttons
      document.querySelectorAll(".approve-reservation").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.closest("tr").dataset.id);
          updateReservationStatus(id, "approved");
        });
      });
  
      document.querySelectorAll(".reject-reservation").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.closest("tr").dataset.id);
          updateReservationStatus(id, "rejected");
        });
      });
    }
  }
  
  function updateReservationStatus(id, status) {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const reservation = reservations.find((r) => r.id === id);
  
    if (reservation) {
      reservation.status = status;
      localStorage.setItem("reservations", JSON.stringify(reservations));
  
      showAlert(`Reservation ${status} successfully!`, "success");
  
      // Reload reservations table
      setupReservationManagement();
    }
  }
  
  // Order Management
  function setupOrderManagement() {
    const ordersTable = document.getElementById("orders-table");
    if (ordersTable) {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
  
      // Generate table rows
      let tableContent = "";
      orders.forEach((order) => {
        tableContent += `
          <tr data-id="${order.id}">
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${new Date(order.date).toLocaleString()}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${order.status}</td>
            <td class="action-buttons">
              <button class="btn btn-sm view-order">View Details</button>
              <button class="btn btn-sm approve-order" ${order.status !== "pending" ? "disabled" : ""}>Approve</button>
              <button class="btn btn-sm reject-order" ${order.status !== "pending" ? "disabled" : ""}>Reject</button>
            </td>
          </tr>
        `;
      });
  
      ordersTable.querySelector("tbody").innerHTML = tableContent;
  
      // Add event listeners for buttons
      document.querySelectorAll(".view-order").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.closest("tr").dataset.id);
          viewOrderDetails(id);
        });
      });
  
      document.querySelectorAll(".approve-order").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.closest("tr").dataset.id);
          updateOrderStatus(id, "approved");
        });
      });
  
      document.querySelectorAll(".reject-order").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.closest("tr").dataset.id);
          updateOrderStatus(id, "rejected");
        });
      });
    }
  }
  
  function viewOrderDetails(id) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = orders.find((o) => o.id === id);
  
    if (order) {
      const detailsModal = document.getElementById("order-details-modal");
      const modalContent = detailsModal.querySelector(".modal-content");
  
      // Generate order details HTML
      let itemsHtml = "";
      order.items.forEach((item) => {
        itemsHtml += `
          <div class="order-item">
            <div class="order-item-details">
              <h4>${item.name}</h4>
              <p>Quantity: ${item.quantity}</p>
              <p>Price: $${item.price.toFixed(2)}</p>
              ${item.customizations ? `<p>Customizations: ${item.customizations}</p>` : ""}
            </div>
            <div class="order-item-total">
              $${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        `;
      });
  
      modalContent.innerHTML = `
        <span class="modal-close">&times;</span>
        <h2>Order #${order.id}</h2>
        <p><strong>Customer:</strong> ${order.customer}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
        <p><strong>Status:</strong> <span class="order-status ${order.status}">${order.status}</span></p>
        
        <h3 class="mt-4">Order Items</h3>
        <div class="order-items">
          ${itemsHtml}
        </div>
        
        <div class="order-summary mt-4">
          <div class="order-total">
            <span>Total:</span>
            <span>$${order.total.toFixed(2)}</span>
          </div>
        </div>
      `;
  
      // Show modal
      detailsModal.classList.add("active");
  
      // Add event listener for close button
      const closeBtn = modalContent.querySelector(".modal-close");
      closeBtn.addEventListener("click", () => {
        detailsModal.classList.remove("active");
      });
  
      // Close modal when clicking outside
      detailsModal.addEventListener("click", (e) => {
        if (e.target === detailsModal) {
          detailsModal.classList.remove("active");
        }
      });
    }
  }
  
  function updateOrderStatus(id, status) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = orders.find((o) => o.id === id);
  
    if (order) {
      order.status = status;
      localStorage.setItem("orders", JSON.stringify(orders));
  
      showAlert(`Order ${status} successfully!`, "success");
  
      // Reload orders table
      setupOrderManagement();
    }
  }
  
  // Menu page setup
  function setupMenuPage() {
    const menuGrid = document.querySelector(".menu-grid");
    if (menuGrid) {
      const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
  
      // Generate menu cards
      let menuHtml = "";
      menuItems.forEach((item) => {
        menuHtml += `
          <div class="menu-card">
            <div class="menu-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-content">
              <div class="menu-title">
                <h3>${item.name}</h3>
                <span class="menu-price">$${item.price.toFixed(2)}</span>
              </div>
              <p class="menu-description">${item.description}</p>
              <div class="menu-actions">
                <a href="dish.html?id=${item.id}" class="btn btn-sm">View Details</a>
                <button class="btn btn-sm btn-outline add-to-cart" data-id="${item.id}">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
      });
  
      menuGrid.innerHTML = menuHtml;
  
      // Add event listeners for "Add to Cart" buttons
      document.querySelectorAll(".add-to-cart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = Number.parseInt(e.target.dataset.id);
          addToCart(id, 1);
        });
      });
    }
  }
  
  // Dish detail page
  function setupDishDetailPage() {
    const dishDetail = document.querySelector(".dish-detail");
    if (dishDetail) {
      // Get dish ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const dishId = Number.parseInt(urlParams.get("id"));
  
      if (dishId) {
        const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
        const dish = menuItems.find((item) => item.id === dishId);
  
        if (dish) {
          // Populate dish details
          document.getElementById("dish-name").textContent = dish.name;
          document.getElementById("dish-price").textContent = `$${dish.price.toFixed(2)}`;
          document.getElementById("dish-description").textContent = dish.description;
          document.getElementById("dish-image").src = dish.image;
  
          // Handle pre-order form submission
          const preorderForm = document.getElementById("preorder-form");
          if (preorderForm) {
            preorderForm.addEventListener("submit", (e) => {
              e.preventDefault();
  
              const quantity = Number.parseInt(document.getElementById("quantity").value);
              const spiceLevel = document.querySelector('input[name="spice-level"]:checked')?.value || "medium";
              const notes = document.getElementById("special-instructions").value;
  
              // Create customization string
              let customizations = `Spice Level: ${spiceLevel}`;
              if (notes) {
                customizations += `, Notes: ${notes}`;
              }
  
              // Add to cart with customizations
              addToCart(dishId, quantity, customizations);
            });
          }
        } else {
          // Dish not found
          dishDetail.innerHTML = '<div class="alert alert-danger">Dish not found!</div>';
        }
      }
    }
  }
  
  // Add to cart
  function addToCart(itemId, quantity, customizations = "") {
    const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
    const item = menuItems.find((item) => item.id === itemId);
  
    if (item) {
      // Check if item is already in cart
      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem.id === itemId && cartItem.customizations === customizations
      );
  
      if (existingItemIndex !== -1) {
        // Update quantity if item exists with same customizations
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: quantity,
          customizations: customizations,
        });
      }
  
      // Save cart to session storage
      sessionStorage.setItem("cart", JSON.stringify(cart));
  
      showAlert(`${item.name} added to cart!`, "success");
  
      // Update cart count
      updateCartCount();
  
      // Open cart sidebar
      toggleCart();
    }
  }
  
  // Update cart count
  function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = totalItems;
  
      if (totalItems > 0) {
        cartCount.style.display = "flex";
      } else {
        cartCount.style.display = "none";
      }
    }
  }
  
  // Toggle cart sidebar
  function toggleCart() {
    const cartContainer = document.querySelector(".cart-container");
    if (cartContainer) {
      cartContainer.classList.toggle("active");
  
      // Generate cart items
      updateCartDisplay();
    }
  }
  
  // Update cart display
  function updateCartDisplay() {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total-amount");
  
    if (cartItemsContainer && cartTotal) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "$0.00";
        return;
      }
  
      let cartHtml = "";
      let total = 0;
  
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
  
        cartHtml += `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.name}</h4>
              <p class="cart-item-price">$${item.price.toFixed(2)}</p>
              ${item.customizations ? `<p class="cart-item-custom">${item.customizations}</p>` : ""}
              <div class="cart-item-quantity">
                <span class="cart-quantity-btn minus" data-index="${index}">-</span>
                <span>${item.quantity}</span>
                <span class="cart-quantity-btn plus" data-index="${index}">+</span>
              </div>
            </div>
            <span class="cart-item-remove" data-index="${index}">&times;</span>
          </div>
        `;
      });
  
      cartItemsContainer.innerHTML = cartHtml;
      cartTotal.textContent = `$${total.toFixed(2)}`;
  
      // Add event listeners for cart actions
      document.querySelectorAll(".cart-quantity-btn.minus").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = Number.parseInt(btn.dataset.index);
          if (cart[index].quantity > 1) {
            cart[index].quantity--;
            sessionStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
          }
        });
      });
  
      document.querySelectorAll(".cart-quantity-btn.plus").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = Number.parseInt(btn.dataset.index);
          cart[index].quantity++;
          sessionStorage.setItem("cart", JSON.stringify(cart));
          updateCartDisplay();
          updateCartCount();
        });
      });
  
      document.querySelectorAll(".cart-item-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = Number.parseInt(btn.dataset.index);
          cart.splice(index, 1);
          sessionStorage.setItem("cart", JSON.stringify(cart));
          updateCartDisplay();
          updateCartCount();
        });
      });
    }
  }
  
  // Setup reservation form
  function setupReservationForm() {
    const reservationForm = document.getElementById("reservation-form");
    if (reservationForm) {
      reservationForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        // Check if user is logged in
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
          showAlert("Please sign in to make a reservation.", "warning");
          setTimeout(() => {
            window.location.href = "signin.html";
          }, 2000);
          return;
        }
  
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const guests = Number.parseInt(document.getElementById("guests").value);
        const notes = document.getElementById("notes").value;
        const payNow = document.getElementById("pay-now").checked;
  
        // Validate date (must be in the future)
        const selectedDate = new Date(`${date}T${time}`);
        const now = new Date();
  
        if (selectedDate <= now) {
          showAlert("Please select a future date and time.", "danger");
          return;
        }
  
        if (payNow) {
          // Show payment modal
          const paymentModal = document.getElementById("payment-modal");
          paymentModal.classList.add("active");
  
          // Handle payment form submission
          const paymentForm = document.getElementById("payment-form");
          paymentForm.addEventListener("submit", (e) => {
            e.preventDefault();
  
            // Process reservation
            processReservation(name, email, phone, date, time, guests, notes, true);
  
            // Hide payment modal
            paymentModal.classList.remove("active");
          });
  
          // Close modal
          const closeBtn = document.querySelector("#payment-modal .modal-close");
          closeBtn.addEventListener("click", () => {
            paymentModal.classList.remove("active");
          });
        } else {
          // Process reservation without payment
          processReservation(name, email, phone, date, time, guests, notes, false);
        }
      });
    }
  }
  
  function processReservation(name, email, phone, date, time, guests, notes, isPaid) {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
  
    // Generate new ID
    const newId = reservations.length > 0 ? Math.max(...reservations.map((r) => r.id)) + 1 : 1;
  
    // Add new reservation
    reservations.push({
      id: newId,
      name,
      email,
      phone,
      date,
      time,
      guests,
      notes,
      isPaid,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  
    localStorage.setItem("reservations", JSON.stringify(reservations));
  
    showAlert("Reservation submitted successfully! Waiting for approval.", "success");
  
    // Reset form
    document.getElementById("reservation-form").reset();
  }
  
  // Setup checkout
  function setupCheckout() {
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        // Check if user is logged in
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
          showAlert("Please sign in to checkout.", "warning");
          setTimeout(() => {
            window.location.href = "signin.html";
          }, 2000);
          return;
        }
  
        // Check if cart is empty
        if (cart.length === 0) {
          showAlert("Your cart is empty.", "warning");
          return;
        }
  
        // Show payment modal
        const paymentModal = document.getElementById("payment-modal");
        paymentModal.classList.add("active");
  
        // Handle payment form submission
        const paymentForm = document.getElementById("payment-form");
        paymentForm.addEventListener("submit", (e) => {
          e.preventDefault();
  
          // Process order
          processOrder();
  
          // Hide payment modal
          paymentModal.classList.remove("active");
        });
  
        // Close modal
        const closeBtn = document.querySelector("#payment-modal .modal-close");
        closeBtn.addEventListener("click", () => {
          paymentModal.classList.remove("active");
        });
      });
    }
  }
  
  function processOrder() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
  
    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    // Generate new ID
    const newId = orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
  
    // Add new order
    orders.push({
      id: newId,
      customer: user.name,
      userId: user.username,
      items: [...cart],
      total: total,
      status: "pending",
      date: new Date().toISOString(),
    });
  
    localStorage.setItem("orders", JSON.stringify(orders));
  
    showAlert("Order placed successfully! Waiting for approval.", "success");
  
    // Clear cart
    cart = [];
    sessionStorage.removeItem("cart");
    updateCartCount();
  
    // Close cart sidebar
    const cartContainer = document.querySelector(".cart-container");
    if (cartContainer) {
      cartContainer.classList.remove("active");
    }
  }
  
  // Helper function to show alerts
  function showAlert(message, type) {
    const alertContainer = document.getElementById("alert-container");
  
    if (!alertContainer) {
      // Create alert container if it doesn't exist
      const container = document.createElement("div");
      container.id = "alert-container";
      container.style.position = "fixed";
      container.style.top = "20px";
      container.style.right = "20px";
      container.style.zIndex = "1000";
      document.body.appendChild(container);
    }
  
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
  
    document.getElementById("alert-container").appendChild(alert);
  
    // Remove alert after 3 seconds
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
  
  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    setupMobileMenu();
    setupSignupForm();
    setupSigninForm();
    setupAdminLogin();
    setupAdminDashboard();
    setupMenuPage();
    setupDishDetailPage();
    setupReservationForm();
    setupCheckout();
    updateCartCount();
  
    // Setup cart toggle
    const cartToggle = document.getElementById("cart-toggle");
    if (cartToggle) {
      cartToggle.addEventListener("click", toggleCart);
    }
  
    // Setup cart close
    const cartClose = document.querySelector(".cart-close");
    if (cartClose) {
      cartClose.addEventListener("click", toggleCart);
    }
  });