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
    const theme = new ThemeModel(data);
    try {
        await theme.save();
    }catch (e) {
        throw e;
    }
    if (data.games) {
        for (const game of data.games) {
            //Game is an ObjectID or string
            await GameModel.findByIdAndUpdate(game,{$addToSet: {themes: theme.id}})
        }
       }
    return theme.id;
 }


 export async function deleteTheme(id: ObjectId) {
    //Make sure to not only delete the theme but also all references
    //to this theme in the game schemas.
    //Theme object contains a list of games, so go through and edit every game object.
    //Review mongoose syntax. 
    connectMongoDB();
    try {
        const deleted_theme: ITheme & {id: ObjectId} | null = await ThemeModel.findByIdAndDelete(id.toString());//To fix BSON Error?

        if (!deleted_theme) {
            //Object Id not present
            throw new ReferenceError("No Theme present with this ObjectID.");
        }
        const games: (ObjectId | string)[] | undefined = deleted_theme.games; //How should I do typing here?
        //Go through every game and remove selected theme
        if (!games) {
            return;
        }
        for (const game of games) {
            await GameModel.findByIdAndUpdate(game,{$pull: {themes: id}});
        }

    }catch (e) {
        throw e;
    }

 }