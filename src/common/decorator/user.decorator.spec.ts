import { getUser } from '@src/common/decorator/user.decorator';

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
        const user = getUser('id', ctxMock);

        expect(user).toBeDefined();
        expect(user).toEqual('unknown');
    });

    it('should return userid if id exists', async () => {
        jest.spyOn(ctxMock, 'switchToHttp').mockImplementation(() => ({
            getRequest: (): any => ({
                user: {
                    id: '08b8b93a-9aa7-4fc1-8201-539e2cb33830',
                },
            }),
        }));

        const userId = getUser('id', ctxMock);

        expect(userId).toBeDefined();
        expect(userId).toEqual('08b8b93a-9aa7-4fc1-8201-539e2cb33830');
    });
});
