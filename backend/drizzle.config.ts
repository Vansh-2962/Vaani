import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { envData } from "./src/config/env.js";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: envData?.DATABASE_URL as string,
  },
});
