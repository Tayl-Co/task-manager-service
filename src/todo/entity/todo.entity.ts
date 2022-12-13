import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
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
    description: string;

    @Column()
    @Field()
    status: number;

    @Column()
    @Field()
    priority: number;

    @Column()
    @Field()
    parentId: number;

    @Column()
    @Field()
    authorId: number;

    @Column({ array: true, type: 'text', default: [] })
    @Field(() => [String])
    assigneesIds: Array<string>;

    @Column({ default: new Date() })
    @Field()
    creationDate: Date;

    @Column()
    @Field()
    lastUpdateDate: Date;

    @Column()
    @Field()
    estimatedDueDate: Date;

    @Column()
    @Field()
    dueDate: Date;

    @Column()
    @Field()
    pinned: boolean;

    @Column()
    @Field()
    type: number;

    @ManyToOne(() => Project, project => project.issues, {
        nullable: true,
        cascade: ['insert', 'update'],
        onDelete: 'CASCADE',
    })
    @Field(() => Project, { nullable: true })
    project: Project | null;
}
