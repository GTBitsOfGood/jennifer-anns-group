import { NextApiRequest, NextApiResponse } from "next";
import { themeSchema } from "@/utils/types";
import { ITheme } from "@/server/db/models/ThemeModel";
import { createTheme } from "@/server/db/actions/ThemeAction";
import {ZodError} from "zod";
import { ObjectId } from "mongodb";
export default async function handler(req: NextApiRequest,res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            let result;
            try {
                //First ensure that req.body is of the proper type, via zod.
                //This gives us runtime verification
                const safeBody: ITheme = themeSchema.parse(req.body);
                if (safeBody.games) {

                
                    for (let i = 0; i < safeBody.games.length; i++) {
                        safeBody.games[i] = new ObjectId(safeBody.games[i]);
                        
                    }
                }
                result = await createTheme(safeBody);


            }catch(e: any) {
                if (e instanceof ZodError) {
                    return res.status(400).send({
                        success: false,
                        message: JSON.parse(e.message)})
                }else if(e instanceof ReferenceError) {
                    return res.status(400).send({
                        success: false,
                        message: e.message
                    })

                }else 
                    return res.status(500).send({
                        success: false,
                        message: e.message
                    })
            }
            return res.status(201).send({
                success: true,
                data: {_id: result.id}
            })
    }
    return res.status(405).send({
        success: false,
        message: `Request method ${req.method} is not allowed`
    });


}