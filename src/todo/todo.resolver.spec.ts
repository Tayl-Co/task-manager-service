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
        remove: jest.fn(),
        update: jest.fn(),
        addLabel: jest.fn(),
        removeLabel: jest.fn(),
        addAssignee: jest.fn(),
        removeAssignee: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        search: jest.fn(),
    };

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

    describe('remove', () => {
        it('should remove a To-Do', async () => {
            const id = 1;
            const todo = todos.find(todo => todo.id === id);
            jest.spyOn(todoService, 'remove').mockResolvedValue(
                Promise.resolve(todo),
            );

            const response = await resolver.remove(id);

            expect(todoService.remove).toHaveBeenCalledTimes(1);
            expect(todoService.remove).toHaveBeenCalledWith(id);
            expect(response).toBeDefined();
            expect(response).toMatchObject(todo);
        });
    });
});
