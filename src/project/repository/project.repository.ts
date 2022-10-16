import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsOrderValue, In, Like, Repository } from 'typeorm';
import { Project } from '@project/entity/project.entity';
import { ProjectDto } from '@project/dtos/project.dto';
import { SearchProjectDto } from '@project/dtos/searchProject.dto';

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

    async search({
        ids,
        name,
        description,
        active,
        order,
        page,
        limit,
    }: SearchProjectDto): Promise<Array<Project>> {
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        if (description)
            where = { ...where, description: Like(`%${description}%`) };

        if (active !== undefined) where = { ...where, active };

        return await this.projectEntity.find({
            relations: { team: true },
            where: { name: Like(`%${name}%`), ...where },
            order: { name: order as FindOptionsOrderValue },
            take: limit,
            skip: page * limit,
        });
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
