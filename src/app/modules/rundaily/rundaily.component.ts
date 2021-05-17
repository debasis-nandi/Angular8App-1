import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst, DocType } from '../../core/config/app-enum';
import { AppUtil } from '../../core/config/app-util';
import { environment } from '../../../environments/environment';
import { MasterIndices } from './rundaily.model';

declare var $: any;

@Component({
    selector: 'app-rundaily',
    templateUrl: './rundaily.component.html',
    styleUrls: ['rundaily.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RunDailyComponent implements OnInit, AfterViewInit {
    
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    
    // For Price
    dataSourceAllData:any;
    dataSourceMissingData: any;
    dataSourcePriceJumpZero: any;
    dataSourcePriceNonZero: any;
    dataSourcePriceExist: any;

    // For FX
    dataSourceFxAllData:any;
    dataSourceFxJumpZero: any;
    dataSourceFxJumpNonZero: any;
    dataSourceFxExist: any;
    dataSourceFxMissingData: any;

    // For CAs
    dataSourceCaAllData:any;
    dataSourceValidCaData: any;
    dataSourceInvalidCaData: any;
    dataSourceExistingCaData: any;

    accountId: any;

    overlay: boolean = false;
    overlayPopup: boolean = false;
    displayModal: boolean = false;
    growlLife: number = GlobalConst.growlLife;
    msgs: any[] = [];
    msgsPopup: any[] = [];
    maxUploadedFileSize: number = GlobalConst.maxUploadedFileSize;
    
    dataUploadRunDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    dataUploadRunDate: any;

    indexCalRunDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    indexCalRunDate: any;

    dataUploadFromDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    dataUploadToDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    dataUploadFromDate: any;
    dataUploadToDate: any;

    indexCalFromDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    indexCalToDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    indexCalFromDate: any;
    indexCalToDate: any;

    useDummyDate: boolean = false;

    uploadDataMasterIndices: any[] = [];
    indexCalMasterIndices: MasterIndices[] = [];

    dataUploadSearch: string;
    dataUploadSelectAllIndices: boolean = false;
    dataUploadIndices: any[] = [];
    
    indexCalSearch: string;
    indexCalSelectAllIndices: boolean = false;
    indexCalIndices: any[] = [];

    uploadNewFile: any;
    basicSanity: any;
    basicSanityModal: any;

    isPrices: boolean = false;
    isFax: boolean = false;
    isCas: boolean = false;

    pricesData: any = {};
    faxData: any = {};
    casData: any = {};

    // For Price
    allDataColumns: string[] =['PrimaryID', 'Currency', 'PriceDate', 'Price', 'PriceType'];
    missingColumns: string[] =['PrimaryID', 'Currency', 'PriceDate', 'Price', 'PriceType'];
    priceJumpZeroColumns: string[] =['PrimaryID', 'PriceDate', 'File_price', 'Last_Available_Price', 'Last_Date', 'PriceJump'];
    priceNonZeroColumns: string[] =['PrimaryID', 'PriceDate', 'File_price', 'Last_Available_Price', 'Last_Date', 'PriceJump'];
    priceExistColumns: string[] =['PrimaryID', 'Date', 'File_price', 'DB_price', 'Price_Difference'];

    // For Fx
    fxAllDataColumns: string[] =['Identifier', 'Date', 'SpotRate', 'Description'];
    fxJumpZeroColumns: string[] =['Identifier', 'Cal_Date', 'File_price', 'Last_Available_Price', 'Last_Date', 'PriceJump'];
    fxJumpNonZeroColumns: string[] =['Identifier', 'Cal_Date', 'File_price', 'Last_Available_Price', 'Last_Date', 'PriceJump'];
    fxExistColumns: string[] =['Identifier', 'Cal_Date', 'File_price', 'DB_price', 'Price_Difference'];
    fxMissingColumns: string[] =['Missing', 'Date'];

    // For CAs
    caAllDataColumns: string[] =['PrimaryID', 'ExDate', 'ActionType', 'Type', 'Event_Value', 'Event_Currency','Pay_Date', 'New_ID', 'Offer_Price'];
    caValidColumns: string[] =['PrimaryID', 'ExDate', 'ActionType', 'Type', 'Event_Value', 'Event_Currency', 'Pay_Date', 'New_ID', 'Offer_Price'];
    caInvalidColumns: string[] =['PrimaryID', 'ExDate', 'ActionType', 'Type', 'Event_Value', 'Event_Currency', 'Pay_Date', 'New_ID', 'Offer_Price'];
    caExistColumns: string[] =['PrimaryID', 'ExDate', 'ActionType', 'Type', 'Event_Value', 'Event_Currency', 'Pay_Date', 'New_ID', 'Offer_Price'];

    basicSanityList: string[] =['tab_name', 'error', 'message', 'file'];
    runSanityStatusColumns: string[] =['IndexName', 'IndexTicker', 'IndexCurrency', 'Upload_Date', 'Upload_Status', 'IndexLevel', 'Last_Run_Date', 'Last_Run_User'];
    indexCalculationColumns: string[] =['IndexName', 'IndexTicker', 'Asset_Class', 'Currency', 'Run_Date', 'Data_Upload_Status', 'Index_Level', 'NextOpen', 'Divisor_t', 'Divisor_t1','Calc_Status'];

    dataSourceSanityStatus: any;
    dataSourceIndexCalculation: any;

    isRunSanityStatusList: boolean = true;
    isCalIndexStatusList: boolean = true;

    isOverwriteExistingPrices: any = 0;
    isOverwriteExistingFax: any = 0;
    isOverwriteExistingCas: any = 0;
    isInsertJumpsPrices: any = 0;
    isInsertJumpsFax: any = 0;

    useDummyDataTitle: any = "On selecting this option, system driven market data(prices, fx rates & CAs) will be assigned to all the constituents of selected indices for selected rundate";

    constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private service: HttpService) {
        this.accountId = AppSession.getSessionStorage('SelectedAccount');
    }

    ngOnInit() {
        this.loadScript();
        this.getUploadDataIndices();
        this.getIndexCalIndices();
    }

    ngAfterViewInit() {
    }

    onChangeOverwriteExistingPrices(event: any){
        this.isOverwriteExistingPrices = event.target.checked ? 1 : 0;
    }

    onChangeOverwriteExistingFax(event: any){
        this.isOverwriteExistingFax = event.target.checked ? 1 : 0;
    }

    onChangeOverwriteExistingCas(event: any){
        this.isOverwriteExistingCas = event.target.checked ? 1 : 0;
    }

    onChangeInsertJumpsPrices(event: any){
        this.isInsertJumpsPrices = event.target.checked ? 1 : 0;
    }

    onChangeInsertJumpsFax(event: any){
        this.isInsertJumpsFax = event.target.checked ? 1 : 0;
    }

    onRunSanity(): void{
        //console.log(this.dataUploadIndices);
        this.basicSanity = null;
        if(!this.useDummyDate){
            let error: number = 0;
            let selectedIndicesCount: number = this.dataUploadIndices.filter(x=>x.isChecked).length;
            if(!this.dataUploadRunDate){
                error++;
                this.showError('Required run date');
                return;
            }
            if(selectedIndicesCount == 0){
                error++;
                this.showError('Select atleast one indices');
                return;
            }
            if(!this.uploadNewFile){
                error++;
                this.showError('Please upload file.');
                return;
            }

            if(error == 0){
                this.onBasicSanity();
            }
        }
        else{
            //For dumy data
            let error: number = 0;
            let selectedIndicesCount: number = this.dataUploadIndices.filter(x=>x.isChecked).length;
            
            if(!this.dataUploadRunDate){
                error++;
                this.showError('Required run date');
                return;
            }
            if(selectedIndicesCount == 0){
                error++;
                this.showError('Select atleast one indices');
                return;
            }

            if (error == 0) {
                let selectedIndex: any = this.dataUploadIndices.filter(x => x.isChecked);
                let selectedArray: any = Object.keys(selectedIndex).map(function (index) {
                    return selectedIndex[index].id
                });
                let model: any = {
                    rundate: AppUtil.getFormattedDate(this.dataUploadRunDate, 'yyyy-mm-dd', false),
                    indexs: selectedArray
                };
                this.overlay = true;
                let api: any = ApiConfig.dummyDataCalculationApi;
                this.service.post(api, model).subscribe(res => {
                    if (res.result) {
                        AppSession.setSessionStorage("FileName", res.file_name);
                        this.onServerSanity();
                        this.overlay = false;
                    }
                    else {
                        this.overlay = false;
                        this.showError(res.message);
                    }
                }, error => {
                    this.overlay = false;
                    console.log(error);
                });

            }

        }
    }

    onBasicSanity(): void{
        this.overlay = true;
        this.basicSanity = null;
        let selectedIndex: any = this.dataUploadIndices.filter(x => x.isChecked);
        let selectedArray: any = Object.keys(selectedIndex).map(function (index) {
            return selectedIndex[index].id
        });
        let frmData: any = new FormData();
        frmData.append("dailyrun_file", this.uploadNewFile);
        frmData.append("date", AppUtil.getFormattedDate(this.dataUploadRunDate, 'yyyy-mm-dd', false));
        //frmData.append("index", this.dataUploadSelectAllIndices ? true : selectedArray);
        frmData.append("index", selectedArray);

        let api: any = ApiConfig.runBasicSanityApi;
        //let api: any = 'assets/datasource/runBasicSanity.json';
        this.service.postFormData(api, frmData).subscribe(res=>{
            if(res.result){
                AppSession.setSessionStorage("BasicSanity",res.results);
                let isBasicSanityFails: boolean = (res.results.filter(x=>x.error > 0).length) > 0 ? true : false;
                if(isBasicSanityFails){
                    this.basicSanity = new MatTableDataSource<any>(res.results);
                    this.showDialog();
                }
                else{
                    this.onServerSanity();
                }
                this.overlay = false;
            }
            else{
                this.overlay = false;    
                this.showError(res.message);
            }
        },error=>{
            this.overlay = false;
            console.log(error);
        });
    }

    onServerSanity(): void{
        this.showDialog();
        this.isOverwriteExistingPrices = 0;
        this.isOverwriteExistingFax = 0;
        this.isOverwriteExistingCas = 0;
        this.isInsertJumpsPrices = 0;
        this.isInsertJumpsFax = 0;
        this.onSelected('prices');
    }

    onBasicSanityDownload(tabName: any, file: any): void {
        this.overlay = true;
        tabName = (tabName == 'price') ? 'px': tabName;
        let runDate: any = AppUtil.getFormattedDate(this.dataUploadRunDate,'yyyy-mm-dd',false);
        let api: any = ApiConfig.downloadBasicSanityApi.replace("{tab_name}", tabName).replace("{file_name}", file).replace('{run_date}', runDate);
        let fileName: any = file + '.xls';
        this.service.getExcelData(api).subscribe(res => {
            AppUtil.downloadFile(res, fileName);
            this.overlay = false;
        }, err => {
            this.overlay = false;
            this.showError("Internal server error");
            console.log(err);
        });
    }

    onDownloadBackendSanity(): void{
        this.overlay = true;
        let tabName: any = '';
        let file: any = '';
        if(this.useDummyDate){
            file = AppSession.getSessionStorage("FileName") ? AppSession.getSessionStorage("FileName") : '';
        }
        else{
            file = AppSession.getSessionStorage("BasicSanity").length > 0 ? AppSession.getSessionStorage("BasicSanity")[0].file : '';
        }
        
        if (this.isPrices)
            tabName = 'px';
        if (this.isFax)
            tabName = 'fx';
        if (this.isCas)
            tabName = 'ca';

        let runDate: any = AppUtil.getFormattedDate(this.dataUploadRunDate,'yyyy-mm-dd',false);
        let api: any = ApiConfig.downloadServerSanityApi.replace("{tab_name}", tabName).replace("{file_name}", file).replace('{run_date}', runDate);
        let fileName: any = file + '.xls';
        this.service.getExcelData(api).subscribe(res => {
            AppUtil.downloadFile(res, fileName);
            this.overlay = false;
        }, err => {
            this.overlay = false;
            this.showError("Internal server error");
            console.log(err);
        });
    }

    onSelected(tabName: string): void{
        this.isPrices = false;
        this.isFax = false;
        this.isCas = false;

        let selectedIndex: any = this.dataUploadIndices.filter(x => x.isChecked);
        let selectedArray: any = Object.keys(selectedIndex).map(function (index) {
            return selectedIndex[index].id
        });

        let basicSanity: any[] = AppSession.getSessionStorage('BasicSanity');
        let fileName: any = this.useDummyDate ? AppSession.getSessionStorage('FileName') : basicSanity[0].file;

        if(tabName == 'prices'){
            this.overlayPopup = true;
            let model: any = {
                tabname:'Price',
                filename: fileName,
                rundate: AppUtil.getFormattedDate(this.dataUploadRunDate, 'yyyy-mm-dd', false),
                //index: this.dataUploadSelectAllIndices ? [0] : selectedArray
                index: selectedArray
            };
            //let api: any = 'assets/datasource/prices.json';
            let api: any = ApiConfig.runServerSanityApi;
            this.service.post(api, model).subscribe(res=>{
                if(res.result){
                    let dataArray: any = res.results;
                    this.pricesData = {
                        allData: dataArray[0].all_data ? dataArray[0].all_data : [],
                        existing: dataArray[1].price_exist ? dataArray[1].price_exist : [],
                        jumps: dataArray[3].price_jump_zero ? dataArray[3].price_jump_zero : [],
                        invalid: dataArray[5].price_jump_nzero ? dataArray[5].price_jump_nzero : [],
                        missing: dataArray[7].missing ? dataArray[7].missing : []
                    };
                    
                    this.dataSourceAllData = new MatTableDataSource<any>(this.pricesData.allData);
                    this.dataSourceAllData.sort = this.sort;

                    this.dataSourcePriceExist = new MatTableDataSource<any>(this.pricesData.existing);
                    this.dataSourcePriceExist.sort = this.sort;

                    this.dataSourcePriceJumpZero = new MatTableDataSource<any>(this.pricesData.jumps);
                    this.dataSourcePriceJumpZero.sort = this.sort;

                    this.dataSourcePriceNonZero = new MatTableDataSource<any>(this.pricesData.invalid);
                    this.dataSourcePriceNonZero.sort = this.sort;

                    this.dataSourceMissingData = new MatTableDataSource<any>(this.pricesData.missing);
                    this.dataSourceMissingData.sort = this.sort;

                    this.isPrices = true;
                }
                else{
                    this.showErrorPopup(res.message);
                }
                this.overlayPopup = false;
            }, error=>{
                console.log(error);
                this.overlayPopup = false;
            });
        }
        if(tabName == 'fax'){
            this.overlayPopup = true;
            let model: any = {
                tabname:'Fx',
                filename: fileName,
                rundate: AppUtil.getFormattedDate(this.dataUploadRunDate, 'yyyy-mm-dd', false),
                //index: this.dataUploadSelectAllIndices ? [0] : selectedArray
                index: selectedArray
            };
            //let api: any = 'assets/datasource/fax.json';
            let api: any = ApiConfig.runServerSanityApi;
            this.service.post(api, model).subscribe(res=>{
                if(res.result){
                    let dataArray: any = res.results;
                    this.faxData = {
                        allData: dataArray[0].all_data ? dataArray[0].all_data : [],
                        jumps: dataArray[1].fx_jump_zero ? dataArray[1].fx_jump_zero : [],
                        invalid: dataArray[3].fx_jump_nzero ? dataArray[3].fx_jump_nzero : [],
                        existing: dataArray[5].fx_exist ? dataArray[5].fx_exist : [],
                        missing: dataArray[7].missing ? dataArray[7].missing : []
                    };
                    
                    this.dataSourceFxAllData = new MatTableDataSource<any>(this.faxData.allData);
                    this.dataSourceFxAllData.sort = this.sort;

                    this.dataSourceFxExist = new MatTableDataSource<any>(this.faxData.existing);
                    this.dataSourceFxExist.sort = this.sort;

                    this.dataSourceFxJumpZero = new MatTableDataSource<any>(this.faxData.jumps);
                    this.dataSourceFxJumpZero.sort = this.sort;

                    this.dataSourceFxJumpNonZero = new MatTableDataSource<any>(this.faxData.invalid);
                    this.dataSourceFxJumpNonZero.sort = this.sort;

                    this.dataSourceFxMissingData = new MatTableDataSource<any>(this.faxData.missing);
                    this.dataSourceFxMissingData.sort = this.sort;

                    this.isFax = true;
                }
                else{
                    this.showErrorPopup(res.message);
                }
                this.overlayPopup = false;
            }, error=>{
                console.log(error);
                this.overlayPopup = false;
            });
        }
        if(tabName == 'cas'){
            this.overlayPopup = true;
            let model: any = {
                tabname:'CA',
                filename: fileName,
                rundate: AppUtil.getFormattedDate(this.dataUploadRunDate, 'yyyy-mm-dd', false),
                //index: this.dataUploadSelectAllIndices ? [0] : selectedArray
                index: selectedArray
            };
            //let api: any = 'assets/datasource/cas.json';
            let api: any = ApiConfig.runServerSanityApi;
            this.service.post(api, model).subscribe(res=>{
                if(res.result){
                    let dataArray: any = res.results[0];
                    this.casData = {
                        allData: dataArray.all_data ? dataArray.all_data : [],
                        Valid: dataArray.Valid_CA ? dataArray.Valid_CA : [],
                        invalid: dataArray.Invalid_CA ? dataArray.Invalid_CA : [],
                        existing: dataArray.Existing_CA ? dataArray.Existing_CA : []
                    };
                    
                    this.dataSourceCaAllData = new MatTableDataSource<any>(this.casData.allData);
                    this.dataSourceCaAllData.sort = this.sort;

                    this.dataSourceExistingCaData = new MatTableDataSource<any>(this.casData.existing);
                    this.dataSourceExistingCaData.sort = this.sort;

                    this.dataSourceValidCaData = new MatTableDataSource<any>(this.casData.Valid);
                    this.dataSourceValidCaData.sort = this.sort;

                    this.dataSourceInvalidCaData = new MatTableDataSource<any>(this.casData.invalid);
                    this.dataSourceInvalidCaData.sort = this.sort;

                    this.isCas = true;
                }
                else{
                    this.showErrorPopup(res.message);
                }
                this.overlayPopup = false;
            }, error=>{
                console.log(error);
                this.overlayPopup = false;
            });
        }
    }

    onConfirm(): void {
        this.overlayPopup = true;
        let basicSanity: any[] = AppSession.getSessionStorage('BasicSanity');
        let fileName: any = this.useDummyDate ? AppSession.getSessionStorage('FileName') : basicSanity[0].file;
        let model: any = {
            filename: fileName,
            rundate: AppUtil.getFormattedDate(this.dataUploadRunDate, 'yyyy-mm-dd', false),
            overwrite_px: this.isOverwriteExistingPrices,
            overwrite_fx: this.isOverwriteExistingFax,
            overwrite_ca: this.isOverwriteExistingCas,
            jump_px: this.isInsertJumpsPrices,
            jump_fx: this.isInsertJumpsFax
        };
        this.service.post(ApiConfig.dailyRunConfirmApi,model).subscribe(res=>{
            if(res.result){
                this.showSuccessPopup(res.message);
                this.overlayPopup = false;
                setTimeout(() => {
                    this.hideDialog();
                    this.getStatusList('RunSanity');
                }, GlobalConst.growlLife);
            }
            else{
                this.showErrorPopup(res.message);
                this.overlayPopup = false;
            }
        }, error=>{
            this.overlayPopup = false;
            console.log(error);
        });
    }

    onCalculateIndex(): void{
        let error: number = 0;
        let selectedIndicesCount: number = this.indexCalIndices.filter(x=>x.isChecked).length;
        if(!this.indexCalRunDate){
            error++;
            this.showError('Required run date');
            return;
        }
        if(selectedIndicesCount == 0){
            error++;
            this.showError('Select atleast one indices');
            return;
        }

        if(error == 0){
            this.overlay = true;
            let selectedIndex: any = this.indexCalIndices.filter(x => x.isChecked);
            let selectedArray: any = Object.keys(selectedIndex).map(function (index) {
                return selectedIndex[index].id
            });
            let model: any = {
                //indexs: this.indexCalSelectAllIndices ? [0] : selectedArray,
                indexs: selectedArray,
                rundate: AppUtil.getFormattedDate(this.indexCalRunDate, 'yyyy-mm-dd', false)
            };
            this.service.post(ApiConfig.dailyRunCalculationApi,model).subscribe(res=>{
                if(res.result){
                    this.showSuccess(res.message);
                    setTimeout(() => {
                        this.getStatusList('CalculateIndex', res.results);
                    }, GlobalConst.growlLife);
                    if(res.file_name){
                        let downloadApi: any = ApiConfig.downloadOutputFileApi.replace("{file_name}", res.file_name);
                        let fileName: any = res.file_name + '.zip';
                        this.service.getExcelData(downloadApi).subscribe(res => {
                            AppUtil.downloadFile(res, fileName);
                            //this.overlay = false;
                        }, err => {
                            //this.overlay = false;
                            this.showError("Internal server error");
                            console.log(err);
                        });
                    }
                }
                else{
                    this.showError(res.message);
                }
                this.overlay = false;
            }, error=>{
                this.overlay = false;
                console.log(error);
            });
        }
    }

    onSearchIndices(value: any, searchSection: string): void {
        let items: any[] = [];
        if (searchSection == 'UploadData') {
            if (value.trim()) {
                items = this.uploadDataMasterIndices.filter(item => item.label.toLowerCase().indexOf(value.toLowerCase()) !== -1);
            }
            else {
                items = this.uploadDataMasterIndices;
            }
            this.dataUploadIndices = items;
        }
        if (searchSection == 'IndexCal') {
            if (value.trim()) {
                items = this.indexCalMasterIndices.filter(item => item.label.toLowerCase().indexOf(value.toLowerCase()) !== -1);
            }
            else {
                items = this.indexCalMasterIndices;
            }
            this.indexCalIndices = items;
        }
    }

    onChangeIndice(isChecked: any, sectionName: string){
        if (sectionName == 'UploadData'){
            this.dataUploadSelectAllIndices = this.dataUploadIndices.filter(x=>x.isChecked == false).length == 0 ? true : false;
        }
        if (sectionName == 'IndexCal'){
            this.indexCalSelectAllIndices = this.indexCalIndices.filter(x=>x.isChecked == false).length == 0 ? true : false;
        }
    }

    onSelectAllIndices(isChecked: any, sectionName: string) {
        if (sectionName == 'UploadData') {
            this.dataUploadSearch = '';
            if (isChecked) {
                let items: any[] = this.uploadDataMasterIndices;
                items.forEach(x => { x.isChecked = true });
                this.dataUploadIndices = items;
            }
            else {
                let items: any[] = this.uploadDataMasterIndices;
                items.forEach(x => { x.isChecked = false });
                this.dataUploadIndices = items;
            }
        }
        if (sectionName == 'IndexCal') {
            this.indexCalSearch = '';
            if (isChecked) {
                let items: any[] = this.indexCalMasterIndices;
                items.forEach(x => { x.isChecked = true });
                this.indexCalIndices = items;
            }
            else {
                let items: any[] = this.indexCalMasterIndices;
                items.forEach(x => { x.isChecked = false });
                this.indexCalIndices = items;
            }
        }
    }

    onDataUploadFromDateChanged(event: IMyDateModel) {
        this.dataUploadToDate = '';
        let toDate: Date = new Date(AppUtil.getFormattedDate(event,''));
        toDate.setDate(toDate.getDate() - 1);
        this.dataUploadToDateOptions = {
            dateFormat: 'mm-dd-yyyy',
            disableUntil: { year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() }
        };
    }

    onIndexCalFromDateChanged(event: IMyDateModel) {
        this.indexCalToDate = '';
        let toDate: Date = new Date(AppUtil.getFormattedDate(event,''));
        toDate.setDate(toDate.getDate() - 1);
        this.indexCalToDateOptions = {
            dateFormat: 'mm-dd-yyyy',
            disableUntil: { year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() }
        };
    }

    uploadNewChangeEvent(fileInput: any) {
        let isValidType: boolean = false;
        let isValidSize: boolean = true;
        if (fileInput.target.files && fileInput.target.files[0]) {
            let file: any = fileInput.target.files[0];
            isValidType = this.isFileTypeValid(file);
            isValidSize = this.isFileSizeValid(file);

            if (!isValidType) {
                this.showError("You can upload only excel file.");
            }
            else if (!isValidSize) {
                this.showError("You have uploaded an invalid file size.");
            }
            else{
                this.uploadNewFile = file;
            }
        }
    }

    resetUploadNewFile(): void {
        this.uploadNewFile = null;
    }

    onTemplateDownload() {
        let fileName: string = 'Upload Price.xlsx';
        AppUtil.downloadStaticFile(environment.templatePath, fileName);
    }

    getUploadDataIndices(): void {
        //let api: any = 'assets/datasource/indiceslist.json';
        let api: any = ApiConfig.indexList2Api.replace("{account_id}", this.accountId);
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let indixList: any[] = res.results;
                indixList.forEach(item=>{
                    let index: MasterIndices = { id: item.index_id, label: item.index_name, isChecked: false };
                    this.uploadDataMasterIndices.push(index);
                });
                //this.uploadDataMasterIndices = res.data;
                this.dataUploadIndices = this.uploadDataMasterIndices;
            }
        }, error => {
            console.log(error);
        });
    }

    getIndexCalIndices(): void {
        //let api: any = 'assets/datasource/indiceslist.json';
        let api: any = ApiConfig.indexList2Api.replace("{account_id}", this.accountId);
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let indixList: any[] = res.results;
                indixList.forEach(item=>{
                    let index: MasterIndices = { id: item.index_id, label: item.index_name, isChecked: false };
                    this.indexCalMasterIndices.push(index);
                });
                //this.indexCalMasterIndices = res.data;
                this.indexCalIndices = this.indexCalMasterIndices;
            }
        }, error => {
            console.log(error);
        });
    }

    isFileTypeValid(file: any): boolean {
        var isValid: boolean = false;
        if (file) {
            var fileType = this.getFileExtension(file.name).toLowerCase();
            if (fileType == DocType.xls || fileType == DocType.xlsx) {
                isValid = true;
            }
        }
        return isValid;
    }

    getFileExtension(filename: string): string {
        return filename.split('.').pop();
    }

    isFileSizeValid(file: any): boolean {
        var isValid: boolean = false;

        if (file) {
            // check for indivisual file size
            if (file.size <= this.maxUploadedFileSize) {
                isValid = true;
            }
            else {
                isValid = false;
            }
        }

        return isValid;
    }

    getStatusList(type: any, calIndexDataSource: any[] = []): void {
        this.isRunSanityStatusList = false;
        this.isCalIndexStatusList = false;
        
        if (type == 'RunSanity') {
            this.overlay = true;
            //let api: any = environment.jsonFilePath + 'status.json';
            let api: any = ApiConfig.dailyRunGetDataApi;
            let model: any = { rundate: AppUtil.getFormattedDate(this.dataUploadRunDate, 'yyyy-mm-dd', false) };
            this.service.post(api, model)
                .subscribe(res => {
                    if (res.result) {
                        this.isRunSanityStatusList = true;

                        $('#DataUpload').collapse('hide');
                        $('#Calculation').collapse('hide');
                        $('#Status').collapse('show');

                        $('#runIndexStatus').show();
                        $('#calIndexStatus').hide();
                        let statusList: any[] = res.results;
                        this.setRunSanityStatusTable(statusList);
                    }
                    else {
                        this.showError(res.message);
                    }
                    this.overlay = false;
                }, err => {
                    console.log(err);
                    this.overlay = false;
                });
        }
        if (type == 'CalculateIndex') {
            this.isCalIndexStatusList = true;
            $('#DataUpload').collapse('hide');
            $('#Calculation').collapse('hide');
            $('#Status').collapse('show');
            
            $('#calIndexStatus').show();
            $('#runIndexStatus').hide();
            let statusList: any[] = calIndexDataSource;
            this.setCalIndexStatusTable(statusList);
        }
    }

    setRunSanityStatusTable(dataSource: any[]): void{
        $('#status_table').DataTable().destroy();
        var table = $('#status_table').DataTable({
            data: dataSource,
            columns: [
                { 
                    "data": "IndexName",
                    "render": function (IndexName) {
                        return '<span class="dynamicwidth_xs text_ellipsis" title="'+ IndexName +'">'+ IndexName +'</span>';
                    } 
                },
                { "data": "IndexTicker" },
                { "data": "IndexCurrency" },
                { "data": "Upload Date" },
                { "data": "Upload Status" },
                { "data": "IndexLevel" },
                { "data": "Last Run Date" },
                { "data": "Last Run User" }
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
                { width: '20%', targets: 0 },
                { width: '10%', targets: 1 },
                { width: '10%', targets: 2 },
                { width: '10%', targets: 3 },
                { width: '15%', targets: 4 },
                { width: '15%', targets: 5 },
                { width: '10%', targets: 6 },
                { width: '10%', targets: 7 }
            ],
        });
        
        /*window.setTimeout(function () {
            table.table().columns.adjust().draw();
        },1);*/

    }

    setCalIndexStatusTable(dataSource: any[]): void{
        $('#status_table2').DataTable().destroy();
        let table = $('#status_table2').DataTable({
            data: dataSource,
            columns: [
                { 
                    "data": "IndexName",
                    "render": function (IndexName) {
                        return '<span class="dynamicwidth_xs text_ellipsis" title="'+ IndexName +'">'+ IndexName +'</span>';
                    } 
                },
                { "data": "IndexTicker" },
                { "data": "Asset Class" },
                { "data": "Currency" },
                { "data": "Run Date" },
                { "data": "Data Upload Status" },
                { "data": "Index Level" },
                { "data": "NextOpen" },
                { "data": "Divisor(t)" },
                { "data": "Divisor(t+1)" },
                { "data": "Prov Div" },
                { "data": "Calc Status" }
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
                { width: '10%', targets: 0 },
                { width: '10%', targets: 1 },
                { width: '10%', targets: 2 },
                { width: '10%', targets: 3 },
                { width: '10%', targets: 4 },
                { width: '10%', targets: 5 },
                { width: '10%', targets: 6 },
                { width: '10%', targets: 7 },
                { width: '10%', targets: 8 },
                { width: '10%', targets: 9 },
                { width: '10%', targets: 10 },
                { width: '10%', targets: 11 }
            ],
        });

    }

    setPriceAllDataTable(dataSource: any[]): void{

        let allDataTable = $('#sanity_table').DataTable({
            data: dataSource,
            columns: [
                { 
                    "data": "constituents",
                    "render": function (constituents) {
                        return '<span class="dynamicwidth_xs text_ellipsis" title="'+ constituents +'">'+ constituents +'</span>';
                    } 
                },
                { "data": "date" },
                { "data": "filePrice" },
                { "data": "priceDifference" },
                { "data": "lastAvailabilityPrice" }
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
            "scrollY": 200,
            columnDefs: [
                { width: '20%', targets: 0 },
                { width: '20%', targets: 1 },
                { width: '20%', targets: 2 },
                { width: '20%', targets: 3 },
                { width: '20%', targets: 4 }
            ]
        });


        $('.modal').on('shown.bs.modal', function () {
            allDataTable.columns.adjust()
        });

    }

    showDialog() {
        this.displayModal = true;
    }

    hideDialog() {
        this.overlay = false;
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

    showSuccessPopup(message: string) {
        this.msgsPopup = [];
        this.msgsPopup.push({ severity: 'success', detail: message });
    }

    showErrorPopup(message: string) {
        this.msgsPopup = [];
        this.msgsPopup.push({ severity: 'error', detail: message });
    }

    loadScript() {
        $('#runIndexStatus').hide();
        $('#calIndexStatus').hide();

        var $form = $('.box2');
        // self-invoking function
        // detect the drag&drop and other features
        var isAdvancedUpload = function () {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        }();

        // show the selected file
        // get the document element
        var $input = $form.find('input[type="file"]'),
            $label = $form.find('label'),
            $boxInput = $form.find('.box2__input'),
            // change the label of the choose file button
            showFiles = function (files) {
                //$label.text(files.length > 1 ? ($input.attr('data-multiple-caption') || '').replace( '{count}', files.length ) : $label.html('<u>' + files[ 0 ].name + '</u>'));
                //files.length > 1 ? ($input.attr('data-multiple-caption') || '').replace('{count}', files.length) : $label.html('<u>' + files[0].name + '  ' + ' <i class="fa fa-minus-circle" aria-hidden="true"></i>' + '</u>');
            };

        // add style if feature is supported
        if (isAdvancedUpload) {
            $form.addClass('has-advanced-upload');

            var droppedFiles = false;
            // listen to the drag events
            $form.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
            })
                .on('dragover dragenter', function () {
                    $form.addClass('is-dragover');
                })
                .on('dragleave dragend drop', function () {
                    $form.removeClass('is-dragover');
                })
                .on('drop', function (e) {
                    droppedFiles = e.originalEvent.dataTransfer.files; // file dropped
                    showFiles(droppedFiles);
                    // console.log(droppedFiles);

                    // read dropped file
                    var file = droppedFiles[0];

                    var reader = new FileReader();
                    // listen to the reader's load event
                    reader.onload = function (evt) {
                        //jsonObj = JSON.parse(evt.target.result);
                        //console.log(evt.target.result);

                    }
                    reader.readAsText(file);
                });

        }

        // when select file with input control
        // show the selected file name
        $input.on('change', function (e) {
            showFiles(e.target.files);
        });


        //For accordin icons  up and down  
	  $('.collapse').on('shown.bs.collapse', function(){
        $(this).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        
        }).on('hidden.bs.collapse', function(){
        $(this).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
        });

        // default set
        $('#DataUpload').collapse('hide');
        $('#Calculation').collapse('hide');
        $('#Status').collapse('hide');

        $('div.Dummy_data  > input:checkbox').change(function () {
        
          /*if ($(this).is(":checked")) {
              $(this).closest("#DataUpload").addClass('disable_area');
              $(".sanity_btn").show();
          }
          else {
              $(this).closest("#DataUpload").removeClass('disable_area');
          };*/

        });	
        
        /*$(".confirm_chck").click(function(){
          $(".pass_msg").show();
          $("#DataUpload").removeClass('in');
          $("#Dummy_data").prop("checked", false);
          $("#DataUpload").removeClass('disable_area');
          $(".sanity_btn").hide();
          $(".cal_pending").show();
        });
        
        $(".Calculate_btn").click(function(){
          $(".cal_pending").hide();
          $(".cal_pass").show();
          $("#Calculation").removeClass('in');
          $(".download_output").show();
        });*/
        
    }

}
