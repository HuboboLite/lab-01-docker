# Lab 01 Part 2: Writing Dockerfiles

In this part, you'll write Dockerfiles to containerize a real full-stack application — a simple Todo app with a Python/FastAPI backend and a React/Vite frontend.

## The Application

- **Backend** (`backend/`): A FastAPI server (Python 3.12) that exposes a REST API for creating, listing, updating, and deleting todo tasks. It runs on port `8000`.
- **Frontend** (`frontend/`): A React + Vite app (TypeScript) that talks to the backend API. It runs on port `5173` in dev mode.

## Your Task

Your job is to split this application into two working Dockerfiles — one for the backend and one for the frontend — and get both containers running and talking to each other.

### Step 1: Dockerize the Backend

Create `backend/Dockerfile`. The backend uses [`uv`](https://docs.astral.sh/uv/) as its package manager (see `backend/pyproject.toml`).

Your Dockerfile should:

1. Start from a Python 3.12 base image (e.g., `python:3.12-slim`)
2. Install `uv` (you can install it with `pip install uv` or use the official installer)
3. Copy `pyproject.toml` and `uv.lock` into the image
4. Install dependencies with `uv sync --frozen --no-dev`
5. Copy the application source (`main.py`)
6. Expose port `8000`
7. Start the server with:
   ```
   uv run fastapi run main.py --port 8000
   ```

Build and test it:

```bash
docker build -t todo-backend ./backend
docker run -p 8000:8000 todo-backend
```

You should be able to visit `http://localhost:8000/docs` and see the FastAPI interactive docs.

### Step 2: Dockerize the Frontend

Create `frontend/Dockerfile`. The frontend uses `yarn` and Vite.

Your Dockerfile should:

1. Start from a `node:20-slim` (or similar) base image
2. Copy `package.json` and `yarn.lock`
3. Install dependencies with `yarn install --frozen-lockfile`
4. Copy the rest of the source
5. Expose port `5173`
6. Start the dev server with:
   ```
   yarn dev --host
   ```
   The `--host` flag is required so the server binds to `0.0.0.0` and is reachable outside the container.

Build and test it:

```bash
docker build -t todo-frontend ./frontend
docker run -p 5173:5173 todo-frontend
```

You should see the Vite dev server start up. The UI will load at `http://localhost:5173`, but it won't be able to reach the backend yet — that's the next step.

### Step 3: Connect Frontend to Backend

The frontend reads the backend URL from the environment variable `VITE_BACKEND_BASE_URL` (see `frontend/.env.local`). By default it's set to a hardcoded IP — you'll need to override this when running the container.

Pass the variable at runtime using the `-e` flag:

```bash
docker run -p 5173:5173 -e VITE_BACKEND_BASE_URL=http://localhost:8000 todo-frontend
```

Now run both containers at the same time (in separate terminals) and verify that:

- You can create todos in the UI
- Todos appear in the list
- You can delete or check them off

> **Heads up:** Because the frontend app runs in your *browser* (not inside the container), `localhost:8000` refers to your host machine — which works as long as you've published the backend port with `-p 8000:8000`.

### Bonus: Multi-stage Build for the Frontend

Running Vite's dev server in a container works, but it's not ideal for production. A better approach is a **multi-stage build**:

1. **Stage 1 (builder):** Use a Node image to install dependencies and run `yarn build`, which outputs a static `dist/` folder.
2. **Stage 2 (server):** Copy just the `dist/` folder into a lightweight `nginx` image and serve it as static files.

This produces a much smaller final image with no build tooling included. Try rewriting `frontend/Dockerfile` to use this pattern and compare the image sizes with `docker images`.

## Tips

- Use `docker ps` to list running containers and `docker logs <container>` to debug them.
- If a port is already in use, either stop the conflicting container (`docker stop <id>`) or pick a different host port with `-p <host-port>:<container-port>`.
- Prefer `COPY`ing only what you need before installing dependencies — this allows Docker to cache the dependency installation layer and skip it on rebuilds when only source files change.
- `.dockerignore` works just like `.gitignore` and keeps your image lean by excluding `node_modules`, `.venv`, `__pycache__`, etc.
