import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import authConfig from '../config/auth'

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
    isAdmin: boolean;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new Error("JWT token is missing.");
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret)
        const { sub, isAdmin } = decoded as TokenPayload;

        request.user = {
            id: sub,
            isAdmin
        }

        return next();
    } catch {
        throw new Error("Invalid JWT token.");
    }
}