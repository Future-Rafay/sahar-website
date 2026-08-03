import assert from "node:assert/strict";
import test from "node:test";

import { assertProductionEnvironment } from "@/config/env";

const valid = {
  DATABASE_URL: "mysql://app:secret@db.example.com:3306/sahar?sslaccept=strict",
  DATABASE_CONNECTION_LIMIT: "5",
  DATABASE_SSL: "true",
  AUTH_SECRET: "a-production-secret-with-32-characters",
  NEXTAUTH_URL: "https://sahar.ch",
  GOOGLE_CLIENT_ID: "client.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "google-secret",
  AWS_REGION: "eu-central-1",
  AWS_ACCESS_KEY_ID: "AKIAEXAMPLE",
  AWS_SECRET_ACCESS_KEY: "aws-secret",
  S3_BUCKET_NAME: "sahar-production",
  S3_PUBLIC_BASE_URL: "https://assets.sahar.ch",
  RESEND_API_KEY: "re_live_example",
  EMAIL_FROM: "Sahar <no-reply@sahar.ch>",
  APP_URL: "https://sahar.ch",
  STRIPE_SECRET_KEY: "sk_live_example",
  STRIPE_WEBHOOK_SECRET: "whsec_example",
};

test("production environment accepts managed TLS configuration", () => {
  assert.equal(assertProductionEnvironment(valid).DATABASE_SSL, true);
});

test("production environment rejects local, placeholder, and test payment values", () => {
  assert.throws(() => assertProductionEnvironment({
    ...valid,
    DATABASE_URL: "mysql://sahar:change-me@127.0.0.1:3306/sahar_dev",
    DATABASE_SSL: "false",
    STRIPE_SECRET_KEY: "sk_test_placeholder",
  }));
});
