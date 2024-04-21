# Backend

So sorry for how many changes and refactorings we've done to the backend guys!! Hopefully this guide helps a little. 

## Models

`src/server/db/models`

These files contain the schemas for the models used in the database. The models are used to store information about games, themes, tags, and users.

### GameModel

This file contains the schema for the game model, including relationships with themes, tags, and builds.

- name: String, required, unique
- lowercaseName: String, required, unique
  - Sprint 5: added to support case-insensitive search for games (since serverless doesn't support collation)
- themes: Array of ObjectIds, ref: "Theme", default: []
- tags: Array of ObjectIds, ref: "Tag", default: []
- description: String, required
- webGLBuild: Boolean, default: false
- builds: [BuildSchema]
  - points to all the builds for a game EXCEPT webGL
- lesson: String
- parentingGuide: String
- answerKey: String
- videoTrailer: String
- preview: Boolean, required
  - Sprint 5: added to support filtering games by preview status
  - games start off as preview=true and when published become preview=false
- image: String, required
  - Sprint 5: field has been added, but backblaze has not been integrated

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
- notes: [NotesSchema], required

### NoteModel

This file contains the schema for the notes model, which is used to store notes for games. This model was implemented in Sprint 3.

- date: Date, required
- description: String, required
- gameId: ObjectId, required
  - references the corresponding game that the note is for

### AdminModel

This file contains the schema for the admin model, which is used to store authorized admin emails. This means that only users with these emails will have the ability to sign up as an admin. This model will be implemented in Sprint 4.

- email: String, required, unique
- lowercaseEmail: String, required, select: false
  - Sprint 5: added to support case-insensitive search for emails (since serverless doesn't support collation)

### HomePageModel

This file contains the schema for the home page model, which is used to store the information that will be displayed on the home page. Only one document will exist in this collection.

- mdTitle: String, required
- mdDescription: String, required
- gameBoyTitle: String, required
- gameBoys: [GameBoySchema], required
- singleton: Boolean, unique, default: true
  - ensures only one document exists in the collection

This file also contains the schema for the Gameboy model, which is a subdocument of the home page model.

- gameID: ObjectId, required
- description: String, required

## Actions

`src/server/db/actions`

These files contain the functions that interact with the database. The functions are used to create, read, update, and delete games, themes, tags, and users.

### BuildAction

This file currently contains the function `deleteBuild` to delete a build. This was implemented in Sprint 2.

The functionality to add a build can be found [here](src/utils/file.ts). This may be refactored later...

### GameAction

This file contains the functions:

- `createGame` which creates a game along with its associated themes and tags IDs
- `deleteGame` which deletes a game and its associated WebGL build if it exists (check if `webGLBuild` is true)
- `editGame` which updates the game's information and associated themes and tags IDs if the themes and tags were modified
- `getSelectedGames` which returns all games matching the given filters
  - this action is quite complex (and may require refactoring if future modifications are needed)
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
- `getUserByEmail` which returns a user given an email
- `editUser` which updates a user's information (and only updates the email if the email is not already in use)
- `editPassword` which updates a user's password after verifying the user's old password
- `deleteUser` which deletes a user given an id

### NotesAction

- `getNotes` which returns all the notes given a userId and gameId
- `createNote` which creates a note given data (INote) and a userId
- `updateNote` which updates a note given a userId, noteId, and data (INote)
- `deleteNote` which deletes a note given a userId and noteId

### AdminAction

- `createAdmin` which adds an authorized admin email to the database
- `deleteAdmin` which removes an authorized admin email from the database. Drew and Susanne's emails cannot be removed.
- `getAdminByEmail` which returns the admin given an email
- `getAllAdmins` which returns all the authorized admin emails

### HomePageAction

- `createHomePage` which creates the information on the home page IF no information exists (only one document allowed)
- `editHomePage` which updates the information on the home page
- `getHomePage` which returns the information on the home page

### EmailAction

- `sendEmail` when sends an email to the nonprofit after the user fills out the Contact Us form on a game page

### NoteAction

- `getNotes` which returns all the notes given a userId and gameId
- `createNote` which creates a note given data (INote) and a userId
- `updateNote` which updates a note given a userId, noteId, and data (INote)
- `deleteNote` which deletes a note given a userId and noteId

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

## Error Handling

`src/utils/exceptions`

Originally, these exceptions were located in a file `src/utils/exceptions` which contained a custom error handler. It has now been refactored to have a separate exceptions file for each model. Please use these exceptions when throwing errors in the backend! Additionally, please use the HTTP status codes in `src/utils/consts.ts` when returning status codes in the backend.