import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsArray, ArrayMinSize, IsNotEmpty } from 'class-validator';

@InputType()
export class TeamDto {
    @IsNotEmpty({ message: 'Required Name' })
    @IsString()
    @Field()
    name: string;

    @IsNotEmpty({ message: 'Required ownerId' })
    @IsString()
    @Field()
    ownerId: string;

    @IsArray()
    @IsString({ each: true })
    @Field(() => [String])
    membersIds: Array<string>;

    @IsNotEmpty({ message: 'Required Managers' })
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    @Field(() => [String])
    managersIds: Array<string>;
}
