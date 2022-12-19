import { Field, InputType, Int } from '@nestjs/graphql';
import {
    IsString,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsDateString,
} from 'class-validator';

@InputType()
export class CreateToDoDto {
    @IsNotEmpty({ message: 'Required Title' })
    @IsString()
    @Field()
    title: string;

    @IsString()
    @Field({ nullable: true, defaultValue: '' })
    description: string;

    @IsNotEmpty({ message: 'Required Type' })
    @IsNumber()
    @Field(() => Int)
    type: number;

    @IsArray()
    @IsString({ each: true })
    @Field(() => [String], { nullable: true })
    assigneesIds: Array<string>;

    @IsOptional()
    @IsNumber()
    @Field(() => Int, { nullable: true })
    projectId: number;

    @IsOptional()
    @IsDateString()
    @Field({ nullable: true })
    dueDate: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    parentId: string;
}
