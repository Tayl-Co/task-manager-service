import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToDo } from '@todo/entity/todo.entity';
import { Repository } from 'typeorm';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import { IssueStatusEnum } from '@src/common/enums/issueStatus.enum';
import { PriorityEnum } from '@src/common/enums/priority.enum';
import { Project } from '@project/entity/project.entity';

@Injectable()
export class ToDoRepository {
    constructor(@InjectRepository(ToDo) private todoEntity: Repository<ToDo>) {}

    // TODO: Add labels property
    async create(
        {
            title,
            description,
            assigneesIds,
            parentId,
            dueDate,
            type,
        }: CreateToDoDto,
        project: Project | null,
    ): Promise<ToDo> {
        const todo = this.todoEntity.create({
            title,
            description,
            assigneesIds,
            project,
            parentId,
            dueDate,
            type,
            status: IssueStatusEnum.OPEN,
            priority: PriorityEnum.LOW,
            authorId: 'username', // TODO: Remove username mock
        });

        return await this.todoEntity.save(todo);
    }

    async remove(todo: ToDo): Promise<ToDo> {
        return await this.todoEntity.remove(todo);
    }

    async findOne(id: number): Promise<ToDo> {
        return await this.todoEntity.findOne({
            relations: { project: true },
            where: { id },
        });
    }
}
