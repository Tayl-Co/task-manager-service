import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { ReferenceModule } from '@reference/reference.module';
import { ProjectModule } from '@project/project.module';
import { TodoModule } from '@todo/todo.module';
import { LabelModule } from '@label/label.module';
import { TeamModule } from '@team/team.module';
import { ActivityModule } from '@activity/activity.module';

// Entities
import { Project } from '@project/entity/project.entity';
import { Reference } from '@reference/entity/reference.entity';
import { Label } from '@label/entity/label.entity';
import { Team } from '@team/entity/team.entity';
import { ToDo } from '@todo/entity/todo.entity';
import { Activity } from '@activity/entity/activity.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            path: '/api/manager/task/',
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            playground: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const isTest = config.get<string>('NODE_ENV') === 'test';
                return {
                    type: 'postgres',
                    dropSchema: isTest,
                    host: config.get<string>('TYPEORM_HOST'),
                    port: config.get<number>('TYPEORM_PORT'),
                    username: config.get<string>('TYPEORM_USERNAME'),
                    password: config.get<string>('TYPEORM_PASSWORD'),
                    database: isTest
                        ? config.get<string>('TYPEORM_TEST_DATABASE')
                        : config.get<string>('TYPEORM_DATABASE'),
                    entities: [Team, Project, ToDo, Reference, Label, Activity],
                    synchronize: true,
                };
            },
        }),
        TeamModule,
        ProjectModule,
        TodoModule,
        ReferenceModule,
        LabelModule,
        ActivityModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
