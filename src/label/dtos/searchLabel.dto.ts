import { Field, ObjectType } from '@nestjs/graphql';
import { BaseSearchFilterDto } from '@src/common/dtos/baseSearchFilter.dto';
import { IsOptional, IsString } from 'class-validator';

@ObjectType()
export class SearchLabelDto extends BaseSearchFilterDto {
    @IsOptional()
    @IsString()
    @Field()
    name: string;

    @IsOptional()
    @IsString()
    @Field()
    color: string;
}
