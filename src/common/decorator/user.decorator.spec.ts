import { getUser } from '@src/common/decorator/user.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

jest.mock('@nestjs/graphql');

const ctxMock: any = {
    switchToHttp: () => ({
        getRequest: (): any => ({
            user: undefined,
        }),
    }),
};

describe('User decorator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return an unknown value if user not exists', () => {
        jest.spyOn(GqlExecutionContext, 'create').mockImplementation(
            (): any => ({
                getContext: () => ({
                    user: undefined,
                }),
            }),
        );
        const user = getUser('id', ctxMock);

        expect(user).toBeDefined();
        expect(user).toEqual('unknown');
    });

    it('should return userid if id exists', async () => {
        jest.spyOn(GqlExecutionContext, 'create').mockImplementation(
            (): any => ({
                getContext: () => ({
                    user: {
                        id: '08b8b93a-9aa7-4fc1-8201-539e2cb33830',
                    },
                }),
            }),
        );

        const userId = getUser('id', ctxMock);

        expect(userId).toBeDefined();
        expect(userId).toEqual('08b8b93a-9aa7-4fc1-8201-539e2cb33830');
    });

    it('should return user object if data not found', async () => {
        const user = {
            id: '08b8b93a-9aa7-4fc1-8201-539e2cb33830',
            name: 'Rodrigo',
        };
        jest.spyOn(GqlExecutionContext, 'create').mockImplementation(
            (): any => ({
                getContext: () => ({
                    user,
                }),
            }),
        );

        const userId = getUser('age', ctxMock);

        expect(userId).toBeDefined();
        expect(userId).toMatchObject(user);
    });
});
