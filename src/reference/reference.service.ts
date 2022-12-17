import { Injectable, NotFoundException } from '@nestjs/common';
import { ReferenceRepository } from '@reference/repository/reference.repository';
import { Reference } from '@reference/entity/reference.entity';
import { ReferenceDto } from '@reference/dtos/reference.dto';
import { TodoService } from '@todo/todo.service';
import { SearchReferenceDto } from '@reference/dtos/searchReference.dto';

@Injectable()
export class ReferenceService {
    constructor(
        private repository: ReferenceRepository,
        private todoService: TodoService,
    ) {}

    async create(referenceInput: ReferenceDto): Promise<Reference> {
        const todo = await this.todoService.findOne(referenceInput.todoId);

        return this.repository.create({ ...referenceInput, todo });
    }

    async findOne(id: number): Promise<Reference> {
        const reference = await this.repository.findOne(id);

        if (!reference)
            throw new NotFoundException(`Reference ${id} not found`);

        return reference;
    }

    async delete(id: number): Promise<Reference> {
        const reference = await this.findOne(id);
        await this.repository.delete(id);

        return reference;
    }

    async update(id: number, referenceInput: ReferenceDto): Promise<Reference> {
        const todo = await this.todoService.findOne(referenceInput.todoId);

        return this.repository.update(id, { ...referenceInput, todo });
    }

    search(searchInput: SearchReferenceDto): Promise<Array<Reference>> {
        return this.repository.search(searchInput);
    }
}
