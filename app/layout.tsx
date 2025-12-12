import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata = {
  title: 'NHS Skin Mole Triage',
  description: 'Upload skin mole images securely for clinician review'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="nhsuk-template">
      <body>
        <a className="nhsuk-skip-link" href="#main-content">
          Skip to main content
        </a>
        <header className="nhsuk-header" role="banner">
          <div className="nhsuk-width-container nhsuk-header__container">
            <div className="nhsuk-header__logo">
              <Link className="nhsuk-header__link" href="/">
                <span className="nhsuk-header__logotype">
                  <span className="nhsuk-header__logotype-text">NHS</span>
                </span>
                <span className="nhsuk-header__service-name">Skin mole review</span>
              </Link>
            </div>
          </div>
        </header>
        <main id="main-content" className="nhsuk-main-wrapper nhsuk-main-wrapper--l">
          <div className="nhsuk-width-container">{children}</div>
        </main>
        <footer className="nhsuk-footer" role="contentinfo">
          <div className="nhsuk-width-container">
            <h2 className="nhsuk-u-visually-hidden">Support links</h2>
            <ul className="nhsuk-footer__list">
              <li className="nhsuk-footer__list-item">
                <Link href="/patient/submissions" className="nhsuk-footer__list-item-link">
                  My submissions
                </Link>
              </li>
              <li className="nhsuk-footer__list-item">
                <Link href="/clinician/login" className="nhsuk-footer__list-item-link">
                  Clinician sign in
                </Link>
              </li>
            </ul>
            <p className="nhsuk-footer__copyright">NHS design system styles applied for accessibility.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
