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

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const label = {
            name: 'Feature',
            color: '#fff',
        };

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
});
