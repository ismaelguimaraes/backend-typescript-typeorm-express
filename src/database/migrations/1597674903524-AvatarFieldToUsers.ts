import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AvatarFieldToUsers1597674903524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn ({
            name: 'picture',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'picture');
    }

}
