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
    constructor(
        @InjectRepository(ToDo) private todoRepository: Repository<ToDo>,
    ) {}

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
        const todo = this.todoRepository.create({
            title,
            description,
            assigneesIds,
            project,
            parentId,
            dueDate: dueDate ? new Date(dueDate) : null,
            type,
            status: IssueStatusEnum.OPEN,
            priority: PriorityEnum.LOW,
            authorId: 'username', // TODO: Remove username mock
        });

        return await this.todoRepository.save(todo);
    }

    async findAll(): Promise<Array<ToDo>> {
        return await this.todoRepository.find();
    }

    async remove(todo: ToDo): Promise<ToDo> {
        return await this.todoRepository.remove(todo);
    }

    async findOne(id: number): Promise<ToDo> {
        return await this.todoRepository.findOne({
            relations: { project: true, references: true },
            where: { id },
        });
    }
}
