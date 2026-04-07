-- Migration: add_notification_settings
-- Adds notification preference columns to profiles table

ALTER TABLE "profiles"
  ADD COLUMN IF NOT EXISTS "notify_email"         BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "notify_sms"           BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "notify_job_alerts"    BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "notify_payout_alerts" BOOLEAN NOT NULL DEFAULT true;
