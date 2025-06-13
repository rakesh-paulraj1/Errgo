/**
 * BONUS: Implement zod schema for model validation
 */
import { describe } from "node:test";
import {z} from "zod";

export interface IProject {
    id: string;
    name: string;
    description: string;
}

export const ProjectSchema=z.object({
    id:z.string().uuid(),
    name:z.string().min(3,"Name should be atleast "),
    descdescription:z.string().max(150,"Description should not exceed 150 characters")
})
