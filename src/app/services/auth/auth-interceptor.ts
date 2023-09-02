import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor() {}
	intercept(req: HttpRequest<any>, next: HttpHandler) {
		// const authToken = this.authService.getToken();
		if (!environment.PRODUCTION) {
			const authToken = localStorage.id_token;
			const authRequest = req.clone({
				headers: req.headers.set('Authorization', 'Bearer ' + authToken)
			});
			return next.handle(authRequest);
		} else {
			const authRequest = req.clone({
				headers: req.headers.set('Prod', 'true')
			});
			return next.handle(authRequest);
		}
	}
}
