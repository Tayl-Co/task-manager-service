import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
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
    @IsString()
    @Field({ nullable: true })
    estimatedDueDate: string;

    @IsNotEmpty({ message: 'Required Priority' })
    @IsNumber()
    @Field(() => Int)
    priority: number;
}
