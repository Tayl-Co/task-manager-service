import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity } from '@activity/entity/activity.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ActivityEnum } from '@src/common/enums/activity.enum';

describe('ActivityService', () => {
    let service: ActivityService;
    let activityRepository: Repository<Activity>;
    let activityRepositoryToken = getRepositoryToken(Activity);

    const mockActivityDate = new Date();
    const mockToDo = {
        id: 1,
        title: 'ToDO 1',
        type: 1,
        description: '',
        status: 1,
        priority: 0,
        parentId: '',
        authorId: 'username',
        assigneesIds: [],
        creationDate: new Date('2022-12-18T17:22:37.344Z'),
        lastUpdateDate: new Date('2022-12-20T17:22:37.344Z'),
        estimatedDueDate: new Date('2022-12-20T17:22:37.344Z'),
        dueDate: new Date('2022-12-20T17:22:37.344Z'),
        pinned: true,
        project: null,
        references: [],
        activities: [],
        labels: [],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActivityService,
                {
                    provide: activityRepositoryToken,
                    useValue: {
                        create: jest
                            .fn()
                            .mockImplementation(
                                (entity: DeepPartial<Activity>) =>
                                    Promise.resolve({
                                        ...entity,
                                        id: 1,
                                        date: mockActivityDate,
                                    }),
                            ),
                        save: jest
                            .fn()
                            .mockImplementation(
                                (entity: DeepPartial<Activity>) =>
                                    Promise.resolve(entity),
                            ),
                    },
                },
            ],
        }).compile();

        service = module.get<ActivityService>(ActivityService);
        activityRepository = module.get<Repository<Activity>>(
            activityRepositoryToken,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Should return created activity', async () => {
        const response = await service.create({
            type: ActivityEnum.TITLE_CHANGED,
            authorId: 'username',
            newValue: 'Title 1',
            todo: mockToDo,
        });

        expect(response).toMatchObject({
            id: 1,
            type: ActivityEnum.TITLE_CHANGED,
            authorId: 'username',
            newValue: 'Title 1',
            todo: mockToDo,
            date: mockActivityDate,
        });
    });
});
