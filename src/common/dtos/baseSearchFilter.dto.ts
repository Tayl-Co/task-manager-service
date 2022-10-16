import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BaseSearchFilterDto {
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
