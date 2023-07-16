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
    Between,
    Equal,
    FindOptionsOrderValue,
    ILike,
    In,
    LessThanOrEqual,
    MoreThanOrEqual,
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
import { Order } from '@src/common/enums/order.enum';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(ToDo) private todoRepository: Repository<ToDo>,
        private projectService: ProjectService,
        private labelService: LabelService,
        private activityService: ActivityService,
    ) {}

    /**
     * Creates a To-Do and returns the created To-Do
     * @param todoInput To-Do data
     * @return ToDo
     */
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

    /**
     * Returns all To-Do
     */
    async findAll(): Promise<Array<ToDo>> {
        return await this.todoRepository.find();
    }

    /**
     * Returns To-Do based on id
     * @param id To-Do identification
     * @return ToDo
     */
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

    /**
     * Remove To-Do based on id
     * @param id To-Do identification
     * @return ToDo
     */
    async remove(id: number): Promise<ToDo> {
        const todo = await this.findOne(id);

        return await this.todoRepository.remove(todo);
    }

    /**
     * Update the To-Do and return the updated To-Do
     * @param id  To-Do identification
     * @param todoInput To-Do data
     * @return ToDo
     */
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
            lastUpdateDate: new Date(),
            estimatedDueDate: estimatedDueDate
                ? new Date(estimatedDueDate)
                : null,
            assigneesIds,
            activities: [...todo.activities, ...activities],
        });

        return this.todoRepository.save(todo);
    }

    /**
     * Add label to To-Do and return updated ToDo
     * @param id To-Do identification
     * @param labelId Label identification
     * @return ToDo
     */
    async addLabel(id: number, labelId: number): Promise<ToDo> {
        const todo = await this.findOne(id);
        const label = await this.labelService.findOne(labelId);
        const activity = await this.activityService.create({
            authorId: 'username',
            type: ActivityEnum.LABEL_ADDED,
            newValue: `${labelId}`,
            todo,
        });

        Object.assign(todo, {
            labels: [...todo.labels, label],
            activities: [...todo.activities, activity],
            lastUpdateDate: new Date(),
        });

        return this.todoRepository.save(todo);
    }

    /**
     * Remove label from To-Do and return updated ToDo
     * @param id To-Do identification
     * @param labelId Label identification
     * @return ToDo
     */
    async removeLabel(id: number, labelId: number): Promise<ToDo> {
        const todo = await this.findOne(id);
        const activity = await this.activityService.create({
            authorId: 'username',
            type: ActivityEnum.LABEL_REMOVED,
            newValue: `${labelId}`,
            todo,
        });

        Object.assign(todo, {
            labels: todo.labels.filter(label => labelId !== label.id),
            activities: [...todo.activities, activity],
            lastUpdateDate: new Date(),
        });

        return this.todoRepository.save(todo);
    }

    /**
     * Add assignee to To-Do and return updated ToDo
     * @param id To-Do identification
     * @param assigneeId assignee identification
     * @return ToDo
     */
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

        Object.assign(todo, {
            assigneesIds: [...todo.assigneesIds, assigneeId],
            activities: [...todo.activities, activity],
            lastUpdateDate: new Date(),
        });

        return this.todoRepository.save(todo);
    }

    /**
     * Remove assignee from To-Do and return updated To-Do
     * @param id To-Do identification
     * @param assigneeId assignee identification
     * @return ToDo
     */
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

        Object.assign(todo, {
            assigneesIds: todo.assigneesIds.filter(id => assigneeId !== id),
            activities: [...todo.activities, activity],
            lastUpdateDate: new Date(),
        });

        return this.todoRepository.save(todo);
    }

    /**
     * Returns ToDos found based on search input
     * @param searchInput
     * @param searchInput.ids List of To-Do IDs you want to find
     * @param searchInput.title To-Do Title
     * @param searchInput.description To-Do Description
     * @param searchInput.type To-Do Type
     * @param searchInput.status To-Do Status
     * @param searchInput.priority To-Do Priority
     * @param searchInput.authorId To-Do author
     * @param searchInput.assigneesIds To-Do assignees
     * @param searchInput.startDate Search by the start date of creation of the To-Do
     * @param searchInput.endDate Search by the end date of creation of the To-Do
     * @param [searchInput.sortOrder = "ASC"] Search sort order
     * @param [searchInput.page = 0] Current search page
     * @param searchInput.limit Limit of returned projects
     * @return Array<ToDo>
     */
    async search(searchInput: SearchTodoDto): Promise<Array<ToDo>> {
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
            startDate,
            endDate,
            limit,
            sortOrder = Order.ASC,
            orderBy = 'title',
            page = 0,
        } = searchInput;
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        if (title) where = { ...where, title: ILike(`%${title}%`) };

        if (description)
            where = { ...where, description: ILike(`%${description}%`) };

        if (type) where = { ...where, type: Equal(type) };

        if (status) where = { ...where, status: Equal(status) };

        if (priority) where = { ...where, priority: Equal(priority) };

        if (pinned !== undefined) where = { ...where, pinned: Equal(pinned) };

        if (authorId) where = { ...where, authorId: Equal(authorId) };

        if (parentIds) where = { ...where, parentId: In(parentIds) };

        if (assigneesIds)
            where = { ...where, assigneesIds: ArrayContains(assigneesIds) };

        if (startDate && endDate) {
            where = { ...where, creationDate: Between(startDate, endDate) };
        } else if (startDate) {
            where = { ...where, creationDate: MoreThanOrEqual(startDate) };
        } else if (endDate) {
            where = { ...where, creationDate: LessThanOrEqual(endDate) };
        }

        return this.todoRepository.find({
            relations: {
                project: true,
                references: true,
                labels: true,
                activities: true,
            },
            where,
            order: { [orderBy]: sortOrder as FindOptionsOrderValue },
            take: limit || undefined,
            skip: limit ? page * limit : page,
        });
    }
}
