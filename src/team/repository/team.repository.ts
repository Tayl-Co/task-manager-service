import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../entity/team.entity';
import { TeamDto } from '../dtos/team.dto';

@Injectable()
export class TeamRepository {
    constructor(
        @InjectRepository(Team)
        private teamEntity: Repository<Team>,
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

    async delete(id: number): Promise<Team> {
        const team = await this.teamEntity.findOneBy({ id });

        return await this.teamEntity.remove(team);
    }

    async findOne(id: number): Promise<Team> {
        return await this.teamEntity.findOne({ where: { id: id } });
    }
}
