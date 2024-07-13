import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./utils/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://aissist_owner:zltED4TIwS8Z@ep-late-union-a56eygw3-pooler.us-east-2.aws.neon.tech/aissist?sslmode=require',
  },
  verbose: true,
  strict: true,
})
