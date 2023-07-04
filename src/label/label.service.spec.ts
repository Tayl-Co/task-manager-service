import { Test, TestingModule } from '@nestjs/testing';
import { LabelService } from './label.service';
import { Equal, Repository } from 'typeorm';
import { Label } from '@label/entity/label.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LabelService', () => {
    let service: LabelService;
    let labelRepository: Repository<Label>;
    let labelRepositoryToken = getRepositoryToken(Label);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LabelService,
                {
                    provide: labelRepositoryToken,
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<LabelService>(LabelService);
        labelRepository = module.get<Repository<Label>>(labelRepositoryToken);
    });

    const label = {
        name: 'Feature',
        color: '#fff',
    };

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should return an error message if label already exist', async () => {
            jest.spyOn(labelRepository, 'findOne').mockImplementation(() =>
                Promise.resolve({
                    id: 1,
                    ...label,
                }),
            );

            await expect(service.create(label)).rejects.toThrow(
                `The Feature Label already exists`,
            );

            expect(labelRepository.findOne).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOne).toHaveBeenCalledWith({
                where: { name: Equal(label.name) },
            });
        });

        it('should create a new label', async () => {
            const newLabel = {
                id: 1,
                ...label,
            };
            jest.spyOn(labelRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(labelRepository, 'create').mockImplementation(
                () => newLabel,
            );
            jest.spyOn(labelRepository, 'save').mockImplementation(() =>
                Promise.resolve(newLabel),
            );

            await service.create(label);

            expect(labelRepository.findOne).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOne).toHaveBeenCalledWith({
                where: { name: Equal(label.name) },
            });
            expect(labelRepository.create).toHaveBeenCalledTimes(1);
            expect(labelRepository.create).toHaveBeenCalledWith(label);
            expect(labelRepository.save).toHaveBeenCalledTimes(1);
            expect(labelRepository.save).toHaveBeenCalledWith(newLabel);
        });
    });

    describe('findOne', () => {
        it('should return an error message if label not found', async () => {
            const id = 6;
            jest.spyOn(labelRepository, 'findOneBy').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.findOne(id)).rejects.toThrow(
                `Label ${id} not found`,
            );

            expect(labelRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOneBy).toHaveBeenCalledWith({ id });
        });

        it('should return a label', async () => {
            const id = 1;
            jest.spyOn(labelRepository, 'findOneBy').mockImplementation(() =>
                Promise.resolve({ id, ...label }),
            );
            const response = await service.findOne(id);

            expect(labelRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOneBy).toHaveBeenCalledWith({ id });
            expect(response).toMatchObject({ id, ...label });
        });
    });

    describe('delete', () => {
        it('should return an error message if label not found', async () => {
            const id = 2;
            jest.spyOn(labelRepository, 'findOneBy').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(labelRepository, 'delete').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.findOne(id)).rejects.toThrow(
                `Label ${id} not found`,
            );

            expect(labelRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(labelRepository.findOneBy).toHaveBeenCalledWith({ id });
            expect(labelRepository.delete).toHaveBeenCalledTimes(0);
            expect(labelRepository.delete).not.toHaveBeenCalled();
        });
    });
});
