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
                {profile.state || notProvided}
              </strong>
            </div>

            <div>
              <span>{t.education}</span>
              <strong>
                {profile.education || notProvided}
              </strong>
            </div>

            <div>
              <span>{t.occupation}</span>
              <strong>
                {profile.occupation || notProvided}
              </strong>
            </div>

            <div>
              <span>{t.income}</span>
              <strong>
                {profile.income || notProvided}
              </strong>
            </div>

            <div>
              <span>{t.category}</span>
              <strong>
                {profile.category || notProvided}
              </strong>
            </div>

            <div>
              <span>{t.gender}</span>
              <strong>
                {profile.gender || notProvided}
              </strong>
            </div>

            <div>
              <span>{t.disability}</span>
              <strong>
                {profile.disability || notProvided}
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