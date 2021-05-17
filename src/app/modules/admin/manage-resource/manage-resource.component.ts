import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { TreeNode } from 'primeng/api';

import { HttpService } from '../../../core/services/http.service';
import { ApiConfig } from '../../../core/config/api-config';
import { AppSession } from '../../../core/config/app-session';
import { AppUtil } from '../../../core/config/app-util';
import { GlobalConst, Action } from '../../../core/config/app-enum';
import { environment } from '../../../../environments/environment';
import { Root, Child } from './manage-resource.model';

declare var $: any;

@Component({
    selector: 'app-manage-resource',
    templateUrl: './manage-resource.component.html',
    styleUrls: ['manage-resource.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ManageResourceComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    overlay: boolean = false;
    displayModal: boolean = false;
    isViewMode: boolean = false;
    dialogHeader: string;
    
    growlLife: number = GlobalConst.growlLife;
    msgs: any[] = [];
    columnList: string[] = [];
    dataSource:any;

    clientOption:any[] = [];
    accountOption: any[] = [];
    roleOption: any[] = [];
    accountList: any[] = [];
    
    clientId: any;
    accountId: any;
    roleId: any;

    resourceListOriginal: any[] = [];
    resourceList: TreeNode[] = [];
    selectedItems: TreeNode[] = [];
    dataArray: any[] = [];
    
    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
    }

    ngOnInit() {
        this.getClientOption();
        this.getAccountList();
        this.setDefault();
    }

    setDefault(){
        this.clientId = '';
        this.accountId = '';
        this.roleId = '';
    }

    onChangeClient(value: any){
        this.accountId = '';
        this.roleId = '';
        this.accountOption = [];
        this.roleOption = [];
        this.resourceList = [];
        this.dataArray = [];
        if(value){
            let items: any = this.accountList.filter(x=> x.clientid == value );
            if(items && items.length > 0){
                this.accountOption = items.map(x => {
                    return { value: x.AccountID, label: x.AccountName };
                });
            }
        }
    }

    onChangeAccount(value: any){
        this.roleId = '';
        this.roleOption = [];
        this.resourceList = [];
        this.dataArray = [];
        if(value){
            this.overlay = true;
            let model: any = { client_id: this.clientId, account_id: this.accountId };
            this.service.post(ApiConfig.ddlRoleApi, model).subscribe(res=>{
                if(res.result){
                    let items: any = res.results;
                    this.roleOption = items.map(x => {
                        return { value: x.Roleid, label: x.Rolename };
                    });    
                }
                this.overlay = false;
            }, error=>{
                console.log(error);
                this.overlay = false;
            });
        }
    }

    onChangeRole(value: any){
        if(value){
            this.overlay = true;
            let api: any = ApiConfig.aclBasedOnRoleApi.replace("{roleId}", this.roleId);
            //let api: any = environment.jsonFilePath + 'acl.json';
            this.service.get(api).subscribe(res=>{
                if(res.result){
                    let data: any = res.results;
                    this.resourceList = [];
                    this.dataArray = [];
                    this.resourceListOriginal = data.acl;
                    this.setResource(data.acl);
                    //this.dataArray = ["11_1_2","12_2_3"];
                    this.checkNode(this.resourceList, this.dataArray);
                    this.expandAll();
                }
                else{
                    this.resourceList = [];
                    this.dataArray = [];
                }
                this.overlay = false;
            }, error=>{
                console.log(error);
                this.overlay = false;
            });
        }
        else{
            this.resourceList = [];
            this.dataArray = [];
        }
    }

    setResource(items: any[]){
        if(items.length > 0){
            for(let item of items){
                let root: Root = {};
                root.label = item.resource_name;
                root.data = item.resource_id;
                root.expandedIcon = '';
                root.collapsedIcon = '';
                root.children = (item.resource_widgets && item.resource_widgets.length > 0) ? this.setWidget(item.resource_widgets, item.resource_id) : [];
                root.leaf = (item.resource_widgets && item.resource_widgets.length > 0) ? false : true;
                this.resourceList.push(root);
            }
        }
        else{
            this.resourceList = [];
        }
    }

    setWidget(items: any[], resourceId: any): Child[]{
        let children: Child[] = [];
        for(let item of items){
            let child: Child = {};
            child.label = item.widget_label;
            child.data = resourceId +'_'+item.widget_id;
            child.expandedIcon = '';
            child.collapsedIcon = '';
            child.children = (item.widget_actions && item.widget_actions.length > 0) ? this.setAction(item.widget_actions, item.widget_id, resourceId) : [];
            child.leaf = (item.widget_actions && item.widget_actions.length > 0) ? false : true;
            children.push(child); 
        }
        return children;
    }

    setAction(items: any[], widgetId: any, resourceId: any): Child[]{
        let children: Child[] = [];
        for(let item of items){
            let child: Child = {};
            child.label = item.action_name;
            child.data = resourceId + '_' + widgetId + '_' + item.action_id;
            child.icon = '';
            child.leaf = true;
            children.push(child); 
            
            if(item.action_selected){
                this.dataArray.push(child.data)
            }
        }
        return children;
    }

    checkNode(nodes:TreeNode[], str:string[]) {
        for(let i=0 ; i < nodes.length ; i++) {
            if(!nodes[i].leaf && nodes[i].children[0].leaf) {
                for(let j=0 ; j < nodes[i].children.length ; j++) {
                    if(str.indexOf(nodes[i].children[j].data) >= 0) {
                        if(this.selectedItems.indexOf(nodes[i].children[j]) == -1){
                            this.selectedItems.push(nodes[i].children[j]);
                        }
                    }
                }
            }
            
            /*if (nodes[i].leaf) {
                return;
            }*/

            if (nodes[i].leaf) {
                if(str.indexOf(nodes[i].data) >= 0) {
                    if(this.selectedItems.indexOf(nodes[i]) == -1){
                        this.selectedItems.push(nodes[i]);
                    }
                }
            }

            if (nodes[i].children) {
                this.checkNode(nodes[i].children, str);
                let count = nodes[i].children.length;
                let c = 0;
                for (let j = 0; j < nodes[i].children.length; j++) {
                    if (this.selectedItems.indexOf(nodes[i].children[j]) >= 0) {
                        c++;
                    }
                    if (nodes[i].children[j].partialSelected) nodes[i].partialSelected = true;
                }
                if (c == 0) { }
                else if (c == count) {
                    nodes[i].partialSelected = false;
                    if (this.selectedItems.indexOf(nodes[i]) == -1) {
                        this.selectedItems.push(nodes[i]);
                    }
                }
                else {
                    nodes[i].partialSelected = true;
                }
            }

        }
    }

    nodeSelect(event) {
        this.addNode(event.node);
        this.selectedItems = [];
        this.checkNode(this.resourceList, this.dataArray);
    }
    
    nodeUnselect(event) {
        this.removeNode(event.node);
        this.selectedItems = [];
        this.checkNode(this.resourceList, this.dataArray);
    }

    removeNode(node: TreeNode) {
        if(node.leaf) {
            this.dataArray.splice(this.dataArray.indexOf(node.data),1);
            return;
        } 
        for(let i=0 ; i < node.children.length ; i++){
            this.removeNode(node.children[i]);
        }
    }

    addNode(node: TreeNode) {
        if(node.leaf) {
            if(this.dataArray.indexOf(node.data) == -1){
                this.dataArray.push(node.data);
            }
            return;
        }
        for(let i=0 ; i < node.children.length ; i++) {
            this.addNode(node.children[i]);
        }
    }

    expandRecursive(node:TreeNode, isExpand:boolean){
        node.expanded = isExpand;
        if(node.children){
            node.children.forEach( childNode => {
                this.expandRecursive(childNode, isExpand);
            } );
        }
    }

    expandAll(){
        this.resourceList.forEach( node => {
            this.expandRecursive(node, true);
        } );
    }

    collapseAll(){
        this.resourceList.forEach( node => {
            this.expandRecursive(node, false);
        } );
    }

    onSubmit(): void{
        //console.log(this.dataArray);

        this.overlay = true;
        this.mapPostModel();
        let model: any = { acl: this.resourceListOriginal };
        //console.log(model);

        let api: any = ApiConfig.aclBasedOnRoleApi.replace("{roleId}", this.roleId);
        this.service.post(api, model).subscribe(res=>{
            if(res.result){
                this.showSuccess(res.message);
            }
            else{
                this.showError(res.error);
            }
            this.overlay = false;
        }, error=>{
            this.overlay = false;
            console.log(error);
        });        
    }

    mapPostModel(): void{
        if(this.dataArray && this.dataArray.length > 0){
            for(let item of this.dataArray){
                let resourceId:any = null, widgetId: any = null, actionId: any = null;
                let Ids: any[] = item.split('_');
                resourceId = Ids.length > 0 ? Ids[0] : null;
                widgetId = Ids.length > 1 ? Ids[1] : null;
                actionId = Ids.length > 2 ? Ids[2] : null;

                let isResourceExist: boolean = this.resourceListOriginal.filter(x=>x.resource_id == resourceId).length > 0 ? true : false;
                if(isResourceExist){
                    this.resourceListOriginal.filter(x=>x.resource_id == resourceId)[0].resource_selected = true;
                    let isWidgetExist: boolean = this.resourceListOriginal.filter(x=>x.resource_id == resourceId)[0].resource_widgets.filter(x=>x.widget_id == widgetId).length > 0 ? true : false;
                    if(isWidgetExist){
                        this.resourceListOriginal.filter(x=>x.resource_id == resourceId)[0].resource_widgets.filter(x=>x.widget_id == widgetId)[0].widget_selected = true;
                        let isActionExist: boolean = this.resourceListOriginal.filter(x=>x.resource_id == resourceId)[0].resource_widgets.filter(x=>x.widget_id == widgetId)[0].widget_actions.filter(x=> x.action_id == actionId).length > 0 ? true : false;
                        if(isActionExist){
                            this.resourceListOriginal.filter(x=>x.resource_id == resourceId)[0].resource_widgets.filter(x=>x.widget_id == widgetId)[0].widget_actions.filter(x=> x.action_id == actionId)[0].action_selected = true;
                        }
                    }
                }
            }
        }
    }

    onCancel(): void{
        
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


    getAccountList(): void {
        this.overlay = true;
        this.service.get(ApiConfig.accountApi).subscribe(res => {
            this.accountList = res.result ? res.data : [];
            this.overlay = false;
        }, error => {
            this.overlay = false;
            console.log(error);
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
