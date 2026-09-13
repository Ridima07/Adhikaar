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

  const schemeTranslations = {
    FIN001: {
      name: {
        hi: 'प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)',
        bn: 'প্রধানমন্ত্রী সুরক্ষা বিমা যোজনা (PMSBY)'
      },
      category: {
        hi: 'वित्तीय समावेशन / बीमा',
        bn: 'আর্থিক অন্তর্ভুক্তি / বীমা'
      },
      description: {
        hi: 'आकस्मिक मृत्यु या पूर्ण स्थायी विकलांगता के लिए ₹2,00,000 और आंशिक स्थायी विकलांगता के लिए ₹1,00,000 की सहायता (प्रीमियम: ₹20/वर्ष)।',
        bn: 'আকস্মিক মৃত্যু বা সম্পূর্ণ স্থায়ী প্রতিবন্ধিতার জন্য ₹২,০০,০০০ এবং আংশিক স্থায়ী প্রতিবন্ধিতার জন্য ₹১,০০,০০০ সহায়তা (প্রিমিয়াম: ₹২০/বছর)।'
      }
    },

    RUR002: {
      name: {
        hi: 'प्रधानमंत्री स्वामित्व योजना (PMSY)',
        bn: 'প্রধানমন্ত্রী স্বামিত্ব প্রকল্প (PMSY)'
      },
      category: {
        hi: 'ग्रामीण विकास / भूमि स्वामित्व',
        bn: 'গ্রামীণ উন্নয়ন / জমির মালিকানা'
      },
      description: {
        hi: 'आधिकारिक संपत्ति कार्ड जारी करना, जिससे वित्तीय ऋण प्राप्त करने और संपत्ति विवादों के समाधान में सहायता मिलती है।',
        bn: 'অফিসিয়াল সম্পত্তি কার্ড জারি করা হয়, যা আর্থিক ঋণ পেতে এবং সম্পত্তি বিরোধ সমাধানে সহায়তা করে।'
      }
    },

    MED004: {
      name: {
        hi: 'दिल्ली आरोग्य कोष (DAK)',
        bn: 'দিল্লি আরোগ্য কোষ (DAK)'
      },
      category: {
        hi: 'स्वास्थ्य सेवा / वित्तीय सहायता',
        bn: 'স্বাস্থ্যসেবা / আর্থিক সহায়তা'
      },
      description: {
        hi: 'गंभीर सर्जरी के लिए ₹5,00,000 तक की वित्तीय सहायता और सूचीबद्ध केंद्रों पर मुफ्त उच्च स्तरीय नैदानिक परीक्षण (MRI, PET-CT)।',
        bn: 'জটিল অস্ত্রোপচারের জন্য ₹৫,০০,০০০ পর্যন্ত আর্থিক সহায়তা এবং তালিকাভুক্ত কেন্দ্রে বিনামূল্যে উচ্চমানের ডায়াগনস্টিক পরীক্ষা (MRI, PET-CT)।'
      }
    }
  }

  const eligibilityLabels = {
    age: {
      hi: 'आयु',
      bn: 'বয়স'
    },
    state: {
      hi: 'राज्य',
      bn: 'রাজ্য'
    },
    district: {
      hi: 'जिला',
      bn: 'জেলা'
    },
    residence_requirement: {
      hi: 'निवास की आवश्यकता',
      bn: 'বাসস্থানের প্রয়োজনীয়তা'
    },
    occupation: {
      hi: 'व्यवसाय',
      bn: 'পেশা'
    },
    user_type: {
      hi: 'उपयोगकर्ता प्रकार',
      bn: 'ব্যবহারকারীর ধরন'
    },
    education_level: {
      hi: 'शिक्षा स्तर',
      bn: 'শিক্ষার স্তর'
    },
    course_type: {
      hi: 'पाठ्यक्रम प्रकार',
      bn: 'কোর্সের ধরন'
    },
    institution_type: {
      hi: 'संस्थान प्रकार',
      bn: 'প্রতিষ্ঠানের ধরন'
    },
    social_category: {
      hi: 'सामाजिक श्रेणी',
      bn: 'সামাজিক শ্রেণি'
    },
    gender: {
      hi: 'लिंग',
      bn: 'লিঙ্গ'
    },
    disability_status: {
      hi: 'दिव्यांगता स्थिति',
      bn: 'প্রতিবন্ধিতার অবস্থা'
    },
    disability_percentage: {
      hi: 'दिव्यांगता प्रतिशत',
      bn: 'প্রতিবন্ধিতার শতাংশ'
    },
    annual_income: {
      hi: 'वार्षिक आय',
      bn: 'বার্ষিক আয়'
    },
    employment_status: {
      hi: 'रोज़गार स्थिति',
      bn: 'কর্মসংস্থানের অবস্থা'
    },
    other_conditions: {
      hi: 'अन्य शर्तें',
      bn: 'অন্যান্য শর্ত'
    },
    original_eligibility_text: {
      hi: 'मूल पात्रता पाठ',
      bn: 'মূল যোগ্যতার বিবরণ'
    }
  }

  const commonTextTranslations = {
    'No age restriction': {
      hi: 'आयु की कोई सीमा नहीं',
      bn: 'বয়সের কোনো সীমা নেই'
    },
    Delhi: {
      hi: 'दिल्ली',
      bn: 'দিল्ली'
    },
    'Open to all': {
      hi: 'सभी के लिए खुला',
      bn: 'সকলের জন্য উন্মুক্ত'
    },
    'No requirement': {
      hi: 'कोई आवश्यकता नहीं',
      bn: 'কোনো প্রয়োজন নেই'
    },
    'Must hold individual savings account in participating bank/post office and authorize auto-debit': {
      hi: 'भाग लेने वाले बैंक/डाकघर में व्यक्तिगत बचत खाता होना चाहिए और ऑटो-डेबिट की अनुमति देनी होगी।',
      bn: 'অংশগ্রহণকারী ব্যাংক/ডাকঘরে ব্যক্তিগত সঞ্চয় অ্যাকাউন্ট থাকতে হবে এবং অটো-ডেবিটের অনুমতি দিতে হবে।'
    },
    'Resident of Delhi holding valid Voter ID / Proof of residence for 3 years': {
      hi: 'दिल्ली का निवासी होना चाहिए और 3 वर्षों के निवास का वैध मतदाता पहचान पत्र या निवास प्रमाण होना चाहिए।',
      bn: 'দিল্লির বাসিন্দা হতে হবে এবং ৩ বছরের বসবাসের বৈধ ভোটার আইডি বা বাসস্থানের প্রমাণ থাকতে হবে।'
    },
    'Treatment or diagnostic test referred by a Delhi Govt hospital to empaneled private centres': {
      hi: 'उपचार या नैदानिक परीक्षण के लिए दिल्ली सरकार के अस्पताल से सूचीबद्ध निजी केंद्र में रेफरल होना चाहिए।',
      bn: 'চিকিৎসা বা ডায়াগনস্টিক পরীক্ষার জন্য দিল্লি সরকারের হাসপাতাল থেকে তালিকাভুক্ত বেসরকারি কেন্দ্রে রেফার করা হতে হবে।'
    },
    'Annual family income up to ₹3,00,000 (No income bar for road accident victims)': {
      hi: 'वार्षिक पारिवारिक आय ₹3,00,000 तक होनी चाहिए (सड़क दुर्घटना पीड़ितों के लिए आय सीमा नहीं है)।',
      bn: 'বার্ষিক পারিবারিক আয় ₹৩,০০,০০০ পর্যন্ত হতে হবে (সড়ক দুর্ঘটনার শিকারদের জন্য আয়ের কোনো সীমা নেই)।'
    },
    'State: Delhi; Residence: Minimum 3 years; Annual Income: Up to ₹3,00,000; Referred by Delhi Govt Hospital': {
      hi: 'राज्य: दिल्ली; निवास: न्यूनतम 3 वर्ष; वार्षिक आय: ₹3,00,000 तक; दिल्ली सरकार के अस्पताल से रेफरल आवश्यक।',
      bn: 'রাজ্য: দিল্লি; বাসস্থান: ন্যূনতম ৩ বছর; বার্ষিক আয়: ₹৩,০০,০০০ পর্যন্ত; দিল্লি সরকারের হাসপাতাল থেকে রেফারেল প্রয়োজন।'
    }
  }

  const translateText = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return value
    }

    if (language === 'en') {
      return String(value)
    }

    const text = String(value)

    if (
      commonTextTranslations[text]?.[language]
    ) {
      return commonTextTranslations[text][language]
    }

    return text
  }

  const translateSchemeField = (
    field,
    value
  ) => {
    if (
      language === 'en' ||
      value === null ||
      value === undefined
    ) {
      return value
    }

    if (
      schemeTranslations[schemeId]?.[field]?.[language]
    ) {
      return schemeTranslations[schemeId][field][language]
    }

    return translateText(value)
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
          language === 'hi'
            ? 'यह योजना लोड नहीं हो सकी।'
            : language === 'bn'
              ? 'এই স্কিমটি লোড করা যায়নি।'
              : 'Could not load this scheme.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchScheme()
  }, [schemeId, language])

  const formatEligibilityKey = (key) => {
    if (
      language !== 'en' &&
      eligibilityLabels[key]?.[language]
    ) {
      return eligibilityLabels[key][language]
    }

    return key
      .replaceAll('_', ' ')
      .replace(
        /\b\w/g,
        (letter) => letter.toUpperCase()
      )
  }

  const formatEligibilityValue = (key, value) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return null
    }

    if (Array.isArray(value)) {
      const translatedItems =
        value
          .map((item) =>
            translateText(item)
          )
          .filter(Boolean)

      return translatedItems.join(', ')
    }

    if (
      typeof value === 'object'
      && value !== null
    ) {
      if (value.original_text) {
        return translateText(
          value.original_text
        )
      }

      return Object.entries(value)
        .map(
          ([childKey, item]) => {

            if (
              item === null ||
              item === undefined ||
              item === ''
            ) {
              return null
            }

            return `${formatEligibilityKey(
              childKey
            )}: ${translateText(item)}`
          }
        )
        .filter(Boolean)
        .join(', ')
    }

    return translateText(value)
  }

  const translateListItem = (item) => {
    if (!item) {
      return ''
    }

    return translateText(item)
  }

  const translateReason = (reason) => {
    if (!reason) {
      return t.statusFallback
    }

    const knownReasons = {
      'Medical superintendent endorsement and income verification from revenue authorities are mandatory.': {
        hi: 'चिकित्सा अधीक्षक की स्वीकृति और राजस्व अधिकारियों से आय सत्यापन अनिवार्य है।',
        bn: 'মেডিক্যাল সুপারিনটেনডেন্টের অনুমোদন এবং রাজস্ব কর্তৃপক্ষের কাছ থেকে আয় যাচাই বাধ্যতামূলক।'
      }
    }

    return (
      knownReasons[reason]?.[language] ||
      translateText(reason)
    )
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

  const schemeName =
    translateSchemeField(
      'name',
      scheme.scheme_name
    )

  const schemeCategory =
    translateSchemeField(
      'category',
      scheme.category
    ) || t.general

  const schemeDescription =
    translateSchemeField(
      'description',
      scheme.benefit?.description
    ) ||
    t.benefitFallback

  const additionalConditions =
    (scheme.additional_conditions || [])
      .map(translateListItem)
      .filter(Boolean)

  const requiredDocuments =
    (scheme.required_documents || [])
      .map(translateListItem)
      .filter(Boolean)

  const optionalDocuments =
    (scheme.optional_documents || [])
      .map(translateListItem)
      .filter(Boolean)

  const applicationSteps =
    (scheme.application_steps || [])
      .map(translateListItem)
      .filter(Boolean)

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
            {language === 'en'
              ? schemeCategory.toUpperCase()
              : schemeCategory}
          </span>

          <h1>
            {schemeName}
          </h1>

          <p>
            {schemeDescription}
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
            {translateReason(
              scheme.manual_verification_reason
            )}
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
              {schemeDescription ||
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
            Object.entries(
              scheme.eligibility
            ).some(
              ([, value]) =>
                value !== null &&
                value !== undefined &&
                value !== ''
            ) ? (

              <div className="criteria-list">

                {Object.entries(
                  scheme.eligibility
                ).map(
                  ([key, value]) => {

                    const formattedValue =
                      formatEligibilityValue(
                        key,
                        value
                      )

                    if (!formattedValue) {
                      return null
                    }

                    return (
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
                            {formattedValue}
                          </p>

                        </div>

                      </div>
                    )
                  }
                )}

              </div>

            ) : (

              <p>
                {t.eligibilityFallback}
              </p>

            )}

          </section>


          {additionalConditions.length > 0 && (

            <section className="details-section">

              <p className="section-label">
                {t.additionalConditions}
              </p>

              <ul className="document-list">

                {additionalConditions.map(
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

            {requiredDocuments.length > 0 ? (

              <ul className="document-list">

                {requiredDocuments.map(
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


          {optionalDocuments.length > 0 && (

            <section className="details-section">

              <p className="section-label">
                {t.optionalDocuments}
              </p>

              <ul className="document-list">

                {optionalDocuments.map(
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

            {applicationSteps.length > 0 ? (

              <ol className="document-list">

                {applicationSteps.map(
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
  rel="noopener noreferrer"
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