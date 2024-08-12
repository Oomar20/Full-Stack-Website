document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        gender: document.getElementById('gender').value,
        age: document.getElementById('age').value,
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            alert(`Error: ${result.message}`);
        } else {
            alert('User registered successfully!');
            this.reset();
        }
    } catch (error) {
        alert('An error occurred while registering. Please try again.');
        console.log(error);
    }
});
