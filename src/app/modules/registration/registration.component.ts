import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['registration.component.css']
})
export class RegistrationComponent implements OnInit, AfterViewInit, OnDestroy {

    registrationForm: FormGroup;
    
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;
    
    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        this.registrationForm = this.fb.group({
            userName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            accountKeyword: ['']
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    onSubmit(): void {
        if (this.registrationForm.valid) {
            this.overlay = true;
            let formData: any = this.registrationForm.value;
            let postModel: any = {
                username: formData.userName ? formData.userName : null,
                email: formData.email ? formData.email : null,
                password: formData.password ? formData.password : null,
                account_keyword: formData.accountKeyword ? formData.accountKeyword : null
            };
            this.service.post(ApiConfig.userApi, postModel).subscribe(res => {
                if (res.result) {
                    this.showSuccess(res.message);
                    setTimeout(() => {
                        this.onLogin();
                    }, GlobalConst.growlLife);
                }
                else {
                    this.showError(res.error);
                }
                this.overlay = false;
            }, err => {
                this.overlay = false;
                this.showError('Internal server error!');
            });
        }
    }

    onLogin(){
        this.router.navigateByUrl('login');
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
