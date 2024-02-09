import { NextApiRequest, NextApiResponse } from "next";
import { themeSchema } from "@/utils/types";
import { ITheme } from "@/server/db/models/ThemeModel";
import { createTheme } from "@/server/db/actions/ThemeAction";
import {ZodError} from "zod";
export default async function handler(req: NextApiRequest,res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            let result;
            try {
                //First ensure that req.body is of the proper type, via zod.
                //This gives us runtime verification
                const safeBody: ITheme = themeSchema.parse(req.body);
                result = await createTheme(safeBody);


            }catch(e) {
                if (e instanceof ReferenceError || e instanceof ZodError) {
                    res.status(400).send({
                        success: false,
                        message: e.message})
                }else 
                    res.status(500).send({
                        success: false,
                        message: "Server error occured"
                    })
            }
            res.status(201).send({
                success: true,
                data: {_id: result.id}
            })

    }
    res.status(405).send({
        success: false,
        message: `Request method ${req.method} is not allowed`
    });


}