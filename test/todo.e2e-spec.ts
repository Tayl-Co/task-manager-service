import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { ENDPOINT } from './common/constant/endpoint.constant';
import { TodoTypeEnum } from '@src/common/enums/todoType.enum';
import request from 'supertest';

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

const createToDoMutation = `
      mutation {
        createToDo(todoInput:{
            title: "To-Do 1",
            type: ${TodoTypeEnum.ISSUE},
            projectId: 1
        }){
            id
            title
        }
    }
`;

const findOneToDoQuery = `
    query {
        findOneToDo(id:1){
            id
            title
            type
        }
    }
`;

describe('To-Do (e2e)', () => {
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

    it('should create a new To-Do', async () => {
        // Add Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);
        // Add project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);

        const {
            body: {
                data: { createToDo },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createToDoMutation })
            .expect(HttpStatus.OK);

        expect(createToDo).toMatchObject({ id: '1', title: 'To-Do 1' });

        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: findOneToDoQuery })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    findOneToDo: {
                        id: '1',
                        title: 'To-Do 1',
                        type: TodoTypeEnum.ISSUE,
                    },
                },
            });
    });

    it('should delete a To-Do', async () => {
        // Add Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);
        // Add project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);
        // Add To-Do in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createToDoMutation })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                mutation {
                    deleteToDo(id: 1){
                        id
                        title
                    }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({ data: { deleteToDo: { id: '1', title: 'To-Do 1' } } });
    });

    it('should find all To-Dos', async () => {
        // Add Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);
        // Add project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);
        // Add To-Do in database
        for (let i = 0; i < 2; i++) {
            await request(httpServer)
                .post(ENDPOINT)
                .send({
                    query: `
                  mutation {
                    createToDo(todoInput:{
                        title: "To-Do ${i + 1}",
                        type: ${TodoTypeEnum.ISSUE},
                        projectId: 1
                    }){
                        id
                        title
                    }
                  }
                `,
                })
                .expect(HttpStatus.OK);
        }

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                query {
                    findAllToDo{
                        id
                        title
                    }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    findAllToDo: [
                        { id: '1', title: 'To-Do 1' },
                        { id: '2', title: 'To-Do 2' },
                    ],
                },
            });
    });

    it('should find a To-Do', async () => {
        // Add Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);
        // Add project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);
        // Add To-Do in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createToDoMutation })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: findOneToDoQuery })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    findOneToDo: {
                        id: '1',
                        title: 'To-Do 1',
                        type: TodoTypeEnum.ISSUE,
                    },
                },
            });
    });

    it('should return an error message if To-Do is not found', async () => {
        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: findOneToDoQuery })
            .expect(HttpStatus.OK)
            .expect({
                errors: [
                    {
                        message: `ToDo 1 not found`,
                        extensions: {
                            code: `${HttpStatus.NOT_FOUND}`,
                            response: {
                                statusCode: HttpStatus.NOT_FOUND,
                                message: `ToDo 1 not found`,
                                error: 'Not Found',
                            },
                        },
                    },
                ],
                data: null,
            });
    });

    it('should search a To-Dos', async () => {
        // Add Team in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createTeamMutation })
            .expect(HttpStatus.OK);
        // Add project in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createProjectMutation })
            .expect(HttpStatus.OK);
        // Add To-Do in database
        for (let i = 0; i < 3; i++) {
            await request(httpServer)
                .post(ENDPOINT)
                .send({
                    query: `
                  mutation {
                    createToDo(todoInput:{
                        title: "To-Do ${i + 1}",
                        type: ${TodoTypeEnum.ISSUE},
                        projectId: 1
                    }){
                        id
                        title
                    }
                  }
                `,
                })
                .expect(HttpStatus.OK);
        }

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                query{
                    searchToDo(searchInput:{title: "To-Do 1",page:0, limit:1}){
                    id
                    title
                }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({ data: { searchToDo: [{ id: '1', title: 'To-Do 1' }] } });
    });
});
