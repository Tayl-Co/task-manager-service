import { Field, InputType } from '@nestjs/graphql';
import { IsHexColor, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LabelDto {
    @IsNotEmpty({ message: 'Required name' })
    @IsString()
    @Field()
    /**
     * Label Name
     */
    name: string;

    @IsNotEmpty({ message: 'Required color' })
    @IsHexColor()
    @Field()
    /**
     * Label Color
     */
    color: string;
}
