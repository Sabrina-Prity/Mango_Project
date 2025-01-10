const handleAddCategory = (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    console.log(name)
    fetch('http://127.0.0.1:8000/category/list/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Category Data",data)
            if (data.id) {
                console.log("Category id",data.id)
                alert("Category added successfully!");
                fetchCategories(); 
            } else {
                document.getElementById("error").innerText = "Failed to add category!";
            }
        })
        .catch((error) => console.error('Error:', error));
};


const fetchCategories = () => {
    fetch('http://127.0.0.1:8000/category/list/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((categories) => {
            const container = document.getElementById("display-all-category");
            container.innerHTML = "<h2>All Categories</h2>";

            if (categories.length === 0) {
                container.innerHTML += "<p>No categories found!</p>";
            } else {
                categories.forEach((category) => {
                    const div = document.createElement("div");
                    div.classList.add("category-item");
                    div.innerHTML = `
                        <p>${category.name}</p>
                        <button class="delete-btn" onclick="deleteCategory(${category.id})">Delete</button>
                    `;
                    container.appendChild(div);
                });
            }
        })
        .catch((error) => console.error('Error:', error));
};


const deleteCategory = (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    fetch(`http://127.0.0.1:8000/category/list/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (response.status === 204) {
                alert("Category deleted successfully!");
                fetchCategories(); 
            } else {
                alert("Failed to delete category!");
            }
        })
        .catch((error) => console.error('Error:', error));
};


fetchCategories();

