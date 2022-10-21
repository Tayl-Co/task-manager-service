import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from '@team/team.service';
import { TeamRepository } from '@team/repository/team.repository';
import { Team } from '@team/entity/team.entity';
import { default as data } from '../../test/data/team.json';
import { TeamDto } from '@team/dtos/team.dto';
import { SearchFilterDto } from '@team/dtos/searchTeam.dto';

describe('TeamService', () => {
    let service: TeamService;
    let fakeRepository: Partial<TeamRepository>;

    beforeEach(async () => {
        fakeRepository = {
            async findAll(): Promise<Array<Team>> {
                return Promise.resolve(data);
            },
            async findOne(id: number): Promise<Team> {
                const team = data.find(team => team.id === id);

                return Promise.resolve(team);
            },
            async remove(team: Team): Promise<Team> {
                const indexTeam = data.map(e => e.id).indexOf(team.id);
                delete data[indexTeam];
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
                const team = data
                    .filter(e => {
                        const resultsQuery: Array<boolean> = [];

                        if (
                            membersIds &&
                            e.membersIds.every(r => membersIds.includes(r))
                        )
                            resultsQuery.push(true);

                        if (
                            managersIds &&
                            e.managersIds.every(r => managersIds.includes(r))
                        )
                            resultsQuery.push(true);

                        if (e.ownerId && e.ownerId === ownerId)
                            resultsQuery.push(true);

                        if (ids && ids.includes(e.id)) resultsQuery.push(true);

                        if (e.name === name || '') resultsQuery.push(true);

                        return resultsQuery.length > 0
                            ? resultsQuery.every(e => e === true)
                            : false;
                    })
                    .sort((a, b) => {
                        if (order === 'DESC') return b.name > a.name ? 1 : -1;

                        return a.name > b.name ? 1 : -1;
                    })
                    .slice(page * limit, limit);
                return Promise.resolve(team);
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

    describe('search Function', () => {
        it('Should return the team if the name exists', async () => {
            const response = await service.search({ name: 'Team 1' });

            expect(response).toMatchObject([
                {
                    id: 1,
                    name: 'Team 1',
                    ownerId: '0cc01959-066e-4d29-9105-61a6c343ad5c',
                    membersIds: [
                        '08b8b93a-9aa7-4fc1-8201-539e2cb33830',
                        'acb63589-c2b6-43d8-aa06-1bc722666bf0',
                    ],
                    managersIds: ['a192fd6d-67c1-4090-8011-d96f83cf3e9b'],
                    projects: [
                        {
                            id: 1,
                            name: 'Project 1',
                            description: 'Description of project 1',
                            active: true,
                            team: null,
                        },
                    ],
                },
            ]);
        });
    });

    describe('findOne Function', () => {
        it('Should return team if team exist', async () => {
            const response = await service.findOne(1);

            expect(response).toBeDefined();
            expect(response).toEqual({
                id: 1,
                name: 'Team 1',
                ownerId: '0cc01959-066e-4d29-9105-61a6c343ad5c',
                membersIds: [
                    '08b8b93a-9aa7-4fc1-8201-539e2cb33830',
                    'acb63589-c2b6-43d8-aa06-1bc722666bf0',
                ],
                managersIds: ['a192fd6d-67c1-4090-8011-d96f83cf3e9b'],
                projects: [
                    {
                        id: 1,
                        name: 'Project 1',
                        description: 'Description of project 1',
                        active: true,
                        team: null,
                    },
                ],
            });
        });

        it('Should return an error message if the team is not found', async () => {
            try {
                await service.findOne(50);
            } catch ({ message }) {
                expect(message).toEqual(`Team 50 not found`);
            }
        });
    });

    describe('update Function', () => {
        const team = {
            name: 'Team 10',
            managersIds: ['96dbafb6-4633-4bdb-8e78-9ae7b4dc4959'],
            membersIds: ['96dbafb6-4633-4bdb-8e78-9ae7b4dc4959'],
            ownerId: '2c7591b9-a582-4819-8aec-d2542cb446e8',
        };

        it('Should return an error message if the team is not found', async () => {
            try {
                await service.update(99, team);
            } catch ({ message }) {
                expect(message).toEqual(`Team 99 not found`);
            }
        });

        it('Should return the updated team', async () => {
            const response = await service.update(1, team);

            expect(response).toBeDefined();
            expect(response).toEqual({
                id: 1,
                ...team,
                projects: [
                    {
                        id: 1,
                        name: 'Project 1',
                        description: 'Description of project 1',
                        active: true,
                        team: null,
                    },
                ],
            });
        });
    });

    describe('create Function', () => {
        it('Should return the team created if the entries are correct', async () => {
            const team = {
                name: 'Team 6',
                managersIds: ['96dbafb6-4633-4bdb-8e78-9ae7b4dc4959'],
                membersIds: ['96dbafb6-4633-4bdb-8e78-9ae7b4dc4959'],
                ownerId: '2c7591b9-a582-4819-8aec-d2542cb446e8',
            };
            const response = await service.create(team);
            expect(response).toBeDefined();
            expect(response).toEqual({ id: 6, ...team, projects: [] });
            expect(data).toContainEqual({ id: 6, ...team, projects: [] });
        });
    });

    describe('delete Function', () => {
        it('Should return an error message if the team is not found', async () => {
            try {
                await service.delete(50);
            } catch ({ message }) {
                expect(message).toBeDefined();
                expect(message).toEqual(`Team 50 not found`);
            }
        });

        it('Should return deleted team and remove team within data', async () => {
            const response = await service.delete(5);
            const team = {
                id: 5,
                name: 'Team 5',
                ownerId: '2296e799-b730-4879-bfe0-26ecabca3ee0',
                membersIds: [
                    'a1f35180-c5f4-4f1d-a84c-e6c7b0202144',
                    '6f3e32de-b2ae-414e-b24c-f02cbac5f443',
                ],
                managersIds: ['98cefbee-7b8e-4878-b213-895f84b5259b'],
                projects: [
                    {
                        id: 5,
                        name: 'Project 5',
                        description: 'Description of project 5',
                        active: false,
                        team: null,
                    },
                ],
            };

            expect(response).toBeDefined();
            expect(response).toEqual(team);
            expect(data).not.toContainEqual(team);
        });
    });
});
