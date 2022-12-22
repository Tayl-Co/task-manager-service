import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import request from 'supertest';

const ENDPOINT = '/api/manager/task/';

describe(ENDPOINT, () => {
    let app: INestApplication;
    let httpServer: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        httpServer = app.getHttpServer();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GRAPHQL MUTATION', () => {
        describe('Create', () => {
            it('createTeam - Should save a team and return created Team', () => {
                return request(httpServer)
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

            it('createProject - Should save a Project and return created Project', () => {
                return request(httpServer)
                    .post(ENDPOINT)
                    .send({
                        query: `
                        mutation{
                          createProject(projectInput:{
                            name:"Project 1", 
                            description:"First Project", 
                            active: true, 
                            teamId: 1
                            })
                            {
                                id
                                name
                                description
                                active
                                team {
                                  id
                                  name
                                  ownerId
                                  managersIds
                                  membersIds
                                }
                                issues{
                                  id
                                }
                            }
                        }          
                        `,
                    })
                    .expect(200)
                    .expect({
                        data: {
                            createProject: {
                                id: '1',
                                name: 'Project 1',
                                description: 'First Project',
                                active: true,
                                team: {
                                    id: '1',
                                    name: 'Team 1',
                                    managersIds: [
                                        'f522b8f6-3cf8-46cc-982f-b7017dc2c22c',
                                    ],
                                    membersIds: [
                                        '97e321ff-1a8b-4890-9cf2-2b05a5127267',
                                        '94e2b8ec-fdf3-4bb5-a6cc-cac47775b782',
                                    ],
                                    ownerId:
                                        '93a8a626-9938-40b5-9072-273cfc061c10',
                                },
                                issues: null,
                            },
                        },
                    });
            });

            it('createToDo - Should save a ToDo and return created ToDo', () => {
                return request(httpServer)
                    .post(ENDPOINT)
                    .send({
                        query: `
                    
                     mutation{
                        createToDo( 
                            todoInput:{
                                title:"ToDo 1", 
                                description:"First ToDo", 
                                dueDate:"2022-12-27T03:00:00.000Z",
                                projectId: 1,
                                type:0
                            }
                        ){
                              title
                              description
                              pinned
                              status
                              assigneesIds
                              authorId
                              dueDate
                              priority
                              type
                              lastUpdateDate
                              estimatedDueDate
                              parentId
                              labels{
                                name
                                color
                              }
                              project{
                                id
                                name
                                description
                                active
                                issues{
                                  title
                                }
                                team{
                                  id
                                  name
                                  managersIds
                                  membersIds
                                  ownerId
                                }
                              }
                              activities{
                                id
                                authorId
                                date
                                newValue
                                type
                              }
                        }
                    }
                    `,
                    })
                    .expect(200)
                    .expect({
                        data: {
                            createToDo: {
                                title: 'ToDo 1',
                                description: 'First ToDo',
                                pinned: false,
                                status: 0,
                                assigneesIds: [],
                                authorId: 'username',
                                dueDate: '2022-12-27T03:00:00.000Z',
                                priority: 3,
                                type: 0,
                                lastUpdateDate: null,
                                estimatedDueDate: null,
                                parentId: '',
                                labels: null,
                                project: {
                                    id: '1',
                                    name: 'Project 1',
                                    description: 'First Project',
                                    active: true,
                                    team: {
                                        id: '1',
                                        name: 'Team 1',
                                        managersIds: [
                                            'f522b8f6-3cf8-46cc-982f-b7017dc2c22c',
                                        ],
                                        membersIds: [
                                            '97e321ff-1a8b-4890-9cf2-2b05a5127267',
                                            '94e2b8ec-fdf3-4bb5-a6cc-cac47775b782',
                                        ],
                                        ownerId:
                                            '93a8a626-9938-40b5-9072-273cfc061c10',
                                    },
                                    issues: null,
                                },
                                activities: null,
                            },
                        },
                    });
            });

            it('createReference - Should save a Reference and return created Reference', () => {
                return request(httpServer)
                    .post(ENDPOINT)
                    .send({
                        query: `
                        mutation{
                           createReference(
                                referenceInput:{
                                    type:"Type 1", 
                                    key: "Key 1", 
                                    url:"https://github.com/rodrigolimoes",
                                    todoId: 1
                                    }
                                ){
                                    id
                                    type
                                    key
                                    url
                                    todo {
                                      id
                                      title
                                    }
                           }
                        }
                    `,
                    })
                    .expect(200)
                    .expect({
                        data: {
                            createReference: {
                                id: '1',
                                type: 'Type 1',
                                key: 'Key 1',
                                url: 'https://github.com/rodrigolimoes',
                                todo: {
                                    id: '1',
                                    title: 'ToDo 1',
                                },
                            },
                        },
                    });
            });

            it('createLabel - Should save a Label and return created Label', () => {
                return request(httpServer)
                    .post(ENDPOINT)
                    .send({
                        query: `
                        mutation{
                            createLabel(
                                labelInput:{
                                    name:"Label 1", 
                                    color: "#FBCA04"
                                    })
                                {
                                    id
                                    name
                                    color
                                }
                        }
                    `,
                    })
                    .expect(200)
                    .expect({
                        data: {
                            createLabel: {
                                id: '1',
                                name: 'Label 1',
                                color: '#FBCA04',
                            },
                        },
                    });
            });
        });
    });
});
