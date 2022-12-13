import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Project } from '@project/entity/project.entity';

@InputType()
export class CreateToDoDto {
    @IsNotEmpty({ message: 'Required Title' })
    @IsString()
    @Field()
    title: string;

    @IsString()
    @Field()
    description: string;

    @IsArray()
    @IsNumber({}, { each: true })
    @Field(() => [Int])
    assigneesIds: Array<number>;

    @Field(() => Project, { nullable: null })
    project: Project;

    @IsString()
    @Field({ nullable: true })
    dueDate: string;

    @IsNumber()
    @Field({ nullable: true })
    parentId: number;
}
