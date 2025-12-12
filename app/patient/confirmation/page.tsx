import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ConfirmationPage({ searchParams }: { searchParams: { submissionId?: string } }) {
  const submissionId = Number(searchParams.submissionId);
  if (!submissionId) redirect('/start');
  const submission = await prisma.submission.findUnique({ where: { id: submissionId }, include: { patient: true } });
  if (!submission) redirect('/start');
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <div className="nhsuk-panel nhsuk-panel--confirmation">
          <h1 className="nhsuk-panel__title">Details sent</h1>
          <div className="nhsuk-panel__body">
            Reference number <br />
            <strong>{submission.reference}</strong>
          </div>
        </div>
        <p className="nhsuk-body">We will review your photos and contact you if we need more information.</p>
        <p className="nhsuk-body">Keep this reference number safe.</p>
        <Link className="nhsuk-button" href="/patient/submissions">
          View my submissions
        </Link>
      </div>
    </div>
  );
}
