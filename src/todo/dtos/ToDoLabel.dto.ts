import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ToDoLabelDto {
    @IsNotEmpty()
    @IsNumber()
    labelId: number;

    @IsNotEmpty()
    @IsString()
    authorId?: string;
}
