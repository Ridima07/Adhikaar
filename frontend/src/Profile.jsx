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

  const t =
    content[language] ||
    content.en

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

                  <option>Delhi</option>
                  <option>Haryana</option>
                  <option>Uttar Pradesh</option>
                  <option>Rajasthan</option>
                  <option>Maharashtra</option>

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

                  <option>School</option>
                  <option>Undergraduate</option>
                  <option>Postgraduate</option>
                  <option>Diploma</option>
                  <option>Other</option>

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

                  <option>Student</option>
                  <option>Employed</option>
                  <option>Self-employed</option>
                  <option>Unemployed</option>
                  <option>Other</option>

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

                  <option>Below ₹1 lakh</option>
                  <option>₹1–3 lakh</option>
                  <option>₹3–5 lakh</option>
                  <option>₹5–10 lakh</option>
                  <option>Above ₹10 lakh</option>

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

                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>Prefer not to say</option>

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

                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>

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

                  <option>Yes</option>
                  <option>No</option>
                  <option>Prefer not to say</option>

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