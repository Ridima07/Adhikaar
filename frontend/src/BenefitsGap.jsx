import { useEffect, useState } from 'react'
import './BenefitsGap.css'
import LanguageSelector from './LanguageSelector.jsx'
import translations from './translations.js'

function BenefitsGap() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const t =
    translations[language]?.benefitsGap ||
    translations.en.benefitsGap

  const common =
    translations[language]?.common ||
    translations.en.common

  const [benefitGaps, setBenefitGaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBenefitGaps = async () => {
      const profile = JSON.parse(
        localStorage.getItem('adhikaarBackendProfile')
      )

      if (!profile) {
        setError(
          'Profile information not found.'
        )
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          'http://127.0.0.1:8000/benefit-gaps?top_k=5',
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
            `Benefit gap analysis failed (${response.status})`
          )
        }

        const data = await response.json()

        setBenefitGaps(
          data.benefit_gaps || []
        )
      } catch (error) {
        console.error(error)

        setError(
          'Could not load benefit gap analysis. Make sure the latest backend is running.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadBenefitGaps()
  }, [])

  const formatField = (field) => {
    return field
      .replace(/_/g, ' ')
      .replace(
        /\b\w/g,
        (letter) => letter.toUpperCase()
      )
  }

  return (
    <div className="benefits-gap-page">

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
            href="/results"
            className="back-link"
          >
            {common.backToResults}
          </a>

        </div>

      </nav>

      <main className="benefits-gap-container">

        <div className="benefits-gap-header">

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

        {loading ? (

          <section className="category-section">

            <div className="section-heading">

              <p className="section-label">
                {t.analysing}
              </p>

              <h2>
                {t.analysingTitle}
              </h2>

            </div>

            <div className="category-card">

              <p>
                {t.analysingText}
              </p>

            </div>

          </section>

        ) : error ? (

          <section className="category-section">

            <div className="section-heading">

              <p className="section-label">
                {t.errorLabel}
              </p>

              <h2>
                {t.errorTitle}
              </h2>

              <p>
                {error}
              </p>

            </div>

          </section>

        ) : benefitGaps.length === 0 ? (

          <section className="category-section">

            <div className="section-heading">

              <p className="section-label">
                {t.noGapsLabel}
              </p>

              <h2>
                {t.noGapsTitle}
              </h2>

            </div>

            <div className="category-card">

              <h3>
                {t.noGapsCardTitle}
              </h3>

              <p>
                {t.noGapsText}
              </p>

              <a href="/find-schemes">
                {common.findMySchemes}
              </a>

            </div>

          </section>

        ) : (

          <section className="category-section">

            <div className="section-heading">

              <p className="section-label">
                {t.opportunitiesLabel}
              </p>

              <h2>
                {t.opportunitiesTitle}
              </h2>

            </div>

            <div className="category-grid">

              {benefitGaps.map(
                (gap, index) => (

                  <div
                    className="category-card"
                    key={gap.scheme_id}
                  >

                    <span className="category-number">
                      {String(
                        index + 1
                      ).padStart(2, '0')}
                    </span>

                    <p className="section-label">
                      {gap.category || 'OTHER'}
                    </p>

                    <h3>
                      {gap.scheme_name}
                    </h3>

                    <p className="gap-match">

                      <strong>
                        {gap.proximity_percentage}%
                      </strong>

                      <span>
                        {' '}{t.profileMatch}
                      </span>

                    </p>

                    <div className="category-schemes">

                      <div className="gap-blocker-section">

                        <p className="gap-blocker-title">
                          {t.whatsStoppingYou}
                        </p>

                        {gap.blockers?.map(
                          (blocker) => (

                            <div
                              className="gap-blocker"
                              key={blocker.field}
                            >

                              <p className="gap-blocker-field">
                                {formatField(
                                  blocker.field
                                )}
                              </p>

                              {blocker.requirement && (
                                <p className="gap-requirement">

                                  <strong>
                                    {t.requirement}
                                  </strong>{' '}

                                  {blocker.requirement}

                                </p>
                              )}

                              <p className="gap-unlock">
                                {blocker.unlock_explanation}
                              </p>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                    <a
                      href={`/scheme-details/${gap.scheme_id}`}
                    >
                      {common.viewSchemeDetails}
                    </a>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        <section className="gap-note">

          <p className="section-label">
            {t.whatThisMeans}
          </p>

          <h2>
            {t.whatThisMeansTitle}
          </h2>

          <p>
            {t.whatThisMeansText}
          </p>

        </section>

        <div className="benefits-gap-actions">

          <a
            href="/results"
            className="back-button"
          >
            {common.backToResults}
          </a>

          <a
            href="/dashboard"
            className="continue-button"
          >
            {common.backToDashboard}
          </a>

        </div>

      </main>

    </div>
  )
}

export default BenefitsGap