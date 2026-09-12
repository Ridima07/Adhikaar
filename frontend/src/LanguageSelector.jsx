import { useEffect, useState } from 'react'
import './LanguageSelector.css'

const LANGUAGES = [
  {
    code: 'en',
    label: 'English'
  },
  {
    code: 'hi',
    label: 'हिन्दी'
  },
  {
    code: 'bn',
    label: 'বাংলা'
  }
]

function LanguageSelector() {
  const [language, setLanguage] = useState(
    localStorage.getItem('adhikaarLanguage') || 'en'
  )

  useEffect(() => {
    localStorage.setItem(
      'adhikaarLanguage',
      language
    )
  }, [language])

  const handleChange = (event) => {
    const nextLanguage = event.target.value

    localStorage.setItem(
      'adhikaarLanguage',
      nextLanguage
    )

    setLanguage(nextLanguage)

    window.location.reload()
  }

  return (
    <div className="language-selector">
      <label htmlFor="adhikaar-language">
        Language
      </label>

      <select
        id="adhikaar-language"
        value={language}
        onChange={handleChange}
      >
        {LANGUAGES.map((item) => (
          <option
            key={item.code}
            value={item.code}
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector