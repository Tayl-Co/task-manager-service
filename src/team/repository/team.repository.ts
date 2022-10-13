import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '../entity/team.entity';
import { Team } from '../interface/team.interface';

@Injectable()
export class TeamRepository {
    constructor(
        @InjectRepository(TeamEntity)
        private teamEntity: Repository<TeamEntity>,
    ) {}

    async create({
        name,
        ownerId,
        membersIds,
        managersIds,
    }: Team): Promise<Team> {
        const team = this.teamEntity.create();
        team.name = name;
        team.ownerId = ownerId;
        team.membersIds = membersIds;
        team.managersIds = managersIds;

        return await this.teamEntity.save(team);
    }
}
