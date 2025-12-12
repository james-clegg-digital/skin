import Link from 'next/link';

export default function StartPage() {
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <h1 className="nhsuk-heading-l">Before you start</h1>
        <p>We will ask for some details about you and the mole, then you can upload clear photos.</p>
        <ul className="nhsuk-list nhsuk-list--bullet">
          <li>Make sure you are in a well-lit room.</li>
          <li>Use a coin or ruler in the photo for scale.</li>
          <li>Avoid using flash to reduce glare.</li>
        </ul>
        <Link className="nhsuk-button" href="/patient/about-you">
          Continue
        </Link>
      </div>
    </div>
  );
}
