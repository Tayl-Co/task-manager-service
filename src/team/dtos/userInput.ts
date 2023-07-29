import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UserInput {
    @IsNotEmpty({ message: 'Required userId' })
    @IsString()
    @Field()
    userId: string;

    @IsNotEmpty({ message: 'Required userType' })
    @IsString()
    @IsIn(['manager', 'member'])
    @Field()
    userType: 'manager' | 'member';
}
