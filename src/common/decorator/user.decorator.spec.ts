import { getUser } from '@src/common/decorator/user.decorator';

const ctxMock: any = {
    switchToHttp: () => ({
        getRequest: (): any => ({
            user: undefined,
        }),
    }),
};

describe('User decorator', () => {
    it('should return an unknown value if user not exists', () => {
        const user = getUser('id', ctxMock);

        expect(user).toBeDefined();
        expect(user).toEqual('unknown');
    });
});
