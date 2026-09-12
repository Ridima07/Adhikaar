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

const path = window.location.pathname

const schemeDetailsMatch =
  path.match(/^\/scheme-details\/([^/]+)$/)

const readinessMatch =
  path.match(/^\/application-readiness\/([^/]+)$/)

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
                  : readinessMatch
                    ? ApplicationReadiness
                    : path === '/rejection-recovery'
                      ? RejectionRecovery
                      : path === '/recovery-result'
                        ? RecoveryResult
                        : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)