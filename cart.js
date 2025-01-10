


const addToCart = (mangoId) => {
    const quantity = document.getElementById("quantity").value;

    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
        alert("No cart found. Please Login first.");
        return;
    }

    // Prepare data to be sent to the backend
    const data = {

        quantity: quantity,
        user: localStorage.getItem("user_id"),
        mango: mangoId,
        cart: cartId,
    };

    console.log("Cart Data", data)
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/add_to_cart/product_get/", {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Item added to cart:", data);
            alert("Item added to cart successfully!");
        })
        .catch((error) => {
            console.error("Error adding to cart:", error);
        });
};

const loadCartProduct = () => {
    const cartId = localStorage.getItem("cartId");
    // console.log(cartId);
    if (!cartId) {
        console.log("No cart found. Please create a cart first.");
        return;
    }
    const token = localStorage.getItem("token");

    
    fetch(`http://127.0.0.1:8000/add_to_cart/cart_products/${cartId}/`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((data) => {
            // console.log("Received Cart Data:", data);
            displayCart(data);
        })
        .catch((error) => {
            console.error("Error adding to cart:", error);
        });
};

const displayCart = (items) => {
    // console.log("Cart Items", items);
    const parent = document.getElementById("cart-section");
    parent.innerHTML = `<h2>Your Cart</h2>`;

    if (!items || items.length === 0) {
        parent.innerHTML += "<p>Your cart is empty!</p>";
       
    }
    else{
        parent.innerHTML += `<p>Total Item : ${items.length}</p>`
    }

    items.forEach((item) => {
        console.log("Item", item)
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.id = item.id;


        const totalPrice = (item.mango.price * item.quantity);
        

        div.innerHTML = `
        <div class="cart-item-container">
            <div class="cart-item-image">
                <img src="${item.mango.image}" alt="Mango Image" style="width:100px; height:auto;">
            </div>
            <div class="cart-item-details">
                <h4>Name: ${item.mango.name}</h4>
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" name="quantity" min="1" max="${item.mango?.quantity}" value="1">
            
                <p>Price: $<span id="price-${item.id}">${totalPrice}</span></p>
                <button class="details-btn">
                <a href="mangoDetails.html?mangoId=${item.mango.id}">Details</a>
                </button>
                <button class="buy-now-btn" onclick="buyNow('${item.mango.id}', ${item.mango.price}, ${item.mango.quantity})">Buy Now</button>
                <button class="delete-btn" onclick="deleteCartItem('${item.id}')">Delete</button>
            </div>
        </div>
        `;

        parent.appendChild(div);
    });
};



function deleteCartItem(cartItemId) {
    const url = `http://127.0.0.1:8000/add_to_cart/update-cart-item/${cartItemId}/`;
    const token = localStorage.getItem("token");
    fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const cartItemElement = document.getElementById(cartItemId);
        if (cartItemElement) {
            cartItemElement.remove(); 
        }
       
    })
    .catch(error => {
        console.error('Error deleting cart item:', error);
    });
}



// addToCart();
loadCartProduct();


