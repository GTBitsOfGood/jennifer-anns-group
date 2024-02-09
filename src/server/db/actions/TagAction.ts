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
   const tag = new TagModel(data);
   try {
       tag.save();
   }catch (e) {
       throw e;
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
        const deleted_tag: ITag & {id: ObjectId} | null = await TagModel.findByIdAndDelete(id);
        if (!deleted_tag) {
            //Object Id not present
            throw new ReferenceError("No Tag present with this ObjectID.");
        }
        const games: ObjectId[] | undefined = deleted_tag.games; //How should I do typing here?
        //Go through every game and remove selected tag
        if (!games) {
            return;
        }
        for (const game of games) {
            const gameDocument: IGame & {id: ObjectId} | null = await GameModel.findById(game);
            //Is there a way to cast this type from promise to just ITheme with Objectid?
            if (!gameDocument) {
                continue; //Indicates that Game Object doesn't exist, weird but whatever.
            }
            if (!gameDocument.tags) {
                continue; //Indicates Game Object doesn't have any themes, shouldn't occur, 
                //but needed for typing purposes.
            }
            const newTags =  gameDocument.tags.filter((tag: ObjectId)=>{tag !== id});
            const gameDoc = await GameModel.findByIdAndUpdate(game,{tag:newTags});
            if (!gameDoc) {
                //Failed to update model in this situation
                //Document should already exist because it was there before, so this cant happen.
                throw Error("Document doesn't appear to exist");
            }


        }

    }catch (e) {
        throw e;
    }

 }
