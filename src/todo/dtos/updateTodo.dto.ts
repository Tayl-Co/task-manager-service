import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import {
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from 'class-validator';

@InputType()
export class UpdateTodoDto extends CreateToDoDto {
    @IsNotEmpty({ message: 'Required Status' })
    @IsNumber()
    @Field()
    status: number;

    @IsNotEmpty({ message: 'Required Pinned' })
    @IsBoolean()
    @Field()
    pinned: boolean;

    @IsOptional()
    @IsDateString()
    @Field({ nullable: true })
    estimatedDueDate: string;

    @IsNotEmpty({ message: 'Required Priority' })
    @IsNumber()
    @Field(() => Int)
    priority: number;
}
