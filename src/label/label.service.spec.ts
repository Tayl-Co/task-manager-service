import { Test, TestingModule } from '@nestjs/testing';
import { LabelService } from './label.service';
import { Repository } from 'typeorm';
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
        });
    });
});
