import { useEffect, useState } from 'react'
import './SchemeDetails.css'

function SchemeDetails() {
  const schemeId = window.location.pathname.split('/').pop()

  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/scheme/${schemeId}`
        )

        if (!response.ok) {
          throw new Error('Could not fetch scheme details')
        }

        const data = await response.json()

        setScheme(data)
      } catch (error) {
        console.error(error)
        setError('Could not load this scheme.')
      } finally {
        setLoading(false)
      }
    }

    fetchScheme()
  }, [schemeId])

  if (loading) {
    return (
      <div className="scheme-details-page">
        <nav className="auth-navbar">
          <div className="logo">ADHIKAAR</div>

          <a href="/results" className="back-link">
            ← Back to results
          </a>
        </nav>

        <main className="scheme-details-container">
          <p>Loading scheme details...</p>
        </main>
      </div>
    )
  }

  if (error || !scheme) {
    return (
      <div className="scheme-details-page">
        <nav className="auth-navbar">
          <div className="logo">ADHIKAAR</div>

          <a href="/results" className="back-link">
            ← Back to results
          </a>
        </nav>

        <main className="scheme-details-container">
          <h1>Unable to load scheme.</h1>

          <p>
            We couldn't retrieve the details for this benefit.
          </p>

          <a href="/results" className="application-button">
            ← Back to results
          </a>
        </main>
      </div>
    )
  }

  return (
    <div className="scheme-details-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a href="/results" className="back-link">
          ← Back to results
        </a>
      </nav>


      <main className="scheme-details-container">

        <div className="scheme-details-header">

          <span className="scheme-category">
            {scheme.category
              ? scheme.category.toUpperCase()
              : 'GENERAL'}
          </span>

          <h1>{scheme.scheme_name}</h1>

          <p>
            {scheme.benefit?.description ||
              'Details about this government benefit.'}
          </p>

        </div>


        <section className="scheme-status">

          <div>

            <span className="status-label">
              YOUR STATUS
            </span>

            <h2>
              {scheme.manual_verification_required
                ? 'Needs verification'
                : 'Potentially eligible'}
            </h2>

          </div>

          <p>
            {scheme.manual_verification_reason ||
              'Your profile matches some of the eligibility criteria. Final eligibility should be verified with the official scheme authority.'}
          </p>

        </section>


        <div className="scheme-content">

          <section className="details-section">

            <p className="section-label">
              BENEFIT
            </p>

            <h2>
              What this benefit provides
            </h2>

            <p>
              {scheme.benefit?.description ||
                'Benefit information is available through the official scheme source.'}
            </p>

          </section>


          <section className="details-section">

            <p className="section-label">
              ELIGIBILITY
            </p>

            <h2>
              What you need to know
            </h2>

            {scheme.eligibility &&
            Object.keys(scheme.eligibility).length > 0 ? (

              <div className="criteria-list">

                {Object.entries(scheme.eligibility).map(
                  ([key, value]) => (

                    <div
                      className="criteria-item"
                      key={key}
                    >

                      <div>

                        <strong>
                          {key
                            .replaceAll('_', ' ')
                            .replace(/\b\w/g, (letter) =>
                              letter.toUpperCase()
                            )}
                        </strong>

                        <p>
                          {Array.isArray(value)
                            ? value.join(', ')
                            : String(value)}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p>
                Detailed eligibility information should be
                verified through the official scheme source.
              </p>

            )}

          </section>


          {scheme.additional_conditions?.length > 0 && (

            <section className="details-section">

              <p className="section-label">
                ADDITIONAL CONDITIONS
              </p>

              <ul className="document-list">

                {scheme.additional_conditions.map(
                  (condition, index) => (
                    <li key={index}>
                      {condition}
                    </li>
                  )
                )}

              </ul>

            </section>

          )}


          <section className="details-section">

            <p className="section-label">
              REQUIRED DOCUMENTS
            </p>

            <h2>
              What you'll need
            </h2>

            {scheme.required_documents?.length > 0 ? (

              <ul className="document-list">

                {scheme.required_documents.map(
                  (document, index) => (
                    <li key={index}>
                      {document}
                    </li>
                  )
                )}

              </ul>

            ) : (

              <p>
                No required documents were listed.
              </p>

            )}

          </section>


          {scheme.optional_documents?.length > 0 && (

            <section className="details-section">

              <p className="section-label">
                OPTIONAL DOCUMENTS
              </p>

              <ul className="document-list">

                {scheme.optional_documents.map(
                  (document, index) => (
                    <li key={index}>
                      {document}
                    </li>
                  )
                )}

              </ul>

            </section>

          )}


          <section className="details-section">

            <p className="section-label">
              HOW TO APPLY
            </p>

            <h2>
              Application steps
            </h2>

            {scheme.application_steps?.length > 0 ? (

              <ol className="document-list">

                {scheme.application_steps.map(
                  (step, index) => (
                    <li key={index}>
                      {step}
                    </li>
                  )
                )}

              </ol>

            ) : (

              <p>
                Application instructions should be verified
                through the official scheme source.
              </p>

            )}

          </section>


          <section className="application-section">

            <div>

              <p className="section-label">
                READY TO APPLY?
              </p>

              <h2>
                Check your application readiness first.
              </h2>

              <p>
                Make sure you have the required documents before
                starting your application.
              </p>

            </div>

            <a
              href={`/application-readiness/${scheme.scheme_id}`}
              className="application-button"
            >
              Check readiness →
            </a>

          </section>


          <section className="source-section">

            <p className="section-label">
              OFFICIAL INFORMATION
            </p>

            <p>
              Always verify the latest eligibility criteria,
              documents and application instructions through the
              official scheme source before applying.
            </p>

            {scheme.official_portal && (

              <a
                href={scheme.official_portal}
                className="source-link"
                target="_blank"
                rel="noreferrer"
              >
                Visit official portal →
              </a>

            )}

          </section>

        </div>

      </main>

    </div>
  )
}

export default SchemeDetails