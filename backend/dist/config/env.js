import z from "zod";
import "dotenv/config";
const envSchema = z.object({
    DATABASE_URL: z.url(),
    PORT: z.string().default("5000"),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    GEMINI_API_KEY: z.string(),
});
if (!envSchema.safeParse(process.env)) {
    console.error("❌ Invalid environment variables:");
    process.exit(1);
}
export const envData = envSchema.safeParse(process.env).data;
//# sourceMappingURL=env.js.map