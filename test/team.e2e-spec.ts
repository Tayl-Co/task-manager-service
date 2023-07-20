import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@src/app.module';

const ENDPOINT = '/api/manager/task/';

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
    let httpServer: any;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        httpServer = app.getHttpServer();
    });

    afterEach(async () => {
        await app.close();
    });

    it('should create a new Team', async () => {
        const {
            body: {
                data: {
                    createTeam: { ...team },
                },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
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

        return request(httpServer)
            .post(ENDPOINT)
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

    it('should delete a Team', async () => {
        const {
            body: {
                data: {
                    createTeam: { ...team },
                },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);

        // delete a team
        const {
            body: {
                data: {
                    deleteTeam: { ...deletedTeam },
                },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
            mutation {
                deleteTeam(id:${team.id}){
                    id
                    name
                }
            }
        `,
            })
            .expect(HttpStatus.OK);

        expect(deletedTeam).toMatchObject({ id: '1', name: 'Team 1' });

        // checks if the team has been deleted
        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: findOneTeamQuery })
            .expect(HttpStatus.OK)
            .expect({
                errors: [
                    {
                        message: `Team ${team.id} not found`,
                        extensions: {
                            code: `${HttpStatus.NOT_FOUND}`,
                            response: {
                                statusCode: HttpStatus.NOT_FOUND,
                                message: `Team ${team.id} not found`,
                                error: 'Not Found',
                            },
                        },
                    },
                ],
                data: { findOneTeam: null },
            });
    });

    it('should find the Team', async () => {
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
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

    it('should find all Teams', async () => {
        const {
            body: {
                data: { findAllTeams },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                query {
                    findAllTeams {
                        id
                        name
                    }
                }
            `,
            })
            .expect(HttpStatus.OK);

        expect(findAllTeams).toBeDefined();
        expect(findAllTeams.length).toEqual(0);
    });
});
