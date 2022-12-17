import { Injectable, NotFoundException } from '@nestjs/common';
import { ReferenceRepository } from '@reference/repository/reference.repository';
import { Reference } from '@reference/entity/reference.entity';
import { CreateReferenceDto } from '@reference/dtos/createReference.dto';
import { TodoService } from '@todo/todo.service';

@Injectable()
export class ReferenceService {
    constructor(
        private repository: ReferenceRepository,
        private todoService: TodoService,
    ) {}

    async create(referenceInput: CreateReferenceDto): Promise<Reference> {
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
}
