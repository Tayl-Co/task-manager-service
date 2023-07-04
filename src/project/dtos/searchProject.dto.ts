import { Field, InputType, Int } from '@nestjs/graphql';
import { BaseSearchFilterDto } from '@src/common/dtos/baseSearchFilter.dto';
import {
    IsArray,
    IsBoolean,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

@InputType()
export class SearchProjectDto extends BaseSearchFilterDto {
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
    description?: string;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    active?: boolean;

    @IsString()
    @IsIn(['id', 'name', 'description', 'active'])
    @IsOptional()
    @Field({ nullable: true, defaultValue: 'name' })
    orderBy?: string;
}
