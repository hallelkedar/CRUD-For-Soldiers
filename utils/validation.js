import z from 'zod';

export const soldierSchema = z.object(
    {
        name: z.string().min(2, 'Name is too short').max(30, 'Name is too long'),
        role: z.string(),
        soldier_rank: z.string().min(3, 'Rank is too short').max(20, 'Rank is too long'),
        unit: z.string(),
        age: z.number(),
        status: z.string().min(2, 'Status is too short').max(30, 'Status is too long').optional()
    }
)

export const soldierUpdateSchema = soldierSchema.partial()