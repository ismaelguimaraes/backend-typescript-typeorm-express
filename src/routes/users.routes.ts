import { Router } from 'express'

import CreateUserService from '../services/User/CreateUserService'
import DeleteUserService from '../services/User/DeleteUserService'

const usersRouter = Router();

usersRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;
    const deleteUser = new DeleteUserService;

    await deleteUser.execute({ id });

    return response.status(202).json({ message: 'User deleted.'})
})

usersRouter.post('/', async (request, response) => {
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