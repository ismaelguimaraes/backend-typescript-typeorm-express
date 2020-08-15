import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import authConfig from '../../config/auth'
import User from '../../models/User'

interface Request {
    cpf: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class CreateSessionService {
    public async execute({ cpf, password }: Request): Promise<Response> {
        const usersRepository = getRepository(User);
        const user = await usersRepository.findOne({ where: { cpf } });

        if(!user) {
            throw new Error("Incorrect cpf/password combination.");
        }

        const passwordMatched = await compare(password, user.password);
        if(!passwordMatched) {
            throw new Error("Incorrect cpf/password combination.");
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({ "isAdmin": user.isAdmin }, secret, {
            subject: user.id,
            expiresIn
        });

        return {
            user,
            token
        }
    }
}

export default CreateSessionService;