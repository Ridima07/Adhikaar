import './Results.css'

function Results() {
  const data =
    JSON.parse(
      localStorage.getItem('adhikaarRecommendations')
    ) || {
      total_recommendations: 0,
      recommendations: []
    }

  const recommendations = data.recommendations || []

  const categories = new Set(
    recommendations.map((scheme) => scheme.category)
  ).size

  const needsVerification = recommendations.filter(
    (scheme) =>
      scheme.manual_verification_required === true ||
      scheme.status === 'needs_verification'
  ).length

  const getStatusText = (scheme) => {
    if (scheme.status === 'possibly_eligible') {
      return 'Likely eligible'
    }

    if (scheme.status === 'eligible') {
      return 'Likely eligible'
    }

    if (scheme.status === 'ineligible') {
      return 'Not eligible'
    }

    return 'Needs verification'
  }

  const getStatusClass = (scheme) => {
    if (
      scheme.status === 'possibly_eligible' ||
      scheme.status === 'eligible'
    ) {
      return 'eligible'
    }

    if (scheme.status === 'ineligible') {
      return 'not-eligible'
    }

    return 'review'
  }

  return (
    <div className="results-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a href="/dashboard" className="back-link">
          ← Dashboard
        </a>
      </nav>


      <main className="results-container">

        <div className="results-header">

          <p className="section-label">YOUR RESULTS</p>

          <h1>Benefits that may be relevant to you.</h1>

          <p>
            Based on the information you've provided, these are the
            benefits we've identified for further consideration.
          </p>

        </div>


        <section className="results-summary">

          <div>
            <span className="result-number">
              {data.total_recommendations}
            </span>

            <p>potentially relevant benefits</p>
          </div>


          <div>
            <span className="result-number">
              {categories}
            </span>

            <p>categories identified</p>
          </div>


          <div>
            <span className="result-number">
              {needsVerification}
            </span>

            <p>need additional verification</p>
          </div>

        </section>


        <section className="eligibility-section">

          <div className="section-heading">

            <p className="section-label">ELIGIBILITY</p>

            <h2>What we found.</h2>

          </div>


          <div className="eligibility-list">

            {recommendations.length === 0 ? (

              <div className="eligibility-item">

                <div className="eligibility-content">

                  <h3>No recommendations found</h3>

                  <p>
                    We couldn't find any benefits matching the
                    information provided.
                  </p>

                </div>

              </div>

            ) : (

              recommendations.map((scheme) => (

                <div
                  className="eligibility-item"
                  key={scheme.scheme_id}
                >

                  <div
                    className={`eligibility-status ${getStatusClass(
                      scheme
                    )}`}
                  >
                    {getStatusText(scheme)}
                  </div>


                  <div className="eligibility-content">

                    <span>
                      {scheme.category
                        ? scheme.category.toUpperCase()
                        : 'GENERAL'}
                    </span>

                    <h3>{scheme.scheme_name}</h3>

                    <p>
                      {scheme.eligibility_summary ||
                        'This scheme may be relevant based on your profile.'}
                    </p>

                    <div className="match-percentage">
                      {scheme.match_percentage}% profile match
                    </div>

                  </div>


                  <a
                    href={`/scheme-details/${scheme.scheme_id}`}
                    className="result-link"
                  >
                    View details →
                  </a>

                </div>

              ))

            )}

          </div>

        </section>


        <section className="gap-section">

          <div>

            <p className="section-label">BENEFITS GAP</p>

            <h2>There may be more benefits worth exploring.</h2>

            <p>
              Your profile may also connect you with benefits across
              categories you haven't specifically searched for.
            </p>

          </div>


          <a
            href="/benefits-gap"
            className="gap-button"
          >
            Explore categories →
          </a>

        </section>

      </main>

    </div>
  )
}

export default Results