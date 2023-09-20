CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."workouts"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "user_id" text NOT NULL, "name" text NOT NULL, "type" text NOT NULL, "repeat" boolean NOT NULL, "interval" numeric NOT NULL, "goal_per_day" numeric NOT NULL, "stop_after" numeric NOT NULL, "rest" numeric NOT NULL, "squeeze" numeric NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_workouts_updated_at"
BEFORE UPDATE ON "public"."workouts"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_workouts_updated_at" ON "public"."workouts" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
