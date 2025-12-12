import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const tagClasses: Record<string, string> = {
  SUBMITTED: 'nhsuk-tag nhsuk-tag--blue',
  IN_REVIEW: 'nhsuk-tag nhsuk-tag--blue',
  NEEDS_MORE_INFO: 'nhsuk-tag nhsuk-tag--yellow',
  COMPLETED: 'nhsuk-tag nhsuk-tag--green',
  DRAFT: 'nhsuk-tag nhsuk-tag--grey'
};

export default async function MySubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: 'desc' },
    include: { patient: true }
  });
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-full">
        <h1 className="nhsuk-heading-l">My submissions</h1>
        <table className="nhsuk-table">
          <caption className="nhsuk-table__caption">Upload history</caption>
          <thead className="nhsuk-table__head">
            <tr className="nhsuk-table__row">
              <th scope="col" className="nhsuk-table__header">
                Reference
              </th>
              <th scope="col" className="nhsuk-table__header">
                Status
              </th>
              <th scope="col" className="nhsuk-table__header">
                Patient
              </th>
              <th scope="col" className="nhsuk-table__header">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="nhsuk-table__body">
            {submissions.map((submission) => (
              <tr className="nhsuk-table__row" key={submission.id}>
                <td className="nhsuk-table__cell">{submission.reference}</td>
                <td className="nhsuk-table__cell">
                  <span className={tagClasses[submission.status] || 'nhsuk-tag'}>{submission.status}</span>
                </td>
                <td className="nhsuk-table__cell">{submission.patient.name}</td>
                <td className="nhsuk-table__cell">{new Date(submission.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link className="nhsuk-button" href="/start">
          Start a new submission
        </Link>
      </div>
    </div>
  );
}
