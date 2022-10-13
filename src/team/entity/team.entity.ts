import { Entity, Column, PrimaryColumn } from 'typeorm';

//TODO: Add the Project property. Obs: The Relation is One to Many
@Entity()
export class TeamEntity {
    @PrimaryColumn({ unique: true, generated: true })
    id: number;

    @Column()
    name: string;

    @Column()
    ownerId: string;

    @Column({ array: true, type: 'text', default: [] })
    membersIds: Array<string>;

    @Column({ array: true, type: 'text', default: [] })
    managersIds: Array<string>;
}
