import { BaseSearchFilterDto } from '@src/common/dtos/baseSearchFilter.dto';
import {
    IsBoolean,
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class SearchTodoDto extends BaseSearchFilterDto {
    @IsOptional()
    @IsNumber({}, { each: true })
    ids?: Array<number>;

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsNumber()
    type: number;

    @IsOptional()
    @IsNumber()
    status: number;

    @IsOptional()
    @IsNumber()
    priority: number;

    @IsOptional()
    @IsString({ each: true })
    parentIds?: Array<string>;

    @IsOptional()
    @IsString()
    authorId: string;

    @IsOptional()
    @IsString({ each: true })
    assigneesIds: Array<string>;

    @IsOptional()
    @IsBoolean()
    pinned: boolean;

    @IsOptional()
    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate: string;
}
