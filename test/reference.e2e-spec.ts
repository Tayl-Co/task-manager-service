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
});
