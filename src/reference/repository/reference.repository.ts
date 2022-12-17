import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { Reference } from '@reference/entity/reference.entity';
import { ReferenceDto } from '@reference/dtos/reference.dto';
import { SearchReferenceDto } from '@reference/dtos/searchReference.dto';

@Injectable()
export class ReferenceRepository {
    constructor(
        @InjectRepository(Reference)
        private repository: Repository<Reference>,
    ) {}

    create({ type, todo, url, key }: ReferenceDto): Promise<Reference> {
        const reference = this.repository.create({ type, todo, url, key });

        return this.repository.save(reference);
    }

    findOne(id: number): Promise<Reference> {
        return this.repository.findOne({
            where: { id },
            relations: { todo: true },
        });
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    async update(
        id: number,
        { url, key, todo, type }: ReferenceDto,
    ): Promise<Reference> {
        const reference = await this.repository.findOne({
            where: { id },
            relations: { todo: true },
        });
        Object.assign(reference, { url, key, todo, type });

        return this.repository.save(reference);
    }

    search({
        ids,
        page,
        limit,
    }: SearchReferenceDto): Promise<Array<Reference>> {
        let where = {};

        if (ids) where = { ...where, id: In(ids) };

        return this.repository.find({ where, take: limit, skip: page * limit });
    }
}
