import { IsNotEmpty, IsString } from 'class-validator';

export class AssigneeDto {
    @IsNotEmpty()
    @IsString()
    assigneeId: string;

    @IsNotEmpty()
    @IsString()
    authorId?: string;
}
