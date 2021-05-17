import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { HttpService } from '../../../core/services/http.service';
import { ApiConfig } from '../../../core/config/api-config';
import { AppSession } from '../../../core/config/app-session';
import { AppUtil } from '../../../core/config/app-util';
import { GlobalConst, Action } from '../../../core/config/app-enum';
import { IManageClient } from './manage-client.model';

@Component({
    selector: 'app-manage-client',
    templateUrl: './manage-client.component.html',
    styleUrls: ['manage-client.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ManageClientComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    overlay: boolean = false;
    displayModal: boolean = false;
    isViewMode: boolean = false;
    dialogHeader: string;
    actionType: string = Action.add;
    
    growlLife: number = GlobalConst.growlLife;
    msgs: any[] = [];
    clientList:IManageClient[] = [];
    dataSource:any;
    
    clientForm: FormGroup;
    Id?: number;
    name: string;
    domain: string;
    subscriptionStart: any;
    subscriptionEnd: any;
    active: any;

    myStartDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    myEndDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    
    // If you want to hide column then only remove the column from the display list 
    columnList: string[] = ['clientName', 'clientDomain', 'subscriptionStart', 'subscriptionEnd', 'isActive', 'action'];
    
    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        this.clientForm = fb.group({
            'name': [null, Validators.required],
            'domain': [null, Validators.required],
            'subscriptionStart': [null, Validators.required],
            'subscriptionEnd': [null, Validators.required],
            'active': ['1']
        });
    }

    ngOnInit() {
        this.getClientList();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setDefault():void{
        this.clientForm.reset();
        this.clientForm.patchValue({
            'name':'',
            'domain':'',
            'subscriptionStart':'',
            'subscriptionEnd':'',
            'active': '1'
        });
    }

    onStartDateChanged(event: IMyDateModel) {
        this.clientForm.controls['subscriptionEnd'].setValue('');
        let toDate: Date = new Date(AppUtil.getFormattedDate(event,''));
        toDate.setDate(toDate.getDate() - 1);
        this.myEndDateOptions = {
            dateFormat: 'mm-dd-yyyy',
            disableUntil: { year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() }
        };
    }
    
    onFormSubmit(): void {
        if (this.clientForm.valid) {
            let formData: any = this.clientForm.value;
            let postModel: any = {
                ClientName: formData.name ? formData.name : null,
                client_domain: formData.domain ? formData.domain : null,
                is_active: formData.active == '1' ? true : false,
                subscription_start: formData.subscriptionStart ? AppUtil.getFormattedDate(formData.subscriptionStart, '', false) : null,
                subscription_end: formData.subscriptionEnd ? AppUtil.getFormattedDate(formData.subscriptionEnd, '', false) : null,
                subscription_key: null
            };
            
            if (this.actionType == Action.add) {
                this.overlay = true;
                this.service.post(ApiConfig.clientApi, postModel).subscribe(res => {
                    if (res.result) {
                        this.showSuccess(res.message);
                        setTimeout(() => {
                            this.hideDialog();
                            this.getClientList();
                        }, GlobalConst.growlLife);
                    }
                    else {
                        this.overlay = false;
                        this.showError(res.message);
                    }
                }, err => {
                    this.overlay = false;
                    this.showError('Internal server error!');
                });
            }
            else {
                this.overlay = true;
                //let updateClientApi: any = ApiConfig.clientApi.concat(this.Id.toString());
                let updateClientApi: any = ApiConfig.updateClientApi.replace("{clientID}",this.Id.toString());
                this.service.put(updateClientApi, postModel).subscribe(res => {
                    if (res.result) {
                        this.showSuccess(res.message);
                        setTimeout(() => {
                            this.hideDialog();
                            this.getClientList();
                        }, GlobalConst.growlLife);
                    }
                    else {
                        this.overlay = false;
                        this.showError(res.message);
                    }
                }, err => {
                    this.overlay = false;
                    this.showError('Internal server error!');
                });
            }
        }
    }

    getClientList(): void {
        this.overlay = true;
        this.service.get(ApiConfig.clientApi).subscribe(res => {
            this.clientList = res.result ? this.mapRows(res.data) : [];
            console.log(this.clientList);
            this.dataSource = new MatTableDataSource<any>(this.clientList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error);
        });
    }

    getClient(): void {
        this.overlay = true;
        let api: any = ApiConfig.clientApi.concat(this.Id.toString());
        this.service.get(api).subscribe(res => {
            if (res.result)
                this.setFormData(res.data[0]);
            else
                this.setDefault();
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error);
        });
    }

    mapRows(items: any[]): any {
        let dataRows: IManageClient[] = [];
        if (items.length > 0) {
            for (let item of items) {
                let row: IManageClient = {
                    clientId: item.ClientID,
                    clientName: item.ClientName,
                    clientDomain: item.client_domain,
                    isActive: item.is_active ? 'Yes' : 'No',
                    createdBy: item.CreatedBy,
                    createdOn: item.CreatedDate ? AppUtil.getDate(item.CreatedDate, 'dd-mm-yyyy') : '',
                    subscriptionStart: item.subscription_start ? AppUtil.getDate(item.subscription_start, 'dd-mm-yyyy') : '',
                    subscriptionEnd: item.subscription_end ? AppUtil.getDate(item.subscription_end, 'dd-mm-yyyy') : '',
                    subscriptionKey: item.subscription_key
                };
                dataRows.push(row);
            }
        }
        return dataRows;
    }

    onAction(actionType: string, id?: any): void {
        this.Id = id;
        this.actionType = actionType;
        if(actionType == Action.add){
            this.dialogHeader = 'Add Client';
            this.isViewMode = false;
            this.clientForm.enable();
            this.setDefault();
            this.showDialog();
        }
        if(actionType == Action.view){
            this.dialogHeader = 'View Client';
            this.isViewMode = true;
            this.getClient();
            this.clientForm.disable();
            this.showDialog();
        }
        if(actionType == Action.edit){
            this.dialogHeader = 'Update Client';
            this.isViewMode = false;
            this.getClient();
            this.clientForm.enable();
            this.showDialog();
        }
        if(actionType == Action.disable){
            if (confirm("Do you want to de-activate this client?")) {
                this.enableDisableRecord(false);
            }
        }
        if(actionType == Action.enable){
            if (confirm("Do you want to activate this client?")) {
                this.enableDisableRecord(true);
            }
        }
    }

    setFormData(formData: any):void{
        this.clientForm.patchValue({
            name:formData['ClientName'],
            domain:formData['client_domain'],
            subscriptionStart:formData['subscription_start'] ? AppUtil.setDate(formData['subscription_start']) : '',
            subscriptionEnd:formData['subscription_end'] ? AppUtil.setDate(formData['subscription_end']) : '',
            active:formData['is_active'] ? '1' : '0'
        });
    }

    enableDisableRecord(isEnable: boolean): void {
        let postModel: any = {
            is_active: isEnable
        };
        this.overlay = true;
        let updateClientApi: any = ApiConfig.clientApi.concat(this.Id.toString()).concat('/');
        this.service.put(updateClientApi, postModel).subscribe(res => {
            if (res.result) {
                this.showSuccess(res.message);
                setTimeout(() => {
                    this.getClientList();
                }, GlobalConst.growlLife);
            }
            else {
                this.overlay = false;
                this.showError(res.message);
            }
        }, err => {
            this.overlay = false;
            this.showError('Internal server error!');
        });
    }

    showDialog() {
        this.displayModal = true;
    }

    hideDialog() {
        this.displayModal = false;
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
