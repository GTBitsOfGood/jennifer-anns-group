## Jennifer Ann's Group

## Development Setup

- Get a locally running MongoDB instance
  - If you have docker installed I believe `docker run --name mongodb -d -p 27017:27017 mongo` will work
- Create a `.env` file in the root of the repository with the content: `DATABASE_URL=mongodb://localhost:27017/jenniferanns`
- `npm install`
- `npm run dev`

## Run With Docker

1. Install [Docker](https://docs.docker.com/engine/install/)
2. Start the application with Docker Compose: `docker compose up`

If you make any changes to the packages, you may need to rebuild the images. To do this, append `--build` to the above docker compose up command.

The Dockerized application will have live-reloading of changes made on the host machine.

Note: On linux-based operating systems, if you come across an entrypoint permission error (i.e. `process: exec: "./entrypoint.sh": permission denied: unknown`), run `chmod +x ./entrypoint.sh` to make the shell file an executable.

Windows Users: If you come across this error `exec ./entrypoint.sh: no such file or directory` when running the docker compose command, please follow this [Stackoverflow thread](https://stackoverflow.com/questions/40452508/docker-error-on-an-entrypoint-script-no-such-file-or-directory) to fix it.

## Major Technologies

- [MongoDB](https://www.mongodb.com/)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
