const buyNow = (mangoId, price, maxQuantity) => {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please Login first.");
        return;
    }
    const quantity = document.getElementById("quantity").value;

    console.log(mangoId,price,quantity)

    if (quantity < 1 || quantity > maxQuantity) {
        alert(`Please enter a valid quantity (1-${maxQuantity}).`);
        return;
    }
    const user_id = localStorage.getItem("user_id")
    console.log("User Id:", user_id);
    // total_price: price * quantity, 

    const orderData = {
        quantity: quantity,
        buying_status: "Pending",
        user : user_id,
        product: mangoId,
       
    };
    // console.log(orderData)
    fetch("http://127.0.0.1:8000/add_to_cart/orders-view/",{
        method: "POST",
        headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
        },
        body : JSON.stringify(orderData)
    })
    .then((res)=> res.json())
    .then((data)=> 
    {
        alert("Successfully buy the product...")
        console.log("SUccess",data)

    }
)
    
};

const displayOrderHistory = () => {
    const token = localStorage.getItem("token");
    console.log("Token", token);
    const id = localStorage.getItem("user_id");
    fetch(`http://127.0.0.1:8000/add_to_cart/orders-view/?user_id=${id}`, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
            },
    })
        .then((response) => response.json())
        .then((orders) => {
            console.log(orders);
            const orderHistoryContainer = document.getElementById("order-history");
            orderHistoryContainer.innerHTML = "";

            if (orders.length === 0) {
                orderHistoryContainer.innerHTML = "<p>No orders found.</p>";
            } else {
                const table = document.createElement("table");
                table.classList.add("order-history-table");

                const header = document.createElement("thead");
                header.innerHTML = `
                    <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                `;
                table.appendChild(header);

                const tbody = document.createElement("tbody");
                orders.forEach((order) => {
                    const productName = `Product ID ${order.product}`;
                    const price = order.product.price;
                    const quantity = order.quantity;
                    const total_price = price * quantity;
                    const orderRow = document.createElement("tr");
                    orderRow.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.product.name}</td>
                        <td>${order.quantity}</td>
                        <td>$${total_price.toFixed(2)}</td>
                        <td>${order.buying_status}</td>
                        <td>
                            <button class="delete-button" onclick="deleteOrder(${order.id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(orderRow);
                });

                table.appendChild(tbody);
                orderHistoryContainer.appendChild(table);
            }
        })
        .catch((error) => {
            console.error("Error fetching orders:", error);
        });
};

const deleteOrder = (orderId) => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    fetch(`http://127.0.0.1:8000/add_to_cart/specific-order/${orderId}/?user_id=${user_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
            },
    })
        .then((response) => {
            if (response.ok) {
                alert("Order deleted successfully!");
                displayOrderHistory(); 
            } else {
                alert("Failed to delete the order.");
            }
        })
        .catch((error) => {
            console.error("Error deleting order:", error);
        });
};

displayOrderHistory();
