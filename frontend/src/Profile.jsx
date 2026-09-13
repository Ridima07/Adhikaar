import { useState } from 'react'
import './Profile.css'
import LanguageSelector from './LanguageSelector.jsx'

function Profile() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const content = {
    en: {
      label: "LET'S GET STARTED",
      title: 'Create your profile.',
      description:
        'Tell us a little about yourself so we can find benefits that are relevant to you.',
      basicInfo: 'Basic information',
      age: 'Age',
      agePlaceholder: 'Enter your age',
      state: 'State',
      statePlaceholder: 'Select your state',
      education: 'Education',
      educationPlaceholder: 'Select your education level',
      occupation: 'Occupation',
      occupationPlaceholder: 'Select your occupation',
      income: 'Annual household income',
      incomePlaceholder: 'Select income range',
      category: 'Social category',
      categoryPlaceholder: 'Select category',
      gender: 'Gender',
      genderPlaceholder: 'Select gender',
      disability: 'Disability status',
      disabilityPlaceholder: 'Select an option',
      save: 'Save profile →',
      logout: 'Logout'
    },

    hi: {
      label: 'आइए शुरू करते हैं',
      title: 'अपनी प्रोफ़ाइल बनाएँ।',
      description:
        'अपने बारे में कुछ जानकारी दें ताकि हम आपके लिए प्रासंगिक लाभ खोज सकें।',
      basicInfo: 'बुनियादी जानकारी',
      age: 'आयु',
      agePlaceholder: 'अपनी आयु दर्ज करें',
      state: 'राज्य',
      statePlaceholder: 'अपना राज्य चुनें',
      education: 'शिक्षा',
      educationPlaceholder: 'अपना शिक्षा स्तर चुनें',
      occupation: 'व्यवसाय',
      occupationPlaceholder: 'अपना व्यवसाय चुनें',
      income: 'वार्षिक पारिवारिक आय',
      incomePlaceholder: 'आय सीमा चुनें',
      category: 'सामाजिक श्रेणी',
      categoryPlaceholder: 'श्रेणी चुनें',
      gender: 'लिंग',
      genderPlaceholder: 'लिंग चुनें',
      disability: 'दिव्यांगता स्थिति',
      disabilityPlaceholder: 'एक विकल्प चुनें',
      save: 'प्रोफ़ाइल सहेजें →',
      logout: 'लॉग आउट'
    },

    bn: {
      label: 'চলুন শুরু করি',
      title: 'আপনার প্রোফাইল তৈরি করুন।',
      description:
        'আপনার সম্পর্কে কিছু তথ্য দিন যাতে আমরা আপনার জন্য প্রাসঙ্গিক সুবিধা খুঁজে পাই।',
      basicInfo: 'মৌলিক তথ্য',
      age: 'বয়স',
      agePlaceholder: 'আপনার বয়স লিখুন',
      state: 'রাজ্য',
      statePlaceholder: 'আপনার রাজ্য নির্বাচন করুন',
      education: 'শিক্ষা',
      educationPlaceholder: 'আপনার শিক্ষার স্তর নির্বাচন করুন',
      occupation: 'পেশা',
      occupationPlaceholder: 'আপনার পেশা নির্বাচন করুন',
      income: 'বার্ষিক পারিবারিক আয়',
      incomePlaceholder: 'আয়ের সীমা নির্বাচন করুন',
      category: 'সামাজিক শ্রেণি',
      categoryPlaceholder: 'শ্রেণি নির্বাচন করুন',
      gender: 'লিঙ্গ',
      genderPlaceholder: 'লিঙ্গ নির্বাচন করুন',
      disability: 'প্রতিবন্ধিতার অবস্থা',
      disabilityPlaceholder: 'একটি বিকল্প নির্বাচন করুন',
      save: 'প্রোফাইল সংরক্ষণ করুন →',
      logout: 'লগ আউট'
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

  const t =
    content[language] ||
    content.en

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

  const [profile, setProfile] = useState({
    age: '',
    state: '',
    education: '',
    occupation: '',
    income: '',
    category: '',
    gender: '',
    disability: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setProfile({
      ...profile,
      [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const existingBackendProfile =
      JSON.parse(
        localStorage.getItem(
          'adhikaarBackendProfile'
        )
      ) || {}

    const backendProfile = {
      ...existingBackendProfile,
      age: Number(profile.age),
      state: profile.state,
      occupation: profile.occupation,
      education_level: profile.education,
      annual_income:
        profile.income === 'Below ₹1 lakh'
          ? 50000
          : profile.income === '₹1–3 lakh'
            ? 200000
            : profile.income === '₹3–5 lakh'
              ? 400000
              : profile.income === '₹5–10 lakh'
                ? 750000
                : 1000000,
      social_category: profile.category,
      gender: profile.gender,
      disability_status:
        profile.disability === 'Yes'
    }

    localStorage.setItem(
      'adhikaarProfile',
      JSON.stringify(profile)
    )

    localStorage.setItem(
      'adhikaarBackendProfile',
      JSON.stringify(backendProfile)
    )

    window.location.href = '/dashboard'
  }

  return (
    <div className="profile-page">

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
            href="/"
            className="back-link"
          >
            {t.logout}
          </a>

        </div>

      </nav>

      <main className="profile-container">

        <div className="profile-header">

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
          className="profile-form"
          onSubmit={handleSubmit}
        >

          <div className="form-section">

            <h2>
              {t.basicInfo}
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  {t.age}
                </label>

                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  placeholder={t.agePlaceholder}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  {t.state}
                </label>

                <select
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    {t.statePlaceholder}
                  </option>

                  <option value="Delhi">
                    {getOptionLabel('state', 'Delhi')}
                  </option>

                  <option value="Haryana">
                    {getOptionLabel('state', 'Haryana')}
                  </option>

                  <option value="Uttar Pradesh">
                    {getOptionLabel('state', 'Uttar Pradesh')}
                  </option>

                  <option value="Rajasthan">
                    {getOptionLabel('state', 'Rajasthan')}
                  </option>

                  <option value="Maharashtra">
                    {getOptionLabel('state', 'Maharashtra')}
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  {t.education}
                </label>

                <select
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    {t.educationPlaceholder}
                  </option>

                  <option value="School">
                    {getOptionLabel('education', 'School')}
                  </option>

                  <option value="Undergraduate">
                    {getOptionLabel('education', 'Undergraduate')}
                  </option>

                  <option value="Postgraduate">
                    {getOptionLabel('education', 'Postgraduate')}
                  </option>

                  <option value="Diploma">
                    {getOptionLabel('education', 'Diploma')}
                  </option>

                  <option value="Other">
                    {getOptionLabel('education', 'Other')}
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  {t.occupation}
                </label>

                <select
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    {t.occupationPlaceholder}
                  </option>

                  <option value="Student">
                    {getOptionLabel('occupation', 'Student')}
                  </option>

                  <option value="Employed">
                    {getOptionLabel('occupation', 'Employed')}
                  </option>

                  <option value="Self-employed">
                    {getOptionLabel('occupation', 'Self-employed')}
                  </option>

                  <option value="Unemployed">
                    {getOptionLabel('occupation', 'Unemployed')}
                  </option>

                  <option value="Other">
                    {getOptionLabel('occupation', 'Other')}
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  {t.income}
                </label>

                <select
                  name="income"
                  value={profile.income}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    {t.incomePlaceholder}
                  </option>

                  <option value="Below ₹1 lakh">
                    {getOptionLabel('income', 'Below ₹1 lakh')}
                  </option>

                  <option value="₹1–3 lakh">
                    {getOptionLabel('income', '₹1–3 lakh')}
                  </option>

                  <option value="₹3–5 lakh">
                    {getOptionLabel('income', '₹3–5 lakh')}
                  </option>

                  <option value="₹5–10 lakh">
                    {getOptionLabel('income', '₹5–10 lakh')}
                  </option>

                  <option value="Above ₹10 lakh">
                    {getOptionLabel('income', 'Above ₹10 lakh')}
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  {t.category}
                </label>

                <select
                  name="category"
                  value={profile.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    {t.categoryPlaceholder}
                  </option>

                  <option value="General">
                    {getOptionLabel('category', 'General')}
                  </option>

                  <option value="OBC">
                    {getOptionLabel('category', 'OBC')}
                  </option>

                  <option value="SC">
                    {getOptionLabel('category', 'SC')}
                  </option>

                  <option value="ST">
                    {getOptionLabel('category', 'ST')}
                  </option>

                  <option value="Prefer not to say">
                    {getOptionLabel(
                      'category',
                      'Prefer not to say'
                    )}
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  {t.gender}
                </label>

                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    {t.genderPlaceholder}
                  </option>

                  <option value="Female">
                    {getOptionLabel('gender', 'Female')}
                  </option>

                  <option value="Male">
                    {getOptionLabel('gender', 'Male')}
                  </option>

                  <option value="Other">
                    {getOptionLabel('gender', 'Other')}
                  </option>

                  <option value="Prefer not to say">
                    {getOptionLabel(
                      'gender',
                      'Prefer not to say'
                    )}
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  {t.disability}
                </label>

                <select
                  name="disability"
                  value={profile.disability}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    {t.disabilityPlaceholder}
                  </option>

                  <option value="Yes">
                    {getOptionLabel('disability', 'Yes')}
                  </option>

                  <option value="No">
                    {getOptionLabel('disability', 'No')}
                  </option>

                  <option value="Prefer not to say">
                    {getOptionLabel(
                      'disability',
                      'Prefer not to say'
                    )}
                  </option>

                </select>

              </div>

            </div>

          </div>

          <button
            type="submit"
            className="profile-button"
          >
            {t.save}
          </button>

        </form>

      </main>

    </div>
  )
}

export default Profile