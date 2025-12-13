# Bruno API Collection for Pompom Time

This Bruno collection contains HTTP requests for testing all serverless functions in the Pompom Time project.

## What is Bruno?

Bruno is a lightweight, open-source API client (like Postman) that stores collections as files in your repository, making them version-controlled and easy to share with your team.

## Installation

1. **Download Bruno:**

   - Visit [https://www.usebruno.com/](https://www.usebruno.com/)
   - Download the installer for your operating system
   - Or install via Homebrew (macOS): `brew install --cask bruno`

2. **Open the Collection:**
   - Launch Bruno
   - Click "Open Collection" or use `Cmd+O` (macOS) / `Ctrl+O` (Windows/Linux)
   - Navigate to and select the `bruno/` folder in this repository

## Environment Setup

This collection includes two environments:

### Local Environment

- **Base URL:** `http://localhost:4200`
- Use this when running the project locally with `yarn dev` (which runs Netlify Dev)

### Production Environment

- **Base URL:** `https://pompom-time.netlify.app`
- Use this to test against the deployed production site

### Switching Environments

1. Click the environment dropdown in the top-right corner of Bruno
2. Select either "Local" or "Production"

## Authentication

All serverless functions require authentication via Netlify Identity. The easiest way to authenticate is using the **Login** request.

### Quick Start with Login Request

1. **Set your credentials:**

   - Open your environment file (`local.bru` or `prod.bru`)
   - Set the `loginEmail` and `loginPassword` secret variables with your credentials

2. **Run the Login request:**

   - Navigate to `requests/auth/login.bru`
   - Click "Send" to authenticate
   - The `authToken` and `userId` will be automatically stored in your environment

3. **Use authenticated requests:**
   - All serverless function requests will now use the stored `authToken` automatically

### Manual Token Setup (Alternative)

If you prefer to set the token manually:

1. **Get your auth token:**

   - Log in to your app (local or production)
   - Obtain the JWT token from Netlify Identity
   - This is typically stored in localStorage or cookies after login

2. **Set the token in Bruno:**
   - Open the environment file (`local.bru` or `prod.bru`)
   - Set the `authToken` secret variable with your JWT token

**Important:** Never commit real authentication tokens or passwords to the repository. Use Bruno's secret variables feature or environment files that are excluded from git.

## Available Requests

### Authentication

#### Login

- **Method:** POST
- **Path:** `/.netlify/identity/token`
- **Description:** Authenticates a user and automatically stores the JWT token and user ID
- **Body:** Form URL-encoded with `grant_type: "password"`, `username` (email), and `password`
- **Automation:** After successful login, stores `authToken` and `userId` in environment variables

### Serverless Functions

### 1. Add Workout By User

- **Method:** POST
- **Path:** `/.netlify/functions/add-workout-by-user`
- **Description:** Creates a new workout for the authenticated user
- **Body:** JSON with workout details (name, variety, repeat, goal_per_day, rest, squeeze, optional interval)

### 2. Delete Workout By ID

- **Method:** POST
- **Path:** `/.netlify/functions/delete-workout-by-id`
- **Description:** Deletes a workout by its ID
- **Body:** JSON with workout `id`

### 3. Get Workouts By ID

- **Method:** GET
- **Path:** `/.netlify/functions/get-workouts-by-id`
- **Description:** Retrieves a workout by its ID
- **Query:** `workout_id` parameter

### 4. List Workouts By User ID

- **Method:** GET
- **Path:** `/.netlify/functions/list-workouts-by-user-id`
- **Description:** Lists workouts for the authenticated user
- **Query:** Optional `workout_name` parameter for filtering

## Using Variables

Each request file uses Bruno variables (like `{{workoutId}}`, `{{workoutName}}`, etc.) instead of hardcoded values. To use a request:

1. Open the request file in Bruno
2. Replace the variable placeholders with actual values, or
3. Set them as environment variables for reuse across requests

## Running Requests

### First Time Setup

1. Select the appropriate environment (Local or Production)
2. Set `loginEmail` and `loginPassword` in your environment secrets
3. Run the **Login** request (`requests/auth/login.bru`) to authenticate
4. The `authToken` and `userId` will be automatically stored

### Using Serverless Function Requests

1. Ensure you've run the Login request first (or manually set `authToken`)
2. Open any request file from the `requests/serverless/` folder
3. Update any variable values if needed (e.g., `{{workoutId}}`, `{{workoutName}}`)
4. Click "Send" or press `Cmd+Enter` (macOS) / `Ctrl+Enter` (Windows/Linux)

## Notes

- All functions require authentication - make sure your `authToken` is valid
- The local dev server must be running (`yarn dev`) to test with the Local environment
- For production testing, ensure you have proper access and valid credentials
- Check the `docs` section in each request file for detailed parameter information
