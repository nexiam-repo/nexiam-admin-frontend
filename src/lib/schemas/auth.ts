import { z } from 'zod';

const email = z
  .string()
  .email({ message: 'Enter a valid email.' })
  .min(1, 'Email is required')
  .email('Invalid email');
const passwordPolicy = z
  .string()
  .min(12, { message: 'At least 12 characters.' })
  .regex(/[a-z]/, { message: 'At least one lowercase letter.' })
  .regex(/[A-Z]/, { message: 'At least one uppercase letter.' })
  .regex(/\d/, { message: 'At least one number.' })
  .regex(/[^A-Za-z\d]/, { message: 'At least one symbol.' });

export const signInSchema = z.object({
  email: email,
  password: passwordPolicy,
});
export type SignInFormInputs = z.infer<typeof signInSchema>;
