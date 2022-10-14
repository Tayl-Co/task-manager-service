import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

//TODO: Add the Project property. Obs: The Relation is One to Many
@ObjectType()
@Entity()
export class Team {
    @PrimaryColumn({ unique: true, generated: true })
    @Field(() => ID)
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    ownerId: string;

    @Field(() => [String])
    @Column({ array: true, type: 'text', default: [] })
    membersIds: Array<string>;

    @Column({ array: true, type: 'text', default: [] })
    @Field(() => [String])
    managersIds: Array<string>;
}
