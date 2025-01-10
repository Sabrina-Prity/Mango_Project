
const fetchOrders = () => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/add_to_cart/admin-order/", { 
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        displayOrders(data); 
    })
    .catch(error => {
        console.error("Error fetching orders:", error);
    });
};


const displayOrders = (orders) => {
    console.log("Orders", orders)
    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = ""; // Clear the current list
    orders.forEach(order => {
        console.log("Order Detail",order)
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order-item");

        const price = order.product.price;
        const quantity = order.quantity;
        const total_price = price * quantity;
        // orderDiv.id = `order-${order.id}`;
        orderDiv.innerHTML = `
            <h3>Order ID: ${order.id}</h3>
            <p><strong>Product:</strong> ${order.product.name}</p>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <p><strong>Total Price:</strong> $${total_price}</p>
            <p><strong>Status:</strong> ${order.buying_status}</p>
            <button class="complete" onclick="updateStatus(${order.id}, 'Completed')">Mark as Completed</button>
            <button class="delete" onclick="deleteOrder(${order.id})">Delete Order</button>
        `;
        ordersList.appendChild(orderDiv);
    });
};


const updateStatus = (orderId, status) => {
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/add_to_cart/admin-order-updated/${orderId}/`, { 
        method: "PUT",
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            buying_status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Order status updated successfully.");
        fetchOrders(); 
    })
    .catch(error => {
        console.error("Error updating order:", error);
    });
};



// const deleteOrder = (orderId) => {
//     const token = localStorage.getItem("token");

//     const orderDiv = document.getElementById(`order-${orderId}`);

//     if (confirm("Are you sure you want to delete this order from the page?")) {

//         if (orderDiv) {
//             orderDiv.remove();
//         }
//         alert("Order deleted from the page.");
//     }
// };




const deleteOrder = (orderId) => {
    console.log("Order Id",orderId);
    const token = localStorage.getItem("token");
    if (confirm("Are you sure you want to delete this order?")) {
        fetch(`http://127.0.0.1:8000/add_to_cart/admin-order-updated/${orderId}/`, {  
            method: "DELETE",
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message || "Order deleted successfully.");
            fetchOrders(); 
        })
        .catch(error => {
            console.error("Error deleting order:", error);
        });
    }
};


fetchOrders();
