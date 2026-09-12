import { useState } from 'react'
import './RejectionRecovery.css'

function RejectionRecovery() {
  const data =
    JSON.parse(
      localStorage.getItem('adhikaarRecommendations')
    ) || {
      recommendations: []
    }

  const recommendations = data.recommendations || []

  const [schemeId, setSchemeId] = useState('')
  const [rejectionMessage, setRejectionMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    localStorage.setItem(
      'adhikaarRejection',
      rejectionMessage
    )

    localStorage.setItem(
      'adhikaarRejectionScheme',
      schemeId
    )

    window.location.href = '/recovery-result'
  }

  return (
    <div className="recovery-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a href="/dashboard" className="back-link">
          ← Back to dashboard
        </a>
      </nav>


      <main className="recovery-container">

        <div className="recovery-header">

          <p className="section-label">
            REJECTION RECOVERY
          </p>

          <h1>
            Got rejected? Let's understand why.
          </h1>

          <p>
            Tell us which benefit you applied for and share
            the rejection message you received. Adhikaar can
            help identify what may have gone wrong and what
            you can do next.
          </p>

        </div>


        <form
          className="recovery-form"
          onSubmit={handleSubmit}
        >

          <label htmlFor="scheme">
            Which benefit was your application for?
          </label>

          <select
            id="scheme"
            value={schemeId}
            onChange={(event) =>
              setSchemeId(event.target.value)
            }
            required
          >

            <option value="">
              Select a benefit
            </option>

            {recommendations.map((scheme) => (

              <option
                key={scheme.scheme_id}
                value={scheme.scheme_id}
              >
                {scheme.scheme_name}
              </option>

            ))}

          </select>


          <label htmlFor="rejectionMessage">
            What did the rejection message say?
          </label>

          <textarea
            id="rejectionMessage"
            value={rejectionMessage}
            onChange={(event) =>
              setRejectionMessage(event.target.value)
            }
            placeholder="Paste the rejection message or explain what you were told..."
            required
          />


          <p className="form-note">
            Don't worry if the message is complicated. We'll
            help break it down into understandable reasons
            and possible next steps.
          </p>


          <div className="recovery-actions">

            <a
              href="/dashboard"
              className="cancel-button"
            >
              Cancel
            </a>

            <button
              type="submit"
              className="analyze-button"
            >
              Understand my rejection →
            </button>

          </div>

        </form>


        <section className="recovery-note">

          <p className="section-label">
            IMPORTANT
          </p>

          <h2>
            Adhikaar doesn't make the final decision.
          </h2>

          <p>
            Government departments and scheme authorities
            remain the source of truth for eligibility and
            application decisions. Adhikaar helps you
            understand the information and identify possible
            next steps.
          </p>

        </section>

      </main>

    </div>
  )
}

export default RejectionRecovery