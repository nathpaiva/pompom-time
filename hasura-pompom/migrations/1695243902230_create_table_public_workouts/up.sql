CREATE TABLE "public"."workouts"("created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "id" serial NOT NULL, "user_id" text NOT NULL, "name" text NOT NULL, "type" text NOT NULL, "interval" integer NOT NULL, "repeat" boolean NOT NULL, "goal_per_day" integer NOT NULL, "stop_after" integer NOT NULL, "rest" integer NOT NULL, "squeeze" integer NOT NULL, PRIMARY KEY ("id") );
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
