import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Repository,
    Like,
    ArrayContains,
    In,
    FindOptionsOrderValue,
} from 'typeorm';
import { Team } from '../entity/team.entity';
import { TeamDto } from '../dtos/team.dto';
import { SearchFilterDto } from '../dtos/searchFilterDto.dto';

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

    async search({
        ids,
        name,
        ownerId,
        membersIds,
        managersIds,
        page,
        order,
        limit,
    }: SearchFilterDto): Promise<Array<Team>> {
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        if (ownerId) where = { ...where, ownerId: ownerId };

        if (membersIds)
            where = { ...where, membersIds: ArrayContains(membersIds) };

        if (managersIds)
            where = { ...where, managersIds: ArrayContains(managersIds) };

        return this.teamEntity.find({
            where: { name: Like(`%${name}%`), ...where },
            order: { name: order as FindOptionsOrderValue },
            take: limit,
            skip: page * limit,
        });
    }
}
