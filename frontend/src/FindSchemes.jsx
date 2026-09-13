import './FindSchemes.css'
import LanguageSelector from './LanguageSelector.jsx'
import translations from './translations.js'

function FindSchemes() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const common =
    translations[language]?.common ||
    translations.en.common

  const profile =
    JSON.parse(
      localStorage.getItem(
        'adhikaarProfile'
      )
    ) || {}

  const notProvided =
    language === 'hi'
      ? 'उपलब्ध नहीं'
      : language === 'bn'
        ? 'দেওয়া হয়নি'
        : 'Not provided'

  const content = {
    en: {
      label: 'FIND MY SCHEMES',
      title: "Let's find what you're eligible for.",
      description:
        "We'll use your profile and a few additional questions to identify benefits that may be relevant to you.",
      profileLabel: 'YOUR PROFILE',
      profileTitle: 'Is this information correct?',
      age: 'Age',
      state: 'State',
      education: 'Education',
      occupation: 'Occupation',
      income: 'Annual income',
      category: 'Social category',
      gender: 'Gender',
      disability: 'Disability status',
      edit: 'Edit profile',
      continue: 'Continue →'
    },

    hi: {
      label: 'मेरे लिए योजनाएँ खोजें',
      title: 'आइए देखें कि आप किन योजनाओं के लिए पात्र हैं।',
      description:
        'आपके लिए प्रासंगिक लाभों की पहचान करने के लिए हम आपकी प्रोफ़ाइल और कुछ अतिरिक्त प्रश्नों का उपयोग करेंगे।',
      profileLabel: 'आपकी प्रोफ़ाइल',
      profileTitle: 'क्या यह जानकारी सही है?',
      age: 'आयु',
      state: 'राज्य',
      education: 'शिक्षा',
      occupation: 'व्यवसाय',
      income: 'वार्षिक आय',
      category: 'सामाजिक श्रेणी',
      gender: 'लिंग',
      disability: 'दिव्यांगता स्थिति',
      edit: 'प्रोफ़ाइल संपादित करें',
      continue: 'जारी रखें →'
    },

    bn: {
      label: 'আমার জন্য স্কিম খুঁজুন',
      title: 'চলুন দেখি আপনি কোন সুবিধার জন্য যোগ্য।',
      description:
        'আপনার জন্য প্রাসঙ্গিক সুবিধা চিহ্নিত করতে আমরা আপনার প্রোফাইল এবং কয়েকটি অতিরিক্ত প্রশ্ন ব্যবহার করব।',
      profileLabel: 'আপনার প্রোফাইল',
      profileTitle: 'এই তথ্য কি সঠিক?',
      age: 'বয়স',
      state: 'রাজ্য',
      education: 'শিক্ষা',
      occupation: 'পেশা',
      income: 'বার্ষিক আয়',
      category: 'সামাজিক শ্রেণি',
      gender: 'লিঙ্গ',
      disability: 'প্রতিবন্ধিতার অবস্থা',
      edit: 'প্রোফাইল সম্পাদনা করুন',
      continue: 'চালিয়ে যান →'
    }
  }

  const optionTranslations = {
    state: {
      Delhi: {
        hi: 'दिल्ली',
        bn: 'দিল্লি'
      },
      Haryana: {
        hi: 'हरियाणा',
        bn: 'হরিয়ানা'
      },
      'Uttar Pradesh': {
        hi: 'उत्तर प्रदेश',
        bn: 'উত্তর প্রদেশ'
      },
      Rajasthan: {
        hi: 'राजस्थान',
        bn: 'রাজস্থান'
      },
      Maharashtra: {
        hi: 'महाराष्ट्र',
        bn: 'মহারাষ্ট্র'
      }
    },

    education: {
      School: {
        hi: 'स्कूल',
        bn: 'স্কুল'
      },
      Undergraduate: {
        hi: 'स्नातक',
        bn: 'স্নাতক'
      },
      Postgraduate: {
        hi: 'स्नातकोत्तर',
        bn: 'স্নাতকোত্তর'
      },
      Diploma: {
        hi: 'डिप्लोमा',
        bn: 'ডিপ্লোমা'
      },
      Other: {
        hi: 'अन्य',
        bn: 'অন্যান্য'
      }
    },

    occupation: {
      Student: {
        hi: 'छात्र',
        bn: 'শিক্ষার্থী'
      },
      Employed: {
        hi: 'नौकरीपेशा',
        bn: 'চাকরিজীবী'
      },
      'Self-employed': {
        hi: 'स्वरोज़गार',
        bn: 'স্বনিযুক্ত'
      },
      Unemployed: {
        hi: 'बेरोज़गार',
        bn: 'বেকার'
      },
      Other: {
        hi: 'अन्य',
        bn: 'অন্যান্য'
      }
    },

    income: {
      'Below ₹1 lakh': {
        hi: '₹1 लाख से कम',
        bn: '₹১ লক্ষের কম'
      },
      '₹1–3 lakh': {
        hi: '₹1–3 लाख',
        bn: '₹১–৩ লক্ষ'
      },
      '₹3–5 lakh': {
        hi: '₹3–5 लाख',
        bn: '₹৩–৫ লক্ষ'
      },
      '₹5–10 lakh': {
        hi: '₹5–10 लाख',
        bn: '₹৫–১০ লক্ষ'
      },
      'Above ₹10 lakh': {
        hi: '₹10 लाख से अधिक',
        bn: '₹১০ লক্ষের বেশি'
      }
    },

    category: {
      General: {
        hi: 'सामान्य',
        bn: 'সাধারণ'
      },
      OBC: {
        hi: 'अन्य पिछड़ा वर्ग (OBC)',
        bn: 'অন্যান্য অনগ্রসর শ্রেণি (OBC)'
      },
      SC: {
        hi: 'अनुसूचित जाति (SC)',
        bn: 'তফসিলি জাতি (SC)'
      },
      ST: {
        hi: 'अनुसूचित जनजाति (ST)',
        bn: 'তফসিলি উপজাতি (ST)'
      },
      'Prefer not to say': {
        hi: 'बताना पसंद नहीं',
        bn: 'জানাতে চাই না'
      }
    },

    gender: {
      Female: {
        hi: 'महिला',
        bn: 'মহিলা'
      },
      Male: {
        hi: 'पुरुष',
        bn: 'পুরুষ'
      },
      Other: {
        hi: 'अन्य',
        bn: 'অন্যান্য'
      },
      'Prefer not to say': {
        hi: 'बताना पसंद नहीं',
        bn: 'জানাতে চাই না'
      }
    },

    disability: {
      Yes: {
        hi: 'हाँ',
        bn: 'হ্যাঁ'
      },
      No: {
        hi: 'नहीं',
        bn: 'না'
      },
      'Prefer not to say': {
        hi: 'बताना पसंद नहीं',
        bn: 'জানাতে চাই না'
      }
    }
  }

  const getOptionLabel = (
    category,
    value
  ) => {
    if (language === 'en') {
      return value
    }

    return (
      optionTranslations[category]?.[value]?.[language] ||
      value
    )
  }

  const t =
    content[language] ||
    content.en

  return (
    <div className="find-schemes-page">

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
            {language === 'en'
              ? '← Back to dashboard'
              : language === 'hi'
                ? '← डैशबोर्ड पर वापस जाएँ'
                : '← ড্যাশবোর্ডে ফিরে যান'}
          </a>

        </div>

      </nav>

      <main className="find-schemes-container">

        <div className="find-schemes-header">

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

        <section className="profile-summary">

          <div>

            <p className="section-label">
              {t.profileLabel}
            </p>

            <h2>
              {t.profileTitle}
            </h2>

          </div>

          <div className="profile-summary-grid">

            <div>
              <span>{t.age}</span>
              <strong>
                {profile.age || notProvided}
              </strong>
            </div>

            <div>
              <span>{t.state}</span>
              <strong>
                {profile.state
                  ? getOptionLabel(
                      'state',
                      profile.state
                    )
                  : notProvided}
              </strong>
            </div>

            <div>
              <span>{t.education}</span>
              <strong>
                {profile.education
                  ? getOptionLabel(
                      'education',
                      profile.education
                    )
                  : notProvided}
              </strong>
            </div>

            <div>
              <span>{t.occupation}</span>
              <strong>
                {profile.occupation
                  ? getOptionLabel(
                      'occupation',
                      profile.occupation
                    )
                  : notProvided}
              </strong>
            </div>

            <div>
              <span>{t.income}</span>
              <strong>
                {profile.income
                  ? getOptionLabel(
                      'income',
                      profile.income
                    )
                  : notProvided}
              </strong>
            </div>

            <div>
              <span>{t.category}</span>
              <strong>
                {profile.category
                  ? getOptionLabel(
                      'category',
                      profile.category
                    )
                  : notProvided}
              </strong>
            </div>

            <div>
              <span>{t.gender}</span>
              <strong>
                {profile.gender
                  ? getOptionLabel(
                      'gender',
                      profile.gender
                    )
                  : notProvided}
              </strong>
            </div>

            <div>
              <span>{t.disability}</span>
              <strong>
                {profile.disability
                  ? getOptionLabel(
                      'disability',
                      profile.disability
                    )
                  : notProvided}
              </strong>
            </div>

          </div>

          <div className="profile-actions">

            <a
              href="/profile"
              className="edit-profile-button"
            >
              {t.edit}
            </a>

            <button
              type="button"
              className="continue-button"
              onClick={() => {
                window.location.href = '/questions'
              }}
            >
              {t.continue}
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default FindSchemes