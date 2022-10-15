import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamResolver } from '@team/team.resolver';
import { Team } from '@team/entity/team.entity';
import { TeamService } from '@team/team.service';
import { TeamRepository } from '@team/repository/team.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Team])],
    providers: [TeamResolver, TeamService, TeamRepository],
    exports: [TypeOrmModule],
})
export class TeamModule {}
