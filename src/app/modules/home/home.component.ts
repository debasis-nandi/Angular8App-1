import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { AppUtil } from '../../core/config/app-util';
import { GlobalConst } from '../../core/config/app-enum';
import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

    accountId: any;
    imgPath: any = environment.imaPath;
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;

    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        this.accountId = AppSession.getSessionStorage('SelectedAccount');
    }

    ngOnInit() {
        this.onLoadScript();
    }

    onGetStarted():void{
        this.router.navigateByUrl('dashboard');
    }

    showSuccess(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'success', detail: message });
    }

    showError(message: string) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', detail: message });
    }

    onLoadScript(): void {
        $('.collapse').on('shown.bs.collapse', function () {
            $(this).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");

        }).on('hidden.bs.collapse', function () {
            $(this).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
        });
    }

}
