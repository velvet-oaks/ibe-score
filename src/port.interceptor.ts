import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PortInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const port = window.location.port;
		const baseUrl = window.location.origin;
		const url = req.url.startsWith('/') ? req.url.substr(1) : req.url;
		const modifiedRequest = req.clone({
			headers: req.headers.set('X-Port', port)
		});
		return next.handle(modifiedRequest);
	}
}
