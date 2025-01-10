const fetchCategory = () => {
    // const token = localStorage.getItem("token"); 
    // if (!token) {
    //     console.error("Token is missing!");
    //     return;
    // }
    console.log("Data")
    fetch('http://127.0.0.1:8000/category/list/', {
        method: 'GET',
        headers: {
            // Authorization: `Token ${token}`, 
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            console.log('Fetch response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); 
        })
        .then((categories) => {
            // console.log('Fetched Categories:', categories);

            const parent = document.getElementById("category"); 
            if (!parent) {
                console.error("Category <select> element not found!");
                return;
            }

            parent.innerHTML = '<option value="" selected disabled>Select Category</option>';
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id; 
                option.textContent = category.name; 
                parent.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error fetching categories:", error);
            document.getElementById("error").textContent = "Failed to load categories.";
        });
};

fetchCategory();



const handleAdd_Mango = (event) => {
    event.preventDefault(); 

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const quantity = document.getElementById("quantity").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const imageInput = document.getElementById("image").files[0];

    if (!name || !price || !quantity || !category || !description) {
        document.getElementById("error").innerText = "All fields are required.";
        return;
    }

    if (!imageInput) {
        document.getElementById("error").innerText = "Please upload an image.";
        return;
    }

    const formData = new FormData();
    formData.append("image", imageInput);

    fetch("https://api.imgbb.com/1/upload?key=13f268ce593eb3a2e14811c1e1de5660", {
        method: "POST",
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.success) {
            const imageUrl = data.data.url;

            const productData = {
                category,
                name,
                price: parseFloat(price),
                quantity: parseInt(quantity, 10),
                description,
                image: imageUrl,
            };

            console.log("Product Data:", productData);
            const token = localStorage.getItem("token");
            fetch("http://127.0.0.1:8000/product/mango/", {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            })
            .then((res) => res.json())
            .then((response) => {
                
                document.getElementById("error").innerText = "Product added successfully!";

                // Reset the form fields
                document.getElementById("name").value = '';
                document.getElementById("price").value = '';
                document.getElementById("quantity").value = '';
                document.getElementById("category").value = '';
                document.getElementById("description").value = '';
                document.getElementById("image").value = '';

                // Reload the page
                setTimeout(() => {
                    window.location.reload();
                }, 100); 
                
            })
            
        } else {
            document.getElementById("error").innerText = "Image upload failed. Please try again.";
        }
    })
    .catch((error) => {
        document.getElementById("error").innerText = "Error during image upload. Please check your connection.";
    });
};






const fetchMango = () => {
    const token = localStorage.getItem("token");
    fetch('http://127.0.0.1:8000/product/mango/', {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((mangos) => {
            const container = document.getElementById("display-all-product");
            container.innerHTML = "<h2>All Mango Items</h2>";

            if (mangos.length === 0) {
                container.innerHTML += "<p>No mango found!</p>";
            } else {
                mangos.forEach((mango) => {
                    const div = document.createElement("div");
                    div.classList.add("mango-item");

                    // Ensure the mango object has the necessary properties
                    div.innerHTML = `
                        <img src="${mango.image}" alt="${mango.name}" />
                        <p>${mango.name}</p>
                        <p>Price: $${mango.price}</p>
                        <p>Quantity: ${mango.quantity}</p>
                        <p>Category: ${mango.category}</p>
                        <button class="delete-btn" onclick="deleteMango(${mango.id})">Delete</button>
                    `;
                    container.appendChild(div);
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById("error").innerText = "Error fetching mango items.";
        });
};


const deleteMango = (id) => {
    const token = localStorage.getItem("token");
    // if (!confirm("Are you sure you want to delete this mango?")) return;

    fetch(`http://127.0.0.1:8000/product/mango/${id}/`, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (response.status === 204) {
                // alert("Mango deleted successfully!");
                fetchMango(); 
            } else {
                alert("Failed to delete mango!");
            }
        })
        .catch((error) => console.error('Error:', error));
};

fetchMango();
