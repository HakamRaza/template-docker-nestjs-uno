import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // Troubleshoot JWT using this code. Will log JWT error or payloads to console

    // handleRequest(...args: Parameters<InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']>) {
    //     console.log(args);
    //     return super.handleRequest(...args);
    // }
}
