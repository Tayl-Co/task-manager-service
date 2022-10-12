import { Resolver, Query } from '@nestjs/graphql';
import { Team } from './team.model';

@Resolver(() => Team)
export class TeamResolver {
    @Query(() => [Team])
    async listTeam() {
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
