import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamModule } from './team/team.module';
import { TeamEntity } from './team/entity/team.entity';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            playground: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env['TYPEORM_HOST'],
            port: ~~process.env['TYPEORM_PORT'],
            username: process.env['TYPEORM_USERNAME'],
            password: process.env['TYPEORM_PASSWORD'],
            database: process.env['TYPEORM_DATABASE'],
            entities: [TeamEntity],
            synchronize: false,
        }),
        TeamModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
