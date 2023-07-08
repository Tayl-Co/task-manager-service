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
    ILike,
    In,
    Repository,
} from 'typeorm';
import { Team } from '@team/entity/team.entity';
import { TeamDto } from '@team/dtos/team.dto';
import { SearchFilterDto } from '@team/dtos/searchTeam.dto';
import { Order } from '@src/common/enums/order.enum';
import { UserInput } from '@team/dtos/userInput';

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

    async addUser(id: number, { userId, userType }: UserInput) {
        const team = await this.findOne(id);
        const key = `${userType}sIds`;
        const isIncludedMember = team[key].includes(userId);

        if (isIncludedMember)
            throw new ConflictException(`${userId} already exists`);

        Object.assign(team, { [key]: [...team[key], userId] });

        return this.teamRepository.save(team);
    }

    async removeUser(id: number, { userId, userType }: UserInput) {
        const team = await this.findOne(id);
        const key = `${userType}sIds`;
        const isIncludedMember = team[key].includes(userId);

        if (!isIncludedMember)
            throw new NotFoundException(`${userId} is not found`);

        Object.assign(team, {
            [key]: team[key].filter(user => user !== userId),
        });

        return this.teamRepository.save(team);
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

    /**
     * Find a Team
     * @param id Team identification
     * @return Team
     */
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
            sortOrder = Order.ASC,
            orderBy = 'name',
            page = 0,
            limit,
        } = searchInput;
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        if (name) where = { ...where, name: ILike(`%${name}%`) };

        if (ownerId) where = { ...where, ownerId: ownerId };

        if (membersIds)
            where = { ...where, membersIds: ArrayContains(membersIds) };

        if (managersIds)
            where = { ...where, managersIds: ArrayContains(managersIds) };

        return this.teamRepository.find({
            relations: {
                projects: true,
            },
            where,
            order: { [orderBy]: sortOrder as FindOptionsOrderValue },
            take: limit ? limit : undefined,
            skip: limit ? page * limit : page,
        });
    }
}
