import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

async function handleSubmit(formData: FormData) {
  'use server';
  const name = String(formData.get('name') || '').trim();
  const dob = String(formData.get('dob') || '').trim();
  const nhsNumber = String(formData.get('nhsNumber') || '').trim() || null;
  if (!name || !dob) {
    return;
  }
  const patient = await prisma.patient.create({
    data: {
      name,
      dateOfBirth: new Date(dob),
      nhsNumber: nhsNumber || null
    }
  });
  const submission = await prisma.submission.create({
    data: {
      patientId: patient.id,
      reference: randomUUID().slice(0, 8).toUpperCase(),
      statusHistory: {
        create: { status: 'DRAFT', note: 'Patient started submission' }
      }
    }
  });
  revalidatePath('/patient/about-you');
  redirect(`/patient/mole-details?submissionId=${submission.id}`);
}

export default function AboutYouPage() {
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <Link className="nhsuk-back-link" href="/start">
          Back
        </Link>
        <h1 className="nhsuk-heading-l">About you</h1>
        <form action={handleSubmit} noValidate>
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="name">
              Full name
            </label>
            <input className="nhsuk-input" id="name" name="name" type="text" required />
          </div>
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="dob">
              Date of birth
            </label>
            <span className="nhsuk-hint">For example, 1980-12-24</span>
            <input className="nhsuk-input" id="dob" name="dob" type="date" required />
          </div>
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="nhsNumber">
              NHS number (optional)
            </label>
            <input className="nhsuk-input" id="nhsNumber" name="nhsNumber" type="text" />
          </div>
          <button className="nhsuk-button" type="submit">
            Save and continue
          </button>
        </form>
      </div>
    </div>
  );
}
