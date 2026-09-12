import { useState } from 'react'
import './RejectionRecovery.css'
import LanguageSelector from './LanguageSelector.jsx'

function RejectionRecovery() {
  const language =
    localStorage.getItem('adhikaarLanguage') || 'en'

  const content = {
    en: {
      label: 'REJECTION RECOVERY',
      title: "Got rejected? Let's understand why.",
      description:
        'Tell us which benefit you applied for and share the rejection message you received. Adhikaar can help identify what may have gone wrong and what you can do next.',
      schemeLabel:
        'Which benefit was your application for?',
      schemePlaceholder:
        'Select a benefit',
      rejectionLabel:
        'What did the rejection message say?',
      rejectionPlaceholder:
        'Paste the rejection message or explain what you were told...',
      note:
        "Don't worry if the message is complicated. We'll help break it down into understandable reasons and possible next steps.",
      cancel: 'Cancel',
      analyze: 'Understand my rejection →',
      important: 'IMPORTANT',
      importantTitle:
        "Adhikaar doesn't make the final decision.",
      importantText:
        'Government departments and scheme authorities remain the source of truth for eligibility and application decisions. Adhikaar helps you understand the information and identify possible next steps.',
      back: '← Back to dashboard'
    },

    hi: {
      label: 'अस्वीकृति के बाद सहायता',
      title: 'आवेदन अस्वीकार हुआ? आइए समझते हैं क्यों।',
      description:
        'हमें बताएँ कि आपने किस लाभ के लिए आवेदन किया था और आपको मिला अस्वीकृति संदेश साझा करें। अधिकार यह समझने में मदद कर सकता है कि क्या गलत हुआ और आगे आप क्या कर सकते हैं।',
      schemeLabel:
        'आपका आवेदन किस लाभ के लिए था?',
      schemePlaceholder:
        'लाभ चुनें',
      rejectionLabel:
        'अस्वीकृति संदेश में क्या लिखा था?',
      rejectionPlaceholder:
        'अस्वीकृति संदेश चिपकाएँ या आपको जो बताया गया वह लिखें...',
      note:
        'यदि संदेश जटिल है तो चिंता न करें। हम इसे आसान कारणों और संभावित अगले कदमों में समझाने में मदद करेंगे।',
      cancel: 'रद्द करें',
      analyze: 'मेरी अस्वीकृति समझें →',
      important: 'महत्वपूर्ण',
      importantTitle:
        'अधिकार अंतिम निर्णय नहीं लेता।',
      importantText:
        'सरकारी विभाग और योजना प्राधिकरण पात्रता और आवेदन संबंधी निर्णयों के अंतिम स्रोत हैं। अधिकार जानकारी समझने और संभावित अगले कदमों की पहचान करने में मदद करता है।',
      back: '← डैशबोर्ड पर वापस जाएँ'
    },

    bn: {
      label: 'আবেদন প্রত্যাখ্যানের পর সহায়তা',
      title: 'আবেদন প্রত্যাখ্যাত? চলুন কারণটি বুঝি।',
      description:
        'আপনি কোন সুবিধার জন্য আবেদন করেছিলেন তা জানান এবং পাওয়া প্রত্যাখ্যানের বার্তাটি শেয়ার করুন। অধিকার কী ভুল হয়েছে এবং এরপর কী করা যায় তা বুঝতে সাহায্য করতে পারে।',
      schemeLabel:
        'আপনার আবেদন কোন সুবিধার জন্য ছিল?',
      schemePlaceholder:
        'একটি সুবিধা নির্বাচন করুন',
      rejectionLabel:
        'প্রত্যাখ্যানের বার্তায় কী বলা হয়েছিল?',
      rejectionPlaceholder:
        'প্রত্যাখ্যানের বার্তাটি পেস্ট করুন বা আপনাকে কী বলা হয়েছিল তা লিখুন...',
      note:
        'বার্তাটি জটিল হলেও চিন্তা করবেন না। আমরা এটিকে সহজ কারণ এবং সম্ভাব্য পরবর্তী পদক্ষেপে ব্যাখ্যা করতে সাহায্য করব।',
      cancel: 'বাতিল করুন',
      analyze: 'আমার প্রত্যাখ্যান বুঝুন →',
      important: 'গুরুত্বপূর্ণ',
      importantTitle:
        'অধিকার চূড়ান্ত সিদ্ধান্ত নেয় না।',
      importantText:
        'যোগ্যতা এবং আবেদন সংক্রান্ত সিদ্ধান্তের চূড়ান্ত উৎস হলো সরকারি বিভাগ ও স্কিম কর্তৃপক্ষ। অধিকার তথ্য বুঝতে এবং সম্ভাব্য পরবর্তী পদক্ষেপ চিহ্নিত করতে সাহায্য করে।',
      back: '← ড্যাশবোর্ডে ফিরে যান'
    }
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
      recommendations: []
    }

  const recommendations =
    data.recommendations || []

  const [
    schemeId,
    setSchemeId
  ] = useState('')

  const [
    rejectionMessage,
    setRejectionMessage
  ] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    localStorage.setItem(
      'adhikaarRejection',
      rejectionMessage
    )

    localStorage.setItem(
      'adhikaarRejectionScheme',
      schemeId
    )

    window.location.href =
      '/recovery-result'
  }

  return (
    <div className="recovery-page">

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

      <main className="recovery-container">

        <div className="recovery-header">

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
          className="recovery-form"
          onSubmit={handleSubmit}
        >

          <label htmlFor="scheme">
            {t.schemeLabel}
          </label>

          <select
            id="scheme"
            value={schemeId}
            onChange={(event) =>
              setSchemeId(
                event.target.value
              )
            }
            required
          >

            <option value="">
              {t.schemePlaceholder}
            </option>

            {recommendations.map(
              (scheme) => (

                <option
                  key={scheme.scheme_id}
                  value={scheme.scheme_id}
                >
                  {scheme.scheme_name}
                </option>

              )
            )}

          </select>


          <label htmlFor="rejectionMessage">
            {t.rejectionLabel}
          </label>

          <textarea
            id="rejectionMessage"
            value={rejectionMessage}
            onChange={(event) =>
              setRejectionMessage(
                event.target.value
              )
            }
            placeholder={
              t.rejectionPlaceholder
            }
            required
          />


          <p className="form-note">
            {t.note}
          </p>


          <div className="recovery-actions">

            <a
              href="/dashboard"
              className="cancel-button"
            >
              {t.cancel}
            </a>

            <button
              type="submit"
              className="analyze-button"
            >
              {t.analyze}
            </button>

          </div>

        </form>


        <section className="recovery-note">

          <p className="section-label">
            {t.important}
          </p>

          <h2>
            {t.importantTitle}
          </h2>

          <p>
            {t.importantText}
          </p>

        </section>

      </main>

    </div>
  )
}

export default RejectionRecovery