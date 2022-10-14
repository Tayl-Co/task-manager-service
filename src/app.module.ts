import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamModule } from './team/team.module';
import { Team } from './team/entity/team.entity';

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
                entities: [Team],
                synchronize: true,
            }),
        }),
        TeamModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
