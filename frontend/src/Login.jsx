import './Login.css'
import LanguageSelector from './LanguageSelector.jsx'

function Login() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const content = {
    en: {
      label: 'WELCOME BACK',
      title: 'Login to Adhikaar.',
      description:
        'Access your profile and discover benefits relevant to you.',
      email: 'Email address',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      login: 'Login',
      or: 'or',
      noAccount: "Don't have an account?",
      createAccount: 'Create one',
      back: '← Back to home',
      invalid: 'Invalid email or password'
    },

    hi: {
      label: 'वापसी पर स्वागत है',
      title: 'अधिकार में लॉग इन करें।',
      description:
        'अपनी प्रोफ़ाइल खोलें और अपने लिए प्रासंगिक लाभ खोजें।',
      email: 'ईमेल पता',
      emailPlaceholder: 'अपना ईमेल दर्ज करें',
      password: 'पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      login: 'लॉग इन',
      or: 'या',
      noAccount: 'क्या आपका खाता नहीं है?',
      createAccount: 'खाता बनाएँ',
      back: '← होम पर वापस जाएँ',
      invalid: 'ईमेल या पासवर्ड गलत है'
    },

    bn: {
      label: 'আবার স্বাগতম',
      title: 'অধিকারে লগ ইন করুন।',
      description:
        'আপনার প্রোফাইলে প্রবেশ করুন এবং আপনার জন্য প্রাসঙ্গিক সুবিধা খুঁজুন।',
      email: 'ইমেল ঠিকানা',
      emailPlaceholder: 'আপনার ইমেল লিখুন',
      password: 'পাসওয়ার্ড',
      passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন',
      login: 'লগ ইন',
      or: 'অথবা',
      noAccount: 'আপনার কি অ্যাকাউন্ট নেই?',
      createAccount: 'অ্যাকাউন্ট তৈরি করুন',
      back: '← হোমে ফিরে যান',
      invalid: 'ইমেল বা পাসওয়ার্ড ভুল'
    }
  }

  const t =
    content[language] ||
    content.en

  const demoEmail = 'demo@adhikaar.in'
  const demoPassword = 'adhikaar123'

  const handleLogin = (event) => {
    event.preventDefault()

    const email = event.target.email.value
    const password = event.target.password.value

    if (
      email === demoEmail &&
      password === demoPassword
    ) {
      window.location.href = '/profile'
    } else {
      alert(t.invalid)
    }
  }

  return (
    <div className="auth-page">

      <nav className="auth-navbar">

        <div className="logo">
          ADHIKAAR
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}
        >

          <LanguageSelector />

          <a
            href="/"
            className="back-link"
          >
            {t.back}
          </a>

        </div>

      </nav>

      <main className="auth-container">

        <div className="auth-box">

          <p className="section-label">
            {t.label}
          </p>

          <h1>
            {t.title}
          </h1>

          <p className="auth-description">
            {t.description}
          </p>

          <form
            className="auth-form"
            onSubmit={handleLogin}
          >

            <div className="form-group">

              <label>
                {t.email}
              </label>

              <input
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
              />

            </div>

            <div className="form-group">

              <label>
                {t.password}
              </label>

              <input
                type="password"
                name="password"
                placeholder={t.passwordPlaceholder}
              />

            </div>

            <button
              type="submit"
              className="auth-button"
            >
              {t.login}
            </button>

          </form>

          <div className="auth-divider">
            <span>
              {t.or}
            </span>
          </div>

          <p className="signup-text">
            {t.noAccount}{' '}
            <a href="/signup">
              {t.createAccount}
            </a>
          </p>

        </div>

      </main>

    </div>
  )
}

export default Login