import { getRepository } from 'typeorm'

import User from '../../models/User'

interface Request {
    id: string;
}

class DeleteUserService {
    public async execute({ id }: Request): Promise<void> {
        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where: { id }
        })

        if(!checkUserExists) {
            throw new Error('User not exists.')
        }

        await usersRepository.delete({ id })
    }
}

export default DeleteUserService;