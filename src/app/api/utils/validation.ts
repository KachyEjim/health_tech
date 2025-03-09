import { z } from 'zod';

export const diagnosticTestSchema = z.object({
  patientName: z.string().min(3, 'Patient name must be at least 3 characters'),
  testType: z.string().min(3, 'Test type must be at least 3 characters'),
  result: z.record(z.any()),
  testDate: z.string().refine((date: string) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  notes: z.string().optional(),
});
