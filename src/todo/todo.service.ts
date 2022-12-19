import { Injectable, NotFoundException } from '@nestjs/common';
import { ToDo } from '@todo/entity/todo.entity';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import { ProjectService } from '@project/project.service';
import { Project } from '@project/entity/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueStatusEnum } from '@src/common/enums/issueStatus.enum';
import { PriorityEnum } from '@src/common/enums/priority.enum';
import { LabelService } from '@label/label.service';
import { ActivityService } from '@activity/activity.service';
import { ActivityEnum } from '@src/common/enums/activity.enum';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(ToDo) private todoRepository: Repository<ToDo>,
        private projectService: ProjectService,
        private labelService: LabelService,
        private activityService: ActivityService,
    ) {}

    async create(todoInput: CreateToDoDto): Promise<ToDo> {
        const {
            title,
            description,
            assigneesIds,
            parentId,
            dueDate,
            type,
            projectId,
        } = todoInput;
        let project: Project | null = null;

        if (projectId) {
            project = await this.projectService.findOne(projectId);
        }

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

        return this.todoRepository.save(todo);
    }

    async findAll(): Promise<Array<ToDo>> {
        return await this.todoRepository.find();
    }

    async findOne(id: number): Promise<ToDo> {
        const todo = await this.todoRepository.findOne({
            relations: {
                project: true,
                references: true,
                labels: true,
                activities: true,
            },
            where: { id },
        });

        if (!todo) throw new NotFoundException(`ToDo ${id} not found`);

        return todo;
    }

    async remove(id: number): Promise<ToDo> {
        const todo = await this.findOne(id);

        return await this.todoRepository.remove(todo);
    }

    async addLabel(id: number, idLabel: number): Promise<ToDo> {
        const label = await this.labelService.findOne(idLabel);
        const todo = await this.findOne(id);
        const activity = await this.activityService.create({
            authorId: 'username',
            type: ActivityEnum.LABEL_ADDED,
            newValue: `${idLabel}`,
            todo,
        });

        todo.activities = [...todo.activities, activity];
        todo.labels = [...todo.labels, label];

        return this.todoRepository.save(todo);
    }

    async removeLabel(id: number, idLabel: number): Promise<ToDo> {
        const todo = await this.findOne(id);

        todo.labels = todo.labels.filter(label => idLabel !== label.id);

        return this.todoRepository.save(todo);
    }
}
