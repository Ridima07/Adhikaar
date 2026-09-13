import './Results.css'
import LanguageSelector from './LanguageSelector.jsx'

function Results() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const content = {
    en: {
      label: 'YOUR RESULTS',
      title: 'Benefits that may be relevant to you.',
      description:
        "Based on the information you've provided, these are the benefits we've identified for further consideration.",
      potential: 'potentially relevant benefits',
      categories: 'categories identified',
      verification: 'need additional verification',
      eligibility: 'ELIGIBILITY',
      found: 'What we found.',
      noRecommendations: 'No recommendations found',
      noRecommendationsText:
        "We couldn't find any benefits matching the information provided.",
      likelyEligible: 'Likely eligible',
      notEligible: 'Not eligible',
      needsVerification: 'Needs verification',
      profileMatch: 'profile match',
      viewDetails: 'View details →',
      benefitsGap: 'BENEFITS GAP',
      moreBenefits:
        'There may be more benefits worth exploring.',
      moreBenefitsText:
        "Your profile may also connect you with benefits across categories you haven't specifically searched for.",
      explore: 'Explore categories →',
      dashboard: '← Dashboard',
      general: 'GENERAL',
      genericSchemeText:
        'This scheme may be relevant based on your profile.'
    },

    hi: {
      label: 'आपके परिणाम',
      title: 'वे लाभ जो आपके लिए प्रासंगिक हो सकते हैं।',
      description:
        'आपके द्वारा दी गई जानकारी के आधार पर हमने इन लाभों की आगे जाँच के लिए पहचान की है।',
      potential: 'संभावित रूप से प्रासंगिक लाभ',
      categories: 'पहचानी गई श्रेणियाँ',
      verification: 'अतिरिक्त सत्यापन आवश्यक',
      eligibility: 'पात्रता',
      found: 'हमें क्या मिला।',
      noRecommendations: 'कोई सुझाव नहीं मिला',
      noRecommendationsText:
        'दी गई जानकारी के आधार पर हमें कोई उपयुक्त लाभ नहीं मिला।',
      likelyEligible: 'संभावित रूप से पात्र',
      notEligible: 'पात्र नहीं',
      needsVerification: 'सत्यापन आवश्यक',
      profileMatch: 'प्रोफ़ाइल मिलान',
      viewDetails: 'विवरण देखें →',
      benefitsGap: 'लाभ अंतर',
      moreBenefits:
        'ऐसे और लाभ हो सकते हैं जिन्हें देखना उपयोगी होगा।',
      moreBenefitsText:
        'आपकी प्रोफ़ाइल आपको ऐसी श्रेणियों के लाभों से भी जोड़ सकती है जिन्हें आपने विशेष रूप से नहीं खोजा है।',
      explore: 'श्रेणियाँ देखें →',
      dashboard: '← डैशबोर्ड',
      general: 'सामान्य',
      genericSchemeText:
        'आपकी प्रोफ़ाइल के आधार पर यह योजना प्रासंगिक हो सकती है।'
    },

    bn: {
      label: 'আপনার ফলাফল',
      title: 'আপনার জন্য প্রাসঙ্গিক হতে পারে এমন সুবিধা।',
      description:
        'আপনার দেওয়া তথ্যের ভিত্তিতে আমরা আরও বিবেচনার জন্য এই সুবিধাগুলো শনাক্ত করেছি।',
      potential: 'সম্ভাব্যভাবে প্রাসঙ্গিক সুবিধা',
      categories: 'শনাক্ত করা শ্রেণি',
      verification: 'অতিরিক্ত যাচাই প্রয়োজন',
      eligibility: 'যোগ্যতা',
      found: 'আমরা যা পেয়েছি।',
      noRecommendations: 'কোনো সুপারিশ পাওয়া যায়নি',
      noRecommendationsText:
        'দেওয়া তথ্যের সাথে মেলে এমন কোনো সুবিধা আমরা খুঁজে পাইনি।',
      likelyEligible: 'সম্ভাব্যভাবে যোগ্য',
      notEligible: 'যোগ্য নন',
      needsVerification: 'যাচাই প্রয়োজন',
      profileMatch: 'প্রোফাইল মিল',
      viewDetails: 'বিস্তারিত দেখুন →',
      benefitsGap: 'সুবিধার ঘাটতি',
      moreBenefits:
        'আরও কিছু সুবিধা রয়েছে যা দেখা মূল্যবান হতে পারে।',
      moreBenefitsText:
        'আপনার প্রোফাইল এমন কিছু শ্রেণির সুবিধার সাথেও মেলতে পারে যেগুলো আপনি নির্দিষ্টভাবে খোঁজেননি।',
      explore: 'শ্রেণিগুলো দেখুন →',
      dashboard: '← ড্যাশবোর্ড',
      general: 'সাধারণ',
      genericSchemeText:
        'আপনার প্রোফাইলের ভিত্তিতে এই স্কিমটি প্রাসঙ্গিক হতে পারে।'
    }
  }

  const schemeNames = {
    'pradhan mantri suraksha bima yojana (pmsby)': {
      hi: 'प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)',
      bn: 'প্রধানমন্ত্রী সুরক্ষা বিমা যোজনা (PMSBY)'
    },

    'pradhan mantri svamitva scheme (pmsy)': {
      hi: 'प्रधानमंत्री स्वामित्व योजना (PMSY)',
      bn: 'প্রধানমন্ত্রী স্বামিত্ব প্রকল্প (PMSY)'
    },

    'delhi arogya kosh (dak)': {
      hi: 'दिल्ली आरोग्य कोष (DAK)',
      bn: 'দিল্লি আরোগ্য কোষ (DAK)'
    }
  }

  const categories = {
    'financial inclusion / insurance': {
      hi: 'वित्तीय समावेशन / बीमा',
      bn: 'আর্থিক অন্তর্ভুক্তি / বীমা'
    },

    'rural development / land ownership': {
      hi: 'ग्रामीण विकास / भूमि स्वामित्व',
      bn: 'গ্রামীণ উন্নয়ন / জমির মালিকানা'
    },

    'healthcare / financial assistance': {
      hi: 'स्वास्थ्य सेवा / वित्तीय सहायता',
      bn: 'স্বাস্থ্যসেবা / আর্থিক সহায়তা'
    }
  }

  const summaries = {
    'you satisfy all the known eligibility conditions for this scheme.': {
      hi: 'आप इस योजना की सभी ज्ञात पात्रता शर्तों को पूरा करते हैं।',
      bn: 'আপনি এই প্রকল্পের সমস্ত পরিচিত যোগ্যতার শর্ত পূরণ করেন।'
    },

    'you satisfy all the known eligibility conditions for this scheme. some conditions may still require official verification.': {
      hi: 'आप इस योजना की सभी ज्ञात पात्रता शर्तों को पूरा करते हैं। कुछ शर्तों के लिए अभी भी आधिकारिक सत्यापन आवश्यक हो सकता है।',
      bn: 'আপনি এই প্রকল্পের সমস্ত পরিচিত যোগ্যতার শর্ত পূরণ করেন। কিছু শর্তের জন্য এখনও সরকারি যাচাই প্রয়োজন হতে পারে।'
    }
  }

  const translateSchemeName = (name) => {
    if (!name || language === 'en') {
      return name
    }

    const key =
      String(name)
        .trim()
        .toLowerCase()

    return (
      schemeNames[key]?.[language] ||
      name
    )
  }

  const translateCategory = (category) => {
    if (!category) {
      return ''
    }

    if (language === 'en') {
      return category
    }

    const key =
      String(category)
        .trim()
        .toLowerCase()

    return (
      categories[key]?.[language] ||
      category
    )
  }

  const translateSummary = (summary) => {
    if (!summary || language === 'en') {
      return summary
    }

    const key =
      String(summary)
        .trim()
        .toLowerCase()

    return (
      summaries[key]?.[language] ||
      summary
    )
  }

  const t =
    content[language] ||
    content.en

  const data =
    JSON.parse(
      localStorage.getItem(
        'adhikaarRecommendations'
      )
    ) || {
      total_recommendations: 0,
      recommendations: []
    }

  const recommendations =
    data.recommendations || []

  const categoriesCount =
    new Set(
      recommendations.map(
        (scheme) => scheme.category
      )
    ).size

  const needsVerification =
    recommendations.filter(
      (scheme) =>
        scheme.manual_verification_required ===
          true ||
        scheme.status ===
          'needs_verification'
    ).length

  const getStatusText = (scheme) => {
    if (
      scheme.status ===
        'possibly_eligible' ||
      scheme.status ===
        'eligible'
    ) {
      return t.likelyEligible
    }

    if (
      scheme.status ===
      'ineligible'
    ) {
      return t.notEligible
    }

    return t.needsVerification
  }

  const getStatusClass = (scheme) => {
    if (
      scheme.status ===
        'possibly_eligible' ||
      scheme.status ===
        'eligible'
    ) {
      return 'eligible'
    }

    if (
      scheme.status ===
      'ineligible'
    ) {
      return 'not-eligible'
    }

    return 'review'
  }

  return (
    <div className="results-page">

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
            {t.dashboard}
          </a>

        </div>

      </nav>

      <main className="results-container">

        <div className="results-header">

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

        <section className="results-summary">

          <div>

            <span className="result-number">
              {data.total_recommendations}
            </span>

            <p>
              {t.potential}
            </p>

          </div>

          <div>

            <span className="result-number">
              {categoriesCount}
            </span>

            <p>
              {t.categories}
            </p>

          </div>

          <div>

            <span className="result-number">
              {needsVerification}
            </span>

            <p>
              {t.verification}
            </p>

          </div>

        </section>

        <section className="eligibility-section">

          <div className="section-heading">

            <p className="section-label">
              {t.eligibility}
            </p>

            <h2>
              {t.found}
            </h2>

          </div>

          <div className="eligibility-list">

            {recommendations.length === 0 ? (

              <div className="eligibility-item">

                <div className="eligibility-content">

                  <h3>
                    {t.noRecommendations}
                  </h3>

                  <p>
                    {t.noRecommendationsText}
                  </p>

                </div>

              </div>

            ) : (

              recommendations.map(
                (scheme) => (

                  <div
                    className="eligibility-item"
                    key={scheme.scheme_id}
                  >

                    <div
                      className={`eligibility-status ${getStatusClass(
                        scheme
                      )}`}
                    >
                      {getStatusText(
                        scheme
                      )}
                    </div>

                    <div className="eligibility-content">

                      <span>
                        {scheme.category
                          ? translateCategory(
                              scheme.category
                            )
                          : t.general}
                      </span>

                      <h3>
                        {translateSchemeName(
                          scheme.scheme_name
                        )}
                      </h3>

                      <p>
                        {translateSummary(
                          scheme.eligibility_summary
                        ) ||
                          t.genericSchemeText}
                      </p>

                      <div className="match-percentage">
                        {scheme.match_percentage}% {t.profileMatch}
                      </div>

                    </div>

                    <a
                      href={`/scheme-details/${scheme.scheme_id}`}
                      className="result-link"
                    >
                      {t.viewDetails}
                    </a>

                  </div>

                )
              )

            )}

          </div>

        </section>

        <section className="gap-section">

          <div>

            <p className="section-label">
              {t.benefitsGap}
            </p>

            <h2>
              {t.moreBenefits}
            </h2>

            <p>
              {t.moreBenefitsText}
            </p>

          </div>

          <a
            href="/benefits-gap"
            className="gap-button"
          >
            {t.explore}
          </a>

        </section>

      </main>

    </div>
  )
}

export default Results