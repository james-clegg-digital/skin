import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function submitApplication(formData: FormData) {
  'use server';
  const submissionId = Number(formData.get('submissionId'));
  if (!submissionId) return;
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: 'SUBMITTED',
      statusHistory: {
        create: { status: 'SUBMITTED', note: 'Patient submitted details' }
      }
    }
  });
  redirect(`/patient/confirmation?submissionId=${submissionId}`);
}

export default async function ReviewPage({ searchParams }: { searchParams: { submissionId?: string } }) {
  const submissionId = Number(searchParams.submissionId);
  if (!submissionId) redirect('/start');
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { patient: true, photos: true }
  });
  if (!submission) redirect('/start');

  const rows = [
    { key: 'Name', value: submission.patient.name },
    { key: 'Date of birth', value: submission.patient.dateOfBirth.toISOString().substring(0, 10) },
    { key: 'NHS number', value: submission.patient.nhsNumber || 'Not provided' },
    { key: 'Location', value: submission.moleLocation || 'Not provided' },
    { key: 'Noticed', value: submission.noticedAt ? submission.noticedAt.toISOString().substring(0, 10) : 'Not provided' },
    { key: 'Changes', value: submission.changes || 'Not provided' },
    { key: 'Symptoms', value: submission.symptoms || 'None' },
    { key: 'Notes', value: submission.notes || 'Not provided' }
  ];

  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <Link className="nhsuk-back-link" href={`/patient/upload-photos?submissionId=${submissionId}`}>
          Back
        </Link>
        <h1 className="nhsuk-heading-l">Check your answers</h1>
        <dl className="nhsuk-summary-list">
          {rows.map((row) => (
            <div className="nhsuk-summary-list__row" key={row.key}>
              <dt className="nhsuk-summary-list__key">{row.key}</dt>
              <dd className="nhsuk-summary-list__value">{row.value}</dd>
            </div>
          ))}
          <div className="nhsuk-summary-list__row">
            <dt className="nhsuk-summary-list__key">Photos</dt>
            <dd className="nhsuk-summary-list__value">{submission.photos.length} uploaded</dd>
          </div>
        </dl>
        <form action={submitApplication}>
          <input type="hidden" name="submissionId" value={submissionId} />
          <button className="nhsuk-button" type="submit">
            Submit for review
          </button>
        </form>
      </div>
    </div>
  );
}
