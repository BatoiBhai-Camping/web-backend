import {z} from "zod"
const validateAdmin = z.object({
    id: z.string("admin id is required")
})

export {validateAdmin}