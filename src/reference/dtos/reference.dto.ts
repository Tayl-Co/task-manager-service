import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ToDo } from '@todo/entity/todo.entity';

@InputType()
export class ReferenceDto {
    @IsNotEmpty({ message: 'Required Type' })
    @IsString()
    @Field()
    type: string;

    @IsNotEmpty({ message: 'Required Key' })
    @IsString()
    @Field()
    key: string;

    @IsNotEmpty({ message: 'Required Url' })
    @IsUrl()
    @Field()
    url: string;

    @IsNotEmpty({ message: 'Required TodoId' })
    @IsNumber()
    @Field()
    todoId: number;

    @IsOptional()
    todo: ToDo;
}
