document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission behavior (which blocks the page from refreshing after submitting the form)

        const data = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // this sets the requests header to indicate that the payload is a JSON object
                body: JSON.stringify(data) // this converts the data object into a JSON object to be sent
            });

            if (response.ok) {
                alert('Login successful!');
                window.location.href = '/store'; // Redirect to store page
            } else {
                const result = await response.json();
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while logging in. Please try again.');
        }
    });
});
