import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function handleSubmit(formData: FormData) {
  'use server';
  const submissionId = Number(formData.get('submissionId'));
  const moleLocation = String(formData.get('location') || '').trim();
  const noticedAt = String(formData.get('noticedAt') || '').trim();
  const changes = String(formData.get('changes') || '').trim();
  const symptoms = (formData.getAll('symptoms') as string[]).filter(Boolean).join(', ');
  const notes = String(formData.get('notes') || '').trim();
  if (!submissionId) return;
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      moleLocation,
      noticedAt: noticedAt ? new Date(noticedAt) : null,
      changes,
      symptoms,
      notes
    }
  });
  redirect(`/patient/upload-photos?submissionId=${submissionId}`);
}

export default async function MoleDetailsPage({ searchParams }: { searchParams: { submissionId?: string } }) {
  const submissionId = Number(searchParams.submissionId);
  if (!submissionId) {
    redirect('/start');
  }
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { patient: true }
  });
  if (!submission) redirect('/start');
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <Link className="nhsuk-back-link" href="/start">
          Back
        </Link>
        <h1 className="nhsuk-heading-l">About the mole</h1>
        <p className="nhsuk-body">Help us understand what is happening with the mole.</p>
        <form action={handleSubmit}>
          <input type="hidden" name="submissionId" value={submission.id} />
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="location">
              Where on your body is the mole?
            </label>
            <input className="nhsuk-input" id="location" name="location" type="text" defaultValue={submission.moleLocation || ''} />
          </div>
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="noticedAt">
              When did you notice it?
            </label>
            <input className="nhsuk-input" id="noticedAt" name="noticedAt" type="date" defaultValue={submission.noticedAt ? submission.noticedAt.toISOString().substring(0, 10) : ''} />
          </div>
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="changes">
              Has it changed?
            </label>
            <textarea className="nhsuk-textarea" id="changes" name="changes" rows={3} defaultValue={submission.changes || ''}></textarea>
          </div>
          <fieldset className="nhsuk-fieldset" aria-describedby="symptoms-hint">
            <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--m">Symptoms</legend>
            <span className="nhsuk-hint" id="symptoms-hint">
              Select all that apply
            </span>
            {['Bleeding', 'Itching', 'Pain'].map((symptom) => (
              <div className="nhsuk-checkboxes__item" key={symptom}>
                <input
                  className="nhsuk-checkboxes__input"
                  id={symptom}
                  name="symptoms"
                  type="checkbox"
                  value={symptom}
                  defaultChecked={submission.symptoms?.includes(symptom)}
                />
                <label className="nhsuk-label nhsuk-checkboxes__label" htmlFor={symptom}>
                  {symptom}
                </label>
              </div>
            ))}
          </fieldset>
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="notes">
              Anything else we should know
            </label>
            <textarea className="nhsuk-textarea" id="notes" name="notes" rows={4} defaultValue={submission.notes || ''}></textarea>
          </div>
          <button className="nhsuk-button" type="submit">
            Save and continue
          </button>
        </form>
      </div>
    </div>
  );
}
