import { useEffect, useState } from 'react'
import './Questions.css'
import LanguageSelector from './LanguageSelector.jsx'
import translations from './translations.js'

function formatOption(option, language) {
  if (option === '__none__') {
    if (language === 'hi') {
      return 'इनमें से कोई नहीं'
    }

    if (language === 'bn') {
      return 'কোনোটিই নয়'
    }

    return 'Neither / None of these'
  }

  if (language === 'hi') {
    const hindiLabels = {
      citizen: 'नागरिक',
      women: 'महिला',
      woman: 'महिला',
      female: 'महिला',
      men: 'पुरुष',
      man: 'पुरुष',
      male: 'पुरुष',
      bank_account_holder: 'बैंक खाता धारक',
      property_owner: 'संपत्ति के मालिक',
      rural_resident: 'ग्रामीण निवासी',
      patient: 'मरीज़'
    }

    if (hindiLabels[option]) {
      return hindiLabels[option]
    }
  }

  if (language === 'bn') {
    const bengaliLabels = {
      citizen: 'নাগরিক',
      women: 'মহিলা',
      woman: 'মহিলা',
      female: 'মহিলা',
      men: 'পুরুষ',
      man: 'পুরুষ',
      male: 'পুরুষ',
      bank_account_holder: 'ব্যাংক অ্যাকাউন্টধারী',
      property_owner: 'সম্পত্তির মালিক',
      rural_resident: 'গ্রামীণ বাসিন্দা',
      patient: 'রোগী'
    }

    if (bengaliLabels[option]) {
      return bengaliLabels[option]
    }
  }

  return option
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function Questions() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const common =
    translations[language]?.common ||
    translations.en.common

  const [questionsByScheme, setQuestionsByScheme] = useState({})
  const [recommendations, setRecommendations] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const content = {
    en: {
      label: 'A FEW MORE QUESTIONS',
      title: "Let's narrow it down.",
      description:
        "We only ask for information that can help determine which benefits are actually relevant to you.",
      loadingText:
        "We're finding the questions that matter for your recommended schemes.",
      errorLabel: 'SOMETHING WENT WRONG',
      errorTitle: "We couldn't load your questions.",
      backendError:
        'Could not connect to the Adhikaar backend. Make sure the backend is running.',
      enoughInfo:
        'We already have enough information to assess your recommended schemes.',
      selectOption: 'Select an option',
      back: '← Back',
      seeResults: 'See My Results →',
      checking: 'Checking...',
      answerAll:
        'Please answer all the questions before continuing.',
      submitError:
        'Could not get personalized recommendations. Make sure the backend is running.',
      questionError:
        'Failed to get personalization questions'
    },

    hi: {
      label: 'कुछ और प्रश्न',
      title: 'आइए इसे और स्पष्ट करें।',
      description:
        'हम केवल वही जानकारी पूछते हैं जो आपके लिए प्रासंगिक लाभों को निर्धारित करने में मदद कर सकती है।',
      loadingText:
        'हम आपकी सुझाई गई योजनाओं के लिए आवश्यक प्रश्न खोज रहे हैं।',
      errorLabel: 'कुछ गलत हुआ',
      errorTitle:
        'हम आपके प्रश्न लोड नहीं कर सके।',
      backendError:
        'अधिकार बैकएंड से कनेक्ट नहीं हो सका। सुनिश्चित करें कि बैकएंड चल रहा है।',
      enoughInfo:
        'आपकी सुझाई गई योजनाओं का आकलन करने के लिए हमारे पास पहले से पर्याप्त जानकारी है।',
      selectOption: 'एक विकल्प चुनें',
      back: '← वापस',
      seeResults: 'मेरे परिणाम देखें →',
      checking: 'जाँच हो रही है...',
      answerAll:
        'जारी रखने से पहले सभी प्रश्नों के उत्तर दें।',
      submitError:
        'व्यक्तिगत सुझाव प्राप्त नहीं हो सके। सुनिश्चित करें कि बैकएंड चल रहा है।',
      questionError:
        'व्यक्तिगत प्रश्न प्राप्त नहीं हो सके'
    },

    bn: {
      label: 'আরও কিছু প্রশ্ন',
      title: 'চলুন আরও নির্দিষ্ট করি।',
      description:
        'আপনার জন্য কোন সুবিধাগুলো আসলে প্রাসঙ্গিক তা নির্ধারণে সাহায্য করে এমন তথ্যই আমরা জিজ্ঞাসা করি।',
      loadingText:
        'আপনার প্রস্তাবিত স্কিমগুলোর জন্য প্রয়োজনীয় প্রশ্ন খোঁজা হচ্ছে।',
      errorLabel: 'কিছু সমস্যা হয়েছে',
      errorTitle:
        'আমরা আপনার প্রশ্ন লোড করতে পারিনি।',
      backendError:
        'অধিকার ব্যাকএন্ডের সাথে সংযোগ করা যায়নি। ব্যাকএন্ড চলছে কিনা নিশ্চিত করুন।',
      enoughInfo:
        'আপনার প্রস্তাবিত স্কিমগুলোর মূল্যায়নের জন্য আমাদের কাছে ইতিমধ্যেই যথেষ্ট তথ্য রয়েছে।',
      selectOption: 'একটি বিকল্প নির্বাচন করুন',
      back: '← ফিরে যান',
      seeResults: 'আমার ফলাফল দেখুন →',
      checking: 'যাচাই করা হচ্ছে...',
      answerAll:
        'চালিয়ে যাওয়ার আগে সব প্রশ্নের উত্তর দিন।',
      submitError:
        'ব্যক্তিগতকৃত সুপারিশ পাওয়া যায়নি। ব্যাকএন্ড চলছে কিনা নিশ্চিত করুন।',
      questionError:
        'ব্যক্তিগতকৃত প্রশ্ন পাওয়া যায়নি'
    }
  }

  const t =
    content[language] ||
    content.en

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
          throw new Error(
            'Failed to get recommendations'
          )
        }

        const recommendationData =
          await recommendationResponse.json()

        const initialRecommendations =
          recommendationData.recommendations || []

        setRecommendations(
          initialRecommendations
        )

        localStorage.setItem(
          'adhikaarRecommendations',
          JSON.stringify(recommendationData)
        )

        if (initialRecommendations.length === 0) {
          setLoading(false)
          return
        }

        const schemeIds =
          initialRecommendations.map(
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
            t.questionError
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
          t.backendError
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
    value,
    checked = false
  ) => {
    const answerKey =
      `${schemeId}:${questionId}`

    if (questionId === 'user_type') {
      setAnswers((previousAnswers) => {
        const updatedAnswers = {
          ...previousAnswers
        }

        const currentValues =
          previousAnswers[answerKey] || []

        if (value === '__none__') {
          updatedAnswers[answerKey] = checked
            ? ['__none__']
            : []

          return updatedAnswers
        }

        let updatedValues =
          currentValues.filter(
            (item) => item !== '__none__'
          )

        if (checked) {
          if (
            !updatedValues.includes(value)
          ) {
            updatedValues = [
              ...updatedValues,
              value
            ]
          }
        } else {
          updatedValues =
            updatedValues.filter(
              (item) => item !== value
            )
        }

        updatedAnswers[answerKey] =
          updatedValues

        /*
         * Citizen is a general user attribute.
         * Carry it across all schemes that ask
         * the same user_type question.
         */
        if (value === 'citizen') {
          Object.entries(
            questionsByScheme
          ).forEach(
            ([otherSchemeId, schemeData]) => {

              if (
                otherSchemeId === schemeId
              ) {
                return
              }

              const hasUserTypeQuestion =
                schemeData.questions?.some(
                  (question) =>
                    question.id === 'user_type'
                )

              if (!hasUserTypeQuestion) {
                return
              }

              const otherAnswerKey =
                `${otherSchemeId}:user_type`

              const otherCurrentValues =
                previousAnswers[
                  otherAnswerKey
                ] || []

              let otherUpdatedValues =
                otherCurrentValues.filter(
                  (item) =>
                    item !== '__none__'
                )

              if (checked) {
                if (
                  !otherUpdatedValues.includes(
                    'citizen'
                  )
                ) {
                  otherUpdatedValues = [
                    ...otherUpdatedValues,
                    'citizen'
                  ]
                }
              } else {
                otherUpdatedValues =
                  otherUpdatedValues.filter(
                    (item) =>
                      item !== 'citizen'
                  )
              }

              updatedAnswers[
                otherAnswerKey
              ] = otherUpdatedValues
            }
          )
        }

        return updatedAnswers
      })

      return
    }

    setAnswers(
      (previousAnswers) => ({
        ...previousAnswers,
        [answerKey]: value
      })
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const schemeEntries =
      Object.entries(
        questionsByScheme
      )

    for (
      const [
        schemeId,
        schemeData
      ] of schemeEntries
    ) {
      for (
        const question
        of schemeData.questions
      ) {
        const answerKey =
          `${schemeId}:${question.id}`

        const answer =
          answers[answerKey]

        if (
          answer === undefined ||
          answer === '' ||
          (
            Array.isArray(answer) &&
            answer.length === 0
          )
        ) {
          alert(t.answerAll)
          return
        }
      }
    }

    setSubmitting(true)

    const profile = JSON.parse(
      localStorage.getItem(
        'adhikaarBackendProfile'
      )
    )

    try {
      const schemeIds =
        recommendations.map(
          (scheme) =>
            scheme.scheme_id
        )

      if (schemeEntries.length === 0) {
        localStorage.setItem(
          'adhikaarRecommendations',
          JSON.stringify({
            total_recommendations:
              recommendations.length,
            recommendations
          })
        )

        window.location.href =
          '/results'

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

              answersByScheme[
                schemeId
              ][question.id] =
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
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            profile,
            scheme_ids:
              schemeIds,
            answers_by_scheme:
              answersByScheme
          })
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to get personalized recommendations'
        )
      }

      const data =
        await response.json()

      localStorage.setItem(
        'adhikaarQuestions',
        JSON.stringify(
          answersByScheme
        )
      )

      localStorage.setItem(
        'adhikaarRecommendations',
        JSON.stringify(
          data
        )
      )

      window.location.href =
        '/results'

    } catch (error) {
      console.error(error)

      alert(
        t.submitError
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="questions-page">

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
              href="/find-schemes"
              className="back-link"
            >
              {t.back}
            </a>

          </div>

        </nav>

        <main className="questions-container">

          <div className="questions-header">

            <p className="section-label">
              {t.label}
            </p>

            <h1>
              {t.title}
            </h1>

            <p>
              {t.loadingText}
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
              href="/find-schemes"
              className="back-link"
            >
              {t.back}
            </a>

          </div>

        </nav>

        <main className="questions-container">

          <div className="questions-header">

            <p className="section-label">
              {t.errorLabel}
            </p>

            <h1>
              {t.errorTitle}
            </h1>

            <p>
              {error}
            </p>

          </div>

        </main>

      </div>
    )
  }

  const schemeEntries =
    Object.entries(
      questionsByScheme
    )

  return (
    <div className="questions-page">

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
            href="/find-schemes"
            className="back-link"
          >
            {t.back}
          </a>

        </div>

      </nav>

      <main className="questions-container">

        <div className="questions-header">

          <p className="section-label">
            {t.label}
          </p>

          <h1>
            {t.title}
          </h1>

          <p>
            {t.description}
          </p>

        </div>

        <form
          className="questions-form"
          onSubmit={handleSubmit}
        >

          {schemeEntries.length === 0 ? (

            <div className="question">

              <label>
                {t.enoughInfo}
              </label>

            </div>

          ) : (

            schemeEntries.map(
              ([schemeId, schemeData]) => (

                <div
                  className="scheme-question-group"
                  key={schemeId}
                >

                  {schemeData.questions.map(
                    (question, index) => {

                      const answerKey =
                        `${schemeId}:${question.id}`

                      const selectedValues =
                        Array.isArray(
                          answers[answerKey]
                        )
                          ? answers[answerKey]
                          : []

                      return (
                        <div
                          className="question"
                          key={question.id}
                        >

                          <span className="question-number">
                            {String(
                              index + 1
                            ).padStart(2, '0')}
                          </span>

                          <label>
                            {question.question}
                          </label>

                          {question.id ===
                          'user_type' ? (

                            <div className="checkbox-options">

                              {question.options?.map(
                                (option) => {

                                  const isSelected =
                                    selectedValues.includes(
                                      option
                                    )

                                  return (
                                    <label
                                      className="checkbox-option"
                                      key={option}
                                    >

                                      <input
                                        type="checkbox"
                                        checked={
                                          isSelected
                                        }
                                        onChange={(
                                          event
                                        ) =>
                                          handleChange(
                                            schemeId,
                                            question.id,
                                            option,
                                            event
                                              .target
                                              .checked
                                          )
                                        }
                                      />

                                      <span>
                                        {formatOption(
                                          option,
                                          language
                                        )}
                                      </span>

                                    </label>
                                  )
                                }
                              )}

                            </div>

                          ) : (

                            <select
                              value={
                                answers[
                                  answerKey
                                ] || ''
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
                                {t.selectOption}
                              </option>

                              {question.options?.map(
                                (option) => (

                                  <option
                                    key={option}
                                    value={option}
                                  >
                                    {formatOption(
                                      option,
                                      language
                                    )}
                                  </option>

                                )
                              )}

                            </select>

                          )}

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
              {t.back}
            </a>

            <button
              type="submit"
              className="continue-button"
              disabled={submitting}
            >
              {submitting
                ? t.checking
                : t.seeResults}
            </button>

          </div>

        </form>

      </main>

    </div>
  )
}

export default Questions