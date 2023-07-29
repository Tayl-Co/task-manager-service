import { Test, TestingModule } from '@nestjs/testing';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from '@project/project.service';
import { default as projects } from '../../test/data/project.json';

describe('ProjectResolver', () => {
    let resolver: ProjectResolver;
    const service = {
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        disable: jest.fn(),
        findOne: jest.fn(),
        search: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectResolver,
                { provide: ProjectService, useValue: service },
            ],
        }).compile();

        resolver = module.get<ProjectResolver>(ProjectResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('create', () => {
        it('should create a project', async () => {
            const newProject = {
                name: 'Project',
                description: '',
                active: true,
                teamId: 1,
            };
            jest.spyOn(service, 'create').mockResolvedValue(
                Promise.resolve({ id: 2, ...newProject }),
            );

            const response = await resolver.create(newProject);

            expect(service.create).toHaveBeenCalledTimes(1);
            expect(service.create).toHaveBeenCalledWith(newProject);
            expect(response).toBeDefined();
            expect(response).toMatchObject({ id: 2, ...newProject });
        });
    });

    describe('delete', () => {
        it('should delete a project', async () => {
            const id = 1;
            jest.spyOn(service, 'delete').mockImplementation((id: number) =>
                projects.find(project => project.id === id),
            );

            const response = await resolver.delete(id);

            expect(service.delete).toHaveBeenCalledTimes(1);
            expect(service.delete).toHaveBeenCalledWith(id);
            expect(response).toBeDefined();
            expect(response).toMatchObject(projects[0]);
        });
    });
    describe('findOne', () => {
        it('should return a project', async () => {
            const id = 1;
            jest.spyOn(service, 'findOne').mockImplementation((id: number) =>
                projects.find(project => project.id === id),
            );

            const response = await resolver.findOne(id);

            expect(service.findOne).toHaveBeenCalledTimes(1);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(response).toBeDefined();
            expect(response).toMatchObject(projects[0]);
        });
    });
    describe('disable', () => {
        it('should deactivate project', async () => {
            const id = 1;
            jest.spyOn(service, 'disable').mockImplementation((id: number) =>
                projects.find(project => project.id === id),
            );

            const response = await resolver.disable(id);

            expect(service.disable).toHaveBeenCalledTimes(1);
            expect(service.disable).toHaveBeenCalledWith(id);
            expect(response).toBeDefined();
            expect(response).toMatchObject(projects[0]);
        });
    });
    describe('search', () => {
        it('should search projects', async () => {
            jest.spyOn(service, 'search').mockResolvedValue(
                Promise.resolve([]),
            );
            const searchInput = {
                name: 'project',
                limit: 10,
                page: 2,
            };

            const response = await resolver.search(searchInput);

            expect(service.search).toHaveBeenCalledTimes(1);
            expect(service.search).toHaveBeenCalledWith(searchInput);
            expect(response).toBeDefined();
        });
    });
    describe('update', () => {
        it('should update a project', async () => {
            const updatedProject = {
                ...projects[0],
                name: 'updated project',
                teamId: 1,
            };
            jest.spyOn(service, 'update').mockResolvedValue(
                Promise.resolve(updatedProject),
            );

            const response = await resolver.update(
                updatedProject.id,
                updatedProject,
            );

            expect(service.update).toHaveBeenCalledTimes(1);
            expect(service.update).toHaveBeenCalledWith(
                updatedProject.id,
                updatedProject,
            );
            expect(response).toBeDefined();
        });
    });
});
