import {
    ConflictException,
    Injectable,
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

    async delete(id: number) {
        const project = await this.projectRepository.findOne(id);

        if (!project) throw new NotFoundException(`Project ${id} not found`);

        return await this.projectRepository.remove(project);
    }

    async update(
        id: number,
        { name, description, active, teamId }: ProjectDto,
    ): Promise<Project> {
        const projectUpdate = await this.projectRepository.findOne(id);

        if (!projectUpdate)
            throw new NotFoundException(`Project ${id} not found`);

        if (teamId !== projectUpdate.team.id) {
            projectUpdate.team = await this.teamService.findOne(teamId);
        }

        projectUpdate.name = name;
        projectUpdate.description = description;
        projectUpdate.active = active;

        return await this.projectRepository.update(projectUpdate);
    }

    async disable(id: number): Promise<Project> {
        const project = await this.findOne(id);

        return await this.projectRepository.disable(project);
    }
}
