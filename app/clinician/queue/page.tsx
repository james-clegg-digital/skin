import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getClinicianFromSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const PAGE_SIZE = 10;
const tagClasses: Record<string, string> = {
  SUBMITTED: 'nhsuk-tag nhsuk-tag--blue',
  IN_REVIEW: 'nhsuk-tag nhsuk-tag--blue',
  NEEDS_MORE_INFO: 'nhsuk-tag nhsuk-tag--yellow',
  COMPLETED: 'nhsuk-tag nhsuk-tag--green',
  DRAFT: 'nhsuk-tag nhsuk-tag--grey'
};

export default async function QueuePage({ searchParams }: { searchParams: { status?: string; page?: string } }) {
  const clinician = await getClinicianFromSession();
  if (!clinician) redirect('/clinician/login');
  const status = searchParams.status as any;
  const page = Number(searchParams.page || '1');
  const where = status ? { status } : {};
  const total = await prisma.submission.count({ where });
  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { patient: true },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-full">
        <h1 className="nhsuk-heading-l">Submission queue</h1>
        <form className="nhsuk-form-group nhsuk-u-margin-bottom-4" method="get" action="/clinician/queue">
          <label className="nhsuk-label" htmlFor="status">
            Filter by status
          </label>
          <select id="status" name="status" className="nhsuk-select" defaultValue={status || ''}>
            <option value="">All</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="IN_REVIEW">In review</option>
            <option value="NEEDS_MORE_INFO">Needs more info</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button className="nhsuk-button nhsuk-button--secondary nhsuk-u-margin-top-2" type="submit">
            Apply filters
          </button>
        </form>
        <table className="nhsuk-table">
          <caption className="nhsuk-table__caption">Current submissions</caption>
          <thead className="nhsuk-table__head">
            <tr className="nhsuk-table__row">
              <th scope="col" className="nhsuk-table__header">
                Reference
              </th>
              <th scope="col" className="nhsuk-table__header">
                Patient
              </th>
              <th scope="col" className="nhsuk-table__header">
                Status
              </th>
              <th scope="col" className="nhsuk-table__header">
                Updated
              </th>
              <th scope="col" className="nhsuk-table__header">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="nhsuk-table__body">
            {submissions.map((submission) => (
              <tr className="nhsuk-table__row" key={submission.id}>
                <td className="nhsuk-table__cell">{submission.reference}</td>
                <td className="nhsuk-table__cell">{submission.patient.name}</td>
                <td className="nhsuk-table__cell">
                  <span className={tagClasses[submission.status] || 'nhsuk-tag'}>{submission.status}</span>
                </td>
                <td className="nhsuk-table__cell">{new Date(submission.updatedAt).toLocaleDateString()}</td>
                <td className="nhsuk-table__cell">
                  <Link href={`/clinician/submissions/${submission.id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="nhsuk-pagination" role="navigation" aria-label="Pagination">
          <ul className="nhsuk-pagination__list">
            {Array.from({ length: totalPages }).map((_, i) => (
              <li className="nhsuk-pagination__item" key={i}>
                <Link
                  className={`nhsuk-pagination__link ${page === i + 1 ? 'nhsuk-pagination__link--current' : ''}`}
                  href={`/clinician/queue?page=${i + 1}${status ? `&status=${status}` : ''}`}
                >
                  {i + 1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
