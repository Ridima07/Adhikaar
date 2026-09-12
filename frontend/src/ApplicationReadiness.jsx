import { useEffect, useState } from 'react'
import './ApplicationReadiness.css'
import LanguageSelector from './LanguageSelector.jsx'

function ApplicationReadiness() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const content = {
    en: {
      sectionLabel: 'APPLICATION READINESS',
      chooseTitle: 'Which scheme are you preparing for?',
      chooseDescription:
        "Choose a scheme and we'll check whether you have everything needed to apply.",
      noSchemesLabel: 'NO SCHEMES FOUND',
      noSchemesTitle:
        "We don't have any recommended schemes yet.",
      noSchemesText:
        'Find schemes first, then come back here to check your application readiness.',
      findSchemes: 'Find schemes →',
      yourSchemes: 'YOUR SCHEMES',
      selectOne: 'Select one to continue.',
      check: 'Check →',
      back: '← Back',
      chooseAnother: '← Choose another scheme',
      chooseScheme: '← Choose a scheme',
      unableTitle: 'Unable to load requirements.',
      loading: 'Loading application readiness...',
      readyTitle: 'Are you ready to apply?',
      readyDescription:
        'Select the documents you currently have for',
      requiredDocuments: 'REQUIRED DOCUMENTS',
      whatDoYouHave: 'What do you have?',
      availableHint:
        'Select this if you currently have it.',
      checkLabel: 'CHECK YOUR READINESS',
      missingTitle: "See what's still missing.",
      missingText:
        'Adhikaar will compare your documents with the requirements listed for this scheme.',
      checking: 'Checking...',
      checkReadiness: 'Check readiness →',
      readyToApply: 'READY TO APPLY',
      almostThere: 'ALMOST THERE',
      allDocuments:
        'You have all the required documents.',
      missingDocuments:
        'You still have some documents to arrange.',
      readinessText:
        'Your current document readiness is',
      requirementsReady: 'requirements ready',
      checklist: 'DOCUMENT CHECKLIST',
      applicationStatus: 'Your application status.',
      availableMessage:
        'You marked this document as available.',
      ready: 'Ready',
      missingMessage:
        'This document is still required.',
      missing: 'Missing',
      nextStep: 'NEXT STEP',
      moveOn:
        'You can move on to the application process.',
      arrange:
        'Arrange the missing documents before applying.',
      verify:
        'Always verify the latest requirements and application instructions through the official scheme source.',
      officialRequirements:
        'View official requirements →',
      error:
        'Could not load scheme requirements.',
      documentError:
        'Could not check your documents.'
    },

    hi: {
      sectionLabel: 'आवेदन की तैयारी',
      chooseTitle: 'आप किस योजना के लिए आवेदन की तैयारी कर रहे हैं?',
      chooseDescription:
        'एक योजना चुनें और हम जाँचेंगे कि आवेदन के लिए आपके पास आवश्यक चीज़ें हैं या नहीं।',
      noSchemesLabel: 'कोई योजना नहीं मिली',
      noSchemesTitle:
        'अभी हमारे पास कोई अनुशंसित योजना नहीं है।',
      noSchemesText:
        'पहले योजनाएँ खोजें, फिर आवेदन की तैयारी जाँचने के लिए यहाँ वापस आएँ।',
      findSchemes: 'योजनाएँ खोजें →',
      yourSchemes: 'आपकी योजनाएँ',
      selectOne: 'जारी रखने के लिए एक चुनें।',
      check: 'जाँचें →',
      back: '← वापस',
      chooseAnother: '← दूसरी योजना चुनें',
      chooseScheme: '← योजना चुनें',
      unableTitle: 'आवश्यकताएँ लोड नहीं हो सकीं।',
      loading: 'आवेदन की तैयारी लोड हो रही है...',
      readyTitle: 'क्या आप आवेदन के लिए तैयार हैं?',
      readyDescription:
        'नीचे उन दस्तावेज़ों का चयन करें जो आपके पास मौजूद हैं',
      requiredDocuments: 'आवश्यक दस्तावेज़',
      whatDoYouHave: 'आपके पास क्या है?',
      availableHint:
        'यदि यह दस्तावेज़ आपके पास है तो इसे चुनें।',
      checkLabel: 'अपनी तैयारी जाँचें',
      missingTitle: 'देखें कि क्या अभी बाकी है।',
      missingText:
        'अधिकार आपके दस्तावेज़ों की तुलना इस योजना की आवश्यकताओं से करेगा।',
      checking: 'जाँच हो रही है...',
      checkReadiness: 'तैयारी जाँचें →',
      readyToApply: 'आवेदन के लिए तैयार',
      almostThere: 'लगभग तैयार',
      allDocuments:
        'आपके पास सभी आवश्यक दस्तावेज़ हैं।',
      missingDocuments:
        'अभी कुछ दस्तावेज़ व्यवस्थित करने बाकी हैं।',
      readinessText:
        'आपकी वर्तमान दस्तावेज़ तैयारी',
      requirementsReady: 'आवश्यकताएँ पूरी हैं',
      checklist: 'दस्तावेज़ सूची',
      applicationStatus: 'आपकी आवेदन स्थिति।',
      availableMessage:
        'आपने बताया कि यह दस्तावेज़ आपके पास उपलब्ध है।',
      ready: 'तैयार',
      missingMessage:
        'यह दस्तावेज़ अभी भी आवश्यक है।',
      missing: 'बाकी',
      nextStep: 'अगला कदम',
      moveOn:
        'अब आप आवेदन प्रक्रिया की ओर बढ़ सकते हैं।',
      arrange:
        'आवेदन करने से पहले बाकी दस्तावेज़ तैयार करें।',
      verify:
        'हमेशा आधिकारिक योजना स्रोत से नवीनतम आवश्यकताओं और आवेदन निर्देशों की पुष्टि करें।',
      officialRequirements:
        'आधिकारिक आवश्यकताएँ देखें →',
      error:
        'योजना की आवश्यकताएँ लोड नहीं हो सकीं।',
      documentError:
        'आपके दस्तावेज़ जाँचे नहीं जा सके।'
    },

    bn: {
      sectionLabel: 'আবেদনের প্রস্তুতি',
      chooseTitle: 'আপনি কোন স্কিমের জন্য আবেদন করার প্রস্তুতি নিচ্ছেন?',
      chooseDescription:
        'একটি স্কিম নির্বাচন করুন এবং আমরা যাচাই করব আবেদন করার জন্য আপনার প্রয়োজনীয় সবকিছু আছে কি না।',
      noSchemesLabel: 'কোনো স্কিম পাওয়া যায়নি',
      noSchemesTitle:
        'এখনও কোনো প্রস্তাবিত স্কিম নেই।',
      noSchemesText:
        'প্রথমে স্কিম খুঁজুন, তারপর আবেদনের প্রস্তুতি যাচাই করতে এখানে ফিরে আসুন।',
      findSchemes: 'স্কিম খুঁজুন →',
      yourSchemes: 'আপনার স্কিম',
      selectOne: 'চালিয়ে যেতে একটি নির্বাচন করুন।',
      check: 'যাচাই করুন →',
      back: '← ফিরে যান',
      chooseAnother: '← অন্য স্কিম নির্বাচন করুন',
      chooseScheme: '← একটি স্কিম নির্বাচন করুন',
      unableTitle: 'প্রয়োজনীয়তা লোড করা যায়নি।',
      loading: 'আবেদনের প্রস্তুতি লোড হচ্ছে...',
      readyTitle: 'আপনি কি আবেদন করার জন্য প্রস্তুত?',
      readyDescription:
        'আপনার কাছে বর্তমানে যে নথিগুলো আছে সেগুলো নির্বাচন করুন',
      requiredDocuments: 'প্রয়োজনীয় নথি',
      whatDoYouHave: 'আপনার কাছে কী আছে?',
      availableHint:
        'নথিটি আপনার কাছে থাকলে এটি নির্বাচন করুন।',
      checkLabel: 'আপনার প্রস্তুতি যাচাই করুন',
      missingTitle: 'কী এখনও বাকি আছে দেখুন।',
      missingText:
        'অধিকার আপনার নথিগুলোকে এই স্কিমের প্রয়োজনীয়তার সাথে তুলনা করবে।',
      checking: 'যাচাই করা হচ্ছে...',
      checkReadiness: 'প্রস্তুতি যাচাই করুন →',
      readyToApply: 'আবেদন করার জন্য প্রস্তুত',
      almostThere: 'প্রায় প্রস্তুত',
      allDocuments:
        'আপনার কাছে সব প্রয়োজনীয় নথি রয়েছে।',
      missingDocuments:
        'এখনও কিছু নথি প্রস্তুত করা বাকি আছে।',
      readinessText:
        'আপনার বর্তমান নথি প্রস্তুতির হার',
      requirementsReady: 'প্রয়োজনীয়তা প্রস্তুত',
      checklist: 'নথির তালিকা',
      applicationStatus: 'আপনার আবেদনের অবস্থা।',
      availableMessage:
        'আপনি এই নথিটি আপনার কাছে আছে বলে উল্লেখ করেছেন।',
      ready: 'প্রস্তুত',
      missingMessage:
        'এই নথিটি এখনও প্রয়োজন।',
      missing: 'বাকি',
      nextStep: 'পরবর্তী ধাপ',
      moveOn:
        'এখন আপনি আবেদন প্রক্রিয়ায় এগিয়ে যেতে পারেন।',
      arrange:
        'আবেদন করার আগে বাকি নথিগুলো প্রস্তুত করুন।',
      verify:
        'আবেদন করার আগে সর্বশেষ প্রয়োজনীয়তা ও নির্দেশাবলি সরকারি স্কিমের উৎস থেকে যাচাই করুন।',
      officialRequirements:
        'সরকারি প্রয়োজনীয়তা দেখুন →',
      error:
        'স্কিমের প্রয়োজনীয়তা লোড করা যায়নি।',
      documentError:
        'আপনার নথি যাচাই করা যায়নি।'
    }
  }

  const t =
    content[language] ||
    content.en

  const pathParts =
    window.location.pathname
      .split('/')
      .filter(Boolean)

  const schemeId =
    pathParts[0] === 'application-readiness'
      ? pathParts[1]
      : null

  const [recommendations, setRecommendations] = useState([])
  const [scheme, setScheme] = useState(null)
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [documentStatus, setDocumentStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const storedData =
          JSON.parse(
            localStorage.getItem(
              'adhikaarRecommendations'
            )
          ) || {
            recommendations: []
          }

        const storedRecommendations =
          storedData.recommendations || []

        setRecommendations(
          storedRecommendations
        )

        if (!schemeId) {
          setLoading(false)
          return
        }

        const response = await fetch(
          `http://127.0.0.1:8000/scheme/${schemeId}`
        )

        if (!response.ok) {
          throw new Error(
            'Could not fetch scheme'
          )
        }

        const data =
          await response.json()

        setScheme(data)

      } catch (error) {
        console.error(error)

        setError(t.error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [schemeId, language])

  const handleDocumentChange = (
    document
  ) => {
    setSelectedDocuments(
      (current) => {

        if (
          current.includes(document)
        ) {
          return current.filter(
            (item) =>
              item !== document
          )
        }

        return [
          ...current,
          document
        ]
      }
    )
  }

  const checkReadiness = async () => {
    if (!scheme) {
      return
    }

    setChecking(true)
    setError('')

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/scheme/${scheme.scheme_id}/document-check`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            available_documents:
              selectedDocuments
          })
        }
      )

      if (!response.ok) {
        throw new Error(
          'Could not check documents'
        )
      }

      const data =
        await response.json()

      setDocumentStatus(data)

    } catch (error) {
      console.error(error)

      setError(t.documentError)

    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="readiness-page">

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
              {t.back}
            </a>

          </div>

        </nav>

        <main className="readiness-container">

          <p>
            {t.loading}
          </p>

        </main>

      </div>
    )
  }

  if (!schemeId) {
    return (
      <div className="readiness-page">

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
              {t.back}
            </a>

          </div>

        </nav>

        <main className="readiness-container">

          <div className="readiness-header">

            <p className="section-label">
              {t.sectionLabel}
            </p>

            <h1>
              {t.chooseTitle}
            </h1>

            <p>
              {t.chooseDescription}
            </p>

          </div>

          {recommendations.length === 0 ? (

            <section className="documents-section">

              <div className="section-heading">

                <p className="section-label">
                  {t.noSchemesLabel}
                </p>

                <h2>
                  {t.noSchemesTitle}
                </h2>

                <p>
                  {t.noSchemesText}
                </p>

              </div>

              <a
                href="/find-schemes"
                className="official-button"
              >
                {t.findSchemes}
              </a>

            </section>

          ) : (

            <section className="documents-section">

              <div className="section-heading">

                <p className="section-label">
                  {t.yourSchemes}
                </p>

                <h2>
                  {t.selectOne}
                </h2>

              </div>

              <div className="document-checklist">

                {recommendations.map(
                  (recommendation) => (

                    <a
                      key={
                        recommendation.scheme_id
                      }
                      href={`/application-readiness/${recommendation.scheme_id}`}
                      className="readiness-item"
                    >

                      <div>

                        <p className="section-label">
                          {recommendation.category}
                        </p>

                        <h3>
                          {recommendation.scheme_name}
                        </h3>

                        {recommendation.match_percentage !==
                          undefined && (
                          <p>
                            {
                              recommendation.match_percentage
                            }% {language === 'hi'
                              ? 'प्रोफ़ाइल मिलान'
                              : language === 'bn'
                                ? 'প্রোফাইল মিল'
                                : 'profile match'}
                          </p>
                        )}

                      </div>

                      <span className="item-status">
                        {t.check}
                      </span>

                    </a>

                  )
                )}

              </div>

            </section>

          )}

        </main>

      </div>
    )
  }

  if (error && !scheme) {
    return (
      <div className="readiness-page">

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
              href="/application-readiness"
              className="back-link"
            >
              {t.chooseAnother}
            </a>

          </div>

        </nav>

        <main className="readiness-container">

          <h1>
            {t.unableTitle}
          </h1>

          <p>
            {error}
          </p>

          <a
            href="/application-readiness"
            className="official-button"
          >
            {t.chooseScheme}
          </a>

        </main>

      </div>
    )
  }

  const documents =
    scheme?.required_documents || []

  const total =
    documentStatus?.total_required_documents ||
    documents.length

  const missing =
    documentStatus?.missing_documents?.length ||
    0

  const ready = documentStatus
    ? total - missing
    : 0

  const readinessPercentage =
    documentStatus
      ? documentStatus.readiness_percentage
      : 0

  return (
    <div className="readiness-page">

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
            href="/application-readiness"
            className="back-link"
          >
            {t.chooseAnother}
          </a>

        </div>

      </nav>

      <main className="readiness-container">

        <div className="readiness-header">

          <p className="section-label">
            {t.sectionLabel}
          </p>

          <h1>
            {t.readyTitle}
          </h1>

          <p>
            {t.readyDescription}{' '}
            <strong>
              {scheme.scheme_name}
            </strong>.
          </p>

        </div>

        {!documentStatus && (

          <section className="documents-section">

            <div className="section-heading">

              <p className="section-label">
                {t.requiredDocuments}
              </p>

              <h2>
                {t.whatDoYouHave}
              </h2>

            </div>

            <div className="document-checklist">

              {documents.map(
                (document) => (

                  <label
                    className="readiness-item"
                    key={document}
                  >

                    <input
                      type="checkbox"
                      checked={
                        selectedDocuments.includes(
                          document
                        )
                      }
                      onChange={() =>
                        handleDocumentChange(
                          document
                        )
                      }
                    />

                    <div>

                      <h3>
                        {document}
                      </h3>

                      <p>
                        {t.availableHint}
                      </p>

                    </div>

                  </label>

                )
              )}

            </div>

            {error && (
              <p className="form-note">
                {error}
              </p>
            )}

            <div className="readiness-actions">

              <div>

                <p className="section-label">
                  {t.checkLabel}
                </p>

                <h2>
                  {t.missingTitle}
                </h2>

                <p>
                  {t.missingText}
                </p>

              </div>

              <button
                type="button"
                className="official-button"
                onClick={checkReadiness}
                disabled={checking}
              >
                {checking
                  ? t.checking
                  : t.checkReadiness}
              </button>

            </div>

          </section>

        )}

        {documentStatus && (

          <>

            <section className="readiness-summary">

              <div className="readiness-score">

                <span>
                  {ready}/{total}
                </span>

                <p>
                  {t.requirementsReady}
                </p>

              </div>

              <div className="readiness-message">

                <p className="section-label">
                  {readinessPercentage === 100
                    ? t.readyToApply
                    : t.almostThere}
                </p>

                <h2>
                  {readinessPercentage === 100
                    ? t.allDocuments
                    : t.missingDocuments}
                </h2>

                <p>
                  {t.readinessText}{' '}
                  {readinessPercentage}%.
                </p>

              </div>

            </section>

            <section className="documents-section">

              <div className="section-heading">

                <p className="section-label">
                  {t.checklist}
                </p>

                <h2>
                  {t.applicationStatus}
                </h2>

              </div>

              <div className="document-checklist">

                {documentStatus.available_documents?.map(
                  (document, index) => (

                    <div
                      className="readiness-item"
                      key={
                        `available-${index}`
                      }
                    >

                      <div className="readiness-icon ready">
                        ✓
                      </div>

                      <div>

                        <h3>
                          {document}
                        </h3>

                        <p>
                          {t.availableMessage}
                        </p>

                      </div>

                      <span className="item-status">
                        {t.ready}
                      </span>

                    </div>

                  )
                )}

                {documentStatus.missing_documents?.map(
                  (document, index) => (

                    <div
                      className="readiness-item missing"
                      key={
                        `missing-${index}`
                      }
                    >

                      <div className="readiness-icon">
                        !
                      </div>

                      <div>

                        <h3>
                          {document}
                        </h3>

                        <p>
                          {t.missingMessage}
                        </p>

                      </div>

                      <span className="item-status">
                        {t.missing}
                      </span>

                    </div>

                  )
                )}

              </div>

            </section>

            <section className="readiness-actions">

              <div>

                <p className="section-label">
                  {t.nextStep}
                </p>

                <h2>
                  {readinessPercentage === 100
                    ? t.moveOn
                    : t.arrange}
                </h2>

                <p>
                  {t.verify}
                </p>

              </div>

              {scheme.official_portal && (

                <a
                  href={scheme.official_portal}
                  className="official-button"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.officialRequirements}
                </a>

              )}

            </section>

          </>

        )}

      </main>

    </div>
  )
}

export default ApplicationReadiness