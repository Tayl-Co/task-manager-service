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
import { ActivityEnum } from '@src/common/enums/activity.enum';

const todos = data.map(todo => ({
    ...todo,
    creationDate: new Date(todo.creationDate),
    lastUpdateDate: todo.lastUpdateDate ? new Date(todo.lastUpdateDate) : null,
    estimatedDueDate: todo.estimatedDueDate
        ? new Date(todo.estimatedDueDate)
        : null,
    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
}));

const labels = [
    {
        id: 1,
        name: 'Label 1',
        color: '#fff',
    },
    {
        id: 2,
        name: 'Label 1',
        color: '#fff',
    },
];

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

        jest.clearAllMocks();
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
            jest.spyOn(repository, 'save').mockImplementation(
                (todo: any) => todo,
            );

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
    describe('findAll', () => {
        it('should return all ToDo', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue(todos);

            const response = await service.findAll();

            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith();
            expect(response).toBeDefined();
            expect(response).toMatchObject(todos);
        });
    });
    describe('remove', () => {
        it('should return removed ToDo', async () => {
            const id = 1;
            const todo = todos.find(todo => todo.id === id);
            jest.spyOn(service, 'findOne').mockResolvedValue(
                Promise.resolve(todo),
            );
            jest.spyOn(repository, 'remove').mockImplementation(
                (todo: any) => todo,
            );

            const response = await service.remove(id);

            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(repository.remove).toHaveBeenCalledTimes(1);
            expect(repository.remove).toHaveBeenCalledWith(todo);
            expect(response).toBeDefined();
            expect(response).toMatchObject(todo);
        });
    });
    describe('addLabel', () => {
        it('should add a label in ToDo', async () => {
            const id = 1;
            const labelId = 1;
            const todo = todos.find(todo => todo.id === id);
            const activity = {
                authorId: 'username',
                type: ActivityEnum.LABEL_ADDED,
                newValue: `${labelId}`,
                todo,
                date: new Date(),
            };
            jest.spyOn(labelService, 'findOne').mockImplementation(
                (id: number) => labels.find(label => label.id === id),
            );
            jest.spyOn(service, 'findOne').mockImplementation((id: number) =>
                Promise.resolve(todos.find(todo => todo.id === id)),
            );
            jest.spyOn(activityService, 'create').mockResolvedValue(
                Promise.resolve(activity),
            );
            jest.spyOn(repository, 'save').mockImplementation((todo: any) =>
                Promise.resolve(todo),
            );

            const response = await service.addLabel(id, labelId);

            const { date, ...activityInput } = activity;

            expect(labelService.findOne).toHaveBeenCalledTimes(1);
            expect(labelService.findOne).toHaveBeenCalledWith(labelId);
            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(activityService.create).toHaveBeenCalledTimes(1);
            expect(activityService.create).toHaveBeenCalledWith(activityInput);
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith({
                ...todo,
                labels: labels.filter(label => label.id === labelId),
                activities: [activity],
            });
            expect(response).toBeDefined();
            expect(response).toMatchObject({
                ...todo,
                labels: labels.filter(label => label.id === labelId),
                activities: [activity],
            });
        });
        it('should return an error message if todo is not found', async () => {
            const id = 2;
            jest.spyOn(labelService, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'findOne').mockResolvedValue(
                Promise.resolve(null),
            );
            jest.spyOn(activityService, 'create').mockResolvedValue(
                Promise.resolve(null),
            );
            jest.spyOn(repository, 'save').mockImplementation((todo: any) =>
                Promise.resolve(todo),
            );

            await expect(service.addLabel(id, 2)).rejects.toThrow(
                `ToDo ${id} not found`,
            );

            expect(labelService.findOne).not.toHaveBeenCalled();
            expect(activityService.create).not.toHaveBeenCalled();
            expect(repository.save).not.toHaveBeenCalled();
        });
    });
    describe('removeLabel', () => {
        it('should remove label from todo', async () => {
            const id = 2;
            const labelId = 4;
            const todo = todos.find(todo => todo.id === id);
            const activity = {
                authorId: 'username',
                type: ActivityEnum.LABEL_REMOVED,
                newValue: `${labelId}`,
                todo,
            };
            jest.spyOn(service, 'findOne').mockImplementation((id: number) =>
                Promise.resolve(todos.find(todo => todo.id === id)),
            );
            jest.spyOn(activityService, 'create').mockImplementation(
                (activity: any) => Promise.resolve(activity),
            );
            jest.spyOn(repository, 'save').mockImplementation((todo: any) =>
                Promise.resolve(todo),
            );

            const response = await service.removeLabel(id, labelId);

            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(activityService.create).toHaveBeenCalledTimes(1);
            expect(activityService.create).toHaveBeenCalledWith(activity);
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith({
                ...todo,
                activities: expect.arrayContaining([
                    expect.objectContaining(activity),
                ]),
                labels: [],
            });
            expect(response).toBeDefined();
            expect(response).toMatchObject({
                ...todo,
                activities: expect.arrayContaining([
                    expect.objectContaining(activity),
                ]),
                labels: [],
            });
        });
        it('should return an error message if todo is not found', async () => {
            const id = -1;
            const labelId = 2;
            jest.spyOn(repository, 'findOne').mockResolvedValue(
                Promise.resolve(null),
            );
            jest.spyOn(service, 'findOne').getMockImplementation();
            jest.spyOn(activityService, 'create').mockResolvedValue(
                Promise.resolve(null),
            );
            jest.spyOn(repository, 'save').mockImplementation((todo: any) =>
                Promise.resolve(todo),
            );

            await expect(service.removeLabel(id, labelId)).rejects.toThrow(
                `ToDo ${id} not found`,
            );

            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(activityService.create).not.toHaveBeenCalled();
            expect(repository.save).not.toHaveBeenCalled();
        });
    });
    describe('addAssignee', () => {
        it('should add assignee in ToDo', async () => {
            const id = 1;
            const assigneeId = '08b8b93a-9aa7-4fc1-8201-539e2cb33830';
            const todo = todos.find(todo => todo.id === id);
            const activity = {
                authorId: 'username',
                type: ActivityEnum.ASSIGNEE_ADDED,
                newValue: assigneeId,
                todo,
            };
            jest.spyOn(service, 'findOne').mockImplementation((id: number) =>
                Promise.resolve(todos.find(todo => todo.id === id)),
            );
            jest.spyOn(activityService, 'create').mockImplementation(
                (activity: any) => Promise.resolve(activity),
            );
            jest.spyOn(repository, 'save').mockImplementation(
                (todo: any) => todo,
            );

            const response = await service.addAssignee(id, assigneeId);

            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(activityService.create).toHaveBeenCalledTimes(1);
            expect(activityService.create).toHaveBeenCalledWith(
                expect.objectContaining(activity),
            );
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith({
                ...todo,
                assigneesIds: expect.arrayContaining([assigneeId]),
                activities: expect.arrayContaining([
                    expect.objectContaining(activity),
                ]),
            });
            expect(response).toBeDefined();
            expect(response).toMatchObject({
                ...todo,
                assigneesIds: expect.arrayContaining([assigneeId]),
                activities: expect.arrayContaining([
                    expect.objectContaining(activity),
                ]),
            });
        });
        it('should return an error message if assignee already exists', async () => {
            const id = 2;
            const assigneeId = '08b8b93a-9aa7-4fc1-8201-539e2cb33830';
            jest.spyOn(service, 'findOne').mockImplementation((id: number) =>
                Promise.resolve(todos.find(todo => todo.id === id)),
            );
            jest.spyOn(activityService, 'create').mockResolvedValue(null);
            jest.spyOn(repository, 'save').mockResolvedValue(null);

            await expect(service.addAssignee(id, assigneeId)).rejects.toThrow(
                `${assigneeId} already exists`,
            );

            expect(activityService.create).not.toHaveBeenCalled();
            expect(repository.save).not.toHaveBeenCalled();
        });
    });
    describe('removeAssignee', () => {
        it('should remove assignee from todo', async () => {
            const id = 2;
            const assigneeId = '08b8b93a-9aa7-4fc1-8201-539e2cb33830';
            const todo = todos.find(todo => todo.id === id);
            const activity = {
                authorId: 'username',
                type: ActivityEnum.ASSIGNEE_REMOVED,
                newValue: assigneeId,
                todo,
            };
            jest.spyOn(service, 'findOne').mockImplementation((id: number) =>
                Promise.resolve(todos.find(todo => todo.id === id)),
            );
            jest.spyOn(activityService, 'create').mockImplementation(
                (activity: any) => Promise.resolve(activity),
            );
            jest.spyOn(repository, 'save').mockImplementation(
                (todo: any) => todo,
            );

            const response = await service.removeAssignee(id, assigneeId);

            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(activityService.create).toHaveBeenCalledTimes(1);
            expect(activityService.create).toHaveBeenCalledWith(activity);
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith({
                ...todo,
                assigneesIds: todo.assigneesIds.filter(id => assigneeId !== id),
                activities: expect.arrayContaining([
                    expect.objectContaining(activity),
                ]),
            });
            expect(response).toBeDefined();
            expect(response).toMatchObject({
                ...todo,
                assigneesIds: todo.assigneesIds.filter(id => assigneeId !== id),
                activities: expect.arrayContaining([
                    expect.objectContaining(activity),
                ]),
            });
        });
        it('should return an error message if assignee does not exist', async () => {
            const id = 2;
            const assigneeId = '08b8b93a-9aa7-4fc1-8201-539e2cb35432';
            jest.spyOn(service, 'findOne').mockImplementation((id: number) =>
                Promise.resolve(todos.find(todo => todo.id === id)),
            );
            jest.spyOn(activityService, 'create').mockResolvedValue(null);
            jest.spyOn(repository, 'save').mockResolvedValue(null);

            await expect(
                service.removeAssignee(id, assigneeId),
            ).rejects.toThrow(`${assigneeId} does not exist`);

            expect(activityService.create).not.toHaveBeenCalled();
            expect(repository.save).not.toHaveBeenCalled();
        });
    });
    describe('update', () => {
        let id = 1;
        let todoInput = {
            title: 'ToDo 1',
            description: '',
            status: 10,
            priority: 10,
            authorId: '',
            assigneesIds: [],
            creationDate: '1998-09-21',
            dueDate: '',
            estimatedDueDate: null,
            pinned: false,
            type: 10,
            parentId: '',
            projectId: 1,
        };
        it('should update title and save activity', async () => {
            const title = 'ToDo 1 updated';
            const activity = {
                todo: todos.find(todo => todo.id === id),
                newValue: title,
                type: ActivityEnum.TITLE_CHANGED,
                authorId: 'username',
            };
            jest.spyOn(service, 'findOne').mockImplementation((id: number) =>
                Promise.resolve(todos.find(todo => todo.id === id)),
            );
            jest.spyOn(activityService, 'create').mockImplementation(activity =>
                Promise.resolve(activity),
            );
            jest.spyOn(repository, 'save').mockImplementation(
                (todo: any) => todo,
            );

            const response = await service.update(id, { ...todoInput, title });

            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(activityService.create).toHaveBeenCalledTimes(1);
            expect(activityService.create).toHaveBeenCalledWith(activity);
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith({
                ...activity.todo,
                title,
                activities: expect.arrayContaining([
                    expect.objectContaining(activity),
                ]),
            });
            expect(response).toBeDefined();
            expect(response).toMatchObject(
                expect.objectContaining({
                    ...activity.todo,
                    title,
                    activities: expect.arrayContaining([
                        expect.objectContaining(activity),
                    ]),
                }),
            );
        });
    });
});
