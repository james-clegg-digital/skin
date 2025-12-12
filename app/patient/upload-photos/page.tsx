import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from '@/lib/validation';

async function savePhotos(formData: FormData) {
  'use server';
  const submissionId = Number(formData.get('submissionId'));
  if (!submissionId) return;
  const files = formData.getAll('photos') as File[];
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  for (const file of files) {
    if (!file || !file.size) continue;
    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      continue;
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${submissionId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    await prisma.submissionPhoto.create({
      data: {
        submissionId,
        filename,
        originalName: file.name,
        contentType: file.type
      }
    });
  }
  redirect(`/patient/upload-photos?submissionId=${submissionId}`);
}

async function removePhoto(formData: FormData) {
  'use server';
  const photoId = Number(formData.get('photoId'));
  const submissionId = Number(formData.get('submissionId'));
  if (!photoId || !submissionId) return;
  const photo = await prisma.submissionPhoto.findUnique({ where: { id: photoId } });
  if (photo) {
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', photo.filename);
    if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);
    await prisma.submissionPhoto.delete({ where: { id: photoId } });
  }
  redirect(`/patient/upload-photos?submissionId=${submissionId}`);
}

async function continueToReview(formData: FormData) {
  'use server';
  const submissionId = Number(formData.get('submissionId'));
  if (!submissionId) return;
  redirect(`/patient/review?submissionId=${submissionId}`);
}

export default async function UploadPhotosPage({ searchParams }: { searchParams: { submissionId?: string } }) {
  const submissionId = Number(searchParams.submissionId);
  if (!submissionId) redirect('/start');
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { photos: true }
  });
  if (!submission) redirect('/start');
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <Link className="nhsuk-back-link" href={`/patient/mole-details?submissionId=${submissionId}`}>
          Back
        </Link>
        <h1 className="nhsuk-heading-l">Upload photos</h1>
        <div className="nhsuk-inset-text">
          <p>Use natural light, keep the camera steady, include a ruler or coin for scale and avoid flash glare.</p>
        </div>
        <form action={savePhotos} encType="multipart/form-data">
          <input type="hidden" name="submissionId" value={submissionId} />
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="photos">
              Add up to 6 images
            </label>
            <span className="nhsuk-hint">JPG, PNG or WebP, up to 10MB each.</span>
            <input className="nhsuk-file-upload" id="photos" name="photos" type="file" accept="image/*" multiple />
          </div>
          <button className="nhsuk-button" type="submit">
            Upload
          </button>
        </form>
        <h2 className="nhsuk-heading-m nhsuk-u-margin-top-4">Your photos</h2>
        {submission.photos.length === 0 && <p>No photos uploaded yet.</p>}
        <div className="nhsuk-grid-row">
          {submission.photos.map((photo) => (
            <div className="nhsuk-grid-column-one-third" key={photo.id}>
              <figure>
                <img
                  src={`/uploads/${photo.filename}`}
                  alt={`Uploaded mole photo ${photo.originalName}`}
                  className="nhsuk-image__img"
                />
                <figcaption className="nhsuk-body-s">{photo.originalName}</figcaption>
              </figure>
              <form action={removePhoto}>
                <input type="hidden" name="submissionId" value={submissionId} />
                <input type="hidden" name="photoId" value={photo.id} />
                <button className="nhsuk-button nhsuk-button--secondary" type="submit">
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>
        <form action={continueToReview} className="nhsuk-u-margin-top-4">
          <input type="hidden" name="submissionId" value={submissionId} />
          <button className="nhsuk-button nhsuk-button--secondary" type="submit">
            Continue to review
          </button>
        </form>
      </div>
    </div>
  );
}
