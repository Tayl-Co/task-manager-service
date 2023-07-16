import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceService } from './reference.service';
import { TodoService } from '@todo/todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reference } from '@reference/entity/reference.entity';
import { Repository } from 'typeorm';
import { ReferenceDto } from '@reference/dtos/reference.dto';
import { default as data } from '../../test/data/todo.json';
import { default as referencesData } from '../../test/data/references.json';

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
    let references: Array<Reference> = [];
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

        references = referencesData.map(referencesData => ({
            ...referencesData,
            todo: toDos.find(todo => todo.id === referencesData.todo.id),
        }));
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

    describe('findOne', () => {
        it('should return a reference', async () => {
            const id = 1;
            const reference = references.find(reference => reference.id === id);
            jest.spyOn(repository, 'findOne').mockResolvedValue(
                Promise.resolve(reference),
            );

            const response = await service.findOne(id);

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id },
                relations: { todo: true },
            });
            expect(response).toBeDefined();
            expect(response).toMatchObject(reference);
        });
        it('should return an error message error if reference is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            const id = -1;

            await expect(service.findOne(id)).rejects.toThrow(
                `Reference ${id} not found`,
            );

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id },
                relations: { todo: true },
            });
        });
    });

    describe('delete', () => {
        it('should delete a reference', async () => {
            const id = 1;
            const reference = references.find(reference => reference.id === id);
            jest.spyOn(repository, 'findOne').mockResolvedValue(
                Promise.resolve(reference),
            );
            jest.spyOn(repository, 'delete').mockResolvedValue(
                Promise.resolve({ raw: [], affected: 1 }),
            );

            const response = await service.delete(id);

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id },
                relations: { todo: true },
            });
            expect(repository.delete).toHaveBeenCalledTimes(1);
            expect(repository.delete).toHaveBeenCalledWith(id);
            expect(response).toBeDefined();
            expect(response).toMatchObject(reference);
        });
    });
});
