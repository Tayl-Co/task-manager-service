import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ToDo } from '@todo/entity/todo.entity';

export class ActivityDto {
    @IsNotEmpty({ message: 'Required Author' })
    @IsString()
    /**
     * Author identification
     */
    authorId: string;

    @IsNotEmpty({ message: 'Required Type' })
    @IsNumber()
    /**
     * Label type
     */
    type: number;

    @IsNotEmpty({ message: 'Required New value' })
    @IsString()
    /**
     * Activity value
     */
    newValue: string;

    todo: ToDo;
}
