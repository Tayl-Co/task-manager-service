import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import request from 'supertest';
import { ActivityEnum } from '@src/common/enums/activity.enum';
import { IssueStatusEnum } from '@src/common/enums/issueStatus.enum';
import { PriorityEnum } from '@src/common/enums/priority.enum';
import { TodoTypeEnum } from '@src/common/enums/todoType.enum';

const ENDPOINT = '/api/manager/task/';

describe(ENDPOINT, () => {
    let app: INestApplication;
    let httpServer: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        httpServer = app.getHttpServer();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GRAPHQL MUTATION', () => {
        describe('Create', () => {
            describe('Team', () => {
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
                        .expect(HttpStatus.OK)
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
                                    ownerId:
                                        '93a8a626-9938-40b5-9072-273cfc061c10',
                                    projects: null,
                                },
                            },
                        });
                });

                it('createTeam - Should return an error message if the team already exists', () => {
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
                        .expect(HttpStatus.OK)
                        .expect({
                            errors: [
                                {
                                    message: 'The Team 1 Team already exists',
                                    extensions: {
                                        code: '409',
                                        response: {
                                            statusCode: HttpStatus.CONFLICT,
                                            message:
                                                'The Team 1 Team already exists',
                                            error: 'Conflict',
                                        },
                                    },
                                },
                            ],
                            data: null,
                        });
                });

                it('createTeam - Should return a bad Request error if inputs are wrong', () => {
                    return request(httpServer)
                        .post(ENDPOINT)
                        .send({
                            query: `
                                mutation{
                                createTeam(teamInput: {
                                    name:"", 
                                    managersIds: [], 
                                    membersIds: [], 
                                    ownerId:""
                                    }){
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
                                    message: 'Bad Request Exception',
                                    extensions: {
                                        code: 'BAD_USER_INPUT',
                                        response: {
                                            statusCode: HttpStatus.BAD_REQUEST,
                                            message: [
                                                'Required Name',
                                                'Required ownerId',
                                                'managersIds must contain at least 1 elements',
                                            ],
                                            error: 'Bad Request',
                                        },
                                    },
                                },
                            ],
                            data: null,
                        });
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
                              id
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
                                id: '1',
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

        describe('Update', () => {
            it('updateTeam - Should update a team and return the updated team', () => {
                return request(httpServer)
                    .post(ENDPOINT)
                    .send({
                        query: `
                    mutation{
                        updateTeam(
                            id: 1, 
                            teamInput: {
                                        name: "Updated Team", 
                                        managersIds:["f522b8f6-3cf8-46cc-982f-b7017dc2c22c"], 
                                        membersIds: ["97e321ff-1a8b-4890-9cf2-2b05a5127267"], 
                                        ownerId:"93a8a626-9938-40b5-9072-273cfc061c10"
                                        }
                            ){
                                id
                                name
                                managersIds
                                membersIds
                                ownerId
                                projects {
                                  id
                                  name
                                }
                          }
                        }
                    `,
                    })
                    .expect(200)
                    .expect({
                        data: {
                            updateTeam: {
                                id: '1',
                                name: 'Updated Team',
                                managersIds: [
                                    'f522b8f6-3cf8-46cc-982f-b7017dc2c22c',
                                ],
                                membersIds: [
                                    '97e321ff-1a8b-4890-9cf2-2b05a5127267',
                                ],
                                ownerId: '93a8a626-9938-40b5-9072-273cfc061c10',
                                projects: [
                                    {
                                        id: '1',
                                        name: 'Project 1',
                                    },
                                ],
                            },
                        },
                    });
            });

            it('updateProject - Should update a project and return the updated project', () => {
                return request(httpServer)
                    .post(ENDPOINT)
                    .send({
                        query: `
                        mutation{
                            updateProject(
                                id: 1, 
                                projectInput: {
                                    name:"Updated Name", 
                                    description:"Updated description",
                                    active: true,
                                    teamId: 1
                                }){
                                    id
                                    name
                                    description
                                  active
                                    issues{
                                      id
                                      title
                                    }
                                  team{
                                      id
                                      name
                                    }
                          }
                        }
                    `,
                    })
                    .expect(200)
                    .expect({
                        data: {
                            updateProject: {
                                id: '1',
                                name: 'Updated Name',
                                description: 'Updated description',
                                active: true,
                                issues: [{ id: '1', title: 'ToDo 1' }],
                                team: {
                                    id: '1',
                                    name: 'Updated Team',
                                },
                            },
                        },
                    });
            });

            it('updateToDo - Should update a ToDo and return the updated ToDo', () => {
                return request(httpServer)
                    .post(ENDPOINT)
                    .send({
                        query: `
                        mutation{
                            updateToDo(
                                id: 1,
                                todoInput:{
                                        title:"Updated Title",
                                        description:"update Description",
                                        parentId:"",
                                        dueDate:"2022-12-28T03:00:00.000Z",
                                        type:${TodoTypeEnum.USER_STORY},
                                        priority:${PriorityEnum.MEDIUM},
                                        status:${IssueStatusEnum.REJECTED},
                                        pinned:true,
                                        estimatedDueDate:"2022-12-27T03:00:00.000Z",
                                        assigneesIds:[]
                              }){
                                      id
                                      title
                                      description
                                      pinned
                                      status
                                      assigneesIds
                                      authorId
                                      dueDate
                                      priority
                                      type
                                      estimatedDueDate
                                      parentId
                                      labels{
                                        name
                                        color
                                      }
                                        activities{
                                        authorId
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
                            updateToDo: {
                                id: '1',
                                title: 'Updated Title',
                                description: 'update Description',
                                pinned: true,
                                assigneesIds: [],
                                authorId: 'username',
                                dueDate: '2022-12-28T03:00:00.000Z',
                                estimatedDueDate: '2022-12-27T03:00:00.000Z',
                                type: TodoTypeEnum.USER_STORY,
                                priority: PriorityEnum.MEDIUM,
                                status: IssueStatusEnum.REJECTED,
                                parentId: '',
                                labels: [],
                                activities: [
                                    {
                                        authorId: 'username',
                                        newValue: 'Updated Title',
                                        type: ActivityEnum.TITLE_CHANGED,
                                    },
                                    {
                                        authorId: 'username',
                                        newValue: '2022-12-28T03:00:00.000Z',
                                        type: ActivityEnum.DEADLINE_CHANGED,
                                    },
                                    {
                                        authorId: 'username',
                                        newValue: `${IssueStatusEnum.REJECTED}`,
                                        type: ActivityEnum.STATUS_CHANGED,
                                    },
                                ],
                            },
                        },
                    });
            });

            it('updateReference - Should update a Reference and return the updated Reference', () => {
                return request(httpServer)
                    .post(ENDPOINT)
                    .send({
                        query: `
                         mutation{
                           updateReference(
                                id: 1,
                                referenceInput:{
                                    type:"Updated Type", 
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
                            updateReference: {
                                id: '1',
                                type: 'Updated Type',
                                key: 'Key 1',
                                url: 'https://github.com/rodrigolimoes',
                                todo: {
                                    id: '1',
                                    title: 'Updated Title',
                                },
                            },
                        },
                    });
            });

            it('updateLabel - Should update a Label and return the updated Label', () => {
                return request(httpServer)
                    .post(ENDPOINT)
                    .send({
                        query: `
                           mutation{
                           updateLabel(
                                id: 1,
                                labelInput:{
                                    name: "updated Label",
                                    color: "#00FFFF"
                                    }
                                ){
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
                            updateLabel: {
                                id: '1',
                                name: 'updated Label',
                                color: '#00FFFF',
                            },
                        },
                    });
            });
        });
    });
});
