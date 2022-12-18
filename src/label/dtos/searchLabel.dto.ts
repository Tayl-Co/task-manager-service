import { Field, InputType } from '@nestjs/graphql';
import { BaseSearchFilterDto } from '@src/common/dtos/baseSearchFilter.dto';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class SearchLabelDto extends BaseSearchFilterDto {
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    name: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    color: string;
}
