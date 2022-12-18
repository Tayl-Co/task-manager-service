import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ToDo } from '@todo/entity/todo.entity';

export class ActivityDto {
    @IsNotEmpty({ message: 'Required Author' })
    @IsString()
    authorId: string;

    @IsNotEmpty({ message: 'Required Type' })
    @IsNumber()
    type: number;

    @IsNotEmpty({ message: 'Required New value' })
    @IsString()
    newValue: string;

    todo: ToDo;
}
