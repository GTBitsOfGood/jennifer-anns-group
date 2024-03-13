# Backend

So sorry for how many changes and refactorings we've done to the backend guys!! Hopefully this guide helps a little. It's currently only updated for what exists in the backend as of Sprint 2, but I will update it to include what will be added in future sprint as well!

## Models

`src/server/db/models`

These files contain the schemas for the models used in the database. The models are used to store information about games, themes, tags, and users.

### GameModel

This file contains the schema for the game model, including relationships with themes, tags, and builds.

- name: String, required, unique
- themes: Array of ObjectIds, ref: "Theme", default: []

  - Sprint 1: this started out as theme (since we thought each game would have one theme)
  - Sprint 2: modified to an array of themes pointing to ObjectIds in the theme model

- tags: Array of ObjectIds, ref: "Tag", default: []

  - Sprint 1: this started out as a string array of tags
  - Sprint 2: modified to an array of tags pointing to ObjectIds in the tag model

- description: String, required
- webGLBuild: Boolean, default: false
  - Sprint 1: this was originally "game" when we thought webGL was the only build we were supporting
  - Sprint 2: modified to a boolean that signifies whether or not the game has a build
- builds: Array of BuildSchema, default: []
  - Sprint 2: added to point to all the builds for a game EXCEPT webGL
- lesson: String
- parentingGuide: String
- answerKey: String
  - Sprint 2: added to support nonprofit's request for answer keys in games
- videoTrailer: String
  - Sprint 2: added to support nonprofit's request for video trailer in games
- image: String (not yet implemented)
  - Sprint 5: will be added to support image previews on game gallery, home page, game pages without webgl builds, etc

This file also contains the schema for the build model, which is a subdocument of the game model. This schema was implemented in Sprint 2.

- type: String, enum: see AllBuilds in [types](types/index.ts), required
  - these are the six other builds we will be supporting, but these will just be links to app stores or repositories for downloading and not embedded games like webGL
- link: String, required
- instructions: String
  - Windows, Mac, and Linux games have instructions for downloading, so we added this field to support that

### TagModel

This file contains the schema for the tag model, which is used to categorize games. Tags can be either accessibility or custom tags. What might be confusing is that on the site, accessibility tags are referred to as "Accessibility" while custom tags are referred to as "Tags".

- name: String, required, unique
- type: String, enum: ["accessibility", "custom"], required

### ThemeModel

This file contains the schema for the theme model, which is used to categorize games. Themes are used to group games by topic.

- name: String, required, unique

### UserModel

This file contains the schema for the user model, which is used to store user information.

- email: String, required, unique
- hashedPassword: String, required
- firstName: String, required
- lastName: String, required
- label: String, enum: ["student", "parent", "educator", "administrator"], required

## Actions

`src/server/db/actions`

These files contain the functions that interact with the database. The functions are used to create, read, update, and delete games, themes, tags, and users.

**These files were heavily modified** in the refactoring to follow the same format for error handling. See more about error handling below!

### BuildAction

This file currently contains the function `deleteBuild` to delete a build. This was implemented in Sprint 2.

The functionality to add a build can be found [here](src/utils/file.ts). This may be refactored later...

### GameAction

This file contains the functions:

- `createGame` which creates a game along with its associated themes and tags IDs
- `deleteGame` which deletes a game and its associated WebGL build if it exists (check if `webGLBuild` is true)
- `editGame` which updates the game's information and associated themes and tags IDs if the themes and tags were modified
- `getAllGames` which returns all games
- `getGameById` which returns a game given an ID

### TagAction

- `createTag` which creates a tag and adds the tag to any games that have the tag
- `deleteTag` which deletes a tag and removes the tag from any games that have the tag
- `getTagsByType` which returns all the tags sorted by whether they are accessibility or custom tags

### ThemeAction

- `createTheme` which creates a theme and adds the theme to any games that have the theme
- `deleteTheme` which deletes a theme and removes the theme from any games that have the theme
- `getThemes` which returns all the themes

### UserAction

- `createUser` which creates a user and hashes the user's password
- `verifyUser` which verifies a user's email and password for login
- `getUser` which returns a user given an id
- `editUser` which updates a user's information (and only updates the email if the email is not already in use)
- `editPassword` which updates a user's password after verifying the user's old password

## API Endpoints

`src/pages/api`

These files contain the API endpoints that the frontend uses to interact with the backend. The endpoints are used to create, read, update, and delete games, themes, tags, and users.

**These files were also heavily modified in the refactoring** to follow the same format for writing handlers and error handling.

Let's just go through one example and all the others should be pretty similar!

### games/[id]

Based on the HTTP method, the handler will call the appropriate function in the switch statement and return the result. If the HTTP method is not supported, the handler will return a 405 status code.

- `getGameByIdHandler` which calls `getGameById` in `src/server/db/actions/game.ts` to get a game by its ID (for a GET request)
- `deleteGameHandler` which calls `deleteGame` in `src/server/db/actions/game.ts` to delete a game by its ID (for a DELETE request)
- `editGameHandler` which calls `editGame` in `src/server/db/actions/game.ts` to edit a game by its ID (for a PUT request)

Notice that the exceptions thrown are specific to games. These exceptions can be found in `src/utils/exceptions/game.ts`. The HTTP status codes can be found in `src/utils/consts.ts`.

### tags

There currently exists a delete endpoint in both `tags/index.ts` and `tags/[id]/index.ts`. For the frontend, please stick to using `tags/[id]` when you can for deleting tags and I will remove the `tags` DELETE endpoint in the next refactor. The same thing applies for themes.

## Error Handling

`src/utils/exceptions`

Originally, these exceptions were located in a file `src/utils/exceptions` which contained a custom error handler. It has now been refactored to have a separate exceptions file for each model. Please use these exceptions when throwing errors in the backend! Additionally, please use the HTTP status codes in `src/utils/consts.ts` when returning status codes in the backend.

## Other

If you notice anything that wasn't refactored correctly or needs to be refactored, please let me know! I'll try to complete the refactoring between sprints instead of during the sprint to prevent future merge conflicts. Sorry for the inconvenience this sprint guys... I really appreciate all the work you're putting into this project!!
