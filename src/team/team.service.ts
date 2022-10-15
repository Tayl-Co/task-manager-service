import { Injectable } from '@nestjs/common';
import { TeamRepository } from '@team/repository/team.repository';
import { Team } from '@team/entity/team.entity';
import { TeamDto } from '@team/dtos/team.dto';
import { SearchFilterDto } from '@team/dtos/searchFilterDto.dto';

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

    async search(search: SearchFilterDto): Promise<Array<Team>> {
        return await this.teamRepository.search(search);
    }
}
