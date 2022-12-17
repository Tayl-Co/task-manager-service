import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Reference } from '@reference/entity/reference.entity';
import { CreateReferenceDto } from '@reference/dtos/createReference.dto';

@Injectable()
export class ReferenceRepository {
    constructor(
        @InjectRepository(Reference)
        private repository: Repository<Reference>,
    ) {}

    create({ type, todo, url, key }: CreateReferenceDto): Promise<Reference> {
        const reference = this.repository.create({ type, todo, url, key });

        return this.repository.save(reference);
    }

    findOne(id: number): Promise<Reference> {
        return this.repository.findOne({ where: { id } });
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}
