import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsArray, IsNumber, IsOptional, IsIn } from 'class-validator';
import { BaseSearchFilterDto } from '@src/common/dtos/baseSearchFilter.dto';

@InputType()
export class SearchFilterDto extends BaseSearchFilterDto {
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

    @IsString()
    @IsIn(['id', 'name'])
    @IsOptional()
    @Field({ nullable: true, defaultValue: 'name' })
    orderBy?: string;
}
