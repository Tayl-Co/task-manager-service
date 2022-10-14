import { Injectable } from '@nestjs/common';
import { TeamRepository } from './repository/team.repository';
import { Team } from './entity/team.entity';
import { TeamDto } from './dtos/team.dto';

@Injectable()
export class TeamService {
    constructor(private teamRepository: TeamRepository) {}

    async create(team: TeamDto): Promise<Team> {
        return await this.teamRepository.create(team);
    }

    async delete(id: number): Promise<Team> {
        return await this.teamRepository.delete(id);
    }

    async findOne(id: number): Promise<Team> {
        return await this.teamRepository.findOne(id);
    }
}
