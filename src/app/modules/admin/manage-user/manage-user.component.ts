import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm, FormArray } from '@angular/forms';
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
import { IManageUser } from './manage-user.model';

@Component({
    selector: 'app-manage-user',
    templateUrl: './manage-user.component.html',
    styleUrls: ['manage-user.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ManageUserComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    overlay: boolean = false;
    displayModal: boolean = false;
    isUser: boolean = false;
    isUserActivation: boolean = false;
    isViewMode: boolean = false;
    dialogHeader: string;
    
    growlLife: number = GlobalConst.growlLife;
    msgs: any[] = [];
    
    userList:IManageUser[] = [];
    dataSource:any;
    userId: any;

    userForm: FormGroup;
    userActivationForm: FormGroup;
    
    columnList: string[] = ['userName', 'email', 'clientName', 'accountName', 'isActive', 'action'];
    clientOption: any[] = [];
    accountOption: any[] = [];
    roleOption: any[] = [];
    accountRoleOption: any[] = [];


    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        this.userForm = this.fb.group({
            'userName': ['',[Validators.required]],
            'email': ['',[Validators.required, Validators.email]],
            'client': ['',[Validators.required]],
            'active': [null],
            'accountRoleMap': this.fb.array([])
        });
        this.userActivationForm = this.fb.group({
            client: [''],
            active: [''],
            accountRoleMap: this.fb.array([])
        });
    }

    ngOnInit() {
        this.getUserList();
    }

    setAccountRole(items: any[]) {
        let roleDetail: any[] = AppSession.getSessionStorage("RoleDetail"); 
        let clientId: any = this.isUser ? this.userForm.controls['client'].value : this.userActivationForm.controls['client'].value;
        let formArray = new FormArray([]);
        /*for (let item of items) {
            let Obj: any = roleDetail.filter(x=>x.accountid == item.AccountID).length > 0 ? roleDetail.filter(x=>x.accountid == item.AccountID)[0] : null;
            formArray.push(this.fb.group({
                account: Obj ? Obj.accountid : '',
                role: Obj ? Obj.roleid : ''
            }));
            this.accountRoleOption.push({account: Obj.accountid, roleOption: []});
            this.onChangeAccount(Obj ? Obj.accountid : '', clientId);
        }*/

        items.forEach((value, index) => {
            this.accountRoleOption.push({roleOption: []});
            let Obj: any = roleDetail.filter(x=>x.accountid == value.AccountID).length > 0 ? roleDetail.filter(x=>x.accountid == value.AccountID)[0] : null;
            formArray.push(this.fb.group({
                account: Obj ? Obj.accountid : '',
                role: Obj ? Obj.roleid : ''
            }));
            if(Obj){
                this.onChangeAccount(Obj.accountid, clientId, index); 
            }
        }); 

        if (this.isViewMode){
            formArray.disable();
        }
        else{
            formArray.enable();
        }

        if (this.isUser){
            this.userForm.setControl('accountRoleMap', formArray);
        }   
        else{
            this.userActivationForm.setControl('accountRoleMap', formArray);
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setDefault():void{
        this.userForm.patchValue({
            'userName':'',
            'email':'',
            'client':'',
            'active': '0',
            'accountRoleMap': null
        });
        
        this.userActivationForm.patchValue({
            'client':'',
            'active': '1',
            'accountRoleMap':null
        });
    }

    setFormData(formData: any):void{
        AppSession.setSessionStorage("RoleDetail", formData['role_detail']);
        this.onChangeClient(formData['clientid']);
        
        if(this.isUser){
            this.userForm.patchValue({
                userName:formData['username'],
                email:formData['email'],
                client:formData['clientid'],
                active:formData['active'] ? '1' : '0'
            });
        }
        if(this.isUserActivation){
            this.userActivationForm.patchValue({
                'client': formData['clientid'],
                'active': formData['active'] ? '1' : '0'
            });
        }
    }

    onUpdateUser(): void{
        if(this.userForm.valid){
            let formData: any = this.userForm.value;
        }
    }

    setRoleDetail(items: any[]): any {
        let details: any[] = [];
        for (let item of items) {
            if (item.account && item.role) {
                details.push({ account: item.account, role: item.role, is_active: 1 });
            }
        }
        return details;
    }

    onActiveUser(): void {
        if (this.userActivationForm.valid) {
            this.overlay = true;
            let formData: any = this.userActivationForm.value;
            let model: any = {
                userid: this.userId,
                active: parseInt(formData['active']),
                role_detail: this.setRoleDetail(formData['accountRoleMap'])
            };
            //console.log(model);
            this.service.post(ApiConfig.activeUserApi, model).subscribe(res => {
                if (res.result) {
                    this.showSuccess(res.message);
                    setTimeout(() => {
                        this.hideDialog();
                        this.getUserList();
                    }, GlobalConst.growlLife);
                }
                else {
                    this.showError(res.message);
                    this.overlay = false;
                }
            }, err => {
                this.overlay = false;
                this.showError('Internal server error!');
            });
        }
    }

    getUserList(): void {
        this.overlay = true;
        let accountId: any = AppSession.getSessionStorage("SelectedAccount");
        let url: any = ApiConfig.userOnAccountIdApi.replace("{id}",accountId);
        //let url: any = "assets/datasource/userlist.json";
        this.service.get(url).subscribe(res => {
            if(res.result){
                this.userList = this.mapRows(res.userlist);
                this.dataSource = new MatTableDataSource<any>(this.userList);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            else{
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error);
        });
    }

    mapRows(items: any[]): any {
        let dataRows: IManageUser[] = [];
        if (items.length > 0) {
            for (let item of items) {
                let row: IManageUser = {
                    id: item.id,
                    userName: item.username,
                    email: item.email,
                    isActive: item.active ? 'Yes' : 'No',
                    clientName: item.clientname,
                    accountName: item.account
                };
                dataRows.push(row);
            }
        }
        return dataRows;
    }

    onAction(actionType: string, id?: any): void {
        this.userId = id;
        if(actionType == Action.view || actionType == Action.edit || actionType == Action.enable){
            this.getClientOption();
        }
        if(actionType == Action.view){
            this.dialogHeader = 'View User';
            this.isViewMode = true;
            this.isUser = true;
            this.isUserActivation = false;
            this.getUser(id);
            this.userForm.disable();
            this.showDialog();
        }
        if(actionType == Action.edit){
            this.dialogHeader = 'Update User';
            this.isViewMode = false;
            this.isUser = true;
            this.isUserActivation = false;
            this.getUser(id);
            this.userForm.enable();
            this.showDialog();
        }
        if (actionType == Action.enable) {
            this.dialogHeader = 'Activate User';
            this.isViewMode = false;
            this.isUser = false;
            this.isUserActivation = true;
            this.getUser(id);
            this.userForm.enable();
            this.showDialog();
        }
        if(actionType == Action.disable){
            if (confirm("Do you want to de-activate this user?")) {
                this.disableUser(id);
            }
        }
    }

    getUser(id:number): void {
        this.overlay = true;
        let api: any = ApiConfig.userApi.concat(id.toString());
        this.service.get(api).subscribe(res => {
            if (res.result)
                this.setFormData(res.userdetail);
            else
                this.setDefault();
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error);
        });
    }

    disableUser(id: number): void {
        let model: any = { active: false };
        this.overlay = true;
        let api: any = ApiConfig.userApi.concat(id.toString()).concat('/');
        this.service.put(api, model).subscribe(res => {
            if (res.result) {
                this.showSuccess(res.message);
                setTimeout(() => {
                    this.getUserList();
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

    onChangeClient(clientId: any) {
        this.accountOption = [];
        this.roleOption = [];
        if (clientId) {
            this.getAccountOnClientIdOption(clientId);
        }
    }

    onChangeAccount(accountId: any, clientId: any, index) {
        this.roleOption = [];
        if (accountId) {
            this.getRoleOnClientAccountOption(clientId, accountId,index);
        }
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

    getAccountOption() {
        this.overlay = true;
        let api: any = ApiConfig.ddlAccountApi;
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let accountList: any[] = res.data;
                if (accountList.length > 0) {
                    this.accountOption = accountList.map(x => {
                        return { value: x.AccountID, label: x.AccountName };
                    });
                }
            }
            this.overlay = false;
        }, error => {
            this.overlay = false; 
            console.log(error) 
        });
    }

    getRoleOption() {
        this.overlay = true;
        this.service.get(ApiConfig.ddlRoleApi).subscribe(res => {
            let roleList: any[] = res.result ? res.results : [];
            if (roleList.length > 0) {
                this.roleOption = roleList.map(x => {
                    return { value: x.Roleid, label: x.Rolename };
                });
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error)
        });
    }

    getAccountOnClientIdOption(clientId: any) {
        this.overlay = true;
        let api: any = ApiConfig.ddlAccountOnClientIdApi.replace("{id}",clientId);
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let accountList: any[] = res.data;
                this.accountOption = accountList.map(x => {
                    return { value: x.AccountID, label: x.AccountName };
                });
                this.setAccountRole(accountList);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false; 
            console.log(error) 
        });
    }

    getRoleOnClientAccountOption(clientId: any, accountId: any, index: any) {
        let model: any = {
            client_id: clientId,
            account_id: accountId
        };
        if (clientId && accountId) {
            this.overlay = true;
            this.service.post(ApiConfig.ddlRoleApi, model).subscribe(res => {
                let roleList: any[] = res.result ? res.results : [];
                if (roleList.length > 0) {
                    /*this.roleOption = roleList.map(x => {
                        return { value: x.Roleid, label: x.Rolename };
                    });*/
                    
                    this.accountRoleOption[index].roleOption = roleList.map(x => {
                        return { value: x.Roleid, label: x.Rolename };
                    });
                }
                this.overlay = false;
            }, error => {
                this.overlay = false;
                console.log(error)
            });
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
