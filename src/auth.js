document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const loginContainer = document.getElementById('login-container');
  const signupContainer = document.getElementById('signup-container');
  const showSignupLink = document.getElementById('show-signup');
  const showLoginLink = document.getElementById('show-login');
  const logoutBtn = document.getElementById('logout');
  const googleSignInBtn = document.getElementById('google-signin-btn'); // Select Google Sign-In button

  // Function to toggle containers
  function toggleContainers(container) {
    if (container.style.display === 'block') {
      container.style.display = 'none';
    } else {
      loginContainer.style.display = 'none';
      signupContainer.style.display = 'none';
      container.style.display = 'block';
    }
  }

  loginBtn.addEventListener('click', () => {
    toggleContainers(loginContainer);
  });

  signupBtn.addEventListener('click', () => {
    toggleContainers(signupContainer);
  });

  showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleContainers(signupContainer);
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleContainers(loginContainer);
  });

  loginContainer.style.display = 'none';
  signupContainer.style.display = 'none';

  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      console.log('Logged in user provider:', user.providerData[0].providerId); // To check login type
    }
  });

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
        toggleContainers(loginContainer);
      })
      .catch((error) => {
        document.getElementById('signup-error').textContent = error.message;
      });
  });

  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password)
      .then((cred) => {
        console.log('User logged in:', cred.user);
        loginForm.reset();
        window.location.href = 'UserDashboard.html';
      })
      .catch((error) => {
        document.getElementById('login-error').textContent = error.message;
      });
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const user = auth.currentUser;
      if (user) {
        const providerId = user.providerData[0].providerId;

        if (providerId === 'google.com') {
          console.log('Logging out from Google account');
        } else if (providerId === 'password') {
          console.log('Logging out from email-password account');
        }

        auth.signOut()
          .then(() => {
            console.log('User logged out');
            window.location.href = 'index.html';
          })
          .catch((error) => {
            console.error('Logout error:', error.message);
          });
      }
    });
  }

  // Google Sign-In button click event
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      googleSignIn();
    });
  }
});
