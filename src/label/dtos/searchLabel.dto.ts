import { Field, InputType } from '@nestjs/graphql';
import { BaseSearchFilterDto } from '@src/common/dtos/baseSearchFilter.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

@InputType()
export class SearchLabelDto extends BaseSearchFilterDto {
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
