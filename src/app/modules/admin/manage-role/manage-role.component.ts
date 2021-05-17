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
import { IManageRole } from './manage-role.model';

@Component({
    selector: 'app-manage-role',
    templateUrl: './manage-role.component.html',
    styleUrls: ['manage-role.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ManageRoleComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    overlay: boolean = false;
    displayModal: boolean = false;
    isViewMode: boolean = false;
    dialogHeader: string;
    
    growlLife: number = GlobalConst.growlLife;
    msgs: any[] = [];
    columnList: string[] = [];
    clientList:IManageRole[] = [];
    dataSource:any;
    
    clientForm: FormGroup;
    name: any;
    domain: any;
    subscriptionStart: any;
    subscriptionEnd: any;
    active: any;

    myStartDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    myEndDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };

    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        // To initialize FormGroup  
        this.clientForm = fb.group({
            'name': [null, Validators.required],
            'domain': [null, Validators.required],
            'subscriptionStart': [null, Validators.required],
            'subscriptionEnd': [null, Validators.required],
            'active': ['1']
        });
    }

    ngOnInit() {
        this.overlay = true;
        setTimeout(() => {
            this.getClientList();
            this.overlay = false;
        }, 3000);        
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setDefault():void{
        /*this.clientForm.patchValue({
            'name': null,
            'domain': null,
            'subscriptionStart': null,
            'subscriptionEnd': null,
            'active': '1'
        });*/
        this.clientForm.reset();
        this.clientForm.patchValue({'active': '1'});
    }

    onStartDateChanged(event: IMyDateModel) {
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
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
                clientname: formData.name ? formData.name : null,
                client_domain: formData.domain ? formData.domain : null,
                is_active: formData.active == 'true' ? 0 : 1,
                subscription_start: formData.subscriptionStart ? AppUtil.getFormattedDate(formData.subscriptionStart, '', false) : null,
                subscription_end: formData.subscriptionEnd ? AppUtil.getFormattedDate(formData.subscriptionEnd, '', false) : null,
                createdby: '',
                createddate: AppUtil.getDate(new Date(), '')
            };
            
            this.overlay = true;
            this.showSuccess('Data added sucessfully!');
            setTimeout(() => {
                this.setDefault();
                this.overlay = false;
                this.hideDialog();
            }, GlobalConst.growlLife);
        }
    }

    getClientList(): void{
        // If you want to hide column then only remove the column from the display list 
        this.columnList = ['clientName', 'clientDomain', 'subscriptionStart', 'subscriptionEnd', 'isActive', 'action'];

        this.clientList = [
            {clientId:1, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'},
            {clientId:2, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'},
            {clientId:3, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'},
            {clientId:4, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'},
            {clientId:5, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'},
            {clientId:6, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'},
            {clientId:7, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'},
            {clientId:8, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'},
            {clientId:9, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'},
            {clientId:10, clientName:'name1', clientDomain:'domain1', subscriptionStart:'2020-09-08', subscriptionEnd:'2020-09-08', isActive: 'Yes'}
        ];
        this.dataSource = new MatTableDataSource<any>(this.clientList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    onAction(actionType: string, id?: any): void {
        if(actionType == Action.add){
            this.dialogHeader = 'Add Client';
            this.isViewMode = false;
            this.setDisable();
            this.setDefault();
            this.showDialog();
        }
        if(actionType == Action.view){
            this.dialogHeader = 'View Client';
            this.isViewMode = true;
            this.setDisable();
            this.showDialog();
        }
        if(actionType == Action.edit){
            this.dialogHeader = 'Update Client';
            this.isViewMode = false;
            this.setDisable();
            this.showDialog();
        }
        if(actionType == Action.delete){
            if (confirm("Do you want to delete this record?")) {
                this.showSuccess('Data updated sucessfully!');
            }
            else {
                this.showError('Data updated fails!');
            }
        }
    }

    setDisable(): void{
        if(this.isViewMode){
            this.clientForm.controls['name'].disable();
            this.clientForm.controls['domain'].disable();
            this.clientForm.controls['subscriptionStart'].disable();
            this.clientForm.controls['subscriptionEnd'].disable();
            this.clientForm.controls['active'].disable();
        }
        else{
            this.clientForm.controls['name'].enable();
            this.clientForm.controls['domain'].enable();
            this.clientForm.controls['subscriptionStart'].enable();
            this.clientForm.controls['subscriptionEnd'].enable();
            this.clientForm.controls['active'].enable();
        }
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
