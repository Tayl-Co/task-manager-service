import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const getUser = (data?: string, ctx?: ExecutionContext) => {
    const user = GqlExecutionContext.create(ctx).getContext().user;

    if (!user) return 'unknown';

    return data && user[data] ? user[data] : user;
};

export const User = createParamDecorator(getUser);
