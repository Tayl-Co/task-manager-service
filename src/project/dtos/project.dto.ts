import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class ProjectDto {
    @IsNotEmpty({ message: 'Required Name' })
    @IsString()
    @Field()
    /**
     * Project Name
     */
    name: string;

    @IsString()
    @Field()
    /**
     * Project Description
     */
    description: string;

    @IsNotEmpty({ message: 'Required Team id' })
    @Field(() => Int)
    /**
     * Team identification
     */
    teamId: number;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    /**
     * Status to identify if the project is active or not
     */
    active?: boolean;
}
