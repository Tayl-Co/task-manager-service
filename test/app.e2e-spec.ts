import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import request from 'supertest';

const ENDPOINT = '/api/manager/task/';

describe(ENDPOINT, () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GRAPHQL MUTATION', () => {
        describe('Create', () => {
            it('createTeam - Should save a team and return created Team', () => {
                return request(app.getHttpServer())
                    .post(ENDPOINT)
                    .send({
                        query: `
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
                    `,
                    })
                    .expect(200)
                    .expect({
                        data: {
                            createTeam: {
                                id: '1',
                                name: 'Team 1',
                                managersIds: [
                                    'f522b8f6-3cf8-46cc-982f-b7017dc2c22c',
                                ],
                                membersIds: [
                                    '97e321ff-1a8b-4890-9cf2-2b05a5127267',
                                    '94e2b8ec-fdf3-4bb5-a6cc-cac47775b782',
                                ],
                                ownerId: '93a8a626-9938-40b5-9072-273cfc061c10',
                                projects: null,
                            },
                        },
                    });
            });
        });
    });
});
