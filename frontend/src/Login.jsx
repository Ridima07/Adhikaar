import './Login.css'

function Login() {
    const demoEmail = 'demo@adhikaar.in'
    const demoPassword = 'adhikaar123'

    const handleLogin = (event) => {
  event.preventDefault()

  const email = event.target.email.value
  const password = event.target.password.value

  if (email === demoEmail && password === demoPassword) {
    window.location.href = '/profile'
  } else {
    alert('Invalid email or password')
  }
}

  return (
    <div className="auth-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a href="/" className="back-link">
          ← Back to home
        </a>
      </nav>


      <main className="auth-container">

        <div className="auth-box">

          <p className="section-label">WELCOME BACK</p>

          <h1>Login to Adhikaar.</h1>

          <p className="auth-description">
            Access your profile and discover benefits relevant to you.
          </p>


          <form className="auth-form" onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email address</label>
              <input
  type="email"
  name="email"
  placeholder="Enter your email"
/>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
  type="password"
  name="password"
  placeholder="Enter your password"
/>
            </div>

            <button type="submit" className="auth-button">
              Login
            </button>

          </form>


          <div className="auth-divider">
            <span>or</span>
          </div>


          <p className="signup-text">
            Don't have an account?{' '}
            <a href="/signup">Create one</a>
          </p>

        </div>

      </main>

    </div>
  )
}

export default Login