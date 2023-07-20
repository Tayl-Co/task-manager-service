import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import request from 'supertest';

const ENDPOINT = '/api/manager/task/';

describe('Label e2e Test', () => {
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

    it('should create a new label', async () => {
        const {
            body: { data },
        } = await request(httpServer)
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
            .expect(HttpStatus.OK);

        expect(data).toMatchObject({
            createLabel: {
                name: 'Label 1',
                color: '#FBCA04',
            },
        });

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                query {
                    findOneLabel(id:${data.createLabel.id}){
                        name
                        color
                    }
                }
            `,
            })
            .expect(HttpStatus.OK)
            .expect({
                data: { findOneLabel: { name: 'Label 1', color: '#FBCA04' } },
            });
    });

    it('should delete a label', async () => {
        const {
            body: { data },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `mutation{
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
                        }`,
            })
            .expect(HttpStatus.OK);

        const {
            body: {
                data: {
                    deleteLabel: { id, name, color },
                },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `mutation{
                    deleteLabel(id:${data.createLabel.id}){
                        id
                        name
                        color
                    }
                }`,
            })
            .expect(HttpStatus.OK);

        expect({ id, name, color }).toMatchObject({
            id: '1',
            name: 'Label 1',
            color: '#FBCA04',
        });

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `query{
                    findOneLabel(id:${id}){
                        id
                        name
                        color
                    }
                }`,
            })
            .expect(HttpStatus.OK)
            .expect({
                errors: [
                    {
                        message: `Label ${id} not found`,
                        extensions: {
                            code: `${HttpStatus.NOT_FOUND}`,
                            response: {
                                statusCode: HttpStatus.NOT_FOUND,
                                message: `Label ${id} not found`,
                                error: 'Not Found',
                            },
                        },
                    },
                ],
                data: null,
            });
    });

    it('should find the label', async () => {
        const {
            body: {
                data: {
                    createLabel: { ...label },
                },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `mutation{
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
                        }`,
            })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `query{
                    findOneLabel(id:${label.id}){
                        id
                        name
                        color
                    }
                }`,
            })
            .expect(HttpStatus.OK)
            .expect({ data: { findOneLabel: label } });
    });

    it('should update the label', async () => {
        const {
            body: {
                data: {
                    createLabel: { ...label },
                },
            },
        } = await request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `mutation{
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
                        }`,
            })
            .expect(HttpStatus.OK);

        return request(httpServer)
            .post(ENDPOINT)
            .send({
                query: `
                    mutation{
                       updateLabel(id:${label.id},labelInput:{name:"Update Label 1", color:"#FFF"}){
                        id,
                        name,
                        color
                       } 
                    }
                `,
            })
            .expect(HttpStatus.OK)
            .expect({
                data: {
                    updateLabel: {
                        id: label.id,
                        color: '#FFF',
                        name: 'Update Label 1',
                    },
                },
            });
    });
});
