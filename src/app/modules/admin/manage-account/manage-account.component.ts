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
import { IManageAccount } from './manage-account.model';

@Component({
    selector: 'app-manage-account',
    templateUrl: './manage-account.component.html',
    styleUrls: ['manage-account.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ManageAccountComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    overlay: boolean = false;
    displayModal: boolean = false;
    isViewMode: boolean = false;
    dialogHeader: string;
    actionType: string = Action.add;
    
    growlLife: number = GlobalConst.growlLife;
    msgs: any[] = [];
    accountList:IManageAccount[] = [];
    dataSource:any;
    
    accountForm: FormGroup;
    Id?: number;
    accountName: string;
    subscriptionStart: any;
    subscriptionEnd: any;
    active: any;
    clientId: number;

    myStartDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    myEndDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    
    // If you want to hide column then only remove the column from the display list 
    columnList: string[] = ['accountName', 'clientName', 'subscriptionStart', 'subscriptionEnd', 'isActive', 'action'];
    clientOption: any[] = [];

    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        // To initialize FormGroup  
        this.accountForm = fb.group({
            'accountName': ['', Validators.required],
            'clientId': ['', Validators.required],
            'subscriptionStart': [null, Validators.required],
            'subscriptionEnd': [null, Validators.required],
            'keywords': [null],
            'active': ['1']
        });
    }

    ngOnInit() {
        this.getClientOption();
        this.getAccountList();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setDefault():void{
        this.accountForm.patchValue({
            'clientId':'', 
            'accountName':'', 
            'subscriptionStart':'',
            'subscriptionEnd':'',
            'keywords':'',
            'active': '1'
        });
    }

    onStartDateChanged(event: IMyDateModel) {
        this.accountForm.controls['subscriptionEnd'].setValue('');
        let toDate: Date = new Date(AppUtil.getFormattedDate(event,''));
        toDate.setDate(toDate.getDate() - 1);
        this.myEndDateOptions = {
            dateFormat: 'mm-dd-yyyy',
            disableUntil: { year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() }
        };
    }
    
    onFormSubmit(): void {
        if (this.accountForm.valid) {
            let formData: any = this.accountForm.value;
            let postModel: any = {
                AccountName: formData.accountName ? formData.accountName : null,
                client_id: formData.clientId ? formData.clientId : null,
                is_active: formData.active == '1' ? true : false,
                fromdate: formData.subscriptionStart ? AppUtil.getFormattedDate(formData.subscriptionStart, '', false) : null,
                enddate: formData.subscriptionEnd ? AppUtil.getFormattedDate(formData.subscriptionEnd, '', false) : null,
                Keywords: formData.keywords ? formData.keywords : null
            };
            
            if (this.actionType == Action.add) {
                this.overlay = true;
                this.service.post(ApiConfig.accountApi, postModel).subscribe(res => {
                    if (res.result) {
                        this.showSuccess(res.message);
                        setTimeout(() => {
                            this.hideDialog();
                            this.getAccountList();
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
                let updateClientApi: any = ApiConfig.accountApi.concat(this.Id.toString()).concat('/');
                this.service.put(updateClientApi, postModel).subscribe(res => {
                    if (res.result) {
                        this.showSuccess(res.message);
                        setTimeout(() => {
                            this.hideDialog();
                            this.getAccountList();
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

    getAccountList(): void {
        this.overlay = true;
        this.service.get(ApiConfig.accountApi).subscribe(res => {
            this.accountList = res.result ? this.mapRows(res.data) : [];
            this.dataSource = new MatTableDataSource<any>(this.accountList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error);
        });
    }

    getAccount(): void {
        this.overlay = true;
        let api: any = ApiConfig.accountApi.concat(this.Id.toString()).concat('/');
        this.service.get(api).subscribe(res => {
            if (res.result && res.data.length > 0)
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
        let dataRows: IManageAccount[] = [];
        if (items.length > 0) {
            for (let item of items) {
                let row: IManageAccount = {
                    accountId: item.AccountID,
                    accountName: item.AccountName,
                    clientId: item.clientid,
                    clientName: item.clientname,
                    isActive: item.is_active ? 'Yes' : 'No',
                    createdOn: item.createdon ? AppUtil.getDate(item.createdon, 'dd-mm-yyyy') : '',
                    subscriptionStart: item.fromdate ? AppUtil.getDate(item.fromdate, 'dd-mm-yyyy') : '',
                    subscriptionEnd: item.enddate ? AppUtil.getDate(item.enddate, 'dd-mm-yyyy') : ''
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
            this.dialogHeader = 'Add Account';
            this.isViewMode = false;
            this.accountForm.enable();
            this.setDefault();
            this.showDialog();
        }
        if(actionType == Action.view){
            this.dialogHeader = 'View Account';
            this.isViewMode = true;
            this.setDefault();
            this.getAccount();
            this.accountForm.disable();
            this.showDialog();
        }
        if(actionType == Action.edit){
            this.dialogHeader = 'Update Account';
            this.isViewMode = false;
            this.setDefault();
            this.getAccount();
            this.accountForm.enable();
            this.showDialog();
        }
        if(actionType == Action.disable){
            if (confirm("Do you want to de-activate this account?")) {
                this.enableDisableRecord(false);
            }
        }
        if(actionType == Action.enable){
            if (confirm("Do you want to activate this account?")) {
                this.enableDisableRecord(true);
            }
        }
    }

    setFormData(formData: any):void{
        this.accountForm.patchValue({
            accountName:formData['AccountName'],
            clientId:formData['clientid'],
            subscriptionStart:formData['fromdate'] ? AppUtil.setDate(formData['fromdate']) : '',
            subscriptionEnd:formData['enddate'] ? AppUtil.setDate(formData['enddate']) : '',
            active:formData['is_active'] ? '1' : '0',
            keywords:formData['Keywords']
        });
    }

    enableDisableRecord(isEnable: boolean): void {
        let postModel: any = {
            is_active: isEnable
        };
        this.overlay = true;
        let updateAccountApi: any = ApiConfig.accountApi.concat(this.Id.toString()).concat('/');
        this.service.put(updateAccountApi, postModel).subscribe(res => {
            if (res.result) {
                this.showSuccess(res.message);
                setTimeout(() => {
                    this.getAccountList();
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

    getClientOption() {
        this.service.get(ApiConfig.ddlClientApi).subscribe(res => {
            let clientList: any[] = res.result ? res.data : [];
            if (clientList.length > 0) {
                this.clientOption = clientList.map(x => {
                    return { value: x.ClientID, label: x.ClientName };
                });
            }
        }, error => { console.log(error) });
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
