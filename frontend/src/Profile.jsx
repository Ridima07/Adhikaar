import { useState } from 'react'
import './Profile.css'

function Profile() {
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

  const backendProfile = {
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
    disability_status: profile.disability === 'Yes'
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
        <div className="logo">ADHIKAAR</div>

        <a href="/" className="back-link">
          Logout
        </a>
      </nav>


      <main className="profile-container">

        <div className="profile-header">
          <p className="section-label">LET'S GET STARTED</p>

          <h1>Create your profile.</h1>

          <p>
            Tell us a little about yourself so we can find benefits
            that are relevant to you.
          </p>
        </div>


        <form className="profile-form" onSubmit={handleSubmit}>

          <div className="form-section">

            <h2>Basic information</h2>

            <div className="form-grid">

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  required
                />
              </div>


              <div className="form-group">
                <label>State</label>
                <select
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your state</option>
                  <option>Delhi</option>
                  <option>Haryana</option>
                  <option>Uttar Pradesh</option>
                  <option>Rajasthan</option>
                  <option>Maharashtra</option>
                </select>
              </div>


              <div className="form-group">
                <label>Education</label>
                <select
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your education level</option>
                  <option>School</option>
                  <option>Undergraduate</option>
                  <option>Postgraduate</option>
                  <option>Diploma</option>
                  <option>Other</option>
                </select>
              </div>


              <div className="form-group">
                <label>Occupation</label>
                <select
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your occupation</option>
                  <option>Student</option>
                  <option>Employed</option>
                  <option>Self-employed</option>
                  <option>Unemployed</option>
                  <option>Other</option>
                </select>
              </div>


              <div className="form-group">
                <label>Annual household income</label>
                <select
                  name="income"
                  value={profile.income}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select income range</option>
                  <option>Below ₹1 lakh</option>
                  <option>₹1–3 lakh</option>
                  <option>₹3–5 lakh</option>
                  <option>₹5–10 lakh</option>
                  <option>Above ₹10 lakh</option>
                </select>
              </div>


              <div className="form-group">
                <label>Social category</label>
                <select
                  name="category"
                  value={profile.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>Prefer not to say</option>
                </select>
              </div>


              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>


              <div className="form-group">
                <label>Disability status</label>
                <select
                  name="disability"
                  value={profile.disability}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Prefer not to say</option>
                </select>
              </div>

            </div>
          </div>


          <button type="submit" className="profile-button">
            Save profile →
          </button>

        </form>

      </main>

    </div>
  )
}

export default Profile