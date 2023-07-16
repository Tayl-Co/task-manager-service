import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceService } from './reference.service';
import { TodoService } from '@todo/todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reference } from '@reference/entity/reference.entity';
import { Repository } from 'typeorm';
import { default as data } from '../../test/data/todo.json';
import { ReferenceDto } from '@reference/dtos/reference.dto';

const toDos = data.map(todo => ({
    ...todo,
    creationDate: new Date(todo.creationDate),
    lastUpdateDate: todo.lastUpdateDate ? new Date(todo.lastUpdateDate) : null,
    estimatedDueDate: todo.estimatedDueDate
        ? new Date(todo.estimatedDueDate)
        : null,
    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
}));

describe('ReferenceService', () => {
    let service: ReferenceService;
    const repositoryToken = getRepositoryToken(Reference);
    let repository: Repository<Reference>;
    let todoService = {
        findOne: jest.fn((id: number) => toDos.find(todo => todo.id === id)),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReferenceService,
                { provide: TodoService, useValue: todoService },
                { provide: repositoryToken, useClass: Repository },
            ],
        }).compile();

        jest.clearAllMocks();
        service = module.get<ReferenceService>(ReferenceService);
        repository = module.get<Repository<Reference>>(repositoryToken);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const referenceInput: ReferenceDto = {
            type: '',
            url: 'www.google.com',
            key: '',
            todoId: 1,
        };
        it('should create a reference', async () => {
            jest.spyOn(repository, 'create').mockImplementation(
                (reference: Reference) => ({ id: 1, ...reference }),
            );
            jest.spyOn(repository, 'save').mockImplementation(
                (reference: Reference) =>
                    Promise.resolve({ id: 1, ...reference }),
            );

            const response = await service.create(referenceInput);

            const { todoId, ...reference } = referenceInput;
            const todo = toDos.find(todo => todo.id === todoId);

            expect(todoService.findOne).toHaveBeenCalledTimes(1);
            expect(todoService.findOne).toHaveBeenCalledWith(todoId);
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...reference,
                    todo,
                }),
            );
            expect(response).toBeDefined();
            expect(response).toMatchObject(
                expect.objectContaining({
                    ...reference,
                    todo,
                }),
            );
        });
    });
});
