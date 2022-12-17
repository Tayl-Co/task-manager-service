import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LabelDto {
    @IsNotEmpty({ message: 'Required name' })
    @IsString()
    @Field()
    name: string;

    @IsNotEmpty({ message: 'Required color' })
    @IsString()
    @Field()
    color: string;
}
