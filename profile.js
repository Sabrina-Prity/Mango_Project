const fetchCustomerDetails = async () => {
  const username = localStorage.getItem('username'); // Fetch username from localStorage
  const token = localStorage.getItem('token'); // Fetch token from localStorage

  try {
    const response = await fetch(`http://127.0.0.1:8000/customer/customer-detail/${username}/`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const customer = await response.json();

      const customerDetailsDiv = document.getElementById('customer-details');
      customerDetailsDiv.innerHTML = `
        <div class="customer-card">
          <img src="${customer.image}" alt="Customer Image" class="customer-image">
          <h2>Customer Details</h2>
          <p><strong>Username:</strong> ${customer.user}</p>
          <p><strong>Mobile Number:</strong> ${customer.mobile_no}</p>
        </div>
      `;
    } else {
      const errorData = await response.json(); // Parse the error response
      alert(`Error: ${errorData.detail || 'Customer not found'}`);
    }
  } catch (error) {
    console.error('Error fetching customer details:', error);
    alert('Error fetching customer details. Please try again later.');
  }
};

fetchCustomerDetails();
