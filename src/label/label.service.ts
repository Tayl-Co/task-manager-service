import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Like, Repository } from 'typeorm';
import { Label } from '@label/entity/label.entity';
import { LabelDto } from '@label/dtos/label.dto';
import { SearchLabelDto } from '@label/dtos/searchLabel.dto';

@Injectable()
export class LabelService {
    constructor(
        @InjectRepository(Label) private labelRepository: Repository<Label>,
    ) {}

    async create(labelInput: LabelDto): Promise<Label> {
        const label = await this.labelRepository.findOne({
            where: { name: Equal(labelInput.name) },
        });

        if (label) throw new ConflictException(`${label.name} already exists`);

        const newLabel = this.labelRepository.create(labelInput);

        return this.labelRepository.save(newLabel);
    }

    async findOne(id: number): Promise<Label> {
        const label = await this.labelRepository.findOneBy({ id });

        if (!label) throw new NotFoundException(`Label ${id} not found`);

        return label;
    }

    async delete(id: number): Promise<Label> {
        const label = await this.findOne(id);
        await this.labelRepository.delete(id);

        return label;
    }

    async update(id: number, labelInput: LabelDto): Promise<Label> {
        const label = await this.findOne(id);
        Object.assign(label, labelInput);

        return this.labelRepository.save(label);
    }

    search(searchInput: SearchLabelDto): Promise<Array<Label>> {
        const { name } = searchInput;
        let where = {};

        if (name) where = { ...where, name: Like(`%${name}%`) };

        return this.labelRepository.find({ where });
    }
}
