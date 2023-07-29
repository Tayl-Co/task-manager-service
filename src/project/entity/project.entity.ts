import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinTable,
    OneToMany,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Team } from '@team/entity/team.entity';
import { ToDo } from '@todo/entity/todo.entity';

@ObjectType()
@Entity()
export class Project {
    @PrimaryColumn({ unique: true, generated: true })
    @Field(() => ID, { nullable: true })
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field(() => Team, { nullable: true })
    @ManyToOne(() => Team, team => team.projects, {
        cascade: ['insert', 'update'],
        onDelete: 'CASCADE',
    })
    @JoinTable()
    team: Team;

    @Field()
    @Column({ default: true, nullable: true })
    active: boolean;

    @OneToMany(() => ToDo, todo => todo.project)
    @Field(() => [ToDo], { nullable: true })
    issues: Array<ToDo>;
}
