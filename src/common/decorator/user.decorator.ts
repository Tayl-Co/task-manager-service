import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getUser = (data?: string, ctx?: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return 'unknown';

    return data ? user[data] : user;
};

export const User = createParamDecorator(getUser);
