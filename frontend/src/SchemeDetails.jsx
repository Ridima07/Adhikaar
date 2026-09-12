import { useEffect, useState } from 'react'
import './SchemeDetails.css'
import LanguageSelector from './LanguageSelector.jsx'

function SchemeDetails() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const content = {
    en: {
      general: 'GENERAL',
      loading: 'Loading scheme details...',
      backResults: '← Back to results',
      unable: 'Unable to load scheme.',
      unableText:
        "We couldn't retrieve the details for this benefit.",
      benefitFallback:
        'Details about this government benefit.',
      statusLabel: 'YOUR STATUS',
      needsVerification: 'Needs verification',
      potentiallyEligible: 'Potentially eligible',
      statusFallback:
        'Your profile matches some of the eligibility criteria. Final eligibility should be verified with the official scheme authority.',
      benefit: 'BENEFIT',
      benefitTitle: 'What this benefit provides',
      benefitFallbackLong:
        'Benefit information is available through the official scheme source.',
      eligibility: 'ELIGIBILITY',
      eligibilityTitle: 'What you need to know',
      eligibilityFallback:
        'Detailed eligibility information should be verified through the official scheme source.',
      additionalConditions: 'ADDITIONAL CONDITIONS',
      requiredDocuments: 'REQUIRED DOCUMENTS',
      documentsTitle: "What you'll need",
      noRequiredDocuments:
        'No required documents were listed.',
      optionalDocuments: 'OPTIONAL DOCUMENTS',
      howToApply: 'HOW TO APPLY',
      applicationSteps: 'Application steps',
      applicationFallback:
        'Application instructions should be verified through the official scheme source.',
      readyToApply: 'READY TO APPLY?',
      readinessTitle:
        'Check your application readiness first.',
      readinessText:
        'Make sure you have the required documents before starting your application.',
      checkReadiness: 'Check readiness →',
      officialInformation: 'OFFICIAL INFORMATION',
      officialText:
        'Always verify the latest eligibility criteria, documents and application instructions through the official scheme source before applying.',
      visitPortal: 'Visit official portal →'
    },

    hi: {
      general: 'सामान्य',
      loading: 'योजना का विवरण लोड हो रहा है...',
      backResults: '← परिणामों पर वापस जाएँ',
      unable: 'योजना लोड नहीं हो सकी।',
      unableText:
        'हम इस लाभ का विवरण प्राप्त नहीं कर सके।',
      benefitFallback:
        'इस सरकारी लाभ के बारे में विवरण।',
      statusLabel: 'आपकी स्थिति',
      needsVerification: 'सत्यापन आवश्यक',
      potentiallyEligible: 'संभावित रूप से पात्र',
      statusFallback:
        'आपकी प्रोफ़ाइल कुछ पात्रता मानदंडों से मेल खाती है। अंतिम पात्रता की पुष्टि आधिकारिक योजना प्राधिकरण से करें।',
      benefit: 'लाभ',
      benefitTitle: 'यह लाभ क्या प्रदान करता है',
      benefitFallbackLong:
        'लाभ की जानकारी आधिकारिक योजना स्रोत पर उपलब्ध है।',
      eligibility: 'पात्रता',
      eligibilityTitle: 'आपको क्या जानना आवश्यक है',
      eligibilityFallback:
        'विस्तृत पात्रता जानकारी की पुष्टि आधिकारिक योजना स्रोत से की जानी चाहिए।',
      additionalConditions: 'अतिरिक्त शर्तें',
      requiredDocuments: 'आवश्यक दस्तावेज़',
      documentsTitle: 'आपको क्या चाहिए',
      noRequiredDocuments:
        'कोई आवश्यक दस्तावेज़ सूचीबद्ध नहीं हैं।',
      optionalDocuments: 'वैकल्पिक दस्तावेज़',
      howToApply: 'आवेदन कैसे करें',
      applicationSteps: 'आवेदन के चरण',
      applicationFallback:
        'आवेदन संबंधी निर्देशों की पुष्टि आधिकारिक योजना स्रोत से की जानी चाहिए।',
      readyToApply: 'आवेदन के लिए तैयार?',
      readinessTitle:
        'पहले अपनी आवेदन तैयारी जाँचें।',
      readinessText:
        'आवेदन शुरू करने से पहले सुनिश्चित करें कि आपके पास आवश्यक दस्तावेज़ हैं।',
      checkReadiness: 'तैयारी जाँचें →',
      officialInformation: 'आधिकारिक जानकारी',
      officialText:
        'आवेदन करने से पहले नवीनतम पात्रता मानदंड, दस्तावेज़ और आवेदन निर्देशों की पुष्टि आधिकारिक योजना स्रोत से करें।',
      visitPortal: 'आधिकारिक पोर्टल देखें →'
    },

    bn: {
      general: 'সাধারণ',
      loading: 'স্কিমের বিস্তারিত লোড হচ্ছে...',
      backResults: '← ফলাফলে ফিরে যান',
      unable: 'স্কিম লোড করা যায়নি।',
      unableText:
        'আমরা এই সুবিধার বিস্তারিত তথ্য সংগ্রহ করতে পারিনি।',
      benefitFallback:
        'এই সরকারি সুবিধা সম্পর্কে বিস্তারিত।',
      statusLabel: 'আপনার অবস্থা',
      needsVerification: 'যাচাই প্রয়োজন',
      potentiallyEligible: 'সম্ভাব্যভাবে যোগ্য',
      statusFallback:
        'আপনার প্রোফাইল কিছু যোগ্যতার মানদণ্ডের সাথে মেলে। চূড়ান্ত যোগ্যতা সরকারি স্কিম কর্তৃপক্ষের কাছ থেকে যাচাই করুন।',
      benefit: 'সুবিধা',
      benefitTitle: 'এই সুবিধা কী দেয়',
      benefitFallbackLong:
        'সুবিধা সম্পর্কিত তথ্য সরকারি স্কিমের উৎসে পাওয়া যায়।',
      eligibility: 'যোগ্যতা',
      eligibilityTitle: 'আপনার যা জানা দরকার',
      eligibilityFallback:
        'বিস্তারিত যোগ্যতার তথ্য সরকারি স্কিমের উৎস থেকে যাচাই করা উচিত।',
      additionalConditions: 'অতিরিক্ত শর্ত',
      requiredDocuments: 'প্রয়োজনীয় নথি',
      documentsTitle: 'আপনার যা লাগবে',
      noRequiredDocuments:
        'কোনো প্রয়োজনীয় নথি তালিকাভুক্ত নেই।',
      optionalDocuments: 'ঐচ্ছিক নথি',
      howToApply: 'কীভাবে আবেদন করবেন',
      applicationSteps: 'আবেদনের ধাপ',
      applicationFallback:
        'আবেদনের নির্দেশাবলি সরকারি স্কিমের উৎস থেকে যাচাই করা উচিত।',
      readyToApply: 'আবেদনের জন্য প্রস্তুত?',
      readinessTitle:
        'প্রথমে আপনার আবেদন প্রস্তুতি যাচাই করুন।',
      readinessText:
        'আবেদন শুরু করার আগে নিশ্চিত করুন যে আপনার কাছে প্রয়োজনীয় নথি রয়েছে।',
      checkReadiness: 'প্রস্তুতি যাচাই করুন →',
      officialInformation: 'সরকারি তথ্য',
      officialText:
        'আবেদন করার আগে সর্বশেষ যোগ্যতার মানদণ্ড, নথি এবং আবেদন নির্দেশাবলি সরকারি স্কিমের উৎস থেকে যাচাই করুন।',
      visitPortal: 'সরকারি পোর্টাল দেখুন →'
    }
  }

  const t =
    content[language] ||
    content.en

  const schemeId =
    window.location.pathname
      .split('/')
      .pop()

  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/scheme/${schemeId}`
        )

        if (!response.ok) {
          throw new Error(
            'Could not fetch scheme details'
          )
        }

        const data =
          await response.json()

        setScheme(data)
      } catch (error) {
        console.error(error)

        setError(
          'Could not load this scheme.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchScheme()
  }, [schemeId])

  const formatEligibilityKey = (key) => {
    return key
      .replaceAll('_', ' ')
      .replace(
        /\b\w/g,
        (letter) => letter.toUpperCase()
      )
  }

  const formatEligibilityValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ')
    }

    if (
      typeof value === 'object' &&
      value !== null
    ) {
      if (value.original_text) {
        return String(
          value.original_text
        )
      }

      return Object.entries(value)
        .map(
          ([key, item]) =>
            `${formatEligibilityKey(
              key
            )}: ${String(item)}`
        )
        .join(', ')
    }

    return String(value)
  }

  if (loading) {
    return (
      <div className="scheme-details-page">

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
              href="/results"
              className="back-link"
            >
              {t.backResults}
            </a>

          </div>

        </nav>

        <main className="scheme-details-container">

          <p>
            {t.loading}
          </p>

        </main>

      </div>
    )
  }

  if (error || !scheme) {
    return (
      <div className="scheme-details-page">

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
              href="/results"
              className="back-link"
            >
              {t.backResults}
            </a>

          </div>

        </nav>

        <main className="scheme-details-container">

          <h1>
            {t.unable}
          </h1>

          <p>
            {error || t.unableText}
          </p>

          <a
            href="/results"
            className="application-button"
          >
            {t.backResults}
          </a>

        </main>

      </div>
    )
  }

  return (
    <div className="scheme-details-page">

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
            href="/results"
            className="back-link"
          >
            {t.backResults}
          </a>

        </div>

      </nav>

      <main className="scheme-details-container">

        <div className="scheme-details-header">

          <span className="scheme-category">

            {scheme.category
              ? scheme.category.toUpperCase()
              : t.general}

          </span>

          <h1>
            {scheme.scheme_name}
          </h1>

          <p>
            {scheme.benefit?.description ||
              t.benefitFallback}
          </p>

        </div>


        <section className="scheme-status">

          <div>

            <span className="status-label">
              {t.statusLabel}
            </span>

            <h2>
              {scheme.manual_verification_required
                ? t.needsVerification
                : t.potentiallyEligible}
            </h2>

          </div>

          <p>
            {scheme.manual_verification_reason ||
              t.statusFallback}
          </p>

        </section>


        <div className="scheme-content">

          <section className="details-section">

            <p className="section-label">
              {t.benefit}
            </p>

            <h2>
              {t.benefitTitle}
            </h2>

            <p>
              {scheme.benefit?.description ||
                t.benefitFallbackLong}
            </p>

          </section>


          <section className="details-section">

            <p className="section-label">
              {t.eligibility}
            </p>

            <h2>
              {t.eligibilityTitle}
            </h2>

            {scheme.eligibility &&
            Object.keys(
              scheme.eligibility
            ).length > 0 ? (

              <div className="criteria-list">

                {Object.entries(
                  scheme.eligibility
                ).map(
                  ([key, value]) => (

                    <div
                      className="criteria-item"
                      key={key}
                    >

                      <div>

                        <strong>
                          {formatEligibilityKey(
                            key
                          )}
                        </strong>

                        <p>
                          {formatEligibilityValue(
                            value
                          )}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p>
                {t.eligibilityFallback}
              </p>

            )}

          </section>


          {scheme.additional_conditions?.length > 0 && (

            <section className="details-section">

              <p className="section-label">
                {t.additionalConditions}
              </p>

              <ul className="document-list">

                {scheme.additional_conditions.map(
                  (condition, index) => (

                    <li key={index}>
                      {condition}
                    </li>

                  )
                )}

              </ul>

            </section>

          )}


          <section className="details-section">

            <p className="section-label">
              {t.requiredDocuments}
            </p>

            <h2>
              {t.documentsTitle}
            </h2>

            {scheme.required_documents?.length > 0 ? (

              <ul className="document-list">

                {scheme.required_documents.map(
                  (document, index) => (

                    <li key={index}>
                      {document}
                    </li>

                  )
                )}

              </ul>

            ) : (

              <p>
                {t.noRequiredDocuments}
              </p>

            )}

          </section>


          {scheme.optional_documents?.length > 0 && (

            <section className="details-section">

              <p className="section-label">
                {t.optionalDocuments}
              </p>

              <ul className="document-list">

                {scheme.optional_documents.map(
                  (document, index) => (

                    <li key={index}>
                      {document}
                    </li>

                  )
                )}

              </ul>

            </section>

          )}


          <section className="details-section">

            <p className="section-label">
              {t.howToApply}
            </p>

            <h2>
              {t.applicationSteps}
            </h2>

            {scheme.application_steps?.length > 0 ? (

              <ol className="document-list">

                {scheme.application_steps.map(
                  (step, index) => (

                    <li key={index}>
                      {step}
                    </li>

                  )
                )}

              </ol>

            ) : (

              <p>
                {t.applicationFallback}
              </p>

            )}

          </section>


          <section className="application-section">

            <div>

              <p className="section-label">
                {t.readyToApply}
              </p>

              <h2>
                {t.readinessTitle}
              </h2>

              <p>
                {t.readinessText}
              </p>

            </div>

            <a
              href={`/application-readiness/${scheme.scheme_id}`}
              className="application-button"
            >
              {t.checkReadiness}
            </a>

          </section>


          <section className="source-section">

            <p className="section-label">
              {t.officialInformation}
            </p>

            <p>
              {t.officialText}
            </p>

            {scheme.official_portal && (

              <a
                href={scheme.official_portal}
                className="source-link"
                target="_blank"
                rel="noreferrer"
              >
                {t.visitPortal}
              </a>

            )}

          </section>

        </div>

      </main>

    </div>
  )
}

export default SchemeDetails