import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ToDo } from '@todo/entity/todo.entity';
import { CreateToDoDto } from '@todo/dtos/createTodo.dto';
import { ProjectService } from '@project/project.service';
import { Project } from '@project/entity/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ArrayContains,
    Equal,
    FindOptionsOrderValue,
    In,
    Like,
    Repository,
} from 'typeorm';
import { IssueStatusEnum } from '@src/common/enums/issueStatus.enum';
import { PriorityEnum } from '@src/common/enums/priority.enum';
import { LabelService } from '@label/label.service';
import { ActivityService } from '@activity/activity.service';
import { ActivityEnum } from '@src/common/enums/activity.enum';
import { UpdateTodoDto } from '@todo/dtos/updateTodo.dto';
import { Activity } from '@activity/entity/activity.entity';
import { SearchTodoDto } from '@todo/dtos/searchTodo.dto';

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

    async update(id: number, todoInput: UpdateTodoDto): Promise<ToDo> {
        const {
            title,
            description,
            parentId,
            dueDate,
            type,
            priority,
            status,
            pinned,
            estimatedDueDate,
            assigneesIds,
        } = todoInput;
        let activities: Array<Activity> = [];
        const todo = await this.findOne(id);
        const newDueDate = dueDate ? new Date(dueDate) : null;

        if (todo.title !== title) {
            activities.push(
                await this.activityService.create({
                    todo,
                    newValue: title,
                    type: ActivityEnum.TITLE_CHANGED,
                    authorId: 'username',
                }),
            );
        }

        if (newDueDate?.toISOString() !== todo.dueDate?.toISOString()) {
            activities.push(
                await this.activityService.create({
                    todo,
                    newValue: newDueDate?.toISOString(),
                    type: ActivityEnum.DEADLINE_CHANGED,
                    authorId: 'username',
                }),
            );
        }

        if (todo.status !== status) {
            activities.push(
                await this.activityService.create({
                    todo,
                    newValue: `${status}`,
                    type: ActivityEnum.STATUS_CHANGED,
                    authorId: 'username',
                }),
            );
        }

        Object.assign(todo, {
            title,
            description,
            parentId,
            dueDate: newDueDate,
            type,
            priority,
            status,
            pinned,
            estimatedDueDate,
            assigneesIds,
            activities: [...todo.activities, ...activities],
        });

        return this.todoRepository.save(todo);
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

        todo.labels = [...todo.labels, label];
        todo.activities = [...todo.activities, activity];

        return this.todoRepository.save(todo);
    }

    async removeLabel(id: number, idLabel: number): Promise<ToDo> {
        const todo = await this.findOne(id);
        const activity = await this.activityService.create({
            authorId: 'username',
            type: ActivityEnum.LABEL_REMOVED,
            newValue: `${idLabel}`,
            todo,
        });

        todo.labels = todo.labels.filter(label => idLabel !== label.id);
        todo.activities = [...todo.activities, activity];

        return this.todoRepository.save(todo);
    }

    async addAssignee(id: number, assigneeId: string): Promise<ToDo> {
        const todo = await this.findOne(id);
        const isIncluded = todo.assigneesIds.includes(assigneeId);

        if (isIncluded)
            throw new ConflictException(`${assigneeId} already exists`);

        const activity = await this.activityService.create({
            authorId: 'username',
            type: ActivityEnum.ASSIGNEE_ADDED,
            newValue: assigneeId,
            todo,
        });

        todo.assigneesIds = [...todo.assigneesIds, assigneeId];
        todo.activities = [...todo.activities, activity];

        return this.todoRepository.save(todo);
    }

    async removeAssignee(id: number, assigneeId: string): Promise<ToDo> {
        const todo = await this.findOne(id);
        const isIncluded = todo.assigneesIds.includes(assigneeId);

        if (!isIncluded)
            throw new NotFoundException(`${assigneeId} does not exist`);

        const activity = await this.activityService.create({
            authorId: 'username',
            type: ActivityEnum.ASSIGNEE_REMOVED,
            newValue: assigneeId,
            todo,
        });

        todo.assigneesIds = todo.assigneesIds.filter(id => assigneeId !== id);
        todo.activities = [...todo.activities, activity];

        return this.todoRepository.save(todo);
    }

    search(searchInput: SearchTodoDto): Promise<Array<ToDo>> {
        const {
            ids,
            title,
            type,
            status,
            priority,
            description,
            pinned,
            authorId,
            parentIds,
            assigneesIds,
            page,
            limit,
            order,
        } = searchInput;
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        if (title) where = { ...where, title: Like(`%${title}%`) };

        if (description)
            where = { ...where, description: Like(`%${description}%`) };

        if (type) where = { ...where, type: Equal(type) };

        if (status) where = { ...where, status: Equal(status) };

        if (priority) where = { ...where, priority: Equal(priority) };

        if (pinned !== undefined) where = { ...where, pinned: Equal(pinned) };

        if (authorId) where = { ...where, authorId: Equal(authorId) };

        if (parentIds) where = { ...where, parentId: In(parentIds) };

        if (assigneesIds)
            where = { ...where, assigneesIds: ArrayContains(assigneesIds) };

        return this.todoRepository.find({
            relations: {
                project: true,
                references: true,
                labels: true,
                activities: true,
            },
            where,
            order: { title: order as FindOptionsOrderValue },
            take: limit,
            skip: page * limit,
        });
    }
}
