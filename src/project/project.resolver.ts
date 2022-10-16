import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { ProjectService } from '@project/project.service';
import { Project } from '@project/entity/project.entity';
import { ProjectDto } from '@project/dtos/project.dto';

@Resolver()
export class ProjectResolver {
    constructor(private projectService: ProjectService) {}

    @Mutation(() => Project, { name: 'createProject' })
    async create(
        @Args('project', { type: () => ProjectDto }) project: ProjectDto,
    ) {
        return await this.projectService.create(project);
    }

    @Query(() => Project, { name: 'findOneProject' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return await this.projectService.findOne(id);
    }
}
