import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamResolver } from './team.resolver';
import { TeamEntity } from './entity/team.entity';
import { TeamService } from './team.service';
import { TeamRepository } from './repository/team.repository';

@Module({
    imports: [TypeOrmModule.forFeature([TeamEntity])],
    providers: [TeamResolver, TeamService, TeamRepository],
    exports: [TypeOrmModule],
})
export class TeamModule {}
