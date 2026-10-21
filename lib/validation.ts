import { z } from "zod";
import { budgetRanges, contactMethods, projectTypes } from "./content";

const phoneRegex = /^[+()\-\s\d]{8,20}$/;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email address").max(120),
  projectType: z.enum(projectTypes, { errorMap: () => ({ message: "Please choose a project type" }) }),
  location: z.string().trim().min(2, "Where is the project?").max(120),
  budget: z.enum(budgetRanges).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more about your project (10+ characters)")
    .max(2000, "Please keep it under 2000 characters"),
  contactMethod: z.enum(contactMethods, { errorMap: () => ({ message: "How should we reach you?" }) }),
  consent: z.boolean().refine((v) => v === true, "Please confirm we may contact you"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** Anti-spam fields sent alongside the enquiry but never shown to people. */
export const spamGuardSchema = z.object({
  website: z.string().max(500).optional(), // honeypot – real visitors leave it empty
  startedAt: z.number().int().positive(),
});
