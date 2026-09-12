import './BenefitsGap.css'

function BenefitsGap() {
  const data =
    JSON.parse(
      localStorage.getItem('adhikaarRecommendations')
    ) || {
      recommendations: []
    }

  const recommendations = data.recommendations || []

  const categoryMap = {}

  recommendations.forEach((scheme) => {
    const category = scheme.category || 'Other'

    if (!categoryMap[category]) {
      categoryMap[category] = []
    }

    categoryMap[category].push(scheme)
  })

  const categories = Object.entries(categoryMap)

  return (
    <div className="benefits-gap-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a href="/results" className="back-link">
          ← Back to results
        </a>
      </nav>


      <main className="benefits-gap-container">

        <div className="benefits-gap-header">

          <p className="section-label">
            BENEFITS GAP
          </p>

          <h1>
            What benefits might you be missing?
          </h1>

          <p>
            Based on your profile, Adhikaar found benefits across
            different areas that may be worth exploring.
          </p>

        </div>


        <section className="category-section">

          <div className="section-heading">

            <p className="section-label">
              YOUR BENEFIT AREAS
            </p>

            <h2>
              Explore what we found.
            </h2>

          </div>


          {categories.length === 0 ? (

            <div className="category-card">

              <h3>
                No benefit categories found
              </h3>

              <p>
                Complete your profile and find your schemes first
                to see relevant benefit categories here.
              </p>

              <a href="/find-schemes">
                Find my schemes →
              </a>

            </div>

          ) : (

            <div className="category-grid">

              {categories.map(
                ([category, schemes]) => (

                  <div
                    className="category-card"
                    key={category}
                  >

                    <span className="category-number">
                      {String(
                        categories.findIndex(
                          ([name]) => name === category
                        ) + 1
                      ).padStart(2, '0')}
                    </span>

                    <h3>
                      {category}
                    </h3>

                    <p>
                      {schemes.length}{' '}
                      {schemes.length === 1
                        ? 'benefit'
                        : 'benefits'}{' '}
                      identified in this area.
                    </p>

                    <div className="category-schemes">

                      {schemes.map((scheme) => (

                        <a
                          href={`/scheme-details/${scheme.scheme_id}`}
                          key={scheme.scheme_id}
                        >
                          {scheme.scheme_name}
                        </a>

                      ))}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        <section className="gap-note">

          <p className="section-label">
            WHAT THIS MEANS
          </p>

          <h2>
            Your benefits shouldn't depend on what you already know.
          </h2>

          <p>
            Adhikaar looks beyond the schemes you might already
            know about and surfaces potentially relevant benefits
            across different areas.
          </p>

        </section>


        <div className="benefits-gap-actions">

          <a
            href="/results"
            className="back-button"
          >
            ← Back to results
          </a>

          <a
            href="/dashboard"
            className="continue-button"
          >
            Back to dashboard →
          </a>

        </div>

      </main>

    </div>
  )
}

export default BenefitsGap