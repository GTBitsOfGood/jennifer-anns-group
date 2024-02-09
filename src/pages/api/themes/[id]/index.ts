import { NextApiResponse,NextApiRequest } from "next";
import { ZodError, z} from "zod";
import { deleteTheme } from "@/server/db/actions/ThemeAction";
import { ObjectId} from "mongodb";

export default async function handler(req: NextApiRequest,res: NextApiResponse) {
    switch (req.method) {
        case "DELETE":
            try {
                //No need to ensure correct id, checking in action
                const potential_id= req.query.id
                if (!potential_id || Array.isArray(potential_id)) {
                    throw ReferenceError("ObjectId is invalid");
                }
                const id: string = potential_id;
                if (ObjectId.isValid(id)) {
                    await deleteTheme(new ObjectId(id));
                }else {
                    throw ReferenceError("ObjectId is invalid");
                }
                


            }catch(e: any) {
                if (e instanceof ReferenceError || e instanceof ZodError) {
                    res.status(400).send({
                        success: false,
                        message: e.message
                    })
                }
            else {
                res.status(500).send({
                    success: false,
                    message: e.message
                })
            }
        }


    }
    res.status(405).send({
        success: false,
        message: `Method ${req.method} not allowed at this endpoint`
    });

}