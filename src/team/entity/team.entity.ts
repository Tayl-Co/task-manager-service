import { Entity, Column, PrimaryColumn, OneToMany, JoinTable } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Project } from '@project/entity/project.entity';

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

    @Field(() => [Project])
    @OneToMany(() => Project, project => project.team)
    @JoinTable()
    projects: Array<Project>;
}
