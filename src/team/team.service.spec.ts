import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from '@team/team.service';
import { TeamRepository } from '@team/repository/team.repository';
import { Team } from '@team/entity/team.entity';
import { default as data } from '../../test/data/team.json';

describe('TeamService', () => {
    let service: TeamService;
    let fakeRepository: Partial<TeamRepository>;

    beforeEach(async () => {
        fakeRepository = {
            async findAll(): Promise<Array<Team>> {
                return Promise.resolve(data);
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TeamService,
                { provide: TeamRepository, useValue: fakeRepository },
            ],
        }).compile();

        service = module.get<TeamService>(TeamService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll Function', () => {
        it('Should return all teams', async () => {
            const response = await service.findAll();

            expect(response).toBeDefined();
            expect(response).toEqual(data);
            expect(response.length).toEqual(5);
        });
    });
});
