import { getRepository } from 'typeorm'
import path from 'path'
import fs from 'fs'

import User from '../../models/User'
import uploadConfig from '../../config/upload'

interface Request {
    user_id: string;
    pictureFilename: string;
}

class UpdateUserAvatarService {
    public async execute({ user_id, pictureFilename }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if(!user) {
            throw new Error("Only authenticated users can change picture.");
        }

        if(user.picture) {
            const userAvatarFilePath = path.join(uploadConfig.directory, user.picture);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.picture = pictureFilename;

        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;