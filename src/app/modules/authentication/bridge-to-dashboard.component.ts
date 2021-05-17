import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';
import { IAuthentication, IToken, IUserInformation } from './authentication.model';

@Component({
    selector: 'app-bridge-to-dashboard',
    templateUrl: './bridge-to-dashboard.component.html'
})
export class BridgeToDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

    overlay: boolean = false;
    
    constructor(private router: Router, private route: ActivatedRoute, private service: HttpService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            let accountId: any = params['accountId'] || null;
            AppSession.setSessionStorage("SelectedAccount", accountId);
            this.getAcl(accountId);
        });
    }

    ngAfterViewInit(){
    }

    ngOnDestroy(){
    }

    getAcl(accountId: number): void {
        this.overlay = true;
        let api: any = ApiConfig.aclBasedOnAccountApi.replace("{accountId}",accountId.toString());
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    AppSession.setSessionStorage("Menu", res.menu);
                    this.router.navigateByUrl('home');
                }
                else {
                    this.router.navigateByUrl('login');
                    this.overlay = false;
                }
            }, err => {
                this.router.navigateByUrl('login');
                console.log(err);
                this.overlay = false;
            });
    }

}
