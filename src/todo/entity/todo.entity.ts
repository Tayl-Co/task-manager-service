import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Project } from '@project/entity/project.entity';
import { Reference } from '@reference/entity/reference.entity';
import { Label } from '@label/entity/label.entity';
import { Activity } from '@src/activity/entity/activity.entity';

@ObjectType()
@Entity()
export class ToDo {
    @PrimaryColumn({ unique: true, generated: true })
    @Field(() => ID, { nullable: true })
    id: number;

    @Column()
    @Field()
    title: string;

    @Column()
    @Field()
    type: number;

    @Column({ default: '' })
    @Field()
    description: string;

    @Column()
    @Field()
    status: number;

    @Column()
    @Field()
    priority: number;

    @Column()
    @Field({ nullable: true })
    parentId: number;

    @Column()
    @Field()
    authorId: string;

    @Column({ array: true, type: 'text', default: [] })
    @Field(() => [String], { nullable: true })
    assigneesIds: Array<string>;

    @Column({ default: new Date() })
    @Field({ nullable: true })
    creationDate: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    lastUpdateDate: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    estimatedDueDate: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    dueDate: Date;

    @Column({ default: false })
    @Field()
    pinned: boolean;

    @ManyToOne(() => Project, project => project.issues, {
        nullable: true,
        cascade: ['insert', 'update'],
        onDelete: 'CASCADE',
    })
    @Field(() => Project, { nullable: true })
    project: Project | null;

    @OneToMany(() => Reference, reference => reference.todo)
    @JoinTable()
    @Field(() => [Reference], { nullable: true })
    references: Array<Reference>;

    @OneToMany(() => Activity, activity => activity.todo)
    @JoinTable()
    @Field(() => [Activity], { nullable: true })
    activities: Array<Activity>;

    @ManyToMany(() => Label)
    @JoinTable()
    @Field(() => [Label], { nullable: true })
    labels: Array<Label>;
}
