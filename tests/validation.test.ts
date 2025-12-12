import { describe, expect, it } from 'vitest';
import { ACCEPTED_TYPES, MAX_FILE_SIZE, validateImage } from '../lib/validation';

describe('validateImage', () => {
  it('accepts valid images', () => {
    const file = new File([new ArrayBuffer(10)], 'photo.jpg', { type: ACCEPTED_TYPES[0] });
    expect(validateImage(file)).toBeNull();
  });

  it('rejects invalid type', () => {
    const file = new File([new ArrayBuffer(10)], 'photo.gif', { type: 'image/gif' });
    expect(validateImage(file)).toContain('JPG');
  });

  it('rejects oversized file', () => {
    const file = new File([new ArrayBuffer(MAX_FILE_SIZE + 1)], 'photo.jpg', { type: ACCEPTED_TYPES[0] });
    expect(validateImage(file)).toContain('10MB');
  });
});
