@echo off
REM ============================================================
REM  Seed the AI courses into the PRODUCTION database.
REM  Run from the project root:  scripts\seed-prod-courses.bat
REM  Safe to re-run: the seed is idempotent (skips existing).
REM ============================================================

REM Move to the project root (this script lives in scripts\)
cd /d "%~dp0.."

echo.
echo [1/3] Pulling production environment...
call vercel env pull .env.production.local --environment=production --yes
if errorlevel 1 goto :error

echo.
echo [2/3] Seeding courses into the production database...
set DOTENV_CONFIG_PATH=.env.production.local
REM PAYLOAD_SECRET is Sensitive in Vercel (not included in the pull). Creating
REM courses needs no encrypted fields, so a throwaway secret is fine here.
set PAYLOAD_SECRET=seed-only-temporary-secret-not-used-for-auth
REM Never let the seed alter the production schema, and abort if we didn't
REM actually connect to Postgres.
set PAYLOAD_DB_PUSH=false
set SEED_REQUIRE_POSTGRES=1
call npx tsx scripts/seed-ai-courses.ts
set SEED_EXIT=%errorlevel%

echo.
echo [3/3] Removing the pulled secrets file...
del .env.production.local
set DOTENV_CONFIG_PATH=
set PAYLOAD_SECRET=
set PAYLOAD_DB_PUSH=
set SEED_REQUIRE_POSTGRES=

if not "%SEED_EXIT%"=="0" goto :error
echo.
echo Done. Courses are in production.
echo Detail pages work immediately; the /courses list and homepage
echo refresh within ~10 minutes (or redeploy for an instant update).
goto :end

:error
echo.
echo Something went wrong - see the output above.
if exist .env.production.local del .env.production.local

:end
