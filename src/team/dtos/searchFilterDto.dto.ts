import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsArray, IsNumber, Min, IsOptional } from 'class-validator';

@InputType()
export class SearchFilterDto {
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Field(() => [Int], { nullable: true })
    ids?: Array<number>;

    @IsOptional()
    @IsString()
    @Field({ nullable: true, defaultValue: '' })
    name?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    ownerId?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Field(() => [String], { nullable: true })
    membersIds?: Array<string>;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Field(() => [String], { nullable: true })
    managersIds?: Array<string>;

    @IsOptional()
    @IsString()
    @Field({ nullable: true, defaultValue: 'ASC' })
    order?: string;

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'The value must be positive' })
    @Field({ nullable: true, defaultValue: 0 })
    page?: number;

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'The value must be positive' })
    @Field({ nullable: true, defaultValue: 50 })
    limit?: number;
}
