import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'


@Injectable()
export class CsInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        let CsReq = req;

        if (req.body && Object.prototype.toString.call(req.body) !== '[object FormData]') {
            CsReq = req.clone({
                body: req.body.set('tokenId', window.localStorage.getItem('tokenId'))
                //  body: req.body.set('testUserId', '4556')
            });
        }
        return next
            .handle(CsReq)
            .mergeMap((event: any) => {
                if (event instanceof HttpResponse && event.body.hasOwnProperty('success') && event.body.success !== true) {
                    return Observable.create(observer => observer.error(event));
                }
                return Observable.create(observer => observer.next(event));
            })
            .catch((res: HttpResponse<any>) => {
                switch (res.status) {
                    case 401:
                        break;
                    case 200:
                        // 业务层级错误处理
                        break;
                    case 404:
                        // not font
                        break;
                }
                return Observable.throw(res);
            })
    }
}
