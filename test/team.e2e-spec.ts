import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';

const createTeamMutation = `
                            mutation{
                                createTeam(teamInput: {
                                    name:"Team 1", 
                                    managersIds:["f522b8f6-3cf8-46cc-982f-b7017dc2c22c"], 
                                    membersIds: ["97e321ff-1a8b-4890-9cf2-2b05a5127267", "94e2b8ec-fdf3-4bb5-a6cc-cac47775b782"], 
                                    ownerId:"93a8a626-9938-40b5-9072-273cfc061c10"
                                    }){
                                        id
                                        name
                                        managersIds
                                        membersIds
                                        ownerId
                                        projects {
                                          id
                                        }
                                }
                            }
                        `;

const findOneTeamQuery = `
    query {
        findOneTeam(id: 1){
            id
            name
        }
    }
`;

describe('Team (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('Should create a new Team', async () => {
        const {
            body: {
                data: {
                    createTeam: { ...team },
                },
            },
        } = await request(app.getHttpServer())
            .post('/api/manager/task/')
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);

        expect(team).toMatchObject({
            id: '1',
            name: 'Team 1',
            managersIds: ['f522b8f6-3cf8-46cc-982f-b7017dc2c22c'],
            membersIds: [
                '97e321ff-1a8b-4890-9cf2-2b05a5127267',
                '94e2b8ec-fdf3-4bb5-a6cc-cac47775b782',
            ],
            ownerId: '93a8a626-9938-40b5-9072-273cfc061c10',
            projects: null,
        });

        return request(app.getHttpServer())
            .post('/api/manager/task/')
            .send({ query: findOneTeamQuery })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    findOneTeam: {
                        id: '1',
                        name: 'Team 1',
                    },
                },
            });
    });
});
