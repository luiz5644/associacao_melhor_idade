import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message:"Token não informado"
        })
    }
    const [, token] = authHeader.split(" ");

    if(!token){
        return res.status(401).json({
            message: 'Token não informado ou mal formatado'
        })
    }
    try{
        const decoded = jwt.verify(
            token,
            "SEGREDO_DO_TOKEN"
        )
        next()
    }
    catch(error){
        return res.status(401).json({
            message:"Token Invalido"
        })
    }
}
