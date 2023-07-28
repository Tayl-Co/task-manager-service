import { Test, TestingModule } from '@nestjs/testing';
import { TodoResolver } from './todo.resolver';
import { TodoService } from '@todo/todo.service';
import { TodoTypeEnum } from '@src/common/enums/todoType.enum';
import { default as data } from '../../test/data/todo.json';

describe('TodoResolver', () => {
    let resolver: TodoResolver;
    let todos = [];
    let todoService = {
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        addLabel: jest.fn(),
        removeLabel: jest.fn(),
        addAssignee: jest.fn(),
        removeAssignee: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        search: jest.fn(),
    };
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TodoResolver,
                {
                    provide: TodoService,
                    useValue: todoService,
                },
            ],
        }).compile();

        resolver = module.get<TodoResolver>(TodoResolver);
        todos = data.map(todo => ({
            ...todo,
            creationDate: new Date(todo.creationDate),
            lastUpdateDate: todo.lastUpdateDate
                ? new Date(todo.lastUpdateDate)
                : null,
            estimatedDueDate: todo.estimatedDueDate
                ? new Date(todo.estimatedDueDate)
                : null,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
        }));
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
    describe('mutation', () => {
        describe('create', () => {
            const toDoInput = {
                title: 'Title 1',
                description: '',
                assigneesIds: [],
                parentId: null,
                dueDate: '2023-09-21',
                type: TodoTypeEnum.TASK,
                projectId: 1,
            };
            it('should create a To-Do', async () => {
                jest.spyOn(todoService, 'create').mockImplementation(() =>
                    Promise.resolve({
                        id: 1,
                        ...toDoInput,
                    }),
                );
                const response = await resolver.create(toDoInput);

                expect(todoService.create).toHaveBeenCalledTimes(1);
                expect(todoService.create).toHaveBeenCalledWith(toDoInput);
                expect(response).toBeDefined();
            });
        });

        describe('update', () => {
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
                parentId: null,
                projectId: 1,
            };

            it('should update a To-Do', async () => {
                const id = 1;
                const todo = todos.find(todo => todo.id === id);
                jest.spyOn(todoService, 'update').mockImplementation(() => {
                    Object.assign(todo, todoInput);
                    return Promise.resolve(todo);
                });

                const response = await resolver.update(id, todoInput);

                expect(todoService.update).toHaveBeenCalledTimes(1);
                expect(todoService.update).toHaveBeenCalledWith(id, todoInput);
                expect(response).toBeDefined();
                expect(response).toMatchObject(todo);
            });
        });

        describe('delete', () => {
            it('should delete a To-Do', async () => {
                const id = 1;
                const todo = todos.find(todo => todo.id === id);
                jest.spyOn(todoService, 'delete').mockResolvedValue(
                    Promise.resolve(todo),
                );

                const response = await resolver.delete(id);

                expect(todoService.delete).toHaveBeenCalledTimes(1);
                expect(todoService.delete).toHaveBeenCalledWith(id);
                expect(response).toBeDefined();
                expect(response).toMatchObject(todo);
            });
        });

        describe('addLabel', () => {
            it('should add label to To-Do', async () => {
                const id = 1;
                const labelId = 3;
                const todo = todos.find(todo => todo.id === id);
                const label = labels.find(label => label.id === labelId);
                jest.spyOn(todoService, 'addLabel').mockResolvedValue(
                    Promise.resolve({
                        ...todo,
                        labels: [...todo.labels, label],
                    }),
                );

                const response = await resolver.addLabel(id, labelId);

                expect(todoService.addLabel).toHaveBeenCalledTimes(1);
                expect(todoService.addLabel).toHaveBeenCalledWith(id, labelId);
                expect(response).toBeDefined();
                expect(response).toMatchObject({
                    ...todo,
                    labels: [...todo.labels, label],
                });
            });
        });
        describe('removeLabel', () => {
            it('should remove label from To-Do', async () => {
                const id = 2;
                const labelId = 3;
                const todo = todos.find(todo => todo.id === id);
                jest.spyOn(todoService, 'removeLabel').mockResolvedValue(
                    Promise.resolve({
                        ...todo,
                        labels: todo.labels.filter(
                            label => label.id !== labelId,
                        ),
                    }),
                );

                const response = await resolver.removeLabel(id, labelId);

                expect(todoService.removeLabel).toHaveBeenCalledTimes(1);
                expect(todoService.removeLabel).toHaveBeenCalledWith(
                    id,
                    labelId,
                );
                expect(response).toBeDefined();
                expect(response).toMatchObject({
                    ...todo,
                    labels: todo.labels.filter(label => label.id !== labelId),
                });
            });
        });
        describe('addAssignee', () => {
            it('should add assignee to To-Do', async () => {
                const id = 1;
                const assignee = 'a192fd6d-67c1-4090-8011-d96f83cf3e9b';
                const todo = todos.find(todo => todo.id === id);
                jest.spyOn(todoService, 'addAssignee').mockResolvedValue(
                    Promise.resolve({
                        ...todo,
                        assigneesIds: [...todo.assigneesIds, assignee],
                    }),
                );

                const response = await resolver.addAssignee(id, assignee);

                expect(todoService.addAssignee).toHaveBeenCalledTimes(1);
                expect(todoService.addAssignee).toHaveBeenCalledWith(
                    id,
                    assignee,
                );
                expect(response).toBeDefined();
                expect(response).toMatchObject({
                    ...todo,
                    assigneesIds: [...todo.assigneesIds, assignee],
                });
            });
        });
        describe('removeAssignee', () => {
            it('should remove assignee from To-Do', async () => {
                const id = 1;
                const assignee = '08b8b93a-9aa7-4fc1-8201-539e2cb33830';
                const todo = todos.find(todo => todo.id === id);
                jest.spyOn(todoService, 'removeAssignee').mockResolvedValue(
                    Promise.resolve({
                        ...todo,
                        assigneesIds: todo.assigneesIds.filter(
                            assigneeId => assigneeId !== assignee,
                        ),
                    }),
                );

                const response = await resolver.removeAssignee(id, assignee);

                expect(todoService.removeAssignee).toHaveBeenCalledTimes(1);
                expect(todoService.removeAssignee).toHaveBeenCalledWith(
                    id,
                    assignee,
                );
                expect(response).toBeDefined();
                expect(response).toMatchObject({
                    ...todo,
                    assigneesIds: [],
                });
            });
        });
    });

    describe('query', () => {
        describe('findAll', () => {
            it('should return all To-Dos', async () => {
                jest.spyOn(todoService, 'findAll').mockResolvedValue(
                    Promise.resolve(todos),
                );

                const response = await resolver.findAll();

                expect(todoService.findAll).toHaveBeenCalledTimes(1);
                expect(response).toBeDefined();
                expect(response).toMatchObject(todos);
            });
        });
        describe('findOne', () => {
            it('should return a To-Do', async () => {
                const id = 1;
                const todo = todos.find(todo => todo.id === id);
                jest.spyOn(todoService, 'findOne').mockResolvedValue(
                    Promise.resolve(todo),
                );

                const response = await resolver.findOne(id);

                expect(todoService.findOne).toHaveBeenCalledTimes(1);
                expect(todoService.findOne).toHaveBeenCalledWith(id);
                expect(response).toBeDefined();
                expect(response).toMatchObject(todo);
            });
        });
        describe('search', () => {
            it('should search To-Dos', async () => {
                jest.spyOn(todoService, 'search').mockResolvedValue(
                    Promise.resolve([]),
                );

                const response = await resolver.search({});

                expect(todoService.search).toHaveBeenCalledTimes(1);
                expect(todoService.search).toHaveBeenCalledWith({});
                expect(response).toBeDefined();
                expect(response).toMatchObject([]);
            });
        });
    });
});
