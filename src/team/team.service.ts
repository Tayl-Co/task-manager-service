import { Injectable } from '@nestjs/common';
import { TeamRepository } from './repository/team.repository';
import { Team } from './interface/team.interface';

@Injectable()
export class TeamService {
    constructor(private teamRepository: TeamRepository) {}

    async create(team: Team): Promise<Team> {
        return await this.teamRepository.create(team);
    }
}
