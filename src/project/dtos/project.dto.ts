import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { TeamDto } from '@team/dtos/team.dto';

@InputType()
export class ProjectDto {
    @IsNotEmpty({ message: 'Required Name' })
    @IsString()
    @Field()
    name: string;

    @IsString()
    @Field()
    description: string;

    @IsOptional()
    team: TeamDto;

    @IsNotEmpty({ message: 'Required Team id' })
    @Field(() => Int)
    teamId: number;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    active: boolean;
}
