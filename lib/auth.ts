import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { randomUUID } from 'crypto';
import { addHours, isAfter } from 'date-fns';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE = 'clinician_session';

export async function createClinicianSession(clinicianId: number) {
  const token = randomUUID();
  const expires = addHours(new Date(), 8);
  await prisma.session.create({
    data: {
      token,
      clinicianId,
      expiresAt: expires
    }
  });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires
  });
}

export async function getClinicianFromSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { clinician: true }
  });
  if (!session) return null;
  if (isAfter(new Date(), session.expiresAt)) {
    await prisma.session.delete({ where: { id: session.id } });
    cookies().delete(SESSION_COOKIE);
    return null;
  }
  return session.clinician;
}

export async function clearSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookies().delete(SESSION_COOKIE);
}

export async function verifyClinicianCredentials(email: string, password: string) {
  const clinician = await prisma.clinician.findUnique({ where: { email } });
  if (!clinician) return null;
  const valid = await bcrypt.compare(password, clinician.passwordHash);
  if (!valid) return null;
  return clinician;
}
