import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReferenceService } from '@reference/reference.service';
import { Reference } from '@reference/entity/reference.entity';
import { CreateReferenceDto } from '@reference/dtos/createReference.dto';

@Resolver()
export class ReferenceResolver {
    constructor(private referenceService: ReferenceService) {}

    @Mutation(() => Reference, { name: 'createReference' })
    async create(
        @Args('referenceInput') referenceInput: CreateReferenceDto,
    ): Promise<Reference> {
        return await this.referenceService.create(referenceInput);
    }
}
