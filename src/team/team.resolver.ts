import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { TeamType } from './type/team.type';
import { Team } from './team.model';

@Resolver(() => Team)
export class TeamResolver {
    constructor(private teamService: TeamService) {}

    @Mutation(() => Team)
    async createTeam(@Args('team') team: TeamType): Promise<Team> {
        return await this.teamService.create(team);
    }

    @Query(() => [Team])
    async findOneTeam() {
        return [
            {
                name: 'Team 1',
                ownerId: '',
                membersIds: [],
                managersIds: [],
            },
        ];
    }
}
