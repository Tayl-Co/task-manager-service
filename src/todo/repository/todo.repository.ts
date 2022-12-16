import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToDo } from '@todo/entity/todo.entity';
import { Repository } from 'typeorm';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import { IssueStatusEnum } from '@src/common/enums/issueStatus.enum';
import { PriorityEnum } from '@src/common/enums/priority.enum';
import { Project } from '@project/entity/project.entity';
import { Reference } from '@todo/entity/reference.entity';
import { CreateReferenceDto } from '@todo/dtos/createReference.dto';

@Injectable()
export class ToDoRepository {
    constructor(
        @InjectRepository(ToDo) private todoRepository: Repository<ToDo>,
        @InjectRepository(Reference)
        private referenceRepository: Repository<Reference>,
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

    async addReference(
        todo: ToDo,
        referenceInput: CreateReferenceDto,
    ): Promise<ToDo> {
        const reference = await this.referenceRepository.create(referenceInput);
        const newReference = await this.referenceRepository.save(reference);

        return await this.todoRepository.save({
            ...todo,
            references: [...todo.references, newReference],
        });
    }
}
