import './Dashboard.css'

function Dashboard() {
  const data =
    JSON.parse(
      localStorage.getItem('adhikaarRecommendations')
    ) || {
      total_recommendations: 0,
      recommendations: []
    }

  const recommendations = data.recommendations || []

  const topRecommendations = recommendations.slice(0, 3)

  return (
    <div className="dashboard-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a href="/" className="back-link">
          Logout
        </a>
      </nav>


      <main className="dashboard-container">

        <div className="dashboard-header">

          <div>

            <p className="section-label">
              YOUR ADHIKAAR
            </p>

            <h1>
              Your benefits dashboard.
            </h1>

            <p>
              Explore benefits that may be relevant to your profile.
            </p>

          </div>

          <a
            href="/profile"
            className="profile-link"
          >
            View profile
          </a>

        </div>


        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <p className="section-label">
                FOR YOU
              </p>

              <h2>
                Benefits you may be eligible for.
              </h2>

            </div>

          </div>


          {topRecommendations.length === 0 ? (

            <div className="scheme-card">

              <h3>
                No recommendations yet.
              </h3>

              <p>
                Complete your profile and find your schemes
                to see benefits relevant to you.
              </p>

              <a href="/find-schemes">
                Find My Schemes →
              </a>

            </div>

          ) : (

            <div className="scheme-grid">

              {topRecommendations.map((scheme) => (

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
                    View details →
                  </a>

                </div>

              ))}

            </div>

          )}

        </section>


        <section className="find-section">

          <div>

            <p className="section-label">
              GO FURTHER
            </p>

            <h2>
              Find benefits you might be missing.
            </h2>

            <p>
              Answer a few additional questions and let Adhikaar
              identify benefits you may not have considered.
            </p>

          </div>

          <a
            href="/find-schemes"
            className="find-button"
          >
            Find My Schemes →
          </a>

        </section>


        <section className="dashboard-tools">

          <a
  href={
    recommendations.length > 0
      ? `/application-readiness/${recommendations[0].scheme_id}`
      : '/find-schemes'
  }
  className="tool-card"
>
            <span>01</span>

            <h3>
              Application readiness
            </h3>

            <p>
              Check your documents and see what you still need
              before applying.
            </p>

          </a>


          <a
            href="/rejection-recovery"
            className="tool-card"
          >
            <span>02</span>

            <h3>
              Rejection recovery
            </h3>

            <p>
              Understand what may have gone wrong and what you
              can do next.
            </p>

          </a>

        </section>

      </main>

    </div>
  )
}

export default Dashboard