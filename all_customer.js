const handleCustomerList = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to log in to view your account!");
        return;
    }


    fetch('http://127.0.0.1:8000/customer/customer-list/', {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            // console.log("Data", data)
            displayCustomerList(data);
        })
        .catch((err) => {
            console.error(err);
        });
};

const displayCustomerList = (items) => {
    // console.log("Items", items); 
    const parent = document.getElementById("cart-section");
    parent.innerHTML = `<h2 class="title" style="color: #e68551;">Customer List</h2>`;

    if (items.length === 0) {
        parent.innerHTML += "<p>Empty Customer List!</p>";
    } else {
        parent.innerHTML += `<p>Total Customers: ${items.length}</p>`;
    }

    items.forEach((item) => {
        // console.log("Item", item); 

        const div = document.createElement("div");
        div.classList.add("cart-item");
        

        div.innerHTML = `
            <div class="cart-item-container">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="Customer Image" style="width:100px; height:auto;">
                </div>
                <div class="cart-item-details">
                    <h4>Name: ${item.user}</h4>
                    <h6>Mobile: ${item.mobile_no}</h6>
                    <button class="details-btn">
                <a href="#">Details</a>
                
                </button>
                </div>
            </div>
        `;

        parent.appendChild(div);
    });
};

// const handleSearch = (event) =>{
//     event.preventDefault();
//     const value = document.getElementById("customer-search").value;
//     console.log(value);
//     handleCustomerList(value);
// }


handleCustomerList();

// {/* <a href="customerDetails.html?customerId=${item.id}">Details</a> */}
// <button class="delete-btn" onclick="deleteCustomer('${item.id}')">Delete</button>


// function deleteCustomer(id) {
//     const url = `http://127.0.0.1:8000/customer/customer-detail/${id}/`;

//     fetch(url, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     })
//     .then(response => response.json())
//     .then(data => {

//         const customer = document.getElementById(id);
//         if (customer) {
//             customer.remove(); 
//         }
        
//     })
//     .catch(error => {
//         console.error('Error deleting cart item:', error);
//     });
// }



