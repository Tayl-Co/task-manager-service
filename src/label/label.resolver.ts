import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Label } from '@label/entity/label.entity';
import { LabelDto } from '@label/dtos/label.dto';
import { LabelService } from '@label/label.service';
import { SearchLabelDto } from '@label/dtos/searchLabel.dto';

@Resolver()
export class LabelResolver {
    constructor(private labelService: LabelService) {}

    @Mutation(() => Label, { name: 'createLabel' })
    async create(@Args('labelInput') labelInput: LabelDto): Promise<Label> {
        return await this.labelService.create(labelInput);
    }

    @Mutation(() => Label, { name: 'deleteLabel' })
    async delete(@Args('id') id: number): Promise<Label> {
        return await this.labelService.delete(id);
    }

    @Mutation(() => Label, { name: 'updateLabel' })
    async update(
        @Args('id') id: number,
        @Args('labelInput') labelInput: LabelDto,
    ): Promise<Label> {
        return await this.labelService.update(id, labelInput);
    }

    @Query(() => [Label], { name: 'searchLabel' })
    async search(
        @Args('searchInput') searchInput: SearchLabelDto,
    ): Promise<Array<Label>> {
        return await this.labelService.search(searchInput);
    }

    @Query(() => Label, { name: 'findOneLabel' })
    async findOne(@Args('id') id: number): Promise<Label> {
        return await this.labelService.findOne(id);
    }
}
