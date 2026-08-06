import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { createRemoteJWKSet, jwtVerify } from 'jose';
import { AuthenticatedRequest } from '../types/authenticated-request';

let jwksPromise: Promise<{
  jwks: ReturnType<typeof createRemoteJWKSet>;
  jwtVerify: typeof jwtVerify;
}> | undefined;

function getJwks() {
  if (!jwksPromise) {
    jwksPromise = import('jose').then(({ createRemoteJWKSet, jwtVerify }) => ({
      jwks: createRemoteJWKSet(
        new URL(
          'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com',
        ),
      ),
      jwtVerify,
    }));
  }
  return jwksPromise;
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const token = authHeader.slice('Bearer '.length);
    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID');

    try {
      const { jwks, jwtVerify } = await getJwks();
      const { payload } = await jwtVerify(token, jwks, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
      });

      if (typeof payload.sub !== 'string') {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.firebaseUser = {
        uid: payload.sub,
        email: typeof payload.email === 'string' ? payload.email : undefined,
        name: typeof payload.name === 'string' ? payload.name : undefined,
        picture:
          typeof payload.picture === 'string' ? payload.picture : undefined,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
