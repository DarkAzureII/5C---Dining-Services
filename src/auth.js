document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const loginContainer = document.getElementById('login-container');
  const signupContainer = document.getElementById('signup-container');
  const showSignupLink = document.getElementById('show-signup');
  const showLoginLink = document.getElementById('show-login');
  const logoutBtn = document.getElementById('logout'); // Select logout button

  function toggleContainers(showLogin) {
    if (showLogin) {
      loginContainer.style.display = 'block';
      signupContainer.style.display = 'none';
    } else {
      loginContainer.style.display = 'none';
      signupContainer.style.display = 'block';
    }
  }

  loginBtn.addEventListener('click', () => {
    toggleContainers(true);
  });

  signupBtn.addEventListener('click', () => {
    toggleContainers(false);
  });

  showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleContainers(false);
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleContainers(true);
  });

  // Initially hide the containers
  loginContainer.style.display = 'none';
  signupContainer.style.display = 'none';

  // Listen for auth status changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      //window.location.href = 'UserDashboard.html'; // Redirect to UserDashboard.html if logged in
    } 
  });

  // Signup form submission
  const signupForm = document.querySelector('#signup-form');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const confirmPassword = signupForm['signup-confirm-password'].value;

    if (password !== confirmPassword) {
      document.getElementById('signup-error').textContent = 'Passwords do not match.';
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        console.log('User signed up:', cred.user);
        signupForm.reset();
        toggleContainers(true); // Show login form after signup
      })
      .catch((error) => {
        document.getElementById('signup-error').textContent = error.message;
        console.error('Signup error:', error.message);
      });
  });

  // Login form submission
  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password)
      .then((cred) => {
        console.log('User logged in:', cred.user);
        loginForm.reset();
        window.location.href = 'UserDashboard.html'; // Redirect to UserDashboard.html on successful login
      })
      .catch((error) => {
        document.getElementById('login-error').textContent = error.message;
        console.error('Login error:', error.message);
      });
  });

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut()
        .then(() => {
          console.log('User logged out');
          window.location.href = 'index.html'; // Redirect to homepage or login page on logout
        })
        .catch((error) => {
          console.error('Logout error:', error.message);
        });
    });
  }
});
