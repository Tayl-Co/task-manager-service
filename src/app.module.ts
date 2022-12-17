import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamModule } from '@team/team.module';
import { Team } from '@team/entity/team.entity';
import { Project } from '@project/entity/project.entity';
import { ProjectModule } from '@project/project.module';
import { TodoModule } from '@todo/todo.module';
import { ToDo } from '@todo/entity/todo.entity';
import { Reference } from '@reference/entity/reference.entity';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            playground: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('TYPEORM_HOST'),
                port: config.get<number>('TYPEORM_PORT'),
                username: config.get<string>('TYPEORM_USERNAME'),
                password: config.get<string>('TYPEORM_PASSWORD'),
                database: config.get<string>('TYPEORM_DATABASE'),
                entities: [Team, Project, ToDo, Reference],
                synchronize: true,
            }),
        }),
        TeamModule,
        ProjectModule,
        TodoModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
