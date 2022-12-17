import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReferenceDto {
    @IsNotEmpty({ message: 'Required Type' })
    @IsString()
    @Field()
    type: string;

    @IsNotEmpty({ message: 'Required Key' })
    @IsString()
    @Field()
    key: string;

    @IsNotEmpty({ message: 'Required Url' })
    @IsUrl()
    @Field()
    url: string;
}
