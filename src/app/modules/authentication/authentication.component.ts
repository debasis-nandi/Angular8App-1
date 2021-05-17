import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';
import { IAuthentication, IToken, IUserInformation } from './authentication.model';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['authentication.component.css']
})
export class AuthenticationComponent implements OnInit, AfterViewInit, OnDestroy {

    loginForm:FormGroup;
    
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;

    authentication: IAuthentication;
    token: IToken;
    
    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required,Validators.minLength(8)]],
            rememberMe: ['']
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.overlay = true;
            this.authentication = { email: this.loginForm.value.email, password: this.loginForm.value.password };
            this.service.post(ApiConfig.authenticationApi, this.authentication)
                .subscribe(res => {
                    if (res.result == undefined) {
                        this.token = { token: res.token, refreshtoken: res.refreshtoken };
                        AppSession.setSessionStorage("token", this.token);
                        this.getUserInfo();
                    }
                    else {
                        this.showError(res.message);
                        this.overlay = false;
                    }
                }, err => {
                    console.log(err);
                    this.overlay = false;
                });
        }
    }

    getUserInfo(): void {
        this.overlay = true;
        //let api: any = 'assets/datasource/userinfo.json';
        let api: any = ApiConfig.userInfoApi;
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    AppSession.setSessionStorage("UserInfo", res.results);
                    let selectedAccount: any = (res.results['role_detail'] && res.results['role_detail'].length > 0) ? res.results['role_detail'][0] : null;
                    this.router.navigate(['login/bridge', selectedAccount.accountid]);
                }
                else {
                    this.showError(res.message);
                    this.overlay = false;
                }
            }, err => {
                console.log(err);
                this.overlay = false;
            });
    }

    onRegistration(){
        this.router.navigateByUrl('registration');
    }

    onForgotPassword(){
        this.router.navigateByUrl('forgotpassword');
    }

    showSuccess(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', detail: message });
    }

    showError(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', detail: message });
    }

}
