import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';

@Component({
    selector: 'app-forgotpassword',
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['forgotpassword.component.css']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit, OnDestroy {

    forgotPassword:FormGroup;
    
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;
    
    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        this.forgotPassword = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    onLogin(){
        this.router.navigateByUrl('login');
    }

    onSubmit(): void {
        if (this.forgotPassword.valid) {
            this.overlay = true;
            let formData: any = this.forgotPassword.value;
            let postModel: any = {
                email: formData.email ? formData.email : null
            };
            this.service.post(ApiConfig.forgotPasswordApi, postModel).subscribe(res => {
                if (res.result) {
                    this.showSuccess(res.message);
                    setTimeout(() => {
                        this.forgotPassword.reset();
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

    showSuccess(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', detail: message });
    }

    showError(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', detail: message });
    }

}
