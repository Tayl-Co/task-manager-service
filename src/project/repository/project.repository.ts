import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Project } from '@project/entity/project.entity';
import { ProjectDto } from '@project/dtos/project.dto';

@Injectable()
export class ProjectRepository {
    constructor(
        @InjectRepository(Project) private projectEntity: Repository<Project>,
    ) {}

    async findByName(name: string): Promise<Project> {
        return await this.projectEntity.findOne({
            where: { name: Equal(name) },
        });
    }

    async create({
        name,
        description,
        team,
        active,
    }: ProjectDto): Promise<Project> {
        const project = this.projectEntity.create({
            name,
            description,
            team,
            active,
        });
        return await this.projectEntity.save(project);
    }

    async findOne(id: number): Promise<Project> {
        return await this.projectEntity.findOne({
            relations: { team: true },
            where: { id },
        });
    }

    async remove(project: Project): Promise<Project> {
        return await this.projectEntity.remove(project);
    }

    async update(project: Project): Promise<Project> {
        return await this.projectEntity.save(project);
    }

    async disable(project: Project): Promise<Project> {
        project.active = false;
        return await this.projectEntity.save(project);
    }
}
