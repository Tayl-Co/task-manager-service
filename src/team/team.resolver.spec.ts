import { Test, TestingModule } from '@nestjs/testing';
import { TeamResolver } from '@team/team.resolver';
import { TeamService } from '@team/team.service';
import { Team } from '@team/entity/team.entity';
import { default as data } from '../../test/data/team.json';
import { TeamDto } from '@team/dtos/team.dto';
import { SearchFilterDto } from '@team/dtos/searchTeam.dto';

describe('TeamResolver', () => {
    let resolver: TeamResolver;
    let fakeService: Partial<TeamService>;

    beforeEach(async () => {
        fakeService = {
            async findAll(): Promise<Array<Team>> {
                return Promise.resolve(data);
            },
            async findOne(id: number): Promise<Team> {
                const team = data.find(team => team.id === id);

                return Promise.resolve(team);
            },
            async delete(id: number): Promise<Team> {
                const indexTeam = data.map(e => e.id).indexOf(id);
                const team = data[indexTeam];
                return Promise.resolve(team);
            },
            async create({
                name,
                ownerId,
                membersIds,
                managersIds,
            }: TeamDto): Promise<Team> {
                const team = {
                    id: 6,
                    name,
                    ownerId,
                    membersIds,
                    managersIds,
                    projects: [],
                };

                data.push(team);
                return Promise.resolve(team);
            },

            async update(
                id: number,
                { name, ownerId, membersIds, managersIds }: TeamDto,
            ): Promise<Team> {
                const team = data.find(e => e.id === id);
                team.name = name;
                team.managersIds = managersIds;
                team.membersIds = membersIds;
                team.ownerId = ownerId;

                return Promise.resolve(team);
            },

            async search({
                ids,
                name = '',
                ownerId,
                membersIds,
                managersIds,
                page = 0,
                order = 'ASC',
                limit = 50,
            }: SearchFilterDto): Promise<Array<Team>> {
                const indexOfPage = page * limit;
                let response = data.filter(e => {
                    return name === '' ? true : e.name === name;
                });

                if (ids || ownerId || membersIds || managersIds)
                    response = response.filter(e => {
                        if (
                            membersIds &&
                            e.membersIds.some(r => membersIds.includes(r))
                        )
                            return true;

                        if (
                            managersIds &&
                            e.managersIds.some(r => managersIds.includes(r))
                        )
                            return true;

                        if (e.ownerId && e.ownerId === ownerId) return true;

                        return ids && ids.includes(e.id);
                    });

                return Promise.resolve(
                    response
                        .sort((a, b) => {
                            if (order === 'DESC')
                                return b.name > a.name ? 1 : -1;

                            return a.name > b.name ? 1 : -1;
                        })
                        .slice(indexOfPage, indexOfPage + limit),
                );
            },
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TeamResolver,
                { provide: TeamService, useValue: fakeService },
            ],
        }).compile();

        resolver = module.get<TeamResolver>(TeamResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('Should return created team', async () => {
        const response = await resolver.create({
            name: 'Team 6',
            ownerId: '',
            membersIds: [],
            managersIds: [],
        });

        expect(response).toBeDefined();
        expect(response).toMatchObject({
            id: 6,
            name: 'Team 6',
            ownerId: '',
            membersIds: [],
            managersIds: [],
            projects: [],
        });
    });
});
