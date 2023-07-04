import { Test, TestingModule } from '@nestjs/testing';
import { LabelResolver } from './label.resolver';
import { LabelService } from '@label/label.service';

const label = { name: 'Feature', color: '#fff' };

describe('LabelResolver', () => {
    let resolver: LabelResolver;
    let service: Partial<LabelService> = {
        create: jest.fn(),
        update: jest.fn(),
        search: jest.fn(),
        delete: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LabelResolver,
                { provide: LabelService, useValue: service },
            ],
        }).compile();

        resolver = module.get<LabelResolver>(LabelResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('Mutation', () => {
        const id = 1;
        it('should create a label', async () => {
            jest.spyOn(service, 'create').mockImplementation(() =>
                Promise.resolve({ id: 1, ...label }),
            );

            await resolver.create({ name: 'Feature', color: '#fff' });

            expect(service.create).toHaveBeenCalledTimes(1);
            expect(service.create).toHaveBeenCalledWith(label);
        });
        it('should delete a label', async () => {
            jest.spyOn(service, 'delete').mockImplementation(() =>
                Promise.resolve({ id, ...label }),
            );

            await resolver.delete(id);

            expect(service.delete).toHaveBeenCalledTimes(1);
            expect(service.delete).toHaveBeenCalledWith(id);
        });
        it('should update a label', async () => {
            const updateLabel = { ...label, name: 'Feature2' };
            jest.spyOn(service, 'update').mockImplementation(() =>
                Promise.resolve({ id, ...updateLabel }),
            );

            await resolver.update(id, updateLabel);

            expect(service.update).toHaveBeenCalledTimes(1);
            expect(service.update).toHaveBeenCalledWith(id, updateLabel);
        });
    });

    describe('Query', () => {
        const id = 2;

        describe('findOneLabel', () => {
            it('should return a label', async () => {
                await resolver.findOne(id);

                expect(service.findOne).toHaveBeenCalledTimes(1);
                expect(service.findOne).toHaveBeenCalledWith(2);
            });
        });
    });
});
