 import ThemeModel from "../models/ThemeModel";
 import GameModel from "../models/GameModel";
 import connectMongoDB from "../mongodb";
 import { ObjectId } from "mongodb";
 import mongoose from "mongoose";
 import { ITheme } from "../models/ThemeModel";
 import { IGame } from "../models/GameModel";

//Put more of the verification in the actual API endpoint
 export async function createTheme(data: ITheme) {
        connectMongoDB();
    const theme = new ThemeModel(data);
    try {
        theme.save();
    }catch (e) {
        throw e;
    }
    return theme.id
 }


 export async function deleteTheme(id: ObjectId) {
    //Make sure to not only delete the theme but also all references
    //to this theme in the game schemas.
    //Theme object contains a list of games, so go through and edit every game object.
    //Review mongoose syntax. 
    connectMongoDB();
    try {
        const deleted_theme: ITheme & {id: ObjectId} | null = await ThemeModel.findByIdAndDelete(id);
        if (!deleted_theme) {
            //Object Id not present
            throw new ReferenceError("No Theme present with this ObjectID.");
        }
        const games: ObjectId[] | undefined = deleted_theme.games; //How should I do typing here?
        //Go through every game and remove selected theme
        if (!games) {
            return;
        }
        for (const game of games) {
            const gameDocument: IGame & {id: ObjectId} | null = await GameModel.findById(game);
            //Is there a way to cast this type from promise to just ITheme with Objectid?
            if (!gameDocument) {
                continue; //Indicates that Game Object doesn't exist, weird but whatever.
            }
            if (!gameDocument.themes) {
                continue; //Indicates Game Object doesn't have any themes, shouldn't occur, 
                //but needed for typing purposes.
            }
            const newThemes =  gameDocument.themes.filter((theme: ObjectId)=>{theme !== id});
            const gameDoc = await GameModel.findByIdAndUpdate(game,{themes:newThemes});
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