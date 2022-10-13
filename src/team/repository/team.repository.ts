import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '../entity/team.entity';
import { Team } from '../interface/team.interface';
import { TeamDto } from '../dtos/team.dto';

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
    }: TeamDto): Promise<Team> {
        const team = this.teamEntity.create({
            name,
            ownerId,
            membersIds,
            managersIds,
        });
        return await this.teamEntity.save(team);
    }

    async findOne(id: number): Promise<Team> {
        return await this.teamEntity.findOne({ where: { id: id } });
    }
}
