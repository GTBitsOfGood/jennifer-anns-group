import { NextApiRequest, NextApiResponse } from "next";
import { tagSchema } from "@/utils/types";
import { ITag } from "@/server/db/models/TagModel";
import { createTag } from "@/server/db/actions/TagAction";
import { ObjectId } from "mongodb";
import {ZodError} from "zod";
export default async function handler(req: NextApiRequest,res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            let result;
            try {
                //First ensure that req.body is of the proper type, via zod.
                //This gives us runtime verification
                const safeBody: ITag = tagSchema.parse(req.body);
                //Convert objectId's represented as strings into normal ObjectIds
                //Also ensure that objectIds represent actual values.
                if (safeBody.games) {

                
                    for (let i = 0; i < safeBody.games.length; i++) {
                        safeBody.games[i] = new ObjectId(safeBody.games[i]);                        
                    }
                }
                result = await createTag(safeBody);

            }catch(e: any) {
                if (e instanceof ZodError) {
                    return res.status(400).send({
                        success: false,
                        message: JSON.parse(e.message)})
                }
                    else if(e instanceof ReferenceError) {
                    return res.status(400).send({
                        success: false,
                        message: e.message
                    })

                }
                else 
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
    })


}