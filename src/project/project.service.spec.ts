import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { Equal, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@project/entity/project.entity';
import { TeamService } from '@team/team.service';
import { default as data } from '../../test/data/team.json';
import { default as projects } from '../../test/data/project.json';

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

            expect(repository.delete).toHaveBeenCalledTimes(1);
            expect(repository.delete).toHaveBeenCalledWith(id);
            expect(response).toBeDefined();
            expect(response).toMatchObject(project);
        });
    });
});
