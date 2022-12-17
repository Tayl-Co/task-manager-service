import { Field, InputType, Int } from '@nestjs/graphql';
import { BaseSearchFilterDto } from '@src/common/dtos/baseSearchFilter.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class SearchReferenceDto extends BaseSearchFilterDto {
    @IsOptional()
    @IsNumber({}, { each: true })
    @Field(() => [Int], { nullable: true })
    ids: Array<number>;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    type: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    key: string;

    @IsOptional()
    @IsNumber({}, { each: true })
    @Field(() => [Int], { nullable: true })
    idsToDo: Array<number>;
}
