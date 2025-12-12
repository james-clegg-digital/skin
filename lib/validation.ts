export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImage(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Files must be JPG, PNG or WebP images.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Each file must be smaller than 10MB.';
  }
  return null;
}
