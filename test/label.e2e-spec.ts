import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import request from 'supertest';

const ENDPOINT = '/api/manager/task/';

describe('Label e2e Test', () => {
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
});
