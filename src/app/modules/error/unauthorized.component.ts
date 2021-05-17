import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { AppSession } from '../../core/config/app-session';
import { ApiConfig } from '../../core/config/api-config';
import { IToken } from '../../modules/authentication/authentication.model';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html',
    styleUrls: ['error.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UnAuthorizedComponent implements OnInit {

    overlay: boolean = false;
    token: IToken = {};

    constructor(private router: Router, private service: HttpService) { }

    ngOnInit() {
    }

    refreshToken() {
        this.overlay = true;
        this.token = AppSession.getSessionStorage("token");
        this.token.token = null;
        AppSession.setSessionStorage("token", this.token);
        let model: any = { refreshtoken: this.token.refreshtoken };
        this.service.post(ApiConfig.refreshTokenApi, model)
            .subscribe(response => {
                if (response.result == undefined) {
                    this.token.token = response['token'];
                    AppSession.setSessionStorage("token", this.token);
                    this.router.navigateByUrl('dashboard');
                }
            }, err => {
                console.log(err);
                this.overlay = false;
            });
    }

}
