import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { Equal, ILike, In, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@project/entity/project.entity';
import { TeamService } from '@team/team.service';
import { default as data } from '../../test/data/team.json';
import { default as projects } from '../../test/data/project.json';
import { Order } from '@src/common/enums/order.enum';

describe('ProjectService', () => {
    let service: ProjectService;
    const repositoryToken = getRepositoryToken(Project);
    let repository: Repository<Project>;
    const teamService = { findOne: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectService,
                { provide: repositoryToken, useClass: Repository },
                { provide: TeamService, useValue: teamService },
            ],
        }).compile();

        service = module.get<ProjectService>(ProjectService);
        repository = module.get<Repository<Project>>(repositoryToken);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const newProject = {
            name: 'New Project',
            description: '',
            teamId: 1,
        };
        const team = data.find(team => team.id === newProject.teamId);
        const createdProject = {
            ...newProject,
            id: 1,
            team,
            active: true,
            issues: [],
        };
        it('should create a project', async () => {
            jest.spyOn(teamService, 'findOne').mockImplementation(() =>
                Promise.resolve(team),
            );
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(repository, 'create').mockImplementation(
                () => createdProject,
            );
            jest.spyOn(repository, 'save').mockImplementation(() =>
                Promise.resolve(createdProject),
            );

            const response = await service.create(newProject);

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { name: Equal(newProject.name) },
            });
            expect(teamService.findOne).toHaveBeenCalledTimes(1);
            expect(teamService.findOne).toHaveBeenCalledWith(newProject.teamId);
            expect(repository.create).toHaveBeenCalledTimes(1);
            expect(repository.create).toHaveBeenCalledWith({
                ...newProject,
                team,
            });
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith(createdProject);
            expect(response).toBeDefined();
            expect(response).toMatchObject(createdProject);
        });
        it('should return an error message if project already exists', async () => {
            jest.spyOn(teamService, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(createdProject),
            );
            jest.spyOn(repository, 'create').mockImplementation(() => null);
            jest.spyOn(repository, 'save').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.create(newProject)).rejects.toThrow(
                `The ${newProject.name} Project already exists`,
            );

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { name: Equal(newProject.name) },
            });
            expect(teamService.findOne).not.toHaveBeenCalled();
            expect(repository.create).not.toHaveBeenCalled();
            expect(repository.save).not.toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        const id = 1;
        it('should return a project', async () => {
            const project = projects.find(project => project.id === id);
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(project),
            );

            const response = await service.findOne(id);

            expect(response).toBeDefined();
            expect(response).toMatchObject(project);
        });
        it('should return an error message if project is not found', async () => {
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.findOne(id)).rejects.toThrow(
                `Project ${id} not found`,
            );

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                relations: { team: true, issues: true },
                where: { id },
            });
        });
    });

    describe('delete', () => {
        const id = 1;
        it('should return a deleted project', async () => {
            const project = projects.find(project => project.id === id);
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(project),
            );
            jest.spyOn(repository, 'delete').mockImplementation(() =>
                Promise.resolve({ raw: [], affected: 1 }),
            );

            const response = await service.delete(id);

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                relations: { team: true, issues: true },
                where: { id },
            });
            expect(repository.delete).toHaveBeenCalledTimes(1);
            expect(repository.delete).toHaveBeenCalledWith(id);
            expect(response).toBeDefined();
            expect(response).toMatchObject(project);
        });
        it('should return an error message if product is not found', async () => {
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(repository, 'delete').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.delete(id)).rejects.toThrow(
                `Project ${id} not found`,
            );

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                relations: { team: true, issues: true },
                where: { id },
            });
            expect(repository.delete).not.toHaveBeenCalled();
        });
    });

    describe('update', () => {
        const id = 1;
        it('should return an updated project', async () => {
            const project = projects.find(project => project.id === id);
            const updateProject = { name: 'updated Project name', ...project };
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(project),
            );
            jest.spyOn(repository, 'save').mockImplementation(() =>
                Promise.resolve(updateProject),
            );
            jest.spyOn(teamService, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );

            const response = await service.update(id, {
                ...updateProject,
                teamId: updateProject.team.id,
            });

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                relations: { team: true, issues: true },
                where: { id },
            });
            expect(teamService.findOne).not.toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith(updateProject);
            expect(response).toBeDefined();
            expect(response).toMatchObject(updateProject);
        });
        it('should move project to another team', async () => {
            const teamId = 2;
            const project = projects.find(project => project.id === id);
            const team = data.find(team => team.id === teamId);
            const updateProject = {
                name: 'updated Project name',
                ...project,
                team,
            };
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(project),
            );
            jest.spyOn(repository, 'save').mockImplementation(() =>
                Promise.resolve(updateProject),
            );
            jest.spyOn(teamService, 'findOne').mockImplementation(
                (id: number) =>
                    Promise.resolve(data.find(team => team.id === id)),
            );

            const response = await service.update(id, {
                ...updateProject,
                teamId,
            });

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                relations: { team: true, issues: true },
                where: { id },
            });
            expect(teamService.findOne).toHaveBeenCalledTimes(1);
            expect(teamService.findOne).toHaveBeenCalledWith(teamId);
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith(updateProject);
            expect(response).toBeDefined();
            expect(response).toMatchObject(updateProject);
        });
        it('should return an error message if project is not found', async () => {
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(repository, 'save').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(teamService, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(
                service.update(id, {
                    name: 'Project 1',
                    description: '',
                    teamId: 1,
                    active: true,
                }),
            ).rejects.toThrow(`Project ${id} not found`);

            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({
                relations: { team: true, issues: true },
                where: { id },
            });
            expect(teamService.findOne).not.toHaveBeenCalled();
            expect(repository.save).not.toHaveBeenCalled();
        });
    });

    describe('search', () => {
        it('should search project by ids', async () => {
            const ids = [1, 2, 3];
            jest.spyOn(repository, 'find').mockResolvedValue(
                Promise.resolve([]),
            );
            await service.search({ ids });

            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                relations: { team: true },
                where: { id: In(ids) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
        });
        it('should search project by name', async () => {
            const name = 'Project 1';
            jest.spyOn(repository, 'find').mockResolvedValue(
                Promise.resolve([]),
            );
            await service.search({ name });

            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                relations: { team: true },
                where: { name: ILike(`%${name}%`) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
        });
        it('should search project by description', async () => {
            const description = 'Project 1';
            jest.spyOn(repository, 'find').mockResolvedValue(
                Promise.resolve([]),
            );
            await service.search({ description });

            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                relations: { team: true },
                where: { description: ILike(`%${description}%`) },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
        });
        it('should search active projects', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue(
                Promise.resolve([]),
            );
            const active = true;
            await service.search({ active });

            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                relations: { team: true },
                where: { active },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
        });
        it('should search inactive projects', async () => {
            const active = false;
            jest.spyOn(repository, 'find').mockResolvedValue(
                Promise.resolve([]),
            );
            await service.search({ active });

            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                relations: { team: true },
                where: { active },
                order: { name: Order.ASC },
                take: undefined,
                skip: 0,
            });
        });
        it('should return projects in descending order', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue(
                Promise.resolve([]),
            );

            await service.search({ sortOrder: Order.DESC });

            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                relations: { team: true },
                where: {},
                order: { name: Order.DESC },
                take: undefined,
                skip: 0,
            });
        });
        it('should sort project search by id', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue(
                Promise.resolve([]),
            );
            const orderBy = 'id';
            await service.search({ orderBy });

            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                relations: { team: true },
                where: {},
                order: { [orderBy]: Order.ASC },
                take: undefined,
                skip: 0,
            });
        });
        it('should return projects based on page and limit quantity', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue(
                Promise.resolve([]),
            );
            const pagination = { limit: 10, page: 2 };

            await service.search(pagination);

            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({
                relations: { team: true },
                where: {},
                order: { name: Order.ASC },
                take: pagination.limit,
                skip: pagination.limit * pagination.page,
            });
        });
    });

    describe('disable', () => {
        const id = 1;
        it('should deactivate project', async () => {
            const project = projects.find(project => project.id === id);
            const inactiveProject = { ...project, active: false };
            jest.spyOn(service, 'findOne').mockResolvedValue(
                Promise.resolve(project),
            );
            jest.spyOn(repository, 'save').mockResolvedValue(
                Promise.resolve(inactiveProject),
            );

            const response = await service.disable(id);

            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith(inactiveProject);
            expect(response).toBeDefined();
            expect(response).toMatchObject(inactiveProject);
        });
        it('should return an error message if project is not found', async () => {
            jest.spyOn(repository, 'findOne').mockImplementation(() =>
                Promise.resolve(null),
            );
            jest.spyOn(repository, 'save').mockImplementation(() =>
                Promise.resolve(null),
            );

            await expect(service.disable(id)).rejects.toThrow(
                `Project ${id} not found`,
            );

            expect(repository.save).not.toHaveBeenCalled();
        });
    });
});
