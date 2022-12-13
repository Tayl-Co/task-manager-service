import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToDo } from '@todo/entity/todo.entity';
import { Repository } from 'typeorm';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import { IssueStatusEnum } from '@src/common/enums/issueStatus.enum';
import { PriorityEnum } from '@src/common/enums/priority.enum';

@Injectable()
export class ToDoRepository {
    constructor(@InjectRepository(ToDo) private todoEntity: Repository<ToDo>) {}

    // TODO: Add labels property
    async create({
        title,
        description,
        assigneesIds,
        project,
        parentId,
        dueDate,
    }: CreateToDoDto): Promise<ToDo> {
        const todo = this.todoEntity.create({
            title,
            description,
            assigneesIds,
            project,
            parentId,
            dueDate,
            status: IssueStatusEnum.OPEN,
            priority: PriorityEnum.LOW,
            authorId: 'username', // TODO: Remove username mock
        });

        return await this.todoEntity.save(todo);
    }
}
