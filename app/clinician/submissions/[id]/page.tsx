import { prisma } from '@/lib/prisma';
import { getClinicianFromSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function updateStatus(formData: FormData) {
  'use server';
  const clinician = await getClinicianFromSession();
  if (!clinician) redirect('/clinician/login');
  const submissionId = Number(formData.get('submissionId'));
  const status = String(formData.get('status')) as any;
  const outcome = (formData.get('outcome') as string) || null;
  if (!submissionId) return;
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status,
      outcome: outcome as any,
      statusHistory: {
        create: { status, note: `Updated by ${clinician.name}` }
      }
    }
  });
  redirect(`/clinician/submissions/${submissionId}`);
}

async function addMessage(formData: FormData) {
  'use server';
  const clinician = await getClinicianFromSession();
  if (!clinician) redirect('/clinician/login');
  const submissionId = Number(formData.get('submissionId'));
  const body = String(formData.get('body') || '').trim();
  if (!submissionId || !body) return;
  await prisma.message.create({
    data: { submissionId, clinicianId: clinician.id, body }
  });
  redirect(`/clinician/submissions/${submissionId}`);
}

export default async function SubmissionDetail({ params }: { params: { id: string } }) {
  const clinician = await getClinicianFromSession();
  if (!clinician) redirect('/clinician/login');
  const submissionId = Number(params.id);
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      patient: true,
      photos: true,
      messages: { include: { clinician: true } },
      statusHistory: true
    }
  });
  if (!submission) redirect('/clinician/queue');
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <Link className="nhsuk-back-link" href="/clinician/queue">
          Back to queue
        </Link>
        <h1 className="nhsuk-heading-l">Submission {submission.reference}</h1>
        <section className="nhsuk-section-break--visible">
          <h2 className="nhsuk-heading-m">Patient</h2>
          <p className="nhsuk-body">{submission.patient.name}</p>
          <p className="nhsuk-body">DOB: {submission.patient.dateOfBirth.toISOString().substring(0, 10)}</p>
          <p className="nhsuk-body">NHS number: {submission.patient.nhsNumber || 'Not provided'}</p>
        </section>
        <section className="nhsuk-section-break--visible">
          <h2 className="nhsuk-heading-m">Mole details</h2>
          <ul className="nhsuk-list nhsuk-list--bullet">
            <li>Location: {submission.moleLocation || 'Not provided'}</li>
            <li>Noticed: {submission.noticedAt ? submission.noticedAt.toISOString().substring(0, 10) : 'Not provided'}</li>
            <li>Changes: {submission.changes || 'Not provided'}</li>
            <li>Symptoms: {submission.symptoms || 'None'}</li>
            <li>Notes: {submission.notes || 'None'}</li>
          </ul>
        </section>
        <section>
          <h2 className="nhsuk-heading-m">Images</h2>
          <div className="nhsuk-grid-row">
            {submission.photos.map((photo) => (
              <div className="nhsuk-grid-column-one-half" key={photo.id}>
                <a href={`/uploads/${photo.filename}`} target="_blank" rel="noreferrer">
                  <img
                    src={`/uploads/${photo.filename}`}
                    alt={`Uploaded mole photo ${photo.originalName}`}
                    className="nhsuk-image__img"
                  />
                </a>
              </div>
            ))}
            {submission.photos.length === 0 && <p>No photos uploaded.</p>}
          </div>
        </section>
        <section>
          <h2 className="nhsuk-heading-m">Triage outcome</h2>
          <form action={updateStatus}>
            <input type="hidden" name="submissionId" value={submissionId} />
            <div className="nhsuk-form-group">
              <label className="nhsuk-label" htmlFor="status">Status</label>
              <select id="status" name="status" className="nhsuk-select" defaultValue={submission.status}>
                <option value="IN_REVIEW">In review</option>
                <option value="NEEDS_MORE_INFO">Needs more info</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="nhsuk-form-group">
              <label className="nhsuk-label" htmlFor="outcome">Outcome</label>
              <select id="outcome" name="outcome" className="nhsuk-select" defaultValue={submission.outcome || ''}>
                <option value="">Choose outcome</option>
                <option value="ROUTINE">Routine</option>
                <option value="URGENT">Urgent</option>
                <option value="NEEDS_MORE_INFO">Needs more info</option>
                <option value="NO_FURTHER_ACTION">No further action</option>
              </select>
            </div>
            <button className="nhsuk-button" type="submit">
              Save update
            </button>
          </form>
        </section>
        <section>
          <h2 className="nhsuk-heading-m">Messages</h2>
          {submission.messages.length === 0 && <p>No messages yet.</p>}
          <ul className="nhsuk-list">
            {submission.messages.map((msg) => (
              <li key={msg.id}>
                <strong>{msg.clinician?.name || 'Patient'}:</strong> {msg.body}
              </li>
            ))}
          </ul>
          <form action={addMessage} className="nhsuk-form-group">
            <input type="hidden" name="submissionId" value={submissionId} />
            <label className="nhsuk-label" htmlFor="body">
              Add note or request more info
            </label>
            <textarea className="nhsuk-textarea" id="body" name="body" rows={3}></textarea>
            <button className="nhsuk-button nhsuk-button--secondary" type="submit">
              Send message
            </button>
          </form>
        </section>
        <section>
          <h2 className="nhsuk-heading-m">Status history</h2>
          <ul className="nhsuk-list">
            {submission.statusHistory.map((entry) => (
              <li key={entry.id}>
                {entry.status} – {new Date(entry.createdAt).toLocaleString()} {entry.note && `(${entry.note})`}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
