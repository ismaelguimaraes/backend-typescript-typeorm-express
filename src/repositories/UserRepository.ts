import { EntityRepository, Repository } from 'typeorm'

import User from '../models/User'

@EntityRepository(User)
class UserRepository extends Repository<User> {
    public async findByDesc(created_at: Date): Promise<any> {

        const findUsers = await this.find({
            where: { created_at },
            order: {
                created_at: "DESC"
            },
            take: 10
        })
        
        return findUsers;
    }
}

export default UserRepository;