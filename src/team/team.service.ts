import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ArrayContains,
    Equal,
    FindOptionsOrderValue,
    In,
    Like,
    Repository,
} from 'typeorm';
import { Team } from '@team/entity/team.entity';
import { TeamDto } from '@team/dtos/team.dto';
import { SearchFilterDto } from '@team/dtos/searchTeam.dto';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private teamRepository: Repository<Team>,
    ) {}

    async create(teamInput: TeamDto): Promise<Team> {
        const team = await this.teamRepository.findOne({
            where: { name: Equal(teamInput.name) },
        });

        if (team)
            throw new ConflictException(`The ${team.name} Team already exists`);

        const newTeam = this.teamRepository.create(teamInput);

        return await this.teamRepository.save(newTeam);
    }

    async delete(id: number): Promise<Team> {
        const team = await this.findOne(id);

        await this.teamRepository.delete(id);

        return team;
    }

    async update(id: number, teamInput: TeamDto): Promise<Team> {
        const team = await this.findOne(id);

        Object.assign(team, teamInput);

        return await this.teamRepository.save(team);
    }

    async findAll(): Promise<Array<Team>> {
        return await this.teamRepository.find({
            relations: { projects: true },
            order: { name: 'ASC' as FindOptionsOrderValue },
        });
    }

    async findOne(id: number): Promise<Team> {
        const team = await this.teamRepository.findOne({
            relations: { projects: true },
            where: { id: id },
        });

        if (!team) throw new NotFoundException(`Team ${id} not found`);

        return team;
    }

    async search(searchInput: SearchFilterDto): Promise<Array<Team>> {
        const {
            ids,
            name,
            ownerId,
            membersIds,
            managersIds,
            page,
            order,
            limit,
        } = searchInput;
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        if (ownerId) where = { ...where, ownerId: ownerId };

        if (membersIds)
            where = { ...where, membersIds: ArrayContains(membersIds) };

        if (managersIds)
            where = { ...where, managersIds: ArrayContains(managersIds) };

        return this.teamRepository.find({
            relations: {
                projects: true,
            },
            where: { name: Like(`%${name}%`), ...where },
            order: { name: order as FindOptionsOrderValue },
            take: limit,
            skip: page * limit,
        });
    }
}
