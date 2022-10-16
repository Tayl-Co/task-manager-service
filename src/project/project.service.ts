import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
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
        const projectExists = await this.projectRepository.findByName(name);

        if (projectExists)
            throw new ConflictException(`Project already exists`);

        const team = await this.teamService.findOne(teamId);

        return await this.projectRepository.create({ ...project, team });
    }

    async findOne(id: number): Promise<Project> {
        const project = await this.projectRepository.findOne(id);

        if (!project) throw new NotFoundException(`Project ${id} not found`);

        return project;
    }
}
