import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClinicianSession, getClinicianFromSession, verifyClinicianCredentials } from '@/lib/auth';

async function handleLogin(formData: FormData) {
  'use server';
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const clinician = await verifyClinicianCredentials(email, password);
  if (clinician) {
    await createClinicianSession(clinician.id);
    redirect('/clinician/queue');
  }
}

export default async function LoginPage() {
  const current = await getClinicianFromSession();
  if (current) redirect('/clinician/queue');
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <Link className="nhsuk-back-link" href="/">
          Back
        </Link>
        <h1 className="nhsuk-heading-l">Clinician sign in</h1>
        <form action={handleLogin}>
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="email">
              Email
            </label>
            <input className="nhsuk-input" id="email" name="email" type="email" required />
          </div>
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="password">
              Password
            </label>
            <input className="nhsuk-input" id="password" name="password" type="password" required />
          </div>
          <button className="nhsuk-button" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
