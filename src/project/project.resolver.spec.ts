import { Test, TestingModule } from '@nestjs/testing';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from '@project/project.service';

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
});
