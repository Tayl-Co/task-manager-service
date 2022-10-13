export interface Team {
    id: number;
    name: string;
    ownerId: string;
    membersIds: Array<string>;
    managersIds: Array<string>;
}
