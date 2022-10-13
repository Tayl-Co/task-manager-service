import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { TeamDto } from './dtos/team.dto';
import { Team } from './team.model';

@Resolver(() => Team)
export class TeamResolver {
    constructor(private teamService: TeamService) {}

    @Mutation(() => Team)
    async createTeam(
        @Args('team', { type: () => TeamDto }) team: TeamDto,
    ): Promise<Team> {
        return await this.teamService.create(team);
    }

    @Query(() => Team)
    async findOneTeam(@Args('id', { type: () => Int }) id: number) {
        return await this.teamService.findOne(id);
    }
}
