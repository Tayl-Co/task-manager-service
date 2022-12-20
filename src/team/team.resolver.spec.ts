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

    it('Should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('findAll', () => {
        it('Should return all teams', async () => {
            const response = await resolver.findAll();

            expect(response).toBeDefined();
            expect(response).toMatchObject(data);
            expect(response).toEqual(data);
            expect(response.length).toEqual(5);
        });
    });

    describe('create', () => {
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

    describe('findOne', () => {
        it('Should return team if team exist', async () => {
            const response = await resolver.findOne(1);

            expect(response).toBeDefined();
            expect(response).toMatchObject({
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
                        issues: [],
                    },
                ],
            });
        });
    });

    describe('delete', () => {
        it('Should return deleted team', async () => {
            const response = await resolver.delete(1);

            expect(response).toBeDefined();
            expect(response).toMatchObject({
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
                        issues: [],
                    },
                ],
            });
        });
    });

    describe('update', () => {
        it('Should return updated team', async () => {
            const response = await resolver.update(1, {
                name: 'Team',
                ownerId: '0cc01959-066e-4d29-9105-61a6c343ad5c',
                membersIds: [],
                managersIds: [],
            });

            expect(response).toBeDefined();
            expect(response).toMatchObject({
                id: 1,
                name: 'Team',
                ownerId: '0cc01959-066e-4d29-9105-61a6c343ad5c',
                membersIds: [],
                managersIds: [],
                projects: [
                    {
                        id: 1,
                        name: 'Project 1',
                        description: 'Description of project 1',
                        active: true,
                        team: null,
                        issues: [],
                    },
                ],
            });
        });
    });

    describe('search', () => {
        it('Should return the teams referring to the ids informed', async () => {
            const response = await resolver.search({ ids: [2, 5] });

            expect(response).toBeDefined();
            expect(response).toMatchObject([
                {
                    id: 2,
                    name: 'Team 2',
                    ownerId: '566fa276-7293-4d55-b832-2e1160fd67f2',
                    membersIds: [
                        'eca80c07-1486-4568-9b1a-3923d0e01d21',
                        '5cc8904a-d849-4fee-8ef9-4999a360611d',
                    ],
                    managersIds: ['fc0282ea-5660-4b9f-a47f-c3d499ae185a'],
                    projects: [
                        {
                            id: 2,
                            name: 'Project 2',
                            description: 'Description of project 2',
                            active: true,
                            team: null,
                            issues: [],
                        },
                    ],
                },
                {
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
                            issues: [],
                        },
                    ],
                },
            ]);
            expect(response.length).toEqual(2);
        });

        it('Should return a maximum of 50 teams if it does not contain filters', async () => {
            const response = await resolver.search({});

            expect(response).toBeDefined();
            expect(response).toMatchObject(data);
        });

        it('Should return two teams in DESC order', async () => {
            const response = await resolver.search({ limit: 2, order: 'DESC' });

            expect(response).toBeDefined();
            expect(response.length).toEqual(2);
            expect(response).toMatchObject([
                {
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
                            issues: [],
                        },
                    ],
                },
                {
                    id: 4,
                    name: 'Team 4',
                    ownerId: '93a8a626-9938-40b5-9072-273cfc061c10',
                    membersIds: [
                        '97e321ff-1a8b-4890-9cf2-2b05a5127267',
                        '94e2b8ec-fdf3-4bb5-a6cc-cac47775b782',
                    ],
                    managersIds: ['f522b8f6-3cf8-46cc-982f-b7017dc2c22c'],
                    projects: [
                        {
                            id: 4,
                            name: 'Project 4',
                            description: 'Description of project 4',
                            active: true,
                            team: null,
                            issues: [],
                        },
                    ],
                },
            ]);
        });
    });
});
