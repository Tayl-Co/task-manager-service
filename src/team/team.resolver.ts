import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { TeamService } from '@team/team.service';
import { TeamDto } from '@team/dtos/team.dto';
import { Team } from '@team/entity/team.entity';
import { SearchFilterDto } from '@team/dtos/searchFilterDto.dto';

@Resolver(() => Team)
export class TeamResolver {
    constructor(private teamService: TeamService) {}

    @Mutation(() => Team, { name: 'createTeam' })
    async create(
        @Args('team', { type: () => TeamDto })
        team: TeamDto,
    ): Promise<Team> {
        return await this.teamService.create(team);
    }

    @Mutation(() => Team, { name: 'deleteTeam' })
    async delete(@Args('id', { type: () => Int }) id: number) {
        return await this.teamService.delete(id);
    }

    @Mutation(() => Team, { name: 'updateTeam' })
    async update(
        @Args('id', { type: () => Int }) id: number,
        @Args('team', { type: () => TeamDto }) team: TeamDto,
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
}
