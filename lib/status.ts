import { SubmissionStatus } from '@prisma/client';

export function allowedTransition(current: SubmissionStatus, next: SubmissionStatus) {
  if (current === next) return true;
  const order = [
    SubmissionStatus.DRAFT,
    SubmissionStatus.SUBMITTED,
    SubmissionStatus.IN_REVIEW,
    SubmissionStatus.NEEDS_MORE_INFO,
    SubmissionStatus.COMPLETED
  ];
  const currentIndex = order.indexOf(current);
  const nextIndex = order.indexOf(next);
  return nextIndex >= currentIndex;
}
