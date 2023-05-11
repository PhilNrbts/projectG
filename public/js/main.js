function displayUserInformation(user) {
    const infoDisplayWrapper = document.getElementById('info-display-wrapper');
    const buttonWrapper = document.querySelector('.button-wrapper');

    infoDisplayWrapper.innerHTML = `
      <h1>User Information</h1>
      <p>Username: ${user.username}</p>
      <p>Email: ${user.email}</p>
      <p>Overall Rounds Played: ${user.overallRoundsPlayed}</p>
      <p>Overall Average Reaction Time: ${user.overallAverageReactionTime}</p>
      <p>Overall Average Reaction Time (correct answers): ${user.overallAverageReactionTimeRight}</p>
      <p>Overall Average Mistakes: ${user.overallAverageMistakes}</p>
      <p>Overall Rounds Won: ${user.overallRoundsWon}</p>
      <p>Overall Average Place: ${user.overallAveragePlace}</p>
    `;

    buttonWrapper.innerHTML = `
    <button class="option-button" id="createGame">Create Game</button>
    <button class="option-button" id="logout">Logout</button>
    `;

    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', () => {
             // Clear the token and user information
             localStorage.removeItem('token');
             showLoginForm();
    });

    // Add an event listener for the "Create Game" button
    const createGameButton = document.getElementById('createGame');
    createGameButton.addEventListener('click', () => {
             // Your logic for creating a game goes here
    });
}

function showLoginForm() {
    const infoDisplayWrapper = document.getElementById('info-display-wrapper');
    infoDisplayWrapper.innerHTML = `
      <h1>Login</h1>
      <form id="login-form">
        <label for="usernameOrEmail">Username or Email:</label>
        <input type="text" name="usernameOrEmail" id="usernameOrEmail" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" required>
        <br>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <button onclick="showRegisterForm()">Register</button></p>
    `;
    const buttonWrapper = document.querySelector('.button-wrapper');
    buttonWrapper.innerHTML = `
      <button class="option-button" onclick="showLoginForm()">Login</button>
      <button class="option-button" onclick="showRegisterForm()">Register</button>
    `;

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
             event.preventDefault();
             const usernameOrEmail = document.getElementById('usernameOrEmail').value;
             const password = document.getElementById('password').value;

             try {
                      const response = await fetch('/api/users/login', {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify({ usernameOrEmail, password }),
                      });

                      if (response.ok) {
                               const data = await response.json();
                               const token = data.token;

                               // Fetch user information
                               const userResponse = await fetch('/api/users/profile', {
                                        headers: { 'Authorization': `Bearer ${token}` },
                               });

                               const userData = await userResponse.json();
                               const user = userData.user;

                               // Display user information
                               displayUserInformation(user);
                      } else {
                               const errorMessage = document.createElement('div');
                               errorMessage.style.color = 'red';
                               errorMessage.textContent = 'Invalid username/email or password';
                               loginForm.parentNode.insertBefore(errorMessage, loginForm);
                      }
             } catch (error) {
                      console.error('Error:', error);
             }
    });
}

function showRegisterForm() {
    const infoDisplayWrapper = document.getElementById('info-display-wrapper');
    infoDisplayWrapper.innerHTML = `
        <h1>Register</h1>
        <form id="register-form">
            <label for="username">Username:</label>
            <input type="text" name="username" id="username" required>
            <br>
            <label for="email">Email:</label>
            <input type="email" name="email" id="email" required>
            <br>
            <label for="password">Password:</label>
            <input type="password" name="password" id="password" required>
            <br>
            <button type="submit">Register</button>
        </form>
        <p>Already have an account? <button onclick="showLoginForm()">Login</button></p>
    `;
    const buttonWrapper = document.querySelector('.button-wrapper');
    buttonWrapper.innerHTML = `
<button class="option-button" onclick="showLoginForm()">Login</button>
<button class="option-button" onclick="showRegisterForm()">Register</button>
`;
    const registerForm = document.getElementById('register-form');
    // For the registration form
    registerForm.addEventListener('submit', async (event) => {
             event.preventDefault();
             const username = document.getElementById('username').value;
             const email = document.getElementById('email').value;
             const password = document.getElementById('password').value;

             try {
                      const response = await fetch('/api/users/register', {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify({ username, email, password }),
                      });

                      if (response.ok) {
                               const data = await response.json();
                               // Handle successful registration (e.g., store user data, redirect, etc.)

                               // Show the login form and display a success message
                               showLoginForm();
                               const successMessage = document.createElement('div');
                               successMessage.style.color = 'green';
                               successMessage.textContent = 'Account successfully created';
                               const loginForm = document.getElementById('login-form');
                               loginForm.parentNode.insertBefore(successMessage, loginForm);
                      } else {
                               // Handle unsuccessful registration (e.g., show error message)
                               const errorMessage = await response.text();
                               alert('Error: ' + errorMessage);
                      }
             } catch (error) {
                      // Handle network errors
                      console.error('Error:', error);
             }
    });
}