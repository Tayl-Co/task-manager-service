import { Injectable, ConflictException } from '@nestjs/common';
import { ProjectRepository } from '@project/repository/project.repository';
import { Project } from '@project/entity/project.entity';
import { ProjectDto } from '@project/dtos/project.dto';
import { TeamService } from '@team/team.service';

@Injectable()
export class ProjectService {
    constructor(
        private projectRepository: ProjectRepository,
        private teamService: TeamService,
    ) {}

    async create(project: ProjectDto): Promise<Project> {
        const { name, teamId } = project;
        const createdProject = await this.projectRepository.findByName(name);

        if (createdProject)
            throw new ConflictException(`Project already exists`);

        const team = await this.teamService.findOne(teamId);

        return await this.projectRepository.create({ ...project, team });
    }
}
