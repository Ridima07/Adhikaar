import { useEffect, useState } from 'react'
import './RecoveryResult.css'

function RecoveryResult() {
  const rejectionMessage =
    localStorage.getItem('adhikaarRejection') || ''

  const schemeId =
    localStorage.getItem('adhikaarRejectionScheme') || ''

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecovery = async () => {
      try {
        if (!schemeId || !rejectionMessage) {
          throw new Error('Missing rejection information')
        }

        const response = await fetch(
          `http://127.0.0.1:8000/scheme/${schemeId}/rejection-recovery`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              rejection_message: rejectionMessage
            })
          }
        )

        if (!response.ok) {
          throw new Error('Could not analyze rejection')
        }

        const data = await response.json()

        setResult(data)
      } catch (error) {
        console.error(error)
        setError(
          'Could not analyze the rejection. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRecovery()
  }, [schemeId, rejectionMessage])

  if (loading) {
    return (
      <div className="recovery-result-page">
        <nav className="auth-navbar">
          <div className="logo">ADHIKAAR</div>

          <a href="/dashboard" className="back-link">
            ← Back to dashboard
          </a>
        </nav>

        <main className="recovery-result-container">
          <p>Analyzing your rejection...</p>
        </main>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="recovery-result-page">
        <nav className="auth-navbar">
          <div className="logo">ADHIKAAR</div>

          <a href="/dashboard" className="back-link">
            ← Back to dashboard
          </a>
        </nav>

        <main className="recovery-result-container">

          <div className="recovery-result-header">
            <p className="section-label">
              REJECTION RECOVERY
            </p>

            <h1>
              We couldn't analyze this rejection.
            </h1>

            <p>
              {error ||
                'Please try submitting the rejection message again.'}
            </p>
          </div>

          <div className="recovery-result-actions">

            <a
              href="/rejection-recovery"
              className="readiness-button"
            >
              Try again →
            </a>

            <a
              href="/dashboard"
              className="dashboard-button"
            >
              Back to dashboard
            </a>

          </div>

        </main>
      </div>
    )
  }

  return (
    <div className="recovery-result-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a href="/dashboard" className="back-link">
          ← Back to dashboard
        </a>
      </nav>


      <main className="recovery-result-container">

        <div className="recovery-result-header">

          <p className="section-label">
            REJECTION RECOVERY
          </p>

          <h1>
            Here's what we found.
          </h1>

          <p>
            We've analyzed the rejection information and
            identified possible reasons and next steps.
          </p>

        </div>


        <section className="submitted-rejection">

          <p className="section-label">
            REJECTION MESSAGE
          </p>

          <div className="rejection-message">
            {rejectionMessage}
          </div>

        </section>


        {result.reasons?.length > 0 && (

          <section className="recovery-section">

            <p className="section-label">
              WHAT MAY HAVE HAPPENED
            </p>

            <h2>
              Possible reasons for the rejection.
            </h2>

            <div className="finding-list">

              {result.reasons.map((reason, index) => (

                <div
                  className="finding-item"
                  key={index}
                >

                  <span className="finding-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <h3>
                      {reason.title ||
                        reason.reason ||
                        `Possible reason ${index + 1}`}
                    </h3>

                    <p>
                      {reason.description ||
                        reason.explanation ||
                        String(reason)}
                    </p>
                  </div>

                </div>

              ))}

            </div>

          </section>

        )}


        {result.next_steps?.length > 0 && (

          <section className="next-steps-section">

            <p className="section-label">
              WHAT YOU CAN DO NEXT
            </p>

            <h2>
              Possible next steps.
            </h2>

            <div className="next-steps-list">

              {result.next_steps.map((step, index) => (

                <div
                  className="next-step"
                  key={index}
                >

                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <h3>
                      {step.title ||
                        `Next step ${index + 1}`}
                    </h3>

                    <p>
                      {step.description ||
                        step.action ||
                        String(step)}
                    </p>
                  </div>

                </div>

              ))}

            </div>

          </section>

        )}


        {result.message && (

          <section className="recovery-warning">

            <p className="section-label">
              ADDITIONAL INFORMATION
            </p>

            <p>
              {result.message}
            </p>

          </section>

        )}


        <section className="recovery-warning">

          <p className="section-label">
            IMPORTANT
          </p>

          <h2>
            Always verify the final decision with the official authority.
          </h2>

          <p>
            Adhikaar helps interpret the rejection and identify
            possible next steps. Government departments and
            scheme authorities remain the final source of truth.
          </p>

        </section>


        <div className="recovery-result-actions">

          <a
            href={`/scheme-details/${schemeId}`}
            className="readiness-button"
          >
            View scheme details →
          </a>

          <a
            href="/dashboard"
            className="dashboard-button"
          >
            Back to dashboard
          </a>

        </div>

      </main>

    </div>
  )
}

export default RecoveryResult