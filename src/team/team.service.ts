import { Injectable } from '@nestjs/common';
import { TeamRepository } from './repository/team.repository';
import { Team } from './interface/team.interface';
import { TeamDto } from './dtos/team.dto';

@Injectable()
export class TeamService {
    constructor(private teamRepository: TeamRepository) {}

    async create(team: TeamDto): Promise<Team> {
        return await this.teamRepository.create(team);
    }

    async findOne(id: number): Promise<Team> {
        return await this.teamRepository.findOne(id);
    }
}
