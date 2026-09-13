import { useEffect, useState } from 'react'
import './Dashboard.css'
import LanguageSelector from './LanguageSelector.jsx'
import translations from './translations.js'

function Dashboard() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const t =
    translations[language]?.dashboard ||
    translations.en.dashboard

  const common =
    translations[language]?.common ||
    translations.en.common

  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecommendations = async () => {
      const profile = JSON.parse(
        localStorage.getItem('adhikaarBackendProfile')
      )

      if (!profile) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          'http://127.0.0.1:8000/recommend',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(profile)
          }
        )

        if (!response.ok) {
          throw new Error(
            'Failed to load recommendations'
          )
        }

        const data = await response.json()

        const freshRecommendations =
          data.recommendations || []

        setRecommendations(
          freshRecommendations
        )

        localStorage.setItem(
          'adhikaarRecommendations',
          JSON.stringify(data)
        )

      } catch (error) {
        console.error(
          'Failed to load dashboard recommendations:',
          error
        )

        const storedData =
          JSON.parse(
            localStorage.getItem(
              'adhikaarRecommendations'
            )
          ) || {
            recommendations: []
          }

        setRecommendations(
          storedData.recommendations || []
        )

      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  return (
    <div className="dashboard-page">

      <nav
        className="auth-navbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >

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
            {common.logout}
          </a>

        </div>

      </nav>

      <main className="dashboard-container">

        <div className="dashboard-header">

          <div>

            <p className="section-label">
              {t.sectionLabel}
            </p>

            <h1>
              {t.title}
            </h1>

            <p>
              {t.description}
            </p>

          </div>

          <a
            href="/profile"
            className="profile-link"
          >
            {t.viewProfile}
          </a>

        </div>

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <p className="section-label">
                {t.forYou}
              </p>

              <h2>
                {t.benefitsTitle}
              </h2>

            </div>

          </div>

          {loading ? (

            <div className="scheme-card">

              <p>
                {t.loading}
              </p>

            </div>

          ) : recommendations.length === 0 ? (

            <div className="scheme-card">

              <h3>
                {t.noRecommendations}
              </h3>

              <p>
                {t.noRecommendationsText}
              </p>

              <a href="/find-schemes">
                {common.findMySchemes}
              </a>

            </div>

          ) : (

            <div className="scheme-grid">

              {recommendations.map(
                (scheme) => (

                  <div
                    className="scheme-card"
                    key={scheme.scheme_id}
                  >

                    <span className="scheme-category">
                      {scheme.category
                        ? scheme.category.toUpperCase()
                        : 'GENERAL'}
                    </span>

                    <h3>
                      {scheme.scheme_name}
                    </h3>

                    <p>
                      {scheme.benefit?.description ||
                        scheme.eligibility_summary ||
                        'This benefit may be relevant to your profile.'}
                    </p>

                    <a
                      href={`/scheme-details/${scheme.scheme_id}`}
                    >
                      {common.viewDetails}
                    </a>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        <section className="find-section">

          <div>

            <p className="section-label">
              {t.goFurther}
            </p>

            <h2>
              {t.goFurtherTitle}
            </h2>

            <p>
              {t.goFurtherText}
            </p>

          </div>

          <a
            href="/find-schemes"
            className="find-button"
          >
            {common.findMySchemes}
          </a>

        </section>

        <section className="dashboard-tools">

          <a
            href="/rejection-recovery"
            className="tool-card"
          >

            <span>
              01
            </span>

            <h3>
              {t.rejectionRecovery}
            </h3>

            <p>
              {t.rejectionRecoveryText}
            </p>

          </a>

        </section>

      </main>

    </div>
  )
}

export default Dashboard