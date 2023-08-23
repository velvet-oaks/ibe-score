import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class ErrorLoggingInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError((error) => {
				const url = req.url; // Get the request URL
				console.log(req.url + '\n');
				console.error(`Error occurred for URL: ${url}`);
				throw error; // Re-throw the error to propagate it to the subscriber
			})
		);
	}
}
