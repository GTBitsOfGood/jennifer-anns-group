import GameModel from "../models/GameModel";
import ThemeModel from "../models/ThemeModel";
import TagModel from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { gameSchema } from "@/utils/types";

export async function createGame(data: any) {
  await connectMongoDB();
  console.log(data);
  try {
      //Ensure every ObjectID actually represents a Document
      if (data && data.themes) {
          for (const theme of data.themes) {
              const result = await GameModel.findById(theme);
              if (!result) {
                  throw ReferenceError(`ObjectID ${theme} not present.`);
              }
          }
      }
      if (data && data.tags) {
        for (const tag of data.tags) {
            const result = await GameModel.findById(tag);
            if (!result) {
                throw ReferenceError(`ObjectID ${tag} not present.`);
            }
        }
    }
  }catch(e) {
      throw e;
  }
  const game = new GameModel(data);
  try {
    await game.save();
    //Make sure to edit existing theme and tags to include this id
    for (const theme_id of data.themes) {
      await ThemeModel.findByIdAndUpdate(theme_id,{$push: {games: game._id}})
    }
    for (const tag_id of data.tags) {
      await TagModel.findByIdAndUpdate(tag_id,{$push: {games: game._id}})
    }
    return game._id;
  } catch (e) {
    throw e;
  }
}

export async function deleteGame(data: any) {
  await connectMongoDB();
  try {
    const result = await GameModel.findByIdAndDelete(data);
    if (!result) {
      throw new ReferenceError("Game with given ID does not exist.");
    }
    if (!result.themes) return;
    if (!result.tags) return;
    for (const theme_id of result.themes) {
      ThemeModel.findByIdAndUpdate(theme_id,{$pull: {games: data}})
    }
    for (const tag_id of result.tags) {
      TagModel.findByIdAndUpdate(tag_id,{$pull: {games: data}})
    }
    
  } catch (e) {
    throw e;
  }
}

export async function editGame(data: any) {
  await connectMongoDB();
  try {
      //Ensure every ObjectID actually represents a Document
      if (data && data.themes) {
          for (const theme of data.themes) {
              const result = await GameModel.findById(theme);
              if (!result) {
                  throw ReferenceError(`ObjectID ${theme} not present.`);
              }
          }
      }
      if (data && data.tags) {
        for (const tag of data.tags) {
            const result = await GameModel.findById(tag);
            if (!result) {
                throw ReferenceError(`ObjectID ${tag} not present.`);
            }
        }
    }
  }catch(e) {
      throw e;
  }
  try {

    const result = await GameModel.findByIdAndUpdate(data.id, data.data, {
      new: true,
    });
    if (!result) {
      throw new ReferenceError("Game with given ID does not exist.");
    }
    //Set result.themes and tags to [] if it is undefined, for simplicity
    if (!result.themes) {
      result.themes = [];
    }
    if (!result.tags) {
      result.tags = [];
    }
    
    if (data.data.themes) {
      //Implies that themes was updated.
      //ADD new themes
      for (const theme of data.data.themes) {
        //First ensure theme is'nt already in result (old one), to prevent excess database calls
        if (!(theme in result.themes)) {
          //Only adds if new theme.
          await ThemeModel.findByIdAndUpdate(theme,{$addToSet: {games: data.id}});
        }
      }
      for (const theme of result.themes) {
        //Remove old themes not in new themes
        if (!(theme.toString() in data.data.themes)) { //Becuase theme is ObjectID type, but data.data.themes has no theme
          await ThemeModel.findByIdAndUpdate(theme,{$pull: {games: data.id}});
          
        }
      }
    }
    //Removes old tags
    if (data.data.tag) {
      //Implies that tags was updated.
      //ADD new tags
      for (const tag of data.data.tags) {
        //First ensure tag is'nt already in result (old one), to prevent excess database calls
        if (!(tag in result.tags)) {
          //Only adds if new tag.
          await TagModel.findByIdAndUpdate(tag,{$addToSet: {games: data.id}});
        }
      }
      for (const tag of result.tags) {
        //Remove old tag not in new tags
        if (!(tag.toString() in data.data.tags)) { //Becuase tag is ObjectID type, but data.data.tags has no tag
          await TagModel.findByIdAndUpdate(tag,{$pull: {games: data.id}});
        }
      }
    }
  } catch (e) {
    throw e;
  }
}

export async function getAllGames() {
  await connectMongoDB();
  try {
    const games = await GameModel.find();
    if (games == null) {
      return [];
    }
    return games;
  } catch (e) {
    throw e;
  }
}

export async function getGameById(id: string) {
  await connectMongoDB();
  try {
    const game = await GameModel.findById(id);
    return game;
  } catch (e) {
    throw e;
  }
}
