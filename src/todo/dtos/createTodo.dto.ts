import { Field, InputType, Int } from '@nestjs/graphql';
import {
    IsString,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from 'class-validator';

@InputType()
export class CreateToDoDto {
    @IsNotEmpty({ message: 'Required Title' })
    @IsString()
    @Field()
    title: string;

    @IsString()
    @Field()
    description: string;

    @IsNotEmpty({ message: 'Required Type' })
    @IsNumber()
    @Field(() => Int)
    type: number;

    @IsArray()
    @IsNumber({}, { each: true })
    @Field(() => [Int], { nullable: true })
    assigneesIds: Array<number>;

    @IsOptional()
    @IsNumber()
    @Field(() => Int, { nullable: true })
    projectId: number;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    dueDate: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    parentId: string;
}
