import './App.css'
import LanguageSelector from './LanguageSelector.jsx'
import translations from './translations.js'

function App() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const t =
    translations[language]?.app ||
    translations.en.app

  const common =
    translations[language]?.common ||
    translations.en.common

  return (
    <div className="landing-page">

      <nav className="navbar">

        <div className="logo">
          ADHIKAAR
        </div>

        <div className="nav-links">
          <a href="#about">
            {language === 'en'
              ? 'About'
              : language === 'hi'
                ? 'हमारे बारे में'
                : 'আমাদের সম্পর্কে'}
          </a>

          <a href="#features">
            {language === 'en'
              ? 'Features'
              : language === 'hi'
                ? 'विशेषताएँ'
                : 'বৈশিষ্ট্য'}
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
        >

          <LanguageSelector />

          <a
            href="/login"
            className="nav-button"
          >
            {t.loginSignup}
          </a>

        </div>

      </nav>


      <main>

        <section className="hero">

          <div className="hero-content">

            <p className="eyebrow">
              {t.eyebrow}
            </p>

            <h1>
              {t.heroTitle
                .split('|')
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    {index === 0 && <br />}
                  </span>
                ))}
            </h1>

            <p className="hero-description">
              {t.heroDescription}
            </p>

            <div className="hero-buttons">

              <a
                href="#how-it-works"
                className="secondary-button"
              >
                {t.howItWorks}
              </a>

            </div>

          </div>

        </section>


        <section
          id="about"
          className="about"
        >

          <p className="section-label">
            {t.whyAdhikaar}
          </p>

          <h2>
            {t.aboutTitle}
          </h2>

          <p>
            {t.aboutText}
          </p>

        </section>


        <section
          id="how-it-works"
          className="journey"
        >

          <p className="section-label">
            {t.howItWorksLabel}
          </p>

          <h2>
            {t.howItWorksTitle}
          </h2>

          <div className="journey-grid">

            <div className="journey-card">
              <span>01</span>
              <h3>{t.discover}</h3>
              <p>{t.discoverText}</p>
            </div>

            <div className="journey-card">
              <span>02</span>
              <h3>{t.understand}</h3>
              <p>{t.understandText}</p>
            </div>

            <div className="journey-card">
              <span>03</span>
              <h3>{t.prepare}</h3>
              <p>{t.prepareText}</p>
            </div>

            <div className="journey-card">
              <span>04</span>
              <h3>{t.act}</h3>
              <p>{t.actText}</p>
            </div>

            <div className="journey-card">
              <span>05</span>
              <h3>{t.recover}</h3>
              <p>{t.recoverText}</p>
            </div>

          </div>

        </section>


        <section
          id="features"
          className="features"
        >

          <p className="section-label">
            {t.featuresLabel}
          </p>

          <h2>
            {t.featuresTitle}
          </h2>

          <div className="feature-grid">

            <div className="feature-card">

              <h3>
                {t.personalizedDiscovery}
              </h3>

              <p>
                {t.personalizedDiscoveryText}
              </p>

            </div>

            <div className="feature-card">

              <h3>
                {t.benefitsGapAnalysis}
              </h3>

              <p>
                {t.benefitsGapAnalysisText}
              </p>

            </div>

            <div className="feature-card">

              <h3>
                {t.explainableEligibility}
              </h3>

              <p>
                {t.explainableEligibilityText}
              </p>

            </div>

            <div className="feature-card">

              <h3>
                {t.adaptiveQuestions}
              </h3>

              <p>
                {t.adaptiveQuestionsText}
              </p>

            </div>

          </div>

        </section>


        <section className="final-cta">

          <h2>
            {t.finalTitle}
          </h2>

          <p>
            {t.finalText}
          </p>

          <a
            href="/login"
            className="primary-button"
          >
            {common.getStarted}
          </a>

        </section>

      </main>

    </div>
  )
}

export default App