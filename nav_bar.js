fetch("nav_bar.html")
  .then((res) => res.text())
  .then((data) => {
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = data;

    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    const isAdmin = localStorage.getItem("is_admin") === 'true';  

    const userContainer = document.getElementById("user-container");

    if (token) {
      userContainer.innerHTML = `
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="index.html">Home</a></li>
        <li class="nav-item" id="profile-item"><a class="nav-link" href="profile.html">Profile</a></li>
        <li class="nav-item" id="logout-item"><a href="#" onclick="handlelogOut()" class="nav-link">Logout</a></li>
        <li class="nav-item btn-cart" id="logout-item"><a href="cart.html" class="nav-link">Cart <i class="fa-solid fa-cart-shopping text-white"></i></a></li>
      `;
      
      if (isAdmin) {
        userContainer.innerHTML += `
          <li class="nav-item"><a class="nav-link" href="add_Mango.html">Product</a></li>
          <li class="nav-item"><a class="nav-link" href="comments.html">Comments</a></li>
          <li class="nav-item"><a class="nav-link" href="all_customer.html">Customers</a></li>
          <li class="nav-item"><a class="nav-link" href="orders.html">Orders</a></li>
          <li class="nav-item"><a class="nav-link" href="add_category.html">Category</a></li>
        `;
      }
    } else {
      userContainer.innerHTML = `
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="index.html">Home</a></li>
        <li class="nav-item" id="login-item"><a class="nav-link" href="login.html">Login</a></li>
        <li class="nav-item" id="register-item"><a class="nav-link" href="registration.html">Register</a></li>
      `;
    }

    userContainer.style.display = "flex";
    userContainer.style.gap = "15px";
    userContainer.style.alignItems = "center";
  })
  .catch((err) => {
    console.error("Error loading navbar:", err);
  });
