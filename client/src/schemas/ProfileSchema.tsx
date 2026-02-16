import z, { number } from "zod";


export const profileSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    experience: number().min(0, 'Kinh nghiệm không thể âm'),
    bio: z.string().optional(),
    skills: z.string().optional(),
    companyName: z.string().optional(),
    website: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    avatar: z
        .any()
});