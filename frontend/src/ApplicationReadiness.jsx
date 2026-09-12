import { useEffect, useState } from 'react'
import './ApplicationReadiness.css'

function ApplicationReadiness() {
  const schemeId = window.location.pathname.split('/').pop()

  const [scheme, setScheme] = useState(null)
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [documentStatus, setDocumentStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/scheme/${schemeId}`
        )

        if (!response.ok) {
          throw new Error('Could not fetch scheme')
        }

        const data = await response.json()

        setScheme(data)
      } catch (error) {
        console.error(error)
        setError('Could not load scheme requirements.')
      } finally {
        setLoading(false)
      }
    }

    fetchScheme()
  }, [schemeId])

  const handleDocumentChange = (document) => {
    setSelectedDocuments((current) => {
      if (current.includes(document)) {
        return current.filter((item) => item !== document)
      }

      return [...current, document]
    })
  }

  const checkReadiness = async () => {
    setChecking(true)
    setError('')

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/scheme/${schemeId}/document-check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            available_documents: selectedDocuments
          })
        }
      )

      if (!response.ok) {
        throw new Error('Could not check documents')
      }

      const data = await response.json()

      setDocumentStatus(data)
    } catch (error) {
      console.error(error)
      setError('Could not check your documents.')
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="readiness-page">
        <nav className="auth-navbar">
          <div className="logo">ADHIKAAR</div>

          <a href="/results" className="back-link">
            ← Back
          </a>
        </nav>

        <main className="readiness-container">
          <p>Loading application requirements...</p>
        </main>
      </div>
    )
  }

  if (error && !scheme) {
    return (
      <div className="readiness-page">
        <nav className="auth-navbar">
          <div className="logo">ADHIKAAR</div>

          <a href="/results" className="back-link">
            ← Back
          </a>
        </nav>

        <main className="readiness-container">
          <h1>Unable to load requirements.</h1>

          <p>{error}</p>

          <a href="/results" className="official-button">
            ← Back to results
          </a>
        </main>
      </div>
    )
  }

  const documents = scheme.required_documents || []

  const total = documentStatus?.total_required_documents || documents.length

  const missing = documentStatus?.missing_documents?.length || 0

  const ready = documentStatus
    ? total - missing
    : 0

  const readinessPercentage = documentStatus
    ? documentStatus.readiness_percentage
    : 0

  return (
    <div className="readiness-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a
          href={`/scheme-details/${scheme.scheme_id}`}
          className="back-link"
        >
          ← Back to scheme
        </a>
      </nav>


      <main className="readiness-container">

        <div className="readiness-header">

          <p className="section-label">
            APPLICATION READINESS
          </p>

          <h1>
            Are you ready to apply?
          </h1>

          <p>
            Select the documents you currently have for{' '}
            <strong>{scheme.scheme_name}</strong>.
          </p>

        </div>


        {!documentStatus && (

          <section className="documents-section">

            <div className="section-heading">

              <p className="section-label">
                REQUIRED DOCUMENTS
              </p>

              <h2>
                What do you have?
              </h2>

            </div>


            <div className="document-checklist">

              {documents.map((document) => (

                <label
                  className="readiness-item"
                  key={document}
                >

                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(
                      document
                    )}
                    onChange={() =>
                      handleDocumentChange(document)
                    }
                  />

                  <div>
                    <h3>{document}</h3>

                    <p>
                      Select this if you currently have it.
                    </p>
                  </div>

                </label>

              ))}

            </div>


            {error && (
              <p className="form-note">
                {error}
              </p>
            )}


            <div className="readiness-actions">

              <div>
                <p className="section-label">
                  CHECK YOUR READINESS
                </p>

                <h2>
                  See what's still missing.
                </h2>

                <p>
                  Adhikaar will compare your documents with
                  the requirements listed for this scheme.
                </p>
              </div>

              <button
                type="button"
                className="official-button"
                onClick={checkReadiness}
                disabled={checking}
              >
                {checking
                  ? 'Checking...'
                  : 'Check readiness →'}
              </button>

            </div>

          </section>

        )}


        {documentStatus && (

          <>

            <section className="readiness-summary">

              <div className="readiness-score">

                <span>
                  {ready}/{total}
                </span>

                <p>
                  requirements ready
                </p>

              </div>


              <div className="readiness-message">

                <p className="section-label">
                  {readinessPercentage === 100
                    ? 'READY TO APPLY'
                    : 'ALMOST THERE'}
                </p>

                <h2>
                  {readinessPercentage === 100
                    ? 'You have all the required documents.'
                    : 'You still have some documents to arrange.'}
                </h2>

                <p>
                  Your current document readiness is{' '}
                  {readinessPercentage}%.
                </p>

              </div>

            </section>


            <section className="documents-section">

              <div className="section-heading">

                <p className="section-label">
                  DOCUMENT CHECKLIST
                </p>

                <h2>
                  Your application status.
                </h2>

              </div>


              <div className="document-checklist">

                {documentStatus.available_documents?.map(
                  (document, index) => (

                    <div
                      className="readiness-item"
                      key={`available-${index}`}
                    >

                      <div className="readiness-icon ready">
                        ✓
                      </div>

                      <div>
                        <h3>{document}</h3>

                        <p>
                          You marked this document as available.
                        </p>
                      </div>

                      <span className="item-status">
                        Ready
                      </span>

                    </div>

                  )
                )}


                {documentStatus.missing_documents?.map(
                  (document, index) => (

                    <div
                      className="readiness-item missing"
                      key={`missing-${index}`}
                    >

                      <div className="readiness-icon">
                        !
                      </div>

                      <div>
                        <h3>{document}</h3>

                        <p>
                          This document is still required.
                        </p>
                      </div>

                      <span className="item-status">
                        Missing
                      </span>

                    </div>

                  )
                )}

              </div>

            </section>


            <section className="readiness-actions">

              <div>

                <p className="section-label">
                  NEXT STEP
                </p>

                <h2>
                  {readinessPercentage === 100
                    ? 'You can move on to the application process.'
                    : 'Arrange the missing documents before applying.'}
                </h2>

                <p>
                  Always verify the latest requirements and
                  application instructions through the official
                  scheme source.
                </p>

              </div>

              {scheme.official_portal && (

                <a
                  href={scheme.official_portal}
                  className="official-button"
                  target="_blank"
                  rel="noreferrer"
                >
                  View official requirements →
                </a>

              )}

            </section>

          </>

        )}

      </main>

    </div>
  )
}

export default ApplicationReadiness