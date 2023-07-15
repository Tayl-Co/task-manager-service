import { Test, TestingModule } from '@nestjs/testing';
import { TodoResolver } from './todo.resolver';
import { TodoService } from '@todo/todo.service';
import { TodoTypeEnum } from '@src/common/enums/todoType.enum';

describe('TodoResolver', () => {
    let resolver: TodoResolver;
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
});
