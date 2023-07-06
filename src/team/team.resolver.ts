import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { TeamService } from '@team/team.service';
import { TeamDto } from '@team/dtos/team.dto';
import { Team } from '@team/entity/team.entity';
import { SearchFilterDto } from '@team/dtos/searchTeam.dto';

@Resolver(() => Team)
export class TeamResolver {
    constructor(private teamService: TeamService) {}

    @Mutation(() => Team, { name: 'createTeam' })
    async create(
        @Args('teamInput', { type: () => TeamDto })
        team: TeamDto,
    ): Promise<Team> {
        return await this.teamService.create(team);
    }

    @Mutation(() => Team, { name: 'deleteTeam' })
    async delete(@Args('id', { type: () => Int }) id: number) {
        return await this.teamService.delete(id);
    }

    @Mutation(() => Team, { name: 'addMemberToTeam' })
    async addMember(
        @Args('id', { type: () => Int }) id: number,
        @Args('memberId', { type: () => String }) memberId: string,
    ): Promise<Team> {
        return await this.teamService.addUser(id, {
            userId: memberId,
            userType: 'member',
        });
    }

    @Mutation(() => Team, { name: 'removeTeamMember' })
    async removeMember(
        @Args('id', { type: () => Int }) id: number,
        @Args('memberId', { type: () => String }) memberId: string,
    ): Promise<Team> {
        return await this.teamService.removeUser(id, {
            userId: memberId,
            userType: 'member',
        });
    }

    @Mutation(() => Team, { name: 'addManagerToTeam' })
    async addManager(
        @Args('id', { type: () => Int }) id: number,
        @Args('managerId', { type: () => String }) managerId: string,
    ): Promise<Team> {
        return await this.teamService.addUser(id, {
            userId: managerId,
            userType: 'manager',
        });
    }

    @Mutation(() => Team, { name: 'removeTeamManager' })
    async removeManager(
        @Args('id', { type: () => Int }) id: number,
        @Args('managerId', { type: () => String }) managerId: string,
    ): Promise<Team> {
        return await this.teamService.removeUser(id, {
            userId: managerId,
            userType: 'manager',
        });
    }

    @Mutation(() => Team, { name: 'updateTeam' })
    async update(
        @Args('id', { type: () => Int }) id: number,
        @Args('teamInput', { type: () => TeamDto }) team: TeamDto,
    ) {
        return await this.teamService.update(id, team);
    }

    @Query(() => Team, { name: 'findOneTeam', nullable: true })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return await this.teamService.findOne(id);
    }

    @Query(() => [Team], { name: 'searchTeams' })
    async search(
        @Args('search', { type: () => SearchFilterDto })
        search: SearchFilterDto,
    ) {
        return await this.teamService.search(search);
    }

    @Query(() => [Team], { name: 'findAllTeams' })
    async findAll() {
        return await this.teamService.findAll();
    }
}
