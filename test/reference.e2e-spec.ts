import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import request from 'supertest';
const ENDPOINT = '/api/manager/task/';

const createToDoMutation = `
    mutation {
        createToDo(todoInput:{
            title: "To Do 1",
            type: 10,
        }){
            id
            title
        }
    }
`;

const createReferenceMutation = `
     mutation {
        createReference(referenceInput:{
            type: "some type",
            key: "some key",
            url: "www.google.com",
            todoId: 1
        }){
            id
            type
            key
            url
        }
    }
`;

const findOneReferenceQuery = `
    query {
        findOneReference(id:1){
            id
            type
            key
            url
        }
    }
`;

describe('Reference (e2e)', () => {
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

    it('should create a new reference', async () => {
        const createReference = {
            id: '1',
            type: 'some type',
            url: 'www.google.com',
            key: 'some key',
        };
        // Add To-Do in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createToDoMutation })
            .expect(HttpStatus.OK);

        const {
            body: {
                data: {
                    createReference: { ...reference },
                },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createReferenceMutation })
            .expect(HttpStatus.OK);

        expect(reference).toMatchObject(createReference);

        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: findOneReferenceQuery })
            .expect(HttpStatus.OK)
            .expect({ data: { findOneReference: createReference } });
    });

    it('should return an error message if todoId is not found', async () => {
        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: createReferenceMutation })
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

    it('should delete a reference', async () => {
        // Add To-Do in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createToDoMutation })
            .expect(HttpStatus.OK);
        // Add reference in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createReferenceMutation })
            .expect(HttpStatus.OK);

        // delete reference
        const {
            body: {
                data: { deleteReference },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                mutation {
                    deleteReference(id:1){
                        id
                        type
                        key
                    }
                }
            `,
            })
            .expect(HttpStatus.OK);

        expect(deleteReference).toMatchObject({
            id: '1',
            type: 'some type',
            key: 'some key',
        });

        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: findOneReferenceQuery })
            .expect(HttpStatus.OK)
            .expect({
                errors: [
                    {
                        message: `Reference 1 not found`,
                        extensions: {
                            code: `${HttpStatus.NOT_FOUND}`,
                            response: {
                                statusCode: HttpStatus.NOT_FOUND,
                                message: `Reference 1 not found`,
                                error: 'Not Found',
                            },
                        },
                    },
                ],
                data: null,
            });
    });

    it('should find a reference', async () => {
        // Add To-Do in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createToDoMutation })
            .expect(HttpStatus.OK);
        // Add reference in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createReferenceMutation })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: findOneReferenceQuery })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    findOneReference: {
                        id: '1',
                        key: 'some key',
                        type: 'some type',
                        url: 'www.google.com',
                    },
                },
            });
    });

    it('should return an error if reference is not found', async () => {
        return request(httpServer)
            .post(ENDPOINT)
            .send({ query: findOneReferenceQuery })
            .expect(HttpStatus.OK)
            .expect({
                errors: [
                    {
                        message: `Reference 1 not found`,
                        extensions: {
                            code: `${HttpStatus.NOT_FOUND}`,
                            response: {
                                statusCode: HttpStatus.NOT_FOUND,
                                message: `Reference 1 not found`,
                                error: 'Not Found',
                            },
                        },
                    },
                ],
                data: null,
            });
    });

    it('should search references', async () => {
        // Add To-Do in database
        await request(httpServer)
            .post(ENDPOINT)
            .send({ query: createToDoMutation })
            .expect(HttpStatus.OK);
        // Add references in database
        for (let i = 0; i < 2; i++) {
            const itemNumber = i + 1;
            await request(httpServer)
                .post(ENDPOINT)
                .send({
                    query: `
                mutation {
                createReference(referenceInput:{
                    type: "type ${itemNumber}",
                        key: "key ${itemNumber}",
                        url: "www.google.com",
                        todoId: 1
                }){
                    id
                    type
                    key
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
                    searchReference(searchInput:{
                        type: "type 2",
                        page:0,
                        limit: 2
                    }){
                        id
                        type
                    }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    searchReference: [{ id: '2', type: 'type 2' }],
                },
            });
    });
});
