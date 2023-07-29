import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ToDo } from '@todo/entity/todo.entity';

@ObjectType()
@Entity()
export class Activity {
    @PrimaryColumn({ generated: true, unique: true })
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    authorId: string;

    @Column()
    @Field()
    type: number;

    @Column()
    @Field()
    newValue: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    date: Date;

    @ManyToOne(() => ToDo, todo => todo.references, {
        cascade: ['insert', 'update'],
        onDelete: 'CASCADE',
    })
    @Field(() => ToDo, { nullable: true })
    todo: ToDo;
}
