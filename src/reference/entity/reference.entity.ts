import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ToDo } from '@todo/entity/todo.entity';

@ObjectType()
@Entity()
export class Reference {
    @PrimaryColumn({ generated: true, unique: true })
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    type: string;

    @Column()
    @Field()
    key: string;

    @Column()
    @Field()
    url: string;

    @ManyToOne(() => ToDo, todo => todo.references, {
        cascade: ['insert', 'update'],
        onDelete: 'CASCADE',
    })
    @Field(() => ToDo)
    todo: ToDo;
}
