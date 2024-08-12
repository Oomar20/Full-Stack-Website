document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('account-form');
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const genderSelect = document.getElementById('gender');
    const ageInput = document.getElementById('age');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const messages = validateForm(emailInput, nameInput, surnameInput, genderSelect, ageInput);

        if (messages.length > 0) {
            alert(messages.join('\n'));
            return;
        }

        const data = getFormData(form);

        try {
            const response = await fetch('/account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Account updated successfully');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('An error occurred while updating the account');
            console.log(error)
        }
    });

    function validateForm(emailInput, nameInput, surnameInput, genderSelect, ageInput) {
        const messages = [];

        // Email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailInput.value)) {
            messages.push('Please enter a valid email address.');
        }

        // Name validation
        if (nameInput.value.trim() === '') {
            messages.push('Name cannot be empty.');
        }

        // Surname validation
        if (surnameInput.value.trim() === '') {
            messages.push('Surname cannot be empty.');
        }

        // Gender validation
        if (!['Male', 'Female'].includes(genderSelect.value)) {
            messages.push('Please select a valid gender.');
        }

        // Age validation
        const age = parseInt(ageInput.value, 10);
        if (isNaN(age) || age < 0 || age > 99) {
            messages.push('Please enter a valid age.');
        }

        return messages;
    }

    function getFormData(form) {
        const formData = new FormData(form);
        return Object.fromEntries(formData.entries());
    }
});