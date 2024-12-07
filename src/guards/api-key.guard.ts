import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = this.configService.get('API_KEY');

    const requiredApiKey = request.headers['x-api-key'];

    if (!requiredApiKey) {
      throw new UnauthorizedException('No API key provided');
    }

    const isApiKeyValid = requiredApiKey === apiKey;

    if (!isApiKeyValid) {
      throw new UnauthorizedException('Invalid API key');
    }

    return isApiKeyValid;
  }
}
