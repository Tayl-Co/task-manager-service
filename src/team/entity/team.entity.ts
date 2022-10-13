import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

//TODO: Add the Project property. Obs: The Relation is One to Many
@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ownerId: string;

    @Column({ array: true, default: [] })
    membersIds: Array<string>;

    @Column({ array: true, default: [] })
    managersIds: Array<string>;
}
