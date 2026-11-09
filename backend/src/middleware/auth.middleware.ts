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
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "Configuração do servidor incompleta" });
        }
        jwt.verify(
            token,
            secret
        )
        next()
    }
    catch(error){
        return res.status(401).json({
            message:"Token Invalido"
        })
    }
}
