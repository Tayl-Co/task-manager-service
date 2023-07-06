import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from '@team/team.service';
import { Team } from '@team/entity/team.entity';
import { default as data } from '../../test/data/team.json';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Equal, In, ILike, ArrayContains } from 'typeorm';
import { Order } from '@src/common/enums/order.enum';

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
                },
            ],
        }).compile();

        service = module.get<TeamService>(TeamService);
        teamRepository = module.get<Repository<Team>>(teamRepositoryToken);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('addUser', () => {
        it('should add member to team', async () => {
            const updateTeam = {
                ...data[0],
                membersIds: [
                    '08b8b93a-9aa7-4fc1-8201-539e2cb33830',
                    'acb63589-c2b6-43d8-aa06-1bc722666bf0',
                    'acb63589-c2b6-43d8-aa06-1bc722666b22',
                ],
            };
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(data[0]),
            );
            jest.spyOn(teamRepository, 'save').mockImplementation(() =>
                Promise.resolve(updateTeam),
            );

            await service.addUser(updateTeam.id, {
                userId: 'acb63589-c2b6-43d8-aa06-1bc722666b22',
                userType: 'member',
            });

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id: updateTeam.id },
            });
            expect(teamRepository.save).toHaveBeenCalledTimes(1);
            expect(teamRepository.save).toHaveBeenCalledWith({
                ...data[0],
                membersIds: expect.arrayContaining(updateTeam.membersIds),
            });
        });
        it('should add manager to team', async () => {
            const updateTeam = {
                ...data[0],
                managersIds: [
                    'a192fd6d-67c1-4090-8011-d96f83cf3e9b',
                    'a432fd6d-67c1-4090-8011-d96f83cf3e45',
                ],
            };
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(data[0]),
            );
            jest.spyOn(teamRepository, 'save').mockImplementation(() =>
                Promise.resolve(updateTeam),
            );

            await service.addUser(updateTeam.id, {
                userId: 'a432fd6d-67c1-4090-8011-d96f83cf3e45',
                userType: 'manager',
            });

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id: updateTeam.id },
            });
            expect(teamRepository.save).toHaveBeenCalledTimes(1);
            expect(teamRepository.save).toHaveBeenCalledWith({
                ...data[0],
                managersIds: expect.arrayContaining(updateTeam.managersIds),
            });
        });
        it('should return an error message if member already exists', async () => {
            const memberId = '08b8b93a-9aa7-4fc1-8201-539e2cb33830';
            jest.spyOn(teamRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(data[0]),
            );
            jest.spyOn(teamRepository, 'save').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(
                service.addUser(data[0].id, {
                    userId: memberId,
                    userType: 'member',
                }),
            ).rejects.toThrow(`${memberId} already exists`);

            expect(teamRepository.findOne).toHaveBeenCalledTimes(1);
            expect(teamRepository.findOne).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id: data[0].id },
            });
        });
    });

    describe('findAll Function', () => {
        it('should return all teams', async () => {
            jest.spyOn(teamRepository, 'find').mockImplementation(() =>
                Promise.resolve(data),
            );
            const response = await service.findAll();

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                order: { name: Order.ASC },
            });
            expect(response).toBeDefined();
            expect(response).toEqual(data);
            expect(response.length).toEqual(data.length);
        });
    });

    describe('search Function', () => {
        it('should return all teams if it does not contain filters', async () => {
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

        it('should return teams in descending order', async () => {
            jest.spyOn(teamRepository, 'find').mockImplementation(() =>
                Promise.resolve([]),
            );

            const response = await service.search({ sortOrder: Order.DESC });

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                where: {},
                order: { name: Order.DESC },
                take: undefined,
                skip: 0,
            });
            expect(response.length).toEqual(0);
        });
        it('should return teams sorted by id', async () => {
            const sortById = data.sort((a, b) => a.id - b.id);
            jest.spyOn(teamRepository, 'find').mockImplementation(() =>
                Promise.resolve(sortById),
            );

            const response = await service.search({ orderBy: 'id' });

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                where: {},
                order: { id: Order.ASC },
                take: undefined,
                skip: 0,
            });
            expect(response).toMatchObject(sortById);
            expect(response.length).toEqual(data.length);
        });

        it('should return items based on page and limit quantity', async () => {
            const teams = [data[2], data[3]];
            const page = 1;
            const limit = 2;

            jest.spyOn(teamRepository, 'find').mockResolvedValue(teams);
            const response = await service.search({ page, limit });

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                where: {},
                order: { name: Order.ASC },
                take: limit,
                skip: page * limit,
            });
            expect(response).toMatchObject(teams);
            expect(response.length).toEqual(2);
        });

        it('should return the teams referring to the ids informed', async () => {
            const ids = [2, 5];
            jest.spyOn(teamRepository, 'find').mockImplementation(() =>
                Promise.resolve(data.filter(team => ids.includes(team.id))),
            );

            const response = await service.search({ ids });

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { id: In(ids) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
            expect(response).toMatchObject(
                data.filter(team => ids.includes(team.id)),
            );
            expect(response.length).toEqual(2);
        });

        it('should return the team if the name exists', async () => {
            const name = 'Team 1';
            jest.spyOn(teamRepository, 'find').mockImplementation(() =>
                Promise.resolve(data.filter(team => team.name === name)),
            );
            const response = await service.search({ name });

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { name: ILike(`%${name}%`) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
            expect(response).toMatchObject([data[0]]);
            expect(response.length).toEqual(1);
        });

        it("should return the teams that contain the managers' IDs", async () => {
            const managersIds = ['baef5525-47ac-4356-bc01-11f268e17352'];
            jest.spyOn(teamRepository, 'find').mockImplementation(() =>
                Promise.resolve([data[2]]),
            );
            const response = await service.search({
                managersIds,
            });

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { managersIds: ArrayContains(managersIds) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
            expect(response).toMatchObject([data[2]]);
            expect(response.length).toEqual(1);
        });

        it("Should return the teams that contain the members' IDs", async () => {
            const membersIds = ['db9ce25e-5de3-41db-80c0-ee637ac3813f'];
            jest.spyOn(teamRepository, 'find').mockImplementation(() =>
                Promise.resolve([data[2]]),
            );
            const response = await service.search({
                membersIds,
            });

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { membersIds: ArrayContains(membersIds) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
            expect(response).toMatchObject([data[2]]);
            expect(response.length).toEqual(1);
        });

        it('should return the teams that contain informed ownerId', async () => {
            const ownerId = '0cc01959-066e-4d29-9105-61a6c343ad5c';
            jest.spyOn(teamRepository, 'find').mockImplementation(() =>
                Promise.resolve([data[0]]),
            );
            const response = await service.search({
                ownerId,
            });

            expect(teamRepository.find).toHaveBeenCalledTimes(1);
            expect(teamRepository.find).toHaveBeenCalledWith({
                relations: { projects: true },
                where: { ownerId },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
            expect(response).toMatchObject([data[0]]);
            expect(response.length).toEqual(1);
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
