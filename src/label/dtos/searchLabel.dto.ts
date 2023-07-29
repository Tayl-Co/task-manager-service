import { Field, InputType, Int } from '@nestjs/graphql';
import { BaseSearchFilterDto } from '@src/common/dtos/baseSearchFilter.dto';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class SearchLabelDto extends BaseSearchFilterDto {
    @IsOptional()
    @IsNumber({}, { each: true })
    @Field(() => [Int], { nullable: true })
    ids?: Array<number>;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    name?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    color?: string;

    @IsString()
    @IsIn(['id', 'name', 'color'])
    @IsOptional()
    @Field({ nullable: true, defaultValue: 'name' })
    orderBy?: string;
}
