import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TeamType {
    @Field(() => String)
    name: string;

    @Field(() => String)
    ownerId: string;

    @Field(() => [String])
    membersIds: Array<string>;

    @Field(() => [String])
    managersIds: Array<string>;
}
