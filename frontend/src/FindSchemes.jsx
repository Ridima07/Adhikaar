import './FindSchemes.css'

function FindSchemes() {
  const profile = JSON.parse(localStorage.getItem('adhikaarProfile')) || {}

  return (
    <div className="find-schemes-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a href="/dashboard" className="back-link">
          ← Back to dashboard
        </a>
      </nav>

      <main className="find-schemes-container">

        <div className="find-schemes-header">

          <p className="section-label">FIND MY SCHEMES</p>

          <h1>Let's find what you're eligible for.</h1>

          <p>
            We'll use your profile and a few additional questions to
            identify benefits that may be relevant to you.
          </p>

        </div>

        <section className="profile-summary">

          <div>
            <p className="section-label">YOUR PROFILE</p>
            <h2>Is this information correct?</h2>
          </div>

          <div className="profile-summary-grid">

            <div>
              <span>Age</span>
              <strong>{profile.age || 'Not provided'}</strong>
            </div>

            <div>
              <span>State</span>
              <strong>{profile.state || 'Not provided'}</strong>
            </div>

            <div>
              <span>Education</span>
              <strong>{profile.education || 'Not provided'}</strong>
            </div>

            <div>
              <span>Occupation</span>
              <strong>{profile.occupation || 'Not provided'}</strong>
            </div>

            <div>
              <span>Annual income</span>
              <strong>{profile.income || 'Not provided'}</strong>
            </div>

            <div>
              <span>Social category</span>
              <strong>{profile.category || 'Not provided'}</strong>
            </div>

            <div>
              <span>Gender</span>
              <strong>{profile.gender || 'Not provided'}</strong>
            </div>

            <div>
              <span>Disability status</span>
              <strong>{profile.disability || 'Not provided'}</strong>
            </div>

          </div>

          <div className="profile-actions">

            <a href="/profile" className="edit-profile-button">
              Edit profile
            </a>

           <button
  type="button"
  className="continue-button"
  onClick={() => {
    window.location.href = '/questions'
  }}
>
  Continue →
</button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default FindSchemes