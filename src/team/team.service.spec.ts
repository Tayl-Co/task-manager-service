import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from '@team/team.service';
import { Team } from '@team/entity/team.entity';
import { default as data } from '../../test/data/team.json';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
    Repository,
    DeepPartial,
    FindOneOptions,
    FindOptionsWhere,
    FindManyOptions,
    Equal,
} from 'typeorm';
import { Order } from '@src/common/enums/order.enum';

type Jest = typeof jest;

const mockRepository =
    (jest: Jest) =>
    <T>(data: any) => ({
        create: jest.fn().mockImplementation((entity: DeepPartial<T>) => {
            let lastId = data[data.length - 1]?.id;
            return Promise.resolve({ ...entity, projects: [], id: lastId + 1 });
        }),
        save: jest
            .fn()
            .mockImplementation((entity: DeepPartial<T>) =>
                Promise.resolve(entity),
            ),
        find: jest
            .fn()
            .mockImplementation(
                (options: FindManyOptions<T>): DeepPartial<T> => {
                    const { where } = options;
                    if (!where) return data;
                },
            ),
        findOne: jest
            .fn()
            .mockImplementation(({ where }: FindOneOptions<T>) => {
                const { id }: FindOptionsWhere<Team> =
                    where as FindOptionsWhere<T>;
                const item = data.find(e => e.id === id);

                return Promise.resolve(item);
            }),
        delete: jest
            .fn()
            .mockImplementation((entity: DeepPartial<T>) =>
                Promise.resolve(entity),
            ),
        remove: jest
            .fn()
            .mockImplementation((entity: DeepPartial<T>) =>
                Promise.resolve(entity),
            ),
    });

const initMockRepository = mockRepository(jest);

const team = {
    name: 'Team 6',
    managersIds: ['96dbafb6-4633-4bdb-8e78-9ae7b4dc4959'],
    membersIds: ['96dbafb6-4633-4bdb-8e78-9ae7b4dc4959'],
    ownerId: '2c7591b9-a582-4819-8aec-d2542cb446e8',
};

describe('TeamService', () => {
    let service: TeamService;
    let teamRepository: Repository<Team>;
    const teamRepositoryToken = getRepositoryToken(Team);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TeamService,
                {
                    provide: teamRepositoryToken,
                    useClass: Repository,
                    //useValue: initMockRepository<Team>(data),
                },
            ],
        }).compile();

        service = module.get<TeamService>(TeamService);
        teamRepository = module.get<Repository<Team>>(teamRepositoryToken);
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
        it('Should return all teams if it does not contain filters', async () => {
            jest.spyOn(teamRepository, 'find').mockResolvedValue(data);
            const response = await service.search({});

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                where: {},
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
            expect(response).toMatchObject(data);
            expect(response.length).toEqual(5);
        });

        it('Should return teams in descending order', async () => {
            jest.spyOn(teamRepository, 'find').mockResolvedValue(
                data.reverse(),
            );
            //TODO: Refactor
            const response = await service.search({});

            expect(response).toMatchObject(data.reverse());
            expect(response.length).toEqual(data.length);
        });

        it('Should return items based on page and limit quantity', async () => {
            const teams = [
                {
                    id: 3,
                    name: 'Team 3',
                    ownerId: 'd18f9873-6707-4df6-9a16-b3bf2d74cbc5',
                    membersIds: [
                        'db9ce25e-5de3-41db-80c0-ee637ac3813f',
                        '745149b6-c4fe-4801-a2ca-d247f94405ac',
                    ],
                    managersIds: ['baef5525-47ac-4356-bc01-11f268e17352'],
                    projects: [
                        {
                            id: 3,
                            name: 'Project 3',
                            description: 'Description of project 3',
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
            ];
            jest.spyOn(teamRepository, 'find').mockResolvedValue(teams);
            const response = await service.search({ page: 1, limit: 2 });

            expect(response).toMatchObject(teams);
            expect(response.length).toEqual(2);
        });

        it('Should return the teams referring to the ids informed', async () => {
            const teams = [
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
            ];
            jest.spyOn(teamRepository, 'find').mockResolvedValue(teams);
            const response = await service.search({ ids: [2, 5] });

            expect(response).toMatchObject(teams);
            expect(response.length).toEqual(2);
        });

        it('Should return the team if the name exists', async () => {
            const teams = [
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
                            issues: [],
                        },
                    ],
                },
            ];
            jest.spyOn(teamRepository, 'find').mockResolvedValue(teams);
            const response = await service.search({ name: 'Team 1' });

            expect(response).toMatchObject(teams);
            expect(response.length).toEqual(1);
        });

        it("Should return the teams that contain the managers' IDs", async () => {
            const teams = [
                {
                    id: 3,
                    name: 'Team 3',
                    ownerId: 'd18f9873-6707-4df6-9a16-b3bf2d74cbc5',
                    membersIds: [
                        'db9ce25e-5de3-41db-80c0-ee637ac3813f',
                        '745149b6-c4fe-4801-a2ca-d247f94405ac',
                    ],
                    managersIds: ['baef5525-47ac-4356-bc01-11f268e17352'],
                    projects: [
                        {
                            id: 3,
                            name: 'Project 3',
                            description: 'Description of project 3',
                            active: false,
                            team: null,
                            issues: [],
                        },
                    ],
                },
            ];
            jest.spyOn(teamRepository, 'find').mockResolvedValue(teams);
            const response = await service.search({
                managersIds: ['baef5525-47ac-4356-bc01-11f268e17352'],
            });

            expect(response).toMatchObject(teams);
            expect(response.length).toEqual(1);
        });

        it("Should return the teams that contain the members' IDs", async () => {
            const teams = [
                {
                    id: 3,
                    name: 'Team 3',
                    ownerId: 'd18f9873-6707-4df6-9a16-b3bf2d74cbc5',
                    membersIds: [
                        'db9ce25e-5de3-41db-80c0-ee637ac3813f',
                        '745149b6-c4fe-4801-a2ca-d247f94405ac',
                    ],
                    managersIds: ['baef5525-47ac-4356-bc01-11f268e17352'],
                    projects: [
                        {
                            id: 3,
                            name: 'Project 3',
                            description: 'Description of project 3',
                            active: false,
                            team: null,
                            issues: [],
                        },
                    ],
                },
            ];
            jest.spyOn(teamRepository, 'find').mockResolvedValue(teams);
            const response = await service.search({
                membersIds: ['db9ce25e-5de3-41db-80c0-ee637ac3813f'],
            });

            expect(response).toMatchObject(teams);
        });
    });

    describe('findOne Function', () => {
        const id = 1;
        it('Should return team if team exist', async () => {
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(data.find(team => team.id === id)),
            );
            const response = await service.findOne(id);

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id },
            });
            expect(response).toBeDefined();
            expect(response).toMatchObject(data[0]);
        });

        it('Should return an error message if the team is not found', async () => {
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.findOne(id)).rejects.toThrow(
                `Team ${id} not found`,
            );

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id },
            });
        });
    });

    describe('create Function', () => {
        it('should return the team created if the entries are correct', async () => {
            const createTeam = {
                id: 1,
                ...team,
                projects: [],
            };
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(teamRepository, 'create').mockImplementation(
                () => createTeam,
            );
            jest.spyOn(teamRepository, 'save').mockImplementation(() =>
                Promise.resolve(createTeam),
            );

            const response = await service.create(team);

            expect(response).toBeDefined();
            expect(response).toMatchObject(createTeam);
            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                where: { name: Equal(team.name) },
            });
            expect(teamRepository.create).toHaveBeenCalledTimes(1);
            expect(teamRepository.create).toHaveBeenCalledWith(team);
            expect(teamRepository.save).toHaveBeenCalledTimes(1);
            expect(teamRepository.save).toHaveBeenCalledWith(createTeam);
        });
        it('should return an error message if team already exist', async () => {
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve({ id: 1, projects: [], ...team }),
            );

            await expect(service.create(team)).rejects.toThrow(
                `The ${team.name} Team already exists`,
            );

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                where: { name: Equal(team.name) },
            });
        });
    });

    describe('update Function', () => {
        const id = 1;
        it('should return an error message if the team is not found', async () => {
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(teamRepository, 'save').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.update(id, team)).rejects.toThrow(
                `Team ${id} not found`,
            );

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id },
            });
            expect(teamRepository.save).not.toHaveBeenCalled();
        });

        it('should return the updated team', async () => {
            const updateTeam = { ...data[0], name: 'Team 1 Updated' };
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(data.find(team => team.id === id)),
            );
            jest.spyOn(teamRepository, 'save').mockImplementation(() =>
                Promise.resolve(updateTeam),
            );
            const response = await service.update(1, updateTeam);

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id },
            });
            expect(teamRepository.save).toHaveBeenCalledTimes(1);
            expect(teamRepository.save).toHaveBeenCalledWith(updateTeam);
            expect(response).toBeDefined();
            expect(response).toEqual(updateTeam);
        });
    });

    describe('delete Function', () => {
        const id = 1;

        it('should return an error message if the team is not found', async () => {
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(teamRepository, 'delete').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.delete(id)).rejects.toThrow(
                `Team ${id} not found`,
            );

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id },
            });
            expect(teamRepository.delete).not.toHaveBeenCalled();
        });

        it('should return deleted team', async () => {
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(data.find(team => team.id === id)),
            );
            jest.spyOn(teamRepository, 'delete').mockImplementation(() =>
                Promise.resolve({ raw: [], affected: 1 }),
            );

            const response = await service.delete(id);

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id },
            });
            expect(teamRepository.delete).toHaveBeenCalledTimes(1);
            expect(teamRepository.delete).toHaveBeenCalledWith(id);
            expect(response).toBeDefined();
            expect(response).toEqual(data[0]);
        });
    });
});
