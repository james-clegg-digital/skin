import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <div className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-bottom-4">
          <h1 className="nhsuk-heading-xl">Skin mole photo upload</h1>
          <p className="nhsuk-body-l">Send clear photos of a skin mole to our clinical team for review.</p>
        </div>
        <div className="nhsuk-warning-callout">
          <h3 className="nhsuk-warning-callout__label">
            <span className="nhsuk-u-visually-hidden">Important: </span>Not for emergencies
          </h3>
          <p>If you need urgent medical help, call 111 or 999 in an emergency.</p>
        </div>
        <p>
          This service securely collects information about your skin mole so a clinician can review it and advise on the
          right next steps.
        </p>
        <div className="nhsuk-inset-text">
          <p>
            We store your details securely. Photos are only visible to the clinical team reviewing your case. This service
            does not provide automated diagnosis.
          </p>
        </div>
        <Link className="nhsuk-button" href="/start" role="button">
          Start now
        </Link>
      </div>
    </div>
  );
}
