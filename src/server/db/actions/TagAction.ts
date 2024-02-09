import TagModel from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import {ITag} from "../models/TagModel";
import { IGame } from "../models/GameModel";
import GameModel from "../models/GameModel";
//Put more of the verification in the actual API endpoint
//Themes and Tags are essentially identical
export async function createTag(data: ITag) {
    connectMongoDB();
    try {
        //Ensure every ObjectID actually represents a game Document
        if (data && data.games) {
            for (const game of data.games) {
                const result = await GameModel.findById(game);
                if (!result) {
                    throw ReferenceError(`ObjectID ${game} not present.`);
                }
            }
        }
    }catch(e) {
        throw e;
    }

   const tag = new TagModel(data);
   //When I create a Tag or Theme make sure to add the tag id/theme id to the corresponding game.

   try {
       await tag.save();
   }catch (e) {
       throw e;
   }
   if (data.games) {
    for (const game of data.games) {
        //Game is an ObjectID or string
        await GameModel.findByIdAndUpdate(game,{$addToSet: {tags: tag.id}})
    }
   }
   return tag.id;
}

export async function deleteTag(id: ObjectId) {
    //Make sure to not only delete the tag but also all references
    //to this tag in the game schemas.
    //tag object contains a list of games, so go through and edit every game object.
    //Review mongoose syntax. 
    connectMongoDB();
    try {
        const deleted_tag: ITag & {id: ObjectId} | null = await TagModel.findByIdAndDelete(id.toString());//To fix error with BSON
        if (!deleted_tag) {
            //Object Id not present
            throw new ReferenceError("No Tag present with this ObjectID.");
        }
        const games: (ObjectId | string)[] | undefined = deleted_tag.games; //How should I do typing here?
        //Go through every game and remove selected tag
        if (!games) {
            return;
        }
        for (const game of games) {
            await GameModel.findByIdAndUpdate(game,{$pull: {tags: id}});

        }

    }catch (e) {
        throw e;
    }

 }
