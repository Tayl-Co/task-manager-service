import { Field, ID, ObjectType } from '@nestjs/graphql';

//TODO: Add the Project property
@ObjectType()
export class Team {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    ownerId: string;

    @Field(() => [String])
    membersIds: Array<string>;

    @Field(() => [String])
    managersIds: Array<string>;
}
