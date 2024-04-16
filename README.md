# Jennifer Ann's Group

## Overview

Jennifer Ann's Group is a nonprofit organization dedicated to preventing teen dating violence through Awareness, Education, and Advocacy in memory of Jennifer Crecente. This Content Management Service will serve as a centralized platform to host educational games, lesson plans, and other resources aimed at reaching young people, parents, and educators. Read more about the organization at https://jenniferann.org/.

## Development Setup

- Install [Node.js](https://nodejs.org/en/download/)
- Install [MongoDB Community Server](https://www.mongodb.com/docs/manual/administration/install-community/) to host a local instance of MongoDB. It may also be helpful to download [MongoDB Compass](https://www.mongodb.com/try/download/compass#compass) to view the state of your database.
- Install and enable [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) in VSCode
- Get a locally running MongoDB instance.
  You can use the command:
  ```sh
  docker run --name mongodb -d -p 27017:27017 mongo
  ```
- In the root directory of the project, run:

  ```sh
  npm install
  ```

- In the root directory, run one of these commands based on your OS:

  ```sh
  npm run secrets:linux # mac / linux
  npm run secrets:windows # windows
  ```

  You should be prompted for a master password. Ask your Engineering leadership to continue. Once the password has been verified, your `.env` file should have been created automatically for you.

  If you are unable to use the commands to retrieve the `.env` file, you can download or visit [Bitwarden](https://bitwarden.com/) and login using `product@bitsofgood.org` and the master password. The `.env` file will be available within the vault.

- To start the Next.js dev server, run:

  ```sh
  npm run dev
  ```

- Navigate to http://localhost:3000/ to view the application.

## Run With Docker

1. Install [Docker](https://docs.docker.com/engine/install/)
2. Obtain the Bitwarden password from your EM. Create a `bitwarden.env` file and fill it in with the following contents:

```
BW_PASSWORD=<your bitwarden password>
```

This only needs to be done on your first run. After that, you should delete the file from your repository to avoid pushing it to Github.

3. Start the application with Docker Compose: `docker compose up`

If you make any changes to the packages, you may need to rebuild the images. To do this, append `--build` to the above docker compose up command.

The Dockerized application will have live-reloading of changes made on the host machine.

Note: On linux-based operating systems, if you come across an entrypoint permission error (i.e. `process: exec: "./entrypoint.sh": permission denied: unknown`), run `chmod +x ./entrypoint.sh` to make the shell file an executable.

Windows Users: If you come across this error `exec ./entrypoint.sh: no such file or directory` when running the docker compose command, please follow this [Stackoverflow thread](https://stackoverflow.com/questions/40452508/docker-error-on-an-entrypoint-script-no-such-file-or-directory) to fix it.

## Major Technologies

- [MongoDB](https://www.mongodb.com/)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
