import './App.css'

function App() {
  return (
    <div className="landing-page">

      <nav className="navbar">
        <div className="logo">ADHIKAAR</div>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
        </div>

        <a href="/login" className="nav-button">
  Login / Sign Up
</a>
      </nav>


      <main>

        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">YOUR BENEFITS. YOUR RIGHTS. YOUR ADHIKAAR.</p>

            <h1>
              Government benefits,
              <br />
              made accessible.
            </h1>

            <p className="hero-description">
              Discover benefits relevant to you, understand your eligibility,
              and know exactly what to do next.
            </p>

            <div className="hero-buttons">
  <a href="#how-it-works" className="secondary-button">
    How it works ↓
  </a>
</div>
          </div>
        </section>


        <section id="about" className="about">
          <p className="section-label">WHY ADHIKAAR?</p>

          <h2>
            Finding a scheme is only the beginning.
          </h2>

          <p>
            Government benefits can be difficult to discover, understand,
            prepare for, and access. Adhikaar helps you navigate the entire
            journey — from finding relevant benefits to knowing what to do next.
          </p>
        </section>


        <section id="how-it-works" className="journey">
          <p className="section-label">HOW IT WORKS</p>

          <h2>From discovery to access.</h2>

          <div className="journey-grid">

            <div className="journey-card">
              <span>01</span>
              <h3>Discover</h3>
              <p>Find benefits relevant to your profile.</p>
            </div>

            <div className="journey-card">
              <span>02</span>
              <h3>Understand</h3>
              <p>See why you may qualify and what is still required.</p>
            </div>

            <div className="journey-card">
              <span>03</span>
              <h3>Prepare</h3>
              <p>Know which documents and requirements you need.</p>
            </div>

            <div className="journey-card">
              <span>04</span>
              <h3>Act</h3>
              <p>Get clear guidance on how and where to apply.</p>
            </div>

            <div className="journey-card">
              <span>05</span>
              <h3>Recover</h3>
              <p>Understand what to do if your application is rejected.</p>
            </div>

          </div>
        </section>


        <section id="features" className="features">
          <p className="section-label">WHAT MAKES ADHIKAAR DIFFERENT?</p>

          <h2>More than a scheme directory.</h2>

          <div className="feature-grid">

            <div className="feature-card">
              <h3>Personalized Discovery</h3>
              <p>
                Find potentially relevant benefits based on your profile,
                even if you didn't know to search for them.
              </p>
            </div>

            <div className="feature-card">
              <h3>Benefits Gap Analysis</h3>
              <p>
                Discover benefits across categories that you may not have
                considered.
              </p>
            </div>

            <div className="feature-card">
              <h3>Explainable Eligibility</h3>
              <p>
                Understand which eligibility criteria you satisfy and
                which requirements still need attention.
              </p>
            </div>

            <div className="feature-card">
              <h3>Adaptive Questions</h3>
              <p>
                Answer only the additional questions needed to determine
                your eligibility.
              </p>
            </div>

          </div>
        </section>


        <section className="final-cta">
          <h2>
            The right benefits are out there.
          </h2>

          <p>Let's find yours.</p>

          <button className="primary-button">Get Started</button>
        </section>

      </main>

    </div>
  )
}

export default App