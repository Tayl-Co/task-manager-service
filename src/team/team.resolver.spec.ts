import { Test, TestingModule } from '@nestjs/testing';
import { TeamResolver } from '@team/team.resolver';
import { TeamService } from '@team/team.service';
import { Team } from '@team/entity/team.entity';
import { default as data } from '../../test/data/team.json';
import { TeamDto } from '@team/dtos/team.dto';
import { SearchFilterDto } from '@team/dtos/searchTeam.dto';
import { Order } from '@src/common/enums/order.enum';

describe('TeamResolver', () => {
    let resolver: TeamResolver;
    let fakeService: Partial<TeamService>;

    beforeEach(async () => {
        fakeService = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            search: jest.fn(),
            addUser: jest.fn(),
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

    describe('mutation', () => {
        describe('create', () => {
            it('should return created team', async () => {
                const createTeam = {
                    name: 'Team 6',
                    ownerId: '',
                    membersIds: [],
                    managersIds: [],
                };
                jest.spyOn(fakeService, 'create').mockImplementation(() =>
                    Promise.resolve({ id: 1, projects: [], ...createTeam }),
                );
                const response = await resolver.create(createTeam);

                expect(fakeService.create).toHaveBeenCalledTimes(1);
                expect(fakeService.create).toHaveBeenCalledWith(createTeam);
                expect(response).toBeDefined();
                expect(response).toMatchObject({
                    id: 1,
                    projects: [],
                    ...createTeam,
                });
            });
        });
        describe('update', () => {
            it('Should return updated team', async () => {
                const updateTeam = { ...data[0], name: 'Team updated' };
                jest.spyOn(fakeService, 'update').mockImplementation(() =>
                    Promise.resolve(updateTeam),
                );

                const response = await resolver.update(
                    updateTeam.id,
                    updateTeam,
                );

                expect(fakeService.update).toHaveBeenCalledTimes(1);
                expect(fakeService.update).toHaveBeenCalledWith(
                    updateTeam.id,
                    updateTeam,
                );
                expect(response).toBeDefined();
                expect(response).toMatchObject(updateTeam);
            });
        });
        describe('delete', () => {
            it('should return deleted team', async () => {
                const id = 1;
                const team = data.find(team => team.id === id);
                jest.spyOn(fakeService, 'delete').mockImplementation(() =>
                    Promise.resolve(team),
                );
                const response = await resolver.delete(1);

                expect(fakeService.delete).toHaveBeenCalledTimes(1);
                expect(fakeService.delete).toHaveBeenCalledWith(id);
                expect(response).toBeDefined();
                expect(response).toMatchObject(team);
            });
        });
        describe('member', () => {
            it('should add member to team', async () => {
                const userId = 'acb63589-c2b6-43d8-aa06-1bc722666b22';
                const updateTeam = {
                    ...data[0],
                    membersIds: [
                        '08b8b93a-9aa7-4fc1-8201-539e2cb33830',
                        'acb63589-c2b6-43d8-aa06-1bc722666bf0',
                        userId,
                    ],
                };
                jest.spyOn(fakeService, 'addUser').mockImplementation(() =>
                    Promise.resolve(updateTeam),
                );

                const response = await resolver.addMember(
                    updateTeam.id,
                    userId,
                );

                expect(fakeService.addUser).toHaveBeenCalledTimes(1);
                expect(fakeService.addUser).toHaveBeenCalledWith(
                    updateTeam.id,
                    { userId, userType: 'member' },
                );
                expect(response).toBeDefined();
            });
        });
    });

    describe('query', () => {
        describe('findOne', () => {
            it('Should return a team', async () => {
                const id = 1;
                const team = data.find(team => team.id === id);
                jest.spyOn(fakeService, 'findOne').mockImplementation(() =>
                    Promise.resolve(team),
                );
                const response = await resolver.findOne(id);

                expect(fakeService.findOne).toHaveBeenCalledTimes(1);
                expect(fakeService.findOne).toHaveBeenCalledWith(id);
                expect(response).toBeDefined();
                expect(response).toMatchObject(team);
            });
        });

        describe('findAll', () => {
            it('should return all teams', async () => {
                jest.spyOn(fakeService, 'findAll').mockImplementation(() =>
                    Promise.resolve(data),
                );
                const response = await resolver.findAll();

                expect(fakeService.findAll).toHaveBeenCalledTimes(1);
                expect(response).toBeDefined();
                expect(response.length).toEqual(5);
            });
        });

        describe('search', () => {
            it('should search teams', async () => {
                jest.spyOn(fakeService, 'search').mockImplementation(() =>
                    Promise.resolve([]),
                );
                const response = await resolver.search({});

                expect(fakeService.search).toHaveBeenCalledTimes(1);
                expect(fakeService.search).toHaveBeenCalledWith({});
                expect(response).toBeDefined();
            });
            it('should search by ids', async () => {
                jest.spyOn(fakeService, 'search').mockImplementation(() =>
                    Promise.resolve([]),
                );
                const ids = [1, 2];
                const response = await resolver.search({ ids });

                expect(fakeService.search).toHaveBeenCalledTimes(1);
                expect(fakeService.search).toHaveBeenCalledWith({ ids });
                expect(response).toBeDefined();
            });
            it('should search by page and by limit', async () => {
                jest.spyOn(fakeService, 'search').mockImplementation(() =>
                    Promise.resolve([]),
                );
                const pagination = { limit: 2, page: 2 };
                const response = await resolver.search(pagination);

                expect(fakeService.search).toHaveBeenCalledTimes(1);
                expect(fakeService.search).toHaveBeenCalledWith(pagination);
                expect(response).toBeDefined();
            });
            it('should search by members', async () => {
                jest.spyOn(fakeService, 'search').mockImplementation(() =>
                    Promise.resolve([]),
                );
                const membersIds = ['member1'];
                const response = await resolver.search({ membersIds });

                expect(fakeService.search).toHaveBeenCalledTimes(1);
                expect(fakeService.search).toHaveBeenCalledWith({ membersIds });
                expect(response).toBeDefined();
            });
            it('should search by managers', async () => {
                jest.spyOn(fakeService, 'search').mockImplementation(() =>
                    Promise.resolve([]),
                );
                const managersIds = ['manager1'];
                const response = await resolver.search({ managersIds });

                expect(fakeService.search).toHaveBeenCalledTimes(1);
                expect(fakeService.search).toHaveBeenCalledWith({
                    managersIds,
                });
                expect(response).toBeDefined();
            });
            it('should search by owner', async () => {
                jest.spyOn(fakeService, 'search').mockImplementation(() =>
                    Promise.resolve([]),
                );
                const ownerId = 'owner1';
                const response = await resolver.search({ ownerId });

                expect(fakeService.search).toHaveBeenCalledTimes(1);
                expect(fakeService.search).toHaveBeenCalledWith({ ownerId });
                expect(response).toBeDefined();
            });
            it('should add order in search', async () => {
                jest.spyOn(fakeService, 'search').mockImplementation(() =>
                    Promise.resolve([]),
                );
                const order = { orderBy: 'id', sortOrder: Order.DESC };
                const response = await resolver.search(order);

                expect(fakeService.search).toHaveBeenCalledTimes(1);
                expect(fakeService.search).toHaveBeenCalledWith(order);
                expect(response).toBeDefined();
            });
        });
    });
});
