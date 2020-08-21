import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import multer from 'multer';
import fs from 'fs'
import path from 'path'

import UserReposity from '../repositories/UserRepository'

import CreateUserService from '../services/User/CreateUserService'
import DeleteUserService from '../services/User/DeleteUserService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import uploadConfig from '../config/upload'
import UpdateUserAvatarService from '../services/User/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.get('/:id', async (request, response) => {
    const userRepository = getCustomRepository(UserReposity);
    const { id } = request.params;

    const users = await userRepository.find({ where: { id } });

    return response.json(users);
})

usersRouter.get('/', async (request, response) => {
    const userRepository = getCustomRepository(UserReposity);
    const users = await userRepository.find();

    return response.json(users);
})

usersRouter.delete('/:id', ensureAuthenticated, async (request, response) => {

    if(!request.user.isAdmin) {
        return response.status(401).json({ message: 'Unauthorized user.'});
    }

    const { id } = request.params;
    const deleteUser = new DeleteUserService;

    await deleteUser.execute({ id });

    return response.status(202).json({ message: 'User deleted.'})
});

usersRouter.post('/', ensureAuthenticated, async (request, response) => {

    if(!request.user.isAdmin) {
        return response.status(401).json({ message: 'Unauthorized user.'});
    }
    
    const { name, email, password, cpf, telephone, isAdmin } = request.body;
    const createUser = new CreateUserService();

    const user = await createUser.execute({
        name,
        email,
        password,
        cpf,
        telephone,
        isAdmin
    });

    const data = new Uint8Array(Buffer.from(`O Administrador ${request.user.id} criou o usuário:\n\nID: ${user.id};\nNome: ${user.name};\nE-mail: ${user.email};\nCPF: ${user.cpf};\nTelefone: ${user.telephone};\nData: ${user.created_at};`));
    fs.writeFile(path.resolve(__dirname, '..', 'logs', 'users', `${user.id}.txt`), data, (err) => {
        if (err) throw err;
    });

    delete user.password;

    return response.status(201).json(user);
});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('picture'), async(request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        pictureFilename: request.file.filename
    });

    delete user.password;

    return response.status(202).json(user);
});

export default usersRouter;