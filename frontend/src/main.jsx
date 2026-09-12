import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'
import Login from './Login.jsx'
import Profile from './Profile.jsx'
import Dashboard from './Dashboard.jsx'
import FindSchemes from './FindSchemes.jsx'
import Questions from './Questions.jsx'
import Results from './Results.jsx'
import BenefitsGap from './BenefitsGap.jsx'
import SchemeDetails from './SchemeDetails.jsx'
import ApplicationReadiness from './ApplicationReadiness.jsx'
import RejectionRecovery from './RejectionRecovery.jsx'
import RecoveryResult from './RecoveryResult.jsx'


/* =========================================================
   BACKEND TRANSLATION
   ========================================================= */

const originalFetch = window.fetch

window.fetch = async (input, init) => {
  const selectedLanguage =
    localStorage.getItem('adhikaarLanguage') || 'en'

  let url

  if (typeof input === 'string') {
    url = input
  } else if (input instanceof Request) {
    url = input.url
  } else {
    url = String(input)
  }

  try {
    const urlObject = new URL(
      url,
      window.location.origin
    )

    const isAdhikaarBackend =
      urlObject.hostname === '127.0.0.1' &&
      urlObject.port === '8000'

    const isLocalBackend =
      urlObject.hostname === 'localhost' &&
      urlObject.port === '8000'

    if (
      isAdhikaarBackend ||
      isLocalBackend
    ) {
      if (
        !urlObject.searchParams.has('lang')
      ) {
        urlObject.searchParams.set(
          'lang',
          selectedLanguage
        )
      }

      if (typeof input === 'string') {
        input = urlObject.toString()

      } else if (input instanceof Request) {
        input = new Request(
          urlObject.toString(),
          input
        )

      } else {
        input = urlObject.toString()
      }
    }

  } catch (error) {
    console.error(
      'Could not add translation language to request:',
      error
    )
  }

  return originalFetch(
    input,
    init
  )
}


/* =========================================================
   ROUTING
   ========================================================= */

function Router() {
  const path =
    window.location.pathname

  const schemeDetailsMatch =
    path.match(
      /^\/scheme-details\/([^/]+)$/
    )

  const readinessMatch =
    path.match(
      /^\/application-readiness\/([^/]+)$/
    )

  const readinessPage =
    path === '/application-readiness' ||
    readinessMatch

  const Page =
    path === '/login'
      ? Login
      : path === '/profile'
        ? Profile
        : path === '/dashboard'
          ? Dashboard
          : path === '/find-schemes'
            ? FindSchemes
            : path === '/questions'
              ? Questions
              : path === '/results'
                ? Results
                : schemeDetailsMatch
                  ? SchemeDetails
                  : path === '/benefits-gap'
                    ? BenefitsGap
                    : readinessPage
                      ? ApplicationReadiness
                      : path === '/rejection-recovery'
                        ? RejectionRecovery
                        : path === '/recovery-result'
                          ? RecoveryResult
                          : App

  return <Page />
}


/* =========================================================
   APP
   ========================================================= */

createRoot(
  document.getElementById('root')
).render(
  <StrictMode>
    <Router />
  </StrictMode>
)