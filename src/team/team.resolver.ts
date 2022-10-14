import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { TeamDto } from './dtos/team.dto';
import { Team } from './entity/team.entity';

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

    @Query(() => Team, { name: 'findOneTeam', nullable: true })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return await this.teamService.findOne(id);
    }
}
