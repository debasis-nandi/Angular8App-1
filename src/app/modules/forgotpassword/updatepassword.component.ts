import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';

@Component({
    selector: 'app-updatepassword',
    templateUrl: './updatepassword.component.html',
    styleUrls: ['forgotpassword.component.css']
})
export class UpdatePasswordComponent implements OnInit, AfterViewInit, OnDestroy {

    updatePassword:FormGroup;
    token: any;
    
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;
    
    constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private service: HttpService) {
        this.route.params.subscribe(params => {
            this.token = params['token'] || null;
        });
        this.updatePassword = this.fb.group({
            password: ['', [Validators.required,Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        },{validator: this.ConfirmedValidator('password', 'confirmPassword')});
    }

    ConfirmedValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
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
        if (this.updatePassword.valid) {
            this.overlay = true;
            let formData: any = this.updatePassword.value;
            let postModel: any = {
                token: this.token,
                password: formData.password ? formData.password : null
            };
            this.service.post(ApiConfig.updatePasswordApi, postModel).subscribe(res => {
                if (res.result) {
                    this.showSuccess(res.message);
                    setTimeout(() => {
                        this.updatePassword.reset();
                        this.router.navigateByUrl('login');
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
