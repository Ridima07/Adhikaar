import { useEffect, useState } from 'react'
import './Questions.css'

function Questions() {
  const [questionsByScheme, setQuestionsByScheme] = useState({})
  const [recommendations, setRecommendations] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadQuestions = async () => {
      const profile = JSON.parse(
        localStorage.getItem('adhikaarBackendProfile')
      )

      if (!profile) {
        setError('Profile information not found.')
        setLoading(false)
        return
      }

      try {
        const recommendationResponse = await fetch(
          'http://127.0.0.1:8000/recommend',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(profile)
          }
        )

        if (!recommendationResponse.ok) {
          throw new Error('Failed to get recommendations')
        }

        const recommendationData =
          await recommendationResponse.json()

        const initialRecommendations =
          recommendationData.recommendations || []

        setRecommendations(initialRecommendations)

        localStorage.setItem(
          'adhikaarRecommendations',
          JSON.stringify(recommendationData)
        )

        if (initialRecommendations.length === 0) {
          setLoading(false)
          return
        }

        const schemeIds = initialRecommendations.map(
          (scheme) => scheme.scheme_id
        )

        const questionResponse = await fetch(
          'http://127.0.0.1:8000/personalization/questions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              profile,
              scheme_ids: schemeIds
            })
          }
        )

        if (!questionResponse.ok) {
          throw new Error(
            'Failed to get personalization questions'
          )
        }

        const questionData =
          await questionResponse.json()

        setQuestionsByScheme(
          questionData.questions_by_scheme || {}
        )

      } catch (error) {
        console.error(error)

        setError(
          'Could not connect to the Adhikaar backend. Make sure the backend is running.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  const handleChange = (
    schemeId,
    questionId,
    value
  ) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [`${schemeId}:${questionId}`]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSubmitting(true)

    const profile = JSON.parse(
      localStorage.getItem('adhikaarBackendProfile')
    )

    try {
      const schemeIds = recommendations.map(
        (scheme) => scheme.scheme_id
      )

      const schemeEntries =
        Object.entries(questionsByScheme)

      if (schemeEntries.length === 0) {
        localStorage.setItem(
          'adhikaarRecommendations',
          JSON.stringify({
            total_recommendations:
              recommendations.length,
            recommendations
          })
        )

        window.location.href = '/results'
        return
      }

      const answersByScheme = {}

      schemeEntries.forEach(
        ([schemeId, schemeData]) => {
          answersByScheme[schemeId] = {}

          schemeData.questions.forEach(
            (question) => {
              const answerKey =
                `${schemeId}:${question.id}`

              answersByScheme[schemeId][question.id] =
                answers[answerKey]
            }
          )
        }
      )

      const response = await fetch(
        'http://127.0.0.1:8000/personalization/recommend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            profile,
            scheme_ids: schemeIds,
            answers_by_scheme: answersByScheme
          })
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to get personalized recommendations'
        )
      }

      const data = await response.json()

      localStorage.setItem(
        'adhikaarQuestions',
        JSON.stringify(answersByScheme)
      )

      localStorage.setItem(
        'adhikaarRecommendations',
        JSON.stringify(data)
      )

      window.location.href = '/results'

    } catch (error) {
      console.error(error)

      alert(
        'Could not get personalized recommendations. Make sure the backend is running.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="questions-page">

        <nav className="auth-navbar">
          <div className="logo">ADHIKAAR</div>

          <a
            href="/find-schemes"
            className="back-link"
          >
            ← Back
          </a>
        </nav>

        <main className="questions-container">

          <div className="questions-header">
            <p className="section-label">
              A FEW MORE QUESTIONS
            </p>

            <h1>Let's narrow it down.</h1>

            <p>
              We're finding the questions that matter
              for your recommended schemes.
            </p>
          </div>

        </main>

      </div>
    )
  }

  if (error) {
    return (
      <div className="questions-page">

        <nav className="auth-navbar">
          <div className="logo">ADHIKAAR</div>

          <a
            href="/find-schemes"
            className="back-link"
          >
            ← Back
          </a>
        </nav>

        <main className="questions-container">

          <div className="questions-header">
            <p className="section-label">
              SOMETHING WENT WRONG
            </p>

            <h1>We couldn't load your questions.</h1>

            <p>{error}</p>
          </div>

        </main>

      </div>
    )
  }

  const schemeEntries =
    Object.entries(questionsByScheme)

  return (
    <div className="questions-page">

      <nav className="auth-navbar">
        <div className="logo">ADHIKAAR</div>

        <a
          href="/find-schemes"
          className="back-link"
        >
          ← Back
        </a>
      </nav>

      <main className="questions-container">

        <div className="questions-header">

          <p className="section-label">
            A FEW MORE QUESTIONS
          </p>

          <h1>Let's narrow it down.</h1>

          <p>
            We only ask for information that can help
            determine which benefits are actually relevant
            to you.
          </p>

        </div>

        <form
          className="questions-form"
          onSubmit={handleSubmit}
        >

          {schemeEntries.length === 0 ? (

            <div className="question">
              <label>
                We already have enough information to
                assess your recommended schemes.
              </label>
            </div>

          ) : (

            schemeEntries.map(
              ([schemeId, schemeData]) => (

                <div
                  className="scheme-question-group"
                  key={schemeId}
                >

                  <h2>
                    {schemeData.scheme_name}
                  </h2>

                  {schemeData.questions.map(
                    (question, index) => {

                      const answerKey =
                        `${schemeId}:${question.id}`

                      return (
                        <div
                          className="question"
                          key={question.id}
                        >

                          <span className="question-number">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <label>
                            {question.question}
                          </label>

                          <select
                            value={
                              answers[answerKey] || ''
                            }
                            onChange={(event) =>
                              handleChange(
                                schemeId,
                                question.id,
                                event.target.value
                              )
                            }
                            required
                          >

                            <option value="">
                              Select an option
                            </option>

                            {question.options?.map(
                              (option) => (
                                <option
                                  key={option}
                                  value={option}
                                >
                                  {option}
                                </option>
                              )
                            )}

                          </select>

                        </div>
                      )
                    }
                  )}

                </div>
              )
            )
          )}

          <div className="questions-actions">

            <a
              href="/find-schemes"
              className="back-button"
            >
              ← Back
            </a>

            <button
              type="submit"
              className="continue-button"
              disabled={submitting}
            >
              {submitting
                ? 'Checking...'
                : 'See My Results →'}
            </button>

          </div>

        </form>

      </main>

    </div>
  )
}

export default Questions