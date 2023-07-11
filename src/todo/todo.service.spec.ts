import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToDo } from '@todo/entity/todo.entity';
import { ProjectService } from '@project/project.service';
import { LabelService } from '@label/label.service';
import { ActivityService } from '@activity/activity.service';
import { default as projects } from '../../test/data/project.json';
import { TodoTypeEnum } from '@src/common/enums/todoType.enum';
import { IssueStatusEnum } from '@src/common/enums/issueStatus.enum';
import { PriorityEnum } from '@src/common/enums/priority.enum';
import { default as data } from '../../test/data/todo.json';

const todos = data.map(todo => ({
    ...todo,
    creationDate: new Date(todo.creationDate),
    lastUpdateDate: todo.lastUpdateDate ? new Date(todo.lastUpdateDate) : null,
    estimatedDueDate: todo.estimatedDueDate
        ? new Date(todo.estimatedDueDate)
        : null,
    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
}));

describe('TodoService', () => {
    let service: TodoService;
    const repositoryToken = getRepositoryToken(ToDo);
    const projectService = {
        findOne: jest.fn(),
    };
    const labelService = {
        findOne: jest.fn(),
    };
    const activityService = {
        create: jest.fn(),
    };
    let repository: Repository<ToDo>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TodoService,
                { provide: repositoryToken, useClass: Repository },
                {
                    provide: ProjectService,
                    useValue: projectService,
                },
                {
                    provide: LabelService,
                    useValue: labelService,
                },
                {
                    provide: ActivityService,
                    useValue: activityService,
                },
            ],
        }).compile();

        service = module.get<TodoService>(TodoService);
        repository = module.get<Repository<ToDo>>(repositoryToken);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new toDo', async () => {
            const toDoInput = {
                title: 'Title 1',
                description: '',
                assigneesIds: [],
                parentId: null,
                dueDate: '2023-09-21',
                type: TodoTypeEnum.TASK,
                projectId: 1,
            };
            const project = projects.find(
                project => project.id === toDoInput.projectId,
            );
            const createdDateToDo = new Date();
            const newToDo = {
                id: 1,
                ...toDoInput,
                status: IssueStatusEnum.OPEN,
                priority: PriorityEnum.LOW,
                authorId: 'username',
                dueDate: new Date('2023-09-21'),
                project: projects[0],
                pinned: false,
                estimatedDueDate: null,
                activities: [],
                lastUpdateDate: null,
                labels: [],
                references: [],
                creationDate: createdDateToDo,
            };
            jest.spyOn(projectService, 'findOne').mockImplementation(() =>
                Promise.resolve(project),
            );
            jest.spyOn(repository, 'create').mockImplementation(() => newToDo);
            jest.spyOn(repository, 'save').mockResolvedValue(newToDo);

            const response = await service.create(toDoInput);

            const { projectId, ...toDo } = toDoInput;

            expect(projectService.findOne).toHaveBeenCalledTimes(1);
            expect(projectService.findOne).toHaveBeenCalledWith(
                newToDo.projectId,
            );
            expect(repository.create).toHaveBeenCalledTimes(1);
            expect(repository.create).toHaveBeenCalledWith({
                ...toDo,
                dueDate: new Date(toDoInput.dueDate),
                status: IssueStatusEnum.OPEN,
                priority: PriorityEnum.LOW,
                authorId: 'username',
                project,
            });
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith(newToDo);
            expect(response).toBeDefined();
            expect(response).toMatchObject(newToDo);
        });
    });

    describe('findOne', () => {
        it('should return a toDo', async () => {
            const id = 1;
            const todo = todos.find(todo => todo.id === id);
            jest.spyOn(repository, 'findOne').mockResolvedValue(
                Promise.resolve(todo),
            );

            const response = await service.findOne(id);

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                relations: {
                    project: true,
                    references: true,
                    labels: true,
                    activities: true,
                },
                where: { id },
            });
            expect(response).toBeDefined();
            expect(response).toMatchObject(todo);
        });
        it('should return an error message if todo is not found', async () => {
            const id = 1;
            jest.spyOn(repository, 'findOne').mockResolvedValue(
                Promise.resolve(null),
            );

            await expect(service.findOne(id)).rejects.toThrow(
                `ToDo ${id} not found`,
            );

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                relations: {
                    project: true,
                    references: true,
                    labels: true,
                    activities: true,
                },
                where: { id },
            });
        });
    });
});
