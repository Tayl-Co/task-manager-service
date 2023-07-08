import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { Equal, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@project/entity/project.entity';
import { TeamService } from '@team/team.service';
import { default as data } from '../../test/data/team.json';

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
        it('should create a project', async () => {
            const team = data.find(team => team.id === newProject.teamId);
            const createdProject = {
                ...newProject,
                id: 1,
                team,
                active: true,
                issues: [],
            };
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
    });
});
