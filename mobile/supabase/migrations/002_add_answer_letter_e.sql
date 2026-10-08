-- Migration 002: allow a fifth answer choice ('E').
--
-- For a Supabase project that was set up with the ORIGINAL schema.sql.
-- (Fresh projects should just run the current schema.sql instead.)
--
-- Run this on its own in Supabase Dashboard > SQL Editor BEFORE 003:
-- Postgres won't let a new enum value be used in the same transaction
-- that adds it, so it can't share a script with 003's inserts.

alter type answer_letter add value if not exists 'E';
