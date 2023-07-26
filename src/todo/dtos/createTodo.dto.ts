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
    @IsOptional()
    @Field({ nullable: true, defaultValue: '' })
    description: string;

    @IsNotEmpty({ message: 'Required Type' })
    @IsNumber()
    @Field(() => Int)
    type: number;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    @Field(() => [String], { nullable: true, defaultValue: [] })
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
    @IsNumber()
    @Field(() => Int, { nullable: true })
    parentId: number;
}
