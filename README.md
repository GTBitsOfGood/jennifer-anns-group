# Jennifer Ann's Group

## Overview

Jennifer Ann's Group is a nonprofit organization dedicated to preventing teen dating violence through Awareness, Education, and Advocacy in memory of Jennifer Crecente. This Content Management Service will serve as a centralized platform to host educational games, lesson plans, and other resources aimed at reaching young people, parents, and educators. Read more about the organization at https://jenniferann.org/.

## Development Setup

- Install [Node.js 21](https://nodejs.org/en/download/)
- Install [MongoDB Community Server](https://www.mongodb.com/docs/manual/administration/install-community/) to host a local instance of MongoDB. It may also be helpful to download [MongoDB Compass](https://www.mongodb.com/try/download/compass#compass) to view the state of your database.
- Install and enable [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) in VSCode
- Get a locally running MongoDB instance.
  You can use the command:
  ```sh
  docker run --name mongodb -d -p 27017:27017 mongo
  ```
- In the root directory of the project, run:

  ```sh
  npm ci
  ```

- In the root directory, run one of these commands based on your OS:

  ```sh
  npm run secrets:linux # mac / linux
  npm run secrets:windows # windows
  ```

  You should be prompted for a master password. Ask your Engineering leadership to continue. Once the password has been verified, your `.env` file should have been created automatically for you.

  If you are unable to use the commands to retrieve the `.env` file, you can download or visit [Bitwarden](https://bitwarden.com/) and login using `product@bitsofgood.org` and the master password. The `.env` file will be available within the vault.

- To setup the db with example data, run:
  ```sh
  npm run add-initial-data
  ```

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

- To setup the db with example data and setup hosts so that docker can talk outward to mongo, run:
  ```sh
  npm run add-initial-data
  ```

Note: You cannot have another mongo instance running at `mongodb://localhost:27017`, Docker will spin up the db inside of docker. It is accessible at `mongodb://localhost:27017` locally outside of the container.

Note: On linux-based operating systems, if you come across an entrypoint permission error (i.e. `process: exec: "./entrypoint.sh": permission denied: unknown`), run `chmod +x ./entrypoint.sh` to make the shell file an executable.

Windows Users: If you come across this error `exec ./entrypoint.sh: no such file or directory` when running the docker compose command, please follow this [Stackoverflow thread](https://stackoverflow.com/questions/40452508/docker-error-on-an-entrypoint-script-no-such-file-or-directory) to fix it.

## Major Technologies

- [MongoDB](https://www.mongodb.com/)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)

## Documentation
### Secrets
- Production secrets: `.env` in Bitwarden.
- Local secrets: `.env.local` in Bitwarden. Used when setting up local container with the Bitwarden CLI. 

### Databases
Production Database: We're planning to spin up Mongo in Azure, but we've had issues with Azure giving us permission to. The NP is aware of this problem and we're trying to sort it out, but we have been unable to do so before DRB.

Local Database: MongoDB on Atlas on the Jennifer Ann's Mongo Account (Sign in with our Gmail located in Bitwarden).

#### Reconfiguring

We use mongoose for our schemas. Updating database objects requires updating those schemas in `server/db/models` and altering the actions in the `server/db/actions` directory accordingly. The connection strings are in the environment files store in Bitwarden. There should be no problem creating a new Mongo database, updating the connection string, and running `npm run add-initial-data` if you want to re-create the database.

### File Storage
For accessing both `application-files` (images, pdfs, etc) and `webgl-builds`, we use Backblaze B2 for hosting and Cloudflare as a bridge to connect to it. Cloudflare allows us to reduce the costs on data transfer.

There is only __one__ Cloudflare account and only __one__ Backblaze account. The same Cloudflare worker is used for both production and development, as all it really does is mitigate our costs and isn't responsible for any data storage. There are __two__ versions of the buckets on the Backblaze account. One is for dev and one is for prod, and those buckets are selected at runtime based on the `NODE_ENV` variable. The `B2_BUCKET_ID_BUILD` and `B2_BUCKET_ID_APPLICATION` env variables have to be updated accordingly as well, corresponding to the production/development bucket they are using. Each set of buckets are only used for their respective environments.

#### Reconfiguring
Any data can be put in the Backblaze buckets. The `cloudflare-b2` package inside of this repository can be used to update the configuration of the Cloudflare worker. Simply update the `src/index.js` file and run `npm run deploy`. To update the CORS policy for Backblaze, you have to use the [B2 CLI tool](https://www.backblaze.com/docs/cloud-storage-command-line-tools). Our CORS policy is kept traack of in the `b2-cors.json` file and then we update the actual policy with `b2-tools`.

### Juno

We use [Juno](https://github.com/GTBitsOfGood/juno) for email services. Juno currently has a delay for spinning up email services, which causes delay in email sending. Right now, we're using the internal BoG Juno instance, but once Infra supports it, we will be moving it to Jennifer Ann's Azure instance. Here is [Juno's Email Service Guide](https://api-gateway.whitesmoke-cea9a269.eastus.azurecontainerapps.io/docs#/email) and [API Call Documentation](https://api-gateway.whitesmoke-cea9a269.eastus.azurecontainerapps.io/docs#/).

### Analytics

We use [bog-analytics](https://github.com/GTBitsOfGood/bog-analytics) for analytics. This will always be hosted on BoG infrastructure and we have no plans to move it. The actual data API is only used from the server, and we use internal `api/events/log` and `api/events/view` routes to access it. There is an useAnalytics hook that calls this API with the same syntax as the npm package. 

### Cron Jobs

We have a few cron jobs that run periodically for updating data.
- Every day, we check if data should be deleted following GDPR (user data should be deleted 30 days after deleting an account).
- Every day, we recalculate 'popularity' values for games to decide rankings.

These jobs have verification keys as specified in the .env and can be run from wherever. We're using Github Actions to run them.