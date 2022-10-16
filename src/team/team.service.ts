import { Injectable, NotFoundException } from '@nestjs/common';
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
        const team = await this.teamRepository.findOne(id);

        if (!team) throw new NotFoundException(`Team ${id} not found`);

        return await this.teamRepository.remove(team);
    }

    async update(id: number, team: TeamDto): Promise<Team> {
        const updateTeam = await this.teamRepository.findOne(id);

        if (!updateTeam) throw new NotFoundException(`Team ${id} not found`);

        return await this.teamRepository.update(id, team);
    }

    async findAll(): Promise<Array<Team>> {
        return await this.teamRepository.findAll();
    }

    async findOne(id: number): Promise<Team> {
        const team = await this.teamRepository.findOne(id);

        if (!team) throw new NotFoundException(`Team ${id} not found`);

        return team;
    }

    async search(search: SearchFilterDto): Promise<Array<Team>> {
        return await this.teamRepository.search(search);
    }
}
