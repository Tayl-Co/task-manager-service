import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import request from 'supertest';
import { ENDPOINT } from './common/constant/endpoint.constant';

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
                                }
                            }
                        `;

const createProjectMutation = `
    mutation {
        createProject(projectInput:{
            name: "Project 1",
            description: "Project",
            teamId: 1,
        }){
            id
            name
            team {
                id
            }
        }
    }
`;

describe('Project (e2e)', () => {
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

    it('should create a new Project', async () => {
        // Adding Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    createProject: {
                        id: '1',
                        name: 'Project 1',
                        team: {
                            id: '1',
                        },
                    },
                },
            });
    });
    it('should update Project', async () => {
        // Adding Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);
        // Adding Project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                mutation {
                    updateProject(id: 1, projectInput:{
                    name: "Updated Project",
                    description: "Project",
                    teamId: 1 
                    }){
                        id
                        name
                    }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({
                data: { updateProject: { id: '1', name: 'Updated Project' } },
            });
    });
    it('should return an error message if project already exists', async () => {
        // Adding Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);

        // Adding Project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK)
            .expect({
                errors: [
                    {
                        message: `The Project 1 Project already exists`,
                        extensions: {
                            code: `${HttpStatus.CONFLICT}`,
                            response: {
                                statusCode: HttpStatus.CONFLICT,
                                message: `The Project 1 Project already exists`,
                                error: 'Conflict',
                            },
                        },
                    },
                ],
                data: null,
            });
    });
    it('should return an error message if Team is not found', async () => {
        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK)
            .expect({
                errors: [
                    {
                        message: `Team 1 not found`,
                        extensions: {
                            code: `${HttpStatus.NOT_FOUND}`,
                            response: {
                                statusCode: HttpStatus.NOT_FOUND,
                                message: `Team 1 not found`,
                                error: 'Not Found',
                            },
                        },
                    },
                ],
                data: null,
            });
    });
    it('should delete a Project', async () => {
        // Adding Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);
        // Adding Project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);

        const id = 1;
        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                mutation {
                    deleteProject(id: ${id}){
                        id
                        name
                    }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    deleteProject: {
                        id: '1',
                        name: 'Project 1',
                    },
                },
            });
    });
    it('should find a Project', async () => {
        // Adding Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);
        // Adding Project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                query {
                    findOneProject(id: 1){
                        id
                        name
                    }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    findOneProject: {
                        id: '1',
                        name: 'Project 1',
                    },
                },
            });
    });
    it('should return an error message if Project is not found', async () => {
        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                query {
                    findOneProject(id: 1){
                        id
                        name
                    }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({
                errors: [
                    {
                        message: `Project 1 not found`,
                        extensions: {
                            code: `${HttpStatus.NOT_FOUND}`,
                            response: {
                                statusCode: HttpStatus.NOT_FOUND,
                                message: `Project 1 not found`,
                                error: 'Not Found',
                            },
                        },
                    },
                ],
                data: null,
            });
    });
    it('should disable Project', async () => {
        // Adding Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);

        // Adding Project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);

        const {
            body: {
                data: {
                    disableProject: { id, active },
                },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                mutation{
                    disableProject(id: 1){
                        id
                        active
                    }
                }
            `,
            })
            .expect(HttpStatus.OK);

        expect(id).toEqual('1');
        expect(active).toEqual(false);
    });
    it('should search Projects', async () => {
        // Adding Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);

        // Adding Projects in database
        for (let i = 0; i < 2; i++) {
            await request(httpServer)
                .post(ENDPOINT)
                .send({
                    query: `mutation {
        createProject(projectInput:{
            name: "Project ${i + 1}",
            description: "Project",
            teamId: 1,
        }){
            id
            name
            team {
                id
            }
        }
    }`,
                })
                .expect(HttpStatus.OK);
        }

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                query {
                    searchProject(searchInput: {name:"Project",page: 0, limit: 2}){
                        id
                        name
                    }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    searchProject: [
                        { id: '1', name: 'Project 1' },
                        { id: '2', name: 'Project 2' },
                    ],
                },
            });
    });
});
