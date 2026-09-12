import { useEffect, useState } from 'react'
import './RecoveryResult.css'
import LanguageSelector from './LanguageSelector.jsx'

function RecoveryResult() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const content = {
    en: {
      label: 'REJECTION RECOVERY',
      loading: 'Analyzing your rejection...',
      errorTitle: "We couldn't analyze this rejection.",
      errorMessage:
        'Please try submitting the rejection message again.',
      backDashboard: '← Back to dashboard',
      tryAgain: 'Try again →',
      rejectionMessage: 'REJECTION MESSAGE',
      foundTitle: "Here's what we found.",
      foundDescription:
        "We've analyzed the rejection information and identified possible reasons and next steps.",
      happened: 'WHAT MAY HAVE HAPPENED',
      reasonsTitle: 'Possible reasons for the rejection.',
      reasonFallback: 'Possible reason',
      next: 'WHAT YOU CAN DO NEXT',
      nextTitle: 'Possible next steps.',
      stepFallback: 'Next step',
      additional: 'ADDITIONAL INFORMATION',
      important: 'IMPORTANT',
      officialTitle:
        'Always verify the final decision with the official authority.',
      officialText:
        'Adhikaar helps interpret the rejection and identify possible next steps. Government departments and scheme authorities remain the final source of truth.',
      schemeDetails: 'View scheme details →',
      dashboard: 'Back to dashboard'
    },

    hi: {
      label: 'अस्वीकृति के बाद सहायता',
      loading: 'आपकी अस्वीकृति का विश्लेषण किया जा रहा है...',
      errorTitle:
        'हम इस अस्वीकृति का विश्लेषण नहीं कर सके।',
      errorMessage:
        'कृपया अस्वीकृति संदेश दोबारा भेजने का प्रयास करें।',
      backDashboard: '← डैशबोर्ड पर वापस जाएँ',
      tryAgain: 'फिर से प्रयास करें →',
      rejectionMessage: 'अस्वीकृति संदेश',
      foundTitle: 'यह जानकारी मिली है।',
      foundDescription:
        'हमने अस्वीकृति की जानकारी का विश्लेषण किया है और संभावित कारणों तथा अगले कदमों की पहचान की है।',
      happened: 'क्या हो सकता है',
      reasonsTitle: 'अस्वीकृति के संभावित कारण।',
      reasonFallback: 'संभावित कारण',
      next: 'आप आगे क्या कर सकते हैं',
      nextTitle: 'संभावित अगले कदम।',
      stepFallback: 'अगला कदम',
      additional: 'अतिरिक्त जानकारी',
      important: 'महत्वपूर्ण',
      officialTitle:
        'अंतिम निर्णय की आधिकारिक प्राधिकरण से पुष्टि अवश्य करें।',
      officialText:
        'अधिकार अस्वीकृति को समझने और संभावित अगले कदमों की पहचान करने में मदद करता है। सरकारी विभाग और योजना प्राधिकरण अंतिम सत्य का स्रोत हैं।',
      schemeDetails: 'योजना का विवरण देखें →',
      dashboard: 'डैशबोर्ड पर वापस जाएँ'
    },

    bn: {
      label: 'আবেদন প্রত্যাখ্যানের পর সহায়তা',
      loading: 'আপনার প্রত্যাখ্যানের কারণ বিশ্লেষণ করা হচ্ছে...',
      errorTitle:
        'আমরা এই প্রত্যাখ্যানটি বিশ্লেষণ করতে পারিনি।',
      errorMessage:
        'অনুগ্রহ করে প্রত্যাখ্যানের বার্তাটি আবার জমা দিন।',
      backDashboard: '← ড্যাশবোর্ডে ফিরে যান',
      tryAgain: 'আবার চেষ্টা করুন →',
      rejectionMessage: 'প্রত্যাখ্যানের বার্তা',
      foundTitle: 'আমরা যা পেয়েছি।',
      foundDescription:
        'আমরা প্রত্যাখ্যানের তথ্য বিশ্লেষণ করে সম্ভাব্য কারণ এবং পরবর্তী পদক্ষেপ শনাক্ত করেছি।',
      happened: 'কী ঘটতে পারে',
      reasonsTitle: 'প্রত্যাখ্যানের সম্ভাব্য কারণ।',
      reasonFallback: 'সম্ভাব্য কারণ',
      next: 'আপনি এরপর কী করতে পারেন',
      nextTitle: 'সম্ভাব্য পরবর্তী পদক্ষেপ।',
      stepFallback: 'পরবর্তী পদক্ষেপ',
      additional: 'অতিরিক্ত তথ্য',
      important: 'গুরুত্বপূর্ণ',
      officialTitle:
        'চূড়ান্ত সিদ্ধান্ত অবশ্যই সরকারি কর্তৃপক্ষের কাছ থেকে যাচাই করুন।',
      officialText:
        'অধিকার প্রত্যাখ্যানের কারণ বুঝতে এবং সম্ভাব্য পরবর্তী পদক্ষেপ চিহ্নিত করতে সাহায্য করে। সরকারি বিভাগ ও স্কিম কর্তৃপক্ষই চূড়ান্ত তথ্যের উৎস।',
      schemeDetails: 'স্কিমের বিস্তারিত দেখুন →',
      dashboard: 'ড্যাশবোর্ডে ফিরে যান'
    }
  }

  const t =
    content[language] ||
    content.en

  const rejectionMessage =
    localStorage.getItem(
      'adhikaarRejection'
    ) || ''

  const schemeId =
    localStorage.getItem(
      'adhikaarRejectionScheme'
    ) || ''

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRecovery = async () => {
      try {
        if (
          !schemeId ||
          !rejectionMessage
        ) {
          throw new Error(
            'Missing rejection information'
          )
        }

        const response = await fetch(
          `http://127.0.0.1:8000/scheme/${schemeId}/rejection-recovery`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json'
            },
            body: JSON.stringify({
              rejection_message:
                rejectionMessage
            })
          }
        )

        if (!response.ok) {
          throw new Error(
            'Could not analyze rejection'
          )
        }

        const data =
          await response.json()

        setResult(data)

      } catch (error) {
        console.error(error)

        setError(
          t.errorMessage
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRecovery()
  }, [
    schemeId,
    rejectionMessage
  ])

  if (loading) {
    return (
      <div className="recovery-result-page">

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
              href="/dashboard"
              className="back-link"
            >
              {t.backDashboard}
            </a>

          </div>

        </nav>

        <main className="recovery-result-container">

          <p>
            {t.loading}
          </p>

        </main>

      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="recovery-result-page">

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
              href="/dashboard"
              className="back-link"
            >
              {t.backDashboard}
            </a>

          </div>

        </nav>

        <main className="recovery-result-container">

          <div className="recovery-result-header">

            <p className="section-label">
              {t.label}
            </p>

            <h1>
              {t.errorTitle}
            </h1>

            <p>
              {error ||
                t.errorMessage}
            </p>

          </div>

          <div className="recovery-result-actions">

            <a
              href="/rejection-recovery"
              className="readiness-button"
            >
              {t.tryAgain}
            </a>

            <a
              href="/dashboard"
              className="dashboard-button"
            >
              {t.dashboard}
            </a>

          </div>

        </main>

      </div>
    )
  }

  return (
    <div className="recovery-result-page">

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
            href="/dashboard"
            className="back-link"
          >
            {t.backDashboard}
          </a>

        </div>

      </nav>

      <main className="recovery-result-container">

        <div className="recovery-result-header">

          <p className="section-label">
            {t.label}
          </p>

          <h1>
            {t.foundTitle}
          </h1>

          <p>
            {t.foundDescription}
          </p>

        </div>

        <section className="submitted-rejection">

          <p className="section-label">
            {t.rejectionMessage}
          </p>

          <div className="rejection-message">
            {rejectionMessage}
          </div>

        </section>

        {result.reasons?.length > 0 && (

          <section className="recovery-section">

            <p className="section-label">
              {t.happened}
            </p>

            <h2>
              {t.reasonsTitle}
            </h2>

            <div className="finding-list">

              {result.reasons.map(
                (reason, index) => (

                  <div
                    className="finding-item"
                    key={index}
                  >

                    <span className="finding-number">
                      {String(
                        index + 1
                      ).padStart(2, '0')}
                    </span>

                    <div>

                      <h3>
                        {reason.title ||
                          reason.reason ||
                          `${t.reasonFallback} ${index + 1}`}
                      </h3>

                      <p>
                        {reason.description ||
                          reason.explanation ||
                          String(reason)}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        {result.next_steps?.length > 0 && (

          <section className="next-steps-section">

            <p className="section-label">
              {t.next}
            </p>

            <h2>
              {t.nextTitle}
            </h2>

            <div className="next-steps-list">

              {result.next_steps.map(
                (step, index) => (

                  <div
                    className="next-step"
                    key={index}
                  >

                    <span>
                      {String(
                        index + 1
                      ).padStart(2, '0')}
                    </span>

                    <div>

                      <h3>
                        {step.title ||
                          `${t.stepFallback} ${index + 1}`}
                      </h3>

                      <p>
                        {step.description ||
                          step.action ||
                          String(step)}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        {result.message && (

          <section className="recovery-warning">

            <p className="section-label">
              {t.additional}
            </p>

            <p>
              {result.message}
            </p>

          </section>

        )}

        <section className="recovery-warning">

          <p className="section-label">
            {t.important}
          </p>

          <h2>
            {t.officialTitle}
          </h2>

          <p>
            {t.officialText}
          </p>

        </section>

        <div className="recovery-result-actions">

          <a
            href={`/scheme-details/${schemeId}`}
            className="readiness-button"
          >
            {t.schemeDetails}
          </a>

          <a
            href="/dashboard"
            className="dashboard-button"
          >
            {t.dashboard}
          </a>

        </div>

      </main>

    </div>
  )
}

export default RecoveryResult