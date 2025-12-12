import { describe, expect, it } from 'vitest';
import { SubmissionStatus } from '@prisma/client';
import { allowedTransition } from '../lib/status';

describe('allowedTransition', () => {
  it('permits forward moves', () => {
    expect(allowedTransition(SubmissionStatus.DRAFT, SubmissionStatus.SUBMITTED)).toBe(true);
    expect(allowedTransition(SubmissionStatus.IN_REVIEW, SubmissionStatus.COMPLETED)).toBe(true);
  });

  it('blocks backward moves', () => {
    expect(allowedTransition(SubmissionStatus.COMPLETED, SubmissionStatus.SUBMITTED)).toBe(false);
  });
});
