import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamResolver } from '@team/team.resolver';
import { Team } from '@team/entity/team.entity';
import { TeamService } from '@team/team.service';

@Module({
    imports: [TypeOrmModule.forFeature([Team])],
    providers: [TeamResolver, TeamService],
    exports: [TypeOrmModule, TeamService],
})
export class TeamModule {}
