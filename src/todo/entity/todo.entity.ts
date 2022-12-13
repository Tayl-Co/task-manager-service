import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Project } from '@project/entity/project.entity';

// TODO: Add property Reference
// TODO: Add property Activity
// TODO: Add property Label
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
    parentId: string;

    @Column()
    @Field()
    authorId: string;

    @Column({ array: true, type: 'text', default: [] })
    @Field(() => [Int], { nullable: true })
    assigneesIds: Array<number>;

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
}
