import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import request from 'supertest';



export const RawHeaders = createParamDecorator(
    (data, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const headers = request.rawHeaders;

        return headers;
    }
)