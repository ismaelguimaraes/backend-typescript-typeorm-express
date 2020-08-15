import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import User from '../../models/User'

interface Request {
    name: string;
    email: string;
    password: string;
    cpf: string;
    telephone: string;
    isAdmin?: boolean;
}

class CreateUserService {
    public async execute({ name, email, password, cpf, telephone, isAdmin }: Request): Promise<User> {
        const usersRepository = getRepository(User);
        
        const checkUserExists = await usersRepository.findOne({
            where: [ { email }, { cpf } ]
        });

        if(checkUserExists) {
            throw new Error("User already exist.");
        }

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
            cpf,
            telephone,
            isAdmin
        });

        await usersRepository.save(user);

        return user;
    }
}

export default CreateUserService;