import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamResolver } from './team.resolver';
import { Team } from './entity/team.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Team])],
    providers: [TeamResolver],
    exports: [TypeOrmModule],
})
export class TeamModule {}
