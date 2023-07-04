import { BaseSearchFilterDto } from '@src/common/dtos/baseSearchFilter.dto';
import {
    IsBoolean,
    IsDateString,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SearchTodoDto extends BaseSearchFilterDto {
    @IsOptional()
    @IsNumber({}, { each: true })
    @Field(() => [Int], { nullable: true })
    ids?: Array<number>;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    title: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    description: string;

    @IsOptional()
    @IsNumber()
    @Field(() => Int, { nullable: true })
    type: number;

    @IsOptional()
    @IsNumber()
    @Field(() => Int, { nullable: true })
    status: number;

    @IsOptional()
    @IsNumber()
    @Field(() => Int, { nullable: true })
    priority: number;

    @IsOptional()
    @IsString({ each: true })
    @Field(() => [String], { nullable: true })
    parentIds?: Array<string>;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    authorId: string;

    @IsOptional()
    @IsString({ each: true })
    @Field(() => [String], { nullable: true })
    assigneesIds: Array<string>;

    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    pinned: boolean;

    @IsOptional()
    @IsDateString()
    @Field({ nullable: true })
    startDate: string;

    @IsOptional()
    @IsDateString()
    @Field({ nullable: true })
    endDate: string;

    @IsString()
    @IsIn(['id', 'title'])
    @IsOptional()
    @Field({ nullable: true, defaultValue: 'title' })
    orderBy?: string;
}
