import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { ProjectService } from '@project/project.service';
import { Project } from '@project/entity/project.entity';
import { ProjectDto } from '@project/dtos/project.dto';
import { SearchProjectDto } from '@project/dtos/searchProject.dto';

@Resolver()
export class ProjectResolver {
    constructor(private projectService: ProjectService) {}

    @Mutation(() => Project, { name: 'createProject' })
    async create(
        @Args('project', { type: () => ProjectDto }) project: ProjectDto,
    ) {
        return await this.projectService.create(project);
    }

    @Mutation(() => Project, { name: 'deleteProject' })
    async delete(@Args('id', { type: () => Int }) id: number) {
        return await this.projectService.delete(id);
    }

    @Mutation(() => Project, { name: 'updateProject' })
    async update(
        @Args('id', { type: () => Int }) id: number,
        @Args('project', { type: () => ProjectDto }) project: ProjectDto,
    ) {
        return await this.projectService.update(id, project);
    }

    @Mutation(() => Project, { name: 'disableProject' })
    async disable(@Args('id', { type: () => Int }) id: number) {
        return await this.projectService.disable(id);
    }

    @Query(() => Project, { name: 'findOneProject' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return await this.projectService.findOne(id);
    }

    @Query(() => [Project], { name: 'searchProject' })
    async search(
        @Args('search', { type: () => SearchProjectDto })
        search: SearchProjectDto,
    ): Promise<Array<Project>> {
        return await this.projectService.search(search);
    }
}
