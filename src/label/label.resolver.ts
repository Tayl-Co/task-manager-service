import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Label } from '@label/entity/label.entity';
import { LabelDto } from '@label/dtos/label.dto';
import { LabelService } from '@label/label.service';

@Resolver()
export class LabelResolver {
    constructor(private labelService: LabelService) {}

    @Mutation(() => Label, { name: 'createLabel' })
    async create(@Args('labelInput') labelInput: LabelDto): Promise<Label> {
        return await this.labelService.create(labelInput);
    }

    @Query(() => Label, { name: 'findOneLabel' })
    async findOne(@Args('id') id: number): Promise<Label> {
        return await this.labelService.findOne(id);
    }
}
