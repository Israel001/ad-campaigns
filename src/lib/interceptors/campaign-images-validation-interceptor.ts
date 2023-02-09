import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class CampaignImagesValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    Object.entries(request.files).forEach(([_k, v]) => {
      if (!request.body['images']) request.body['images'] = [];
      request.body['images'].push({ buffer: (v as any).buffer, mimetype: (v as any).mimetype }) 
    })
    return next.handle();
  }
}