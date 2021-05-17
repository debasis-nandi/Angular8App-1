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
import { GlobalConst, RoleType } from '../../core/config/app-enum';
import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    userInfo: any;
    accountId: any;
    imgPath: any = environment.imaPath;
    overlay: boolean = false;
    msgs: any[] = [];
    growlLife: number = GlobalConst.growlLife;

    columnList: string[] = [];
    indexSnapshot: any = {
        indexDetails: {},
        indexCharacteristics: {},
        indexLevels: []
    };
    lineChartData: any;
    lineChartOptions: any;
    panelCount: any = {
        totalIndex:'#',
        pending:'#',
        completed:'#',
        rebalCount:'#'
    }

    showHelpModal: boolean = false;
    showViewModal: boolean = false;
    showConstituentModel: boolean = false;

    indexCompositionTitle: any = { indexName:'', lastRun: '', indexLevel:'' };
    
    constructor(private fb: FormBuilder, private router: Router, private service: HttpService) {
        this.userInfo = AppSession.getSessionStorage('UserInfo');
        this.accountId = AppSession.getSessionStorage('SelectedAccount');
    }

    ngOnInit() {
        this.getPanelCount();
        this.getIndicesList();
        this.getStatsList();
        this.getUpcomingRebalanceList();
        this.getUpcomingHolidaysList();
    }

    getStatsList(): void {
        this.overlay = true;
        //let api: any = environment.jsonFilePath + 'stats.json';
        let api: any = ApiConfig.indexListApi.replace("{account_id}", this.accountId);
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    let items: any[] = res.results;
                    let dataSource: any[] = [
                        { "assetClass": "Equity", "noOfIndices": items.length },
                        { "assetClass": "Fixed Income", "noOfIndices": 0 },
                        { "assetClass": "Rolling Futures", "noOfIndices": 0 },
                        { "assetClass": "Commodities", "noOfIndices": 0 },
                    ];
                    this.setStatsTable(dataSource);
                    this.overlay = false;
                }
                else {
                    this.setStatsTable([]);
                    this.showError(res.message);
                    this.overlay = false;
                }
            }, err => {
                this.setStatsTable([]);
                console.log(err);
                this.overlay = false;
            });
    }

    getPanelCount(): void {
        this.overlay = true;
        let api: any = ApiConfig.panelCountApi.replace("{account_id}", this.accountId);
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    let panelCount: any = res.results;
                    this.panelCount = {
                        totalIndex:panelCount.total_index,
                        pending:panelCount.pending,
                        completed:panelCount.completed,
                        rebalCount:panelCount.rebal_count
                    };
                }
                this.overlay = false;
            }, err => {
                console.log(err);
                this.overlay = false;
            });
    }

    getUpcomingRebalanceList(): void {
        this.overlay = true;
        //let api: any = environment.jsonFilePath + 'rebalance.json';
        let api: any = ApiConfig.rebalListApi.replace("{account_id}", this.accountId);
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    let rebalanceList: any[] = res.results;
                    this.setUpcomingRebalanceTable(rebalanceList);
                    this.overlay = false;
                }
                else {
                    this.showError(res.message);
                    this.overlay = false;
                }
            }, err => {
                console.log(err);
                this.overlay = false;
            });
    }

    getUpcomingHolidaysList(): void {
        this.overlay = true;
        //let api: any = environment.jsonFilePath + 'holiday.json';
        let api: any = ApiConfig.holidayListApi;
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    let holidayList: any[] = res.results;
                    this.setUpcomingHolidayTable(holidayList);
                    this.overlay = false;
                }
                else {
                    this.showError(res.message);
                    this.overlay = false;
                }
            }, err => {
                console.log(err);
                this.overlay = false;
            });
    }

    setStatsTable(dataSource: any[]): void {
        $('#Stats_table').DataTable({
            data: dataSource,
            columns: [
                { "data": "assetClass" },
                { "data": "noOfIndices" }
            ],
            responsive: true,
            ordering: true,
            fixedColumns: false,
            result: false,
            bFilter: false,
            bInfo: false,
            paging: false,
            searching: false,
            pageLength: 10,
            "scrollX": true,
            "scrollY": 140,
            columnDefs: [
                { width: '50%', targets: 0 }
            ],
            "order": [[ 1, "desc" ]]
        });
    }

    setUpcomingRebalanceTable(dataSource: any[]): void{
        $('#Rebalance_table').DataTable({
            data: dataSource,
            columns: [
                { 
                    "data": "indexName",
                    "render": function (indexName) {
                        return '<span class="dynamicwidth_xs text_ellipsis" title="'+ indexName +'">'+ indexName +'</span>'
                    } 
                },
                { "data": "rebalance_date" }
            ],
            responsive: true,
            ordering: true,
            fixedColumns: false,
            result: false,
            bFilter: false,
            bInfo: false,
            paging: false,
            searching: false,
            pageLength: 10,
            "scrollY": 140,
            "scrollX": true,
            columnDefs: [
                { width: '70%', targets: 0 },
            ],
        });
    }

    setUpcomingHolidayTable(dataSource: any[]): void{
        $('#Holidays_table').DataTable({
            data: dataSource,
            columns: [
                { "data": "code" },
                { "data": "holidays" },
                { 
                    "data": "description",
                    "render": function (description) {
                        return '<span class="dynamicwidth_xs text_ellipsis" title="'+ description +'">'+ description +'</span>'
                    } 
                }
            ],
            responsive: true,
            ordering: true,
            fixedColumns: false,
            result: false,
            bFilter: false,
            bInfo: false,
            paging: false,
            searching: false,
            pageLength: 10,
            "scrollY": 140,
            "scrollX": true
        });
    }

    getIndicesList(): void {
        this.overlay = true;
        //let api: any = environment.jsonFilePath + 'indices.json';
        let api: any = ApiConfig.indexListApi.replace("{account_id}", this.accountId);
        let isEnableDelete: boolean = false;
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    let indicesList: any[] = res.results;
                    let roleType: any = this.userInfo['role_detail'].filter(x=>x.accountid == this.accountId).length > 0 ? this.userInfo['role_detail'].filter(x=>x.accountid == this.accountId)[0].roletype : null;
                    isEnableDelete = (roleType == RoleType.clientAdmin || roleType == RoleType.accountManager) ? true : false;
                    this.setIndicesTable(indicesList, isEnableDelete);
                    this.overlay = false;
                }
                else {
                    this.setIndicesTable([], isEnableDelete);
                    this.showError(res.message);
                    this.overlay = false;
                }
            }, err => {
                this.setIndicesTable([], isEnableDelete);
                console.log(err);
                this.overlay = false;
            });
    }

    setIndicesTable(dataSource: any[],isEnableDelete: boolean): void {
        $('#Indices_table').DataTable().destroy();
        let table = $('#Indices_table').DataTable({
            data: dataSource,
            columns: [
                {
                    "data": "ind_name",
                    "render": function (ind_name) {
                        if (ind_name.length > 40)
                            return '<span class="dynamicwidth_xs text_ellipsis" title="' + ind_name + '">' + ind_name + '</span>';
                        else
                            return '<span class="dynamicwidth_xs" title="' + ind_name + '">' + ind_name + '</span>';
                    }
                },
                { "data": "ind_ticker" },
                { "data": "ind_currency" },
                { "data": "ind_asset" },
                {
                    "data": "last_run",
                    "render": function (last_run) {
                        return (last_run == 'Not applicable') ? last_run : AppUtil.getDate(last_run, 'yyyy-mm-dd')
                    }
                },
                { "data": "index_level" },
                {
                    "data": "%change",
                    "render": function (data) {
                        if(data == 'Not applicable'){ return data }
                        else{
                            if(data > 0){ return '<span class="positive">' + data + '</span>'; }
                            else if(data < 0){ return '<span class="negative">' + data + '</span>'; }
                            else{ return data; }
                        }
                    }
                },
                {
                    "data": "ind_id",
                    "render": function (ind_id) {
                        if(isEnableDelete){
                            return '<a href="javascript:void(0)" class="bg_lightgrey marginR5 view" title="View" data-toggle="modal" data-target="#viewModal" data-backdrop="static" data-keyboard="false"><i class="fa fa-eye"></i></a>' +
                            '<a href="javascript:void(0)" class="bg_lightblue2 marginR5 constituent" title="Constituent" data-toggle="modal" data-target="#expandModal" data-backdrop="static" data-keyboard="false"><i class="fa fa-expand"></i></a>' +
                            '<a href="javascript:void(0)" class="bg_lightPurple marginR5 delete" title="Delete"><i class="fa fa-trash"></i></a>';
                        }
                        else{
                            return '<a href="javascript:void(0)" class="bg_lightgrey marginR5 view" title="View" data-toggle="modal" data-target="#viewModal" data-backdrop="static" data-keyboard="false"><i class="fa fa-eye"></i></a>' +
                            '<a href="javascript:void(0)" class="bg_lightblue2 marginR5 constituent" title="Constituent" data-toggle="modal" data-target="#expandModal" data-backdrop="static" data-keyboard="false"><i class="fa fa-expand"></i></a>';
                        }
                    }
                }
            ],
            createdRow: function (row, data, index) {
                $('td', row).eq(7).addClass('table_icons');
            },
            responsive: true,
            ordering: true,
            fixedColumns: false,
            result: true,
            bFilter: true,
            bInfo: true,
            paging: true,
            searching: true,
            pageLength: 10,
            columnDefs: [
                { width: '40%', targets: 0 },
                { width: '10%', targets: 1 },
                { width: '5%', targets: 2 },
                { width: '5%', targets: 3 },
                { width: '5%', targets: 4 },
                { width: '15%', targets: 5 },
                { width: '5%', targets: 6 },
                { width: '15%', targets: 7 },
                { orderable: false, targets: -1 },
            ],
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Type in keywords to filter...",
                "emptyTable": "No data available in table"
            }
        });

        // View record
        table.on('click', '.view', event => {
            let $tr = $(event.target).closest('tr');
            let data = table.row($tr).data();
            this.getIndexSnapshot(data);
            this.openModal('View');
        });

        // Constituent record
        table.on('click', '.constituent', event => {
            let $tr = $(event.target).closest('tr');
            let data = table.row($tr).data();
            AppSession.setSessionStorage("ConstituentRowData",data);
            this.getConstituent(data);
            this.openModal('Constituent');
        });

        // Calendar record
        table.on('click', '.calendar', event => {
            let $tr = $(event.target).closest('tr');
            let data = table.row($tr).data();
        });

        // Delete record
        table.on('click', '.delete', event => {
            let $tr = $(event.target).closest('tr');
            let data = table.row($tr).data();
            if(confirm('Do you want to delete index?')){
                this.deleteIndex(data.ind_id);     
            }
        });

    }

    getConstituent(rowData: any): void {
        this.overlay = true;
        this.indexCompositionTitle = { indexName: '', lastRun: '', indexLevel:'' };
        this.indexCompositionTitle.indexName = rowData.ind_name;
        //let api: any = environment.jsonFilePath + 'indices.json';
        let api: any = ApiConfig.constituentApi.replace('{index_id}', rowData.ind_id);
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    this.indexCompositionTitle.lastRun = res.last_run_date;
                    this.indexCompositionTitle.indexLevel = res.index_level;
                    let dataSource: any[] = res.results;
                    this.setConstituentTable(dataSource);
                    this.overlay = false;
                }
                else {
                    this.showError(res.message);
                    this.overlay = false;
                }
            }, err => {
                console.log(err);
                this.overlay = false;
            });
    }

    onDownloadConstituent(): void {
        //this.overlay = true;
        let rowData: any = AppSession.getSessionStorage("ConstituentRowData");
        // get index data
        let indexDetailapi: any = ApiConfig.constituentApi.replace("{index_id}", rowData.ind_id);
        this.service.get(indexDetailapi).subscribe(data => {
            if (data.result) {
                let downloadApi: any = ApiConfig.downloadCompositionApi.replace("{fileName}", data.file_name).replace("{id}",rowData.ind_id);
                //let fileName: any = 'Index_Data.xls';
                //let fileName: any = data.file_name + '.xls';
                let fileName: any = this.indexCompositionTitle.indexName + '.xls';
                this.service.getExcelData(downloadApi).subscribe(res => {
                    AppUtil.downloadFile(res, fileName);
                    //this.overlay = false;
                }, err => {
                    //this.overlay = false;
                    this.showError("Internal server error");
                    console.log(err);
                });
            }
        }, error => {
            //this.overlay = false;
            this.showError("Internal server error");
            console.log(error);
        });

    }

    getIndexSnapshot(indexDetail: any): void {
        /*this.overlay = true;
        let api: any = environment.jsonFilePath + 'indexsnapshot.json';
        this.service.getConfig(api)
            .subscribe(res => {
                if (res.result) {
                    this.indexSnapshot = res.data;
                    this.setIndexDetail(indexDetail);
                    this.getIndexLevel(indexDetail);
                    this.getPerformance(indexDetail);
                    this.overlay = false;
                }
                else {
                    this.showError(res.message);
                    this.overlay = false;
                }
            }, err => {
                console.log(err);
                this.overlay = false;
            });*/
        
        this.indexSnapshot = { indexDetails: {}, indexCharacteristics: {}, indexLevels: [] };
        this.setIndexDetail(indexDetail);
        this.getCharacteristics(indexDetail);
        this.getIndexLevel(indexDetail);
        this.getPerformance(indexDetail);
        this.getCalendarYearPerformance(indexDetail);
    }

    getIndexLevel(indexDetail: any): void {
        let api: any = ApiConfig.indexLevelApi.replace("{index_id}", indexDetail.ind_id);
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    this.indexSnapshot.indexLevels = res.results;
                    this.setIndexSnapshotTable(this.indexSnapshot.indexLevels);
                    this.setIndexLevelChart(this.indexSnapshot.indexLevels);
                }
            }, err => {
                console.log(err);
            });
    }

    getPerformance(indexDetail: any): void {
        let api: any = ApiConfig.indexPerformanceApi.replace("{index_id}", indexDetail.ind_id);
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    let dataSource: any[] = res.results;
                    this.setPerformanceTable(dataSource);
                }
            }, err => {
                console.log(err);
            });
    }

    getCalendarYearPerformance(indexDetail: any): void {
        //let api: any = environment.jsonFilePath + 'CalendarYearPerformance.json';
        let api: any = ApiConfig.calYearPerformanceApi.replace("{index_id}", indexDetail.ind_id);
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    let dataSource: any[] = res.results;
                    let columns = [];
                    columns.push({"title": "", "data":""});
                    for (let i = 0; i < 5; i++) {
                        let currentYear = new Date().getFullYear();
                        let year = currentYear - i;
                        columns.push({ "title": year, "data": year });
                    }
                    this.setCalendarYearPerformanceTable(dataSource,columns);
                }
            }, err => {
                console.log(err);
            });
    }

    getCharacteristics(indexDetail: any): void {
        let api: any = ApiConfig.indexCharacteristicsApi.replace("{index_id}", indexDetail.ind_id)
        this.service.get(api)
            .subscribe(res => {
                if (res.result) {
                    let data: any = res.results;
                    this.indexSnapshot.indexCharacteristics = {
                        indexOfConstituents: data.constituent,
                        weightLargestConstituent: data.Weight_Largest_Constituent ? data.Weight_Largest_Constituent : 'NA',
                        constituentMarket: 'NA',
                        meanTotalMarketCap: 'NA',
                        largestTotalMarketCap: 'NA',
                        smallestTotalMarketCap: 'NA',
                        weightTop10Constituent: data.top_const_wht ? data.top_const_wht : 'NA'
                    };
                }
            }, err => {
                console.log(err);
            });
    }

    setPerformanceTable(dataSource: any[]): void {
        $('#Performance_table').DataTable().destroy();
        var tbl = $('#Performance_table').DataTable({
            data: dataSource,
            columns: [
                { "data": "" },
                { "data": "1" },
                { "data": "3" },
                { "data": "5" },
                { "data": "10" },
                { "data": "YTD" }
            ],
            responsive: false,
            ordering: false,
            fixedColumns: false,
            result: false,
            bFilter: false,
            bInfo: false,
            paging: false,
            searching: false,
            pageLength: 10,
            "scrollX": true,
            "scrollY": 140,
            columnDefs: [
                { width: '25%', targets: 0 },
                { width: '15%', targets: 1 },
                { width: '15%', targets: 2 },
                { width: '15%', targets: 3 },
                { width: '15%', targets: 4 },
                { width: '15%', targets: 5 }
            ]
        });
        
        window.setTimeout(function () {
            tbl.table().columns.adjust().draw();
        },1);
    }

    setCalendarYearPerformanceTable(dataSource: any[], dataColumn: any[]): void {
        
        $('#calendarYearPerformance_table').DataTable().destroy();
        var tbl1 = $('#calendarYearPerformance_table').DataTable({
            data: dataSource,
            columns: dataColumn,
            responsive: false,
            ordering: false,
            fixedColumns: false,
            result: false,
            bFilter: false,
            bInfo: false,
            paging: false,
            searching: false,
            pageLength: 10,
            "scrollX": true,
            "scrollY": 140,
            columnDefs: [
                { width: '25%', targets: 0 },
                { width: '15%', targets: 1 },
                { width: '15%', targets: 2 },
                { width: '15%', targets: 3 },
                { width: '15%', targets: 4 },
                { width: '15%', targets: 5 }
            ]
        });
        
        window.setTimeout(function () {
            tbl1.table().columns.adjust().draw();
        },100);
    }

    setIndexDetail(indexDetail: any): void{
        this.indexSnapshot.indexDetails = {
            indexName: indexDetail.ind_name,
            indexTicker: indexDetail.ind_ticker,
            indexCurrency: indexDetail.ind_currency,
            returnType: indexDetail.ind_rtn_typ,
            assetClass: indexDetail.ind_asset,
            launchDate: AppUtil.getDate(indexDetail.ind_onboard_date, 'yyyy-mm-dd'),
            baseDate: AppUtil.getDate(indexDetail.ind_base_date,'yyyy-mm-dd'),
            lastRun: indexDetail.last_run,
            indexLvl: indexDetail.index_lvl
        };
    }

    setIndexLevelChart(dataSource: any): void{
        let arrayLabel = Object.keys(dataSource).map(function(index){
            let calDate = AppUtil.getDate(dataSource[index].cal_date, 'yyyy-mm-dd');
            return calDate;
        });
        let arrayData = Object.keys(dataSource).map(function(index){
            let data = dataSource[index].index_level;
            return data;
        });
        
        this.lineChartData = {
            labels: arrayLabel,
            datasets: [
                {
                    label: 'Index Level',
                    data: arrayData,
                    borderWidth: 1,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)'
                }
            ]
        }

        this.lineChartOptions = {
            title: {
                display: true,
                text: 'Index Level Chart',
                fontSize: 16
            },
            legend: {
                position: 'bottom'
            }
        };

    }

    setIndexSnapshotTable(dataSource: any[]): void {
        $('#indexLevels').DataTable().destroy();
        let table = $('#indexLevels').DataTable({
            data: dataSource,
            columns: [
                { 
                    "data": "cal_date",
                    "render": function (cal_date) {
                        return cal_date ? AppUtil.getDate(cal_date, 'yyyy-mm-dd') : ''
                    } 
                },
                { "data": "index_level" }
            ],
            responsive: false,
            ordering: true,
            fixedColumns: false,
            result: true,
            bFilter: false,
            bInfo: true,
            paging: true,
            searching: false,
            pageLength: 28,
            lengthChange: false,
            columnDefs: [
                { width: '40%', targets: 0 },
                { width: '60%', targets: 1 },
                { orderable: false, targets: -1 },
            ]
        });
    }

    setConstituentTable(dataSource: any[]): void {
        $('#expandTable').DataTable().destroy();
        //$('#expandTable').empty();
        let table = $('#expandTable').DataTable({
            data: dataSource,
            columns: [
                { "data": "primaryID" },
                { "data": "ric" },
                { "data": "sedol" },
                { "data": "bbg" },
                { "data": "isin" },
                { "data": "open_unit" },
                { "data": "open_price" },
                { "data": "delta_cap" }
            ],
            responsive: false,
            ordering: true,
            fixedColumns: false,
            result: true,
            bFilter: false,
            bInfo: true,
            paging: true,
            searching: false,
            pageLength: 17,
            columnDefs: [
                { width: '20%', targets: 0 },
                { width: '20%', targets: 1 },
                { width: '10%', targets: 2 },
                { width: '10%', targets: 3 },
                { width: '10%', targets: 4 },
                { width: '10%', targets: 5 },
                { width: '10%', targets: 6 },
                { width: '10%', targets: 7 },
                { orderable: false, targets: -1 },
            ]
        });

        //$('#expandTable').DataTable({ pageLength: 13 });
        $( "#expandTable_wrapper .row .col-sm-5" ).prepend( $( "#expandTable_paginate" ) );
    }

    openModal(actionType: any): void{
        if(actionType == 'Help'){
            this.showHelpModal = true;
        }
        if(actionType == 'View'){
            this.showViewModal = true;
        }
        if(actionType == 'Constituent'){
            this.showConstituentModel = true;
        }
    }

    closeModal(actionType: any): void{
        if(actionType == 'Help'){
            this.showHelpModal = false;
        }
        if(actionType == 'View'){
            this.showViewModal = false;
        }
        if(actionType == 'Constituent'){
            this.showConstituentModel = false;
        }
    }

    deleteIndex(indexId: any): void {
        this.overlay = true;
        let api: any = ApiConfig.deleteIndexApi.replace("{index_id}", indexId);
        this.service.delete(api).subscribe(res => {
            if (res.result) {
                this.showSuccess(res.message);
                this.getIndicesList();
            }
            else {
                this.showError(res.message);
                this.overlay = false;
            }
        }, err => {
            console.log(err);
            this.overlay = false;
        });
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
