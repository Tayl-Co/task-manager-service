import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '@team/entity/team.entity';
import { TeamDto } from '@team/dtos/team.dto';
import { SearchFilterDto } from '@team/dtos/searchFilterDto.dto';
import {
    Repository,
    Like,
    ArrayContains,
    In,
    FindOptionsOrderValue,
} from 'typeorm';

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

    async update(
        id: number,
        { name, ownerId, membersIds, managersIds }: TeamDto,
    ) {
        const team = await this.teamEntity.findOneBy({ id });
        team.name = name;
        team.ownerId = ownerId;
        team.membersIds = membersIds;
        team.managersIds = managersIds;

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
