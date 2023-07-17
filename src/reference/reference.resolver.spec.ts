import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceResolver } from './reference.resolver';
import { ReferenceService } from '@reference/reference.service';
import { ReferenceDto } from '@reference/dtos/reference.dto';
import { default as data } from '../../test/data/todo.json';
import { Reference } from '@reference/entity/reference.entity';
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
let references: Array<Reference> = referencesData.map(referencesData => ({
    ...referencesData,
    todo: toDos.find(todo => todo.id === referencesData.todo.id),
}));
describe('ReferenceResolver', () => {
    let resolver: ReferenceResolver;
    let service = {
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        findOne: jest.fn(),
        search: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReferenceResolver,
                { provide: ReferenceService, useValue: service },
            ],
        }).compile();

        resolver = module.get<ReferenceResolver>(ReferenceResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('mutation', () => {
        describe('create', () => {
            const referenceInput: ReferenceDto = {
                type: '',
                url: 'www.google.com',
                key: '',
                todoId: 1,
            };
            it('should create a reference', async () => {
                jest.spyOn(service, 'create').mockImplementation(
                    referenceInput =>
                        Promise.resolve({ ...referenceInput, id: 1 }),
                );

                const response = await resolver.create(referenceInput);

                expect(service.create).toHaveBeenCalledTimes(1);
                expect(service.create).toHaveBeenCalledWith(referenceInput);
                expect(response).toBeDefined();
                expect(response).toMatchObject(
                    expect.objectContaining(referenceInput),
                );
            });
        });
    });
    describe('query', () => {
        describe('findOne', () => {
            it('should return a reference', async () => {
                jest.spyOn(service, 'findOne').mockImplementation(
                    (id: number) =>
                        Promise.resolve(
                            references.find(reference => reference.id === id),
                        ),
                );
                const id = 1;
                const response = await resolver.findOne(id);

                expect(service.findOne).toHaveBeenCalledTimes(1);
                expect(service.findOne).toHaveBeenCalledWith(id);
                expect(response).toBeDefined();
                expect(response).toMatchObject(references[0]);
            });
        });
    });
});
