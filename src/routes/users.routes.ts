import { Router } from 'express'

import UserReposity from '../repositories/UserRepository'

import CreateUserService from '../services/User/CreateUserService'
import DeleteUserService from '../services/User/DeleteUserService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { getCustomRepository } from 'typeorm'

const usersRouter = Router();

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
})

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

    delete user.password;

    return response.status(201).json(user);
});

export default usersRouter;