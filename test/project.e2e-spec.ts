import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import request from 'supertest';
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
});
