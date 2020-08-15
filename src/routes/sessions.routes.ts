import { Router } from 'express';

import CreateSessionService from '../services/Session/CreateSessionService'

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    const { cpf, password } = request.body;
    const authenticateUser = new CreateSessionService();

    const { user, token } = await authenticateUser.execute({
        cpf,
        password
    });

    delete user.password;

    return response.status(202).json({ user, token })
});

export default sessionsRouter;