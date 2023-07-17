import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceResolver } from './reference.resolver';
import { ReferenceService } from '@reference/reference.service';
import { ReferenceDto } from '@reference/dtos/reference.dto';

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

    describe('create', () => {
        const referenceInput: ReferenceDto = {
            type: '',
            url: 'www.google.com',
            key: '',
            todoId: 1,
        };
        it('should create a reference', async () => {
            jest.spyOn(service, 'create').mockImplementation(referenceInput =>
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
