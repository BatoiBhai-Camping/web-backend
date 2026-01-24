import { asyncHandler } from "../../uitls/asyncHandler.js";
import type { Request,Response } from "express";
import { idValidator } from "../../validator/user.validator.js";
import { ApiError } from "../../uitls/apiError.js";
import { db } from "../../db/db.js";
import { ApiResponse } from "../../uitls/apiResponse.js";

const getAllPkgOfAgent = asyncHandler(async(req:Request, res:Response)=>{
    const validRes = idValidator.safeParse(req.body);
    if(!validRes.success){
        throw new ApiError(400,validRes.error.message || "invalid data for agent id")
    }
    const data = validRes.data;
    const allPkg = await db.bb_travelPackage.findMany({
        where:{
            agentId: data.id
        }
    })
   
    return res.status(200).json(
        new ApiResponse(200,allPkg,"Successfully get all the agent packages")
    )
})

export {getAllPkgOfAgent}