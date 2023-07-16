import { Injectable, NotFoundException } from '@nestjs/common';
import { Reference } from '@reference/entity/reference.entity';
import { ReferenceDto } from '@reference/dtos/reference.dto';
import { TodoService } from '@todo/todo.service';
import { SearchReferenceDto } from '@reference/dtos/searchReference.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrderValue, In, Like, Repository } from 'typeorm';
import { Order } from '@src/common/enums/order.enum';

@Injectable()
export class ReferenceService {
    constructor(
        @InjectRepository(Reference)
        private referenceRepository: Repository<Reference>,
        private todoService: TodoService,
    ) {}

    /**
     * Creates a Reference and returns the created Reference
     * @param reference Reference Data
     * @param reference.type Reference type
     * @param reference.url Reference URL
     * @param reference.key Reference Key
     * @param reference.todoId To-Do identification
     * @return Reference
     */
    async create({ type, url, key, todoId }: ReferenceDto): Promise<Reference> {
        const todo = await this.todoService.findOne(todoId);

        const reference = this.referenceRepository.create({
            type,
            url,
            key,
            todo,
        });

        return this.referenceRepository.save(reference);
    }

    /**
     * Returns Reference based on id
     * @param id Reference identification
     * @return Reference
     */
    async findOne(id: number): Promise<Reference> {
        const reference = await this.referenceRepository.findOne({
            where: { id },
            relations: { todo: true },
        });

        if (!reference)
            throw new NotFoundException(`Reference ${id} not found`);

        return reference;
    }

    /**
     * Delete Reference based on id
     * @param id Reference identification
     * @return Reference
     */
    async delete(id: number): Promise<Reference> {
        const reference = await this.findOne(id);
        await this.referenceRepository.delete(id);

        return reference;
    }

    async update(
        id: number,
        { url, key, type, todoId }: ReferenceDto,
    ): Promise<Reference> {
        const reference = await this.findOne(id);
        const todo = await this.todoService.findOne(todoId);

        Object.assign(reference, { url, key, type, todo });

        return this.referenceRepository.save(reference);
    }

    search(searchInput: SearchReferenceDto): Promise<Array<Reference>> {
        const {
            ids,
            idsToDo,
            type,
            key,
            sortOrder = Order.ASC,
            orderBy,
            page = 0,
            limit,
        } = searchInput;
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        if (idsToDo) where = { ...where, todo: In(idsToDo) };

        if (type) where = { ...where, type: Like(`%${type}%`) };

        if (key) where = { ...where, key: Like(`%${key}%`) };

        return this.referenceRepository.find({
            where,
            take: limit,
            skip: page * limit,
            order:
                orderBy && sortOrder
                    ? { [orderBy]: sortOrder as FindOptionsOrderValue }
                    : undefined,
            relations: { todo: true },
        });
    }
}
