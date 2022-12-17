import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReferenceService } from '@reference/reference.service';
import { Reference } from '@reference/entity/reference.entity';
import { ReferenceDto } from '@reference/dtos/reference.dto';

@Resolver()
export class ReferenceResolver {
    constructor(private referenceService: ReferenceService) {}

    @Mutation(() => Reference, { name: 'createReference' })
    async create(
        @Args('referenceInput') referenceInput: ReferenceDto,
    ): Promise<Reference> {
        return await this.referenceService.create(referenceInput);
    }

    @Mutation(() => Reference, { name: 'deleteReference' })
    async delete(@Args('id') id: number): Promise<Reference> {
        return await this.referenceService.delete(id);
    }

    @Mutation(() => Reference, { name: 'updateReference' })
    async update(
        @Args('id') id: number,
        @Args('referenceInput') referenceInput: ReferenceDto,
    ): Promise<Reference> {
        return await this.referenceService.update(id, referenceInput);
    }

    @Query(() => Reference, { name: 'findOneReference' })
    async findOne(@Args('id') id: number): Promise<Reference> {
        return await this.referenceService.findOne(id);
    }
}
