const loadcartId = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login");
        return;
    }
    fetch(`http://127.0.0.1:8000/add_to_cart/cart_details/${localStorage.getItem("user_id")}/`,{
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            const cartId = data.id;
            localStorage.setItem("cartId", cartId); 
        });
};
loadcartId();

const displayMangosDetails = (mango) => {
    const parent = document.getElementById("mango-details");
    parent.innerHTML = "";  // Clear previous content

    const div = document.createElement("div");
    div.classList.add("mango-detail");

    const closeButton = document.createElement("span");
    closeButton.classList.add("close-btn");
    closeButton.innerHTML = "&times;";
    closeButton.onclick = () => window.history.back();
    parent.appendChild(closeButton);

    div.innerHTML = `
        <img class="mango-img" src="${mango?.image}" />
        <div class="mng-detail">
            <h4>${mango?.name}</h4>
            <h6>Price: $${mango?.price}</h6>
            <h6>Quantity: ${mango?.quantity}</h6>
            <h6>Category: ${mango?.category}</h6>
            <p>${mango?.description}</p>
            
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" min="1" max="${mango?.quantity}" value="1">
            
            <button class="details-btn">
                <a  onclick="addToCart('${mango.id}')">Add To Cart</a>
            </button>
            <button class="buy-now-btn" onclick="buyNow('${mango.id}', ${mango.price}, ${mango.quantity})">Buy Now</button>
        </div>
    `;

    parent.appendChild(div);

    displayComments(mango.id);
     // Display comments for this mango
};

const getparams = () => {
    const param = new URLSearchParams(window.location.search).get("mangoId");
    console.log("Cart Mango Id", param);
    fetch(`http://127.0.0.1:8000/product/mango/${param}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Cart Details Mango", data);
            displayMangosDetails(data);
        });
};

getparams();

const displayComments = (mangoId) => {
    fetch(`http://127.0.0.1:8000/product/comment/comments_by_mango/?mango_id=${mangoId}`)
        .then((res) => res.json())
        .then((data) => {
            const commentsList = document.getElementById("comments-list");
            commentsList.innerHTML = ''; 
            // const username = localStorage.getItem("username")

            data.forEach((comment) => {
                const commentDiv = document.createElement("div");
                commentDiv.classList.add("comment");
                commentDiv.innerHTML = `
                    <p>${comment.body}</p>
                    <small>by ${comment.user} | Rated: ${comment.rating}</small>
                    <hr>
                `;
                commentsList.appendChild(commentDiv);
            });

            // Show the comment form if the user is logged in
            const token = localStorage.getItem("token");
            if (token) {
                document.getElementById("comment-form").style.display = "block";  // Show comment form if token exists
                document.getElementById("comment-login-msg").style.display = "none"; // Hide login message if token exists
            } else {
                document.getElementById("comment-form").style.display = "none";  // Hide comment form if token doesn't exist
                document.getElementById("comment-login-msg").style.display = "block"; // Show login message if token doesn't exist
            }
        });
};

const postComment = () => {
    const param = new URLSearchParams(window.location.search).get("mangoId");
    console.log(param)
    const token = localStorage.getItem("token");
    const commentText = document.getElementById("comment-text").value;
    const rating = document.getElementById("rating").value;  // Assuming a dropdown or a similar input for the rating

    if (!token) {
        alert("You must be logged in to post a comment.");
        return;
    }

    const commentData = {
        body: commentText,
        rating: rating,
        mango: param,  
    };

    console.log(commentData);
    fetch('http://127.0.0.1:8000/product/comment/', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
    })
    .then((response) => response.json())
    .then((data) => {
        
        console.log("Comment posted:", data);
        // commentText.value = "";
        // rating.value = ""; 
        // displayComments(param);  
        location.reload();
        
    })
    .catch((error) => {
        console.error("Error posting comment:", error);
    });
};

