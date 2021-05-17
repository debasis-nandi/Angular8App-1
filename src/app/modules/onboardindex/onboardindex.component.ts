import { Component, OnInit, ViewEncapsulation, ViewChildren, ViewChild, QueryList, ElementRef, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm, FormArray } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { trigger,state,style,transition,animate } from '@angular/animations';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst, ScheduleType, DocType } from '../../core/config/app-enum';
import { AppUtil } from '../../core/config/app-util';
import { IOnBoardIndex, IndexDetail } from './onboardindex.model';
import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
    selector: 'app-onboardindex',
    templateUrl: './onboardindex.component.html',
    styleUrls: ['onboardindex.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class OnBoardIndexComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource:any;
    
    @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
    onBoardIndexForm: FormGroup;
    
    overlay: boolean = false;
    displayModal: boolean = false;
    growlLife: number = GlobalConst.growlLife;
    msgs: any[] = [];
    maxUploadedFileSize: number = GlobalConst.maxUploadedFileSize;
    baseDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };
    onBoardDateOptions: IMyDpOptions = { dateFormat: 'mm-dd-yyyy', editableDateField: false };

    accountId: any;

    indexCurrencyOptions: any[] = [];
    calcMethodolodyOptions: any[] = [];
    calcTypeOptions: any[] = [];
    indexTypeOptions: any[] = [];
    corporateActionOptions: any[] = [];
    recurrenceOptions: any[] = [];
    weekDayOptions: any[] = [];
    monthOptions: any[] = [];
    indexCalcDaysOptions: any[] = [];
    preOnboardedMasterIndexList: any[] = [];
    preOnboardedIndexList: any[] = [];
    preOnboardedIndexSearch: string;

    withholdingTaxInputTypeOptions: any[] = [];
    holidayListInputTypeOptions: any[] = [];
    holidayOptions: any[] = [];
    holidayMergeTypeOptions: any[] = [];

    constituentFile: any;
    holidayListFile: any;
    withholdingTaxFile: any;
    scheduleFile: any;

    isUploadHolidayList: boolean = true;
    isHolidayListStandard: boolean = false;
    isHolidayListNA: boolean = false;
    isUploadWithholdingTax: boolean = true;
    isViewConstituentSanity: boolean = false;
    isViewHolidayListSanity: boolean = false;
    isViewWithholdingTaxSanity: boolean = false;
    isWhtNA: boolean = false;
    isWhtStandard: boolean = false;
    isPreOnboardedIndex: boolean = false;

    modalHeader: string;
    isConstituentSanity: boolean = false;
    isHolidayListSanity: boolean = false;
    isWithholdingTaxSanity: boolean = false;
    isCustomRebalance: boolean = false;
    isStandardHoliday: boolean = false;
    isStandardWht: boolean = false;
    isNTR: boolean = false;

    constituentSanityCount: number = 0;
    holidayListSanityCount: number = 0;
    withholdingTaxSanityCount: number = 0;
    rebalUploadScheduleSanityCount: number = 0;
    constituentSanityStatusIcon: string;
    holidayListSanityStatusIcon: string;
    withholdingTaxSanityStatusIcon: string;
    rebalUploadScheduleSanityStatusIcon: string;

    whtStandardPreviewFileName: any;
    holidayStandardPreviewFileName: any;

    isCopyUploadSchedule: boolean = false;
    isUploadRebalance: boolean = false;

    isCopyConstituents: boolean = false;
    isCopyUploadHoliday: boolean = false;
    isCopyWht: boolean = false;

    // If you want to hide column then only remove the column from the display list 
    constituentColumnList: string[] = [
        'SanityResult', 'Message' , 'PrimaryID', 'RebalDate', 'RIC', 'SEDOL_CHK', 'ISIN', 'BBGTicker', 'CompanyName', 'PrimaryExchangeListed',
        'Currency', 'CountryCode', 'IndexConstituentWeights', 'units_PR', 'units_TR', 'units_NTR', 'open_div_PR',
        'open_div_TR', 'open_div_NTR'
    ];
    holidayColumnList: string[] =['SanityResult', 'Message', 'Description', 'Exchange_Code', 'Holidays', 'Trading_Status', 'Settlement_Status'];
    whtColumnList: string[] =['SanityResult', 'Message', 'CountryCode', 'TaxRate', 'from_date', 'to_date'];
    customRebalList: string[] =['Date'];
    uploadRebalList: string[] =['rebal_date'];
    standardHolidayList: string[] =['exchange_code', 'holiday_date', 'description'];
    standardWhtList: string[] =['country_code', 'taxrate', 'from_date', 'to_date'];
    preOnboardedIndex:string[] = ['index_id', 'index_name','return_type','ticker','onboarding_date', 'index_currency'];

    constructor(private fb:FormBuilder, private router: Router, private service: HttpService) {
        this.accountId = AppSession.getSessionStorage('SelectedAccount');
    }

    ngOnInit() {
        this.getCalcMethodolodyOption();
        this.getIndexCurrencyOption();
        this.getCalcTypeOption();
        this.getIndexType();
        this.getCorporateActionOptions();
        this.getRecurrenceOption();
        this.getWeekDayOptions();
        this.getMonthOptions();
        this.getHolidayListInputType();
        this.getWithholdingTaxInputType();
        this.getIndexCalcDaysOption();
        this.getHolidayOption();
        this.getHolidayCalTypeOption();
        this.setDefaultFormFields();
        //console.log(this.onBoardIndexForm);
    }

    setDefaultFormFields(): void {
        this.onBoardIndexForm = this.fb.group({
            indexDetail: this.fb.array([
                this.fb.group({
                    indexType: [''],
                    indexName: [''],
                    indexTicker: [''],
                    transactionCost: ['']
                }),
                this.fb.group({
                    indexType: [''],
                    indexName: [''],
                    indexTicker: [''],
                    transactionCost: ['']
                }),
                this.fb.group({
                    indexType: [''],
                    indexName: [''],
                    indexTicker: [''],
                    transactionCost: ['']
                })
            ]),
            indexCurrency:['', Validators.required],
            calcMethodolody:['', Validators.required],
            calcType:['', Validators.required],
            baseDate:['', Validators.required],
            onboardingDate:['', Validators.required],
            indexCalcDays:['', Validators.required],
            baseValue:['', Validators.required],
            constituentFile: [''],
            holidayFile: [''],
            withholdingTaxFile: [''],
            holidayType: ['upload'],
            holidayMergeType: [''],
            holiday:[''],
            whtTaxType: '1',
            corporateActions: this.fb.array([]),
            scheduleType: [''],
            customScheduleOptions: this.fb.group({
                recurrence: [''],
                weekDay: [''],
                month: this.fb.array([])
            }),
            uploadScheduleFile: ['']
        });
        this.onChangeRebalance(ScheduleType.custom);
    }

    
    onPreOnboardedIndex(): void {
        //this.preOnboardedMasterIndexList = [];
        //this.preOnboardedIndexList = [];
        let api: any = ApiConfig.indexList2Api.replace("{account_id}", this.accountId);
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let indixList: any[] = res.results;
                /*if(indixList.length > 0){
                    indixList.forEach(item=>{
                        let index: any = { id: item.index_id, label: item.index_name };
                        this.preOnboardedMasterIndexList.push(index);
                    });
                    //this.preOnboardedIndexList = this.preOnboardedMasterIndexList;
                }*/
                this.setModalForm(indixList, 'PreOnboardedIndex');
            }
        }, error => {
            this.showError('Internal server error');
            console.log(error);
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onSearchIndex(value: any): void {
        let items: any[] = [];
        if (value.trim()) {
            items = this.preOnboardedMasterIndexList.filter(item => item.label.toLowerCase().indexOf(value.toLowerCase()) !== -1);
        }
        else {
            items = this.preOnboardedMasterIndexList;
        }
        this.preOnboardedIndexList = items;
    }

    onPreOnboardIndexChange(value: any): void{
        this.overlay = true;
        let api: any = ApiConfig.indexDetailApi.replace("{index_id}", value);
        this.service.get(api).subscribe(res=>{
            if(res.result){
                let indexDetail: any = res.results[0];
                AppSession.setSessionStorage('IndexDetail',indexDetail);
                this.setFormFields(indexDetail);
                this.hideDialog();
            }
            else{
                this.showError(res.message);
            }
            this.overlay = false;
        },error=>{
            this.overlay = false;
            this.showError('Internal Server Error.');
        });
    }

    setFormFields(formData: any): void {
        let indexDetail: any[] = [
            {
                indexType: (formData.return_type && formData.return_type.toLowerCase()) == 'pr' ? formData.return_type : '',
                indexName: (formData.return_type && formData.return_type.toLowerCase()) == 'pr' ? formData.index_name : '',
                indexTicker: (formData.return_type && formData.return_type.toLowerCase()) == 'pr' ? formData.ticker : '',
                transactionCost: (formData.return_type && formData.return_type.toLowerCase()) == 'pr' ? formData.txn_cost : ''
            },
            {
                indexType: (formData.return_type && formData.return_type.toLowerCase()) == 'tr' ? formData.return_type: '',
                indexName: (formData.return_type && formData.return_type.toLowerCase()) == 'tr' ? formData.index_name: '',
                indexTicker: (formData.return_type && formData.return_type.toLowerCase()) == 'tr' ? formData.ticker:'',
                transactionCost: (formData.return_type && formData.return_type.toLowerCase()) == 'tr' ? formData.txn_cost:''
            },
            {
                indexType: (formData.return_type && formData.return_type.toLowerCase()) == 'ntr' ? formData.return_type:'',
                indexName: (formData.return_type && formData.return_type.toLowerCase()) == 'ntr' ? formData.index_name:'',
                indexTicker: (formData.return_type && formData.return_type.toLowerCase()) == 'ntr' ? formData.ticker:'',
                transactionCost: (formData.return_type && formData.return_type.toLowerCase()) == 'ntr' ? formData.txn_cost:''
            }
        ];

        let holidayType: any = (formData.holiday_1 && formData.holiday_merge) ? 'standard' : 'upload';
        let holidayMergeType: any = formData.holiday_merge ? formData.holiday_merge : '';
        /*if(formData.holiday_merge == 'union'){
            holidayMergeType = {'label':'Union','value':'union'};
        }
        else if(formData.holiday_merge == 'intersection'){
            holidayMergeType = {'label':'Intersection','value':'intersection'};
        }
        else{
            holidayMergeType = '';
        }*/ 

        let whtType: any = formData.wht_1 ? formData.wht_1 : '3'; 

        let holiday: any[] = [];
        if (formData.holiday_1 && formData.holiday_1.length > 0) {
            let itemArray: any[] = formData.holiday_1.split(',');
            itemArray.forEach(x => {
                let item: any = { name: x, code: x };
                holiday.push(item);
            });
        }

        this.onBoardIndexForm.patchValue({
            indexDetail: indexDetail,
            indexCurrency: formData.index_currency ? formData.index_currency : '',
            calcMethodolody: formData.cal_method ? formData.cal_method : '',
            calcType: formData.index_type ? formData.index_type : '',
            baseDate: formData.base_date ? AppUtil.setDate(formData.base_date) : '',
            onboardingDate: formData.onboarding_date ? AppUtil.setDate(formData.onboarding_date) : '',
            indexCalcDays: formData.index_cal_days ? formData.index_cal_days : '',
            baseValue: formData.base_level ? formData.base_level : '',
            constituentFile: [''],
            holidayFile: [''],
            withholdingTaxFile: [''],
            holidayType: holidayType,
            holidayMergeType: holidayMergeType ,
            holiday: holiday,
            whtTaxType: whtType,
            corporateActions: [],
            scheduleType: formData.schedule_type,
            customScheduleOptions: {
                recurrence: formData.recurrence ? formData.recurrence : '',
                weekDay: formData.week_days ? formData.week_days : '',
                month: []
            },
            uploadScheduleFile: ['']
        });

        // for Constituents
        this.isCopyConstituents = true;
        
        //formData.schedule_type = ScheduleType.upload; // for testing
        // for month check in rebalance -> custom schedule
        if(formData.schedule_type == ScheduleType.custom){
            let months: FormArray = this.onBoardIndexForm.get('customScheduleOptions')['controls'].month as FormArray;
            let monthArray: any[] = formData.month_s ? formData.month_s.split(',') : [];
            this.monthOptions.forEach(item=>{
                if((monthArray.indexOf(item.value) !== -1)){
                    item.isChecked = true;
                    months.push(new FormControl(item.value));
                }
                else{
                    item.isChecked = false;
                }
            });
            $('#tabCustom').click();
        }
        if(formData.schedule_type == ScheduleType.upload){
            $('#tabUpload').click();
            this.isCopyUploadSchedule = true;
        }
        if(formData.schedule_type == ScheduleType.adHoc){
            $('#tabAd').click();
        }

        //set holiday list
        this.onChangeHolidayListType(holidayType);
        if(holidayType == 'upload'){
            this.isCopyUploadHoliday = true;
        }

        //set wht
        this.onChangeWithholdingTaxType(whtType);
        if(whtType == '1'){
            this.isCopyWht = true;
        }

        //Index details validation
        let index: any;
        if (formData.return_type && formData.return_type.toLowerCase() == 'pr') {
            index = 0;
        }
        if (formData.return_type && formData.return_type.toLowerCase() == 'tr') {
            index = 1;
        }
        if (formData.return_type && formData.return_type.toLowerCase() == 'ntr') {
            index = 2;
        }

        this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.indexName.setValidators(Validators.required);
        this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.indexTicker.setValidators(Validators.required);
        //this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.transactionCost.setValidators(Validators.required);
        this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.transactionCost.setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);

        this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.indexName.markAsTouched();
        this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.indexTicker.markAsTouched();
        this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.transactionCost.markAsTouched();
        this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.indexName.updateValueAndValidity();
        this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.indexTicker.updateValueAndValidity();
        this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.transactionCost.updateValueAndValidity();

        this.onCheckIndexName(this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.indexName.value,index);
        this.onCheckTicker(this.onBoardIndexForm.controls.indexDetail['controls'][index].controls.indexTicker.value, index);

        let indexDetails: any[] = this.onBoardIndexForm.controls.indexDetail.value;
        this.isNTR = indexDetails.filter(x => x.indexType == 'ntr').length > 0 ? true : false;

    }

    onCheckIndexName(value: any, i: any) {
        if (value) {
            this.overlay = true;
            let api: any = ApiConfig.checkIndexNameApi.replace("{indexname}", value);
            this.service.get(api).subscribe(res => {
                if (res.result) {
                    if (!res.status) {
                        this.onBoardIndexForm.get('indexDetail')['controls'][i].controls.indexName.setErrors({ duplicate: true });
                    }
                    else {
                        this.onBoardIndexForm.get('indexDetail')['controls'][i].controls.indexName.setErrors(null);
                    }
                    this.overlay = false;
                }
            }, error => {
                this.overlay = false;
            });
        }
    }

    onCheckTicker(value: any, i: any){
        if (value) {
            this.overlay = true;
            let api: any = ApiConfig.checkTickerApi.replace("{ticker}", value);
            this.service.get(api).subscribe(res => {
                if (res.result) {
                    if (!res.status) {
                        this.onBoardIndexForm.get('indexDetail')['controls'][i].controls.indexTicker.setErrors({ duplicate: true });
                    }
                    else {
                        this.onBoardIndexForm.get('indexDetail')['controls'][i].controls.indexTicker.setErrors(null);
                    }
                    this.overlay = false;
                }
            }, error => {
                this.overlay = false;
            });
        }
    }

    OnboardingDateChanged(event: IMyDateModel){
        /*if (this.isPreOnboardedIndex) {
            if (confirm('Existing constituent data from pre-onboarded index would no longer be valid; and new data will have to upload. Do you want to proceed with this change?')) {
                //reset preview Constituent Data on change of index type
                this.isCopyConstituents = false;
                //reset Pre Onboarded Index 
                this.isPreOnboardedIndex = false;
            }
        }*/
    }

    onBaseDateChanged(event: IMyDateModel) {
        /*if (this.isPreOnboardedIndex) {
            if (confirm('Existing constituent data from pre-onboarded index would no longer be valid; and new data will have to upload. Do you want to proceed with this change?')) {
                //reset preview Constituent Data on change of index type
                this.isCopyConstituents = false;
                //reset Pre Onboarded Index 
                this.isPreOnboardedIndex = false;
            }
        }*/

        this.onBoardIndexForm.controls['onboardingDate'].setValue('');
        let toDate: Date = new Date(AppUtil.getFormattedDate(event,''));
        toDate.setDate(toDate.getDate() - 1);
        this.onBoardDateOptions = {
            dateFormat: 'mm-dd-yyyy',
            disableUntil: { year: toDate.getFullYear(), month: toDate.getMonth() + 1, day: toDate.getDate() }
        };
    }

    onIndexTypeChange(e, i) {
        if (this.isPreOnboardedIndex) {
            if (confirm('Existing constituent data from pre-onboarded index would no longer be valid; and new data will have to upload. Do you want to proceed with this change?')) {
                //reset preview Constituent Data on change of index type
                this.isCopyConstituents = false;
                //reset Pre Onboarded Index 
                this.isPreOnboardedIndex = false;
            }
            else {
                e.target.checked = false;
            }
        }
        
        if (e.target.checked) {
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexType.setValue(this.indexTypeOptions[i].value);
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexName.setValidators(Validators.required);
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexTicker.setValidators(Validators.required);
            //this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.transactionCost.setValidators(Validators.required);
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.transactionCost.setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);

            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexName.markAsTouched();
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexTicker.markAsTouched();
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.transactionCost.markAsTouched();

        } else {
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexType.setValue('');

            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexName.clearValidators();
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexTicker.clearValidators();
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.transactionCost.clearValidators();

            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexName.setValue('');
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexTicker.setValue('');
            this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.transactionCost.setValue('');
        }
        this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexName.updateValueAndValidity();
        this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.indexTicker.updateValueAndValidity();
        this.onBoardIndexForm.controls.indexDetail['controls'][i].controls.transactionCost.updateValueAndValidity();

        let indexDetails: any[] = this.onBoardIndexForm.controls.indexDetail.value;
        this.isNTR = indexDetails.filter(x=> x.indexType == 'ntr').length > 0 ? true : false;

        //reset preview Constituent Data on change of index type
        //this.isCopyConstituents = false;

    }

    onChangeCalMethodology(value: any){
        this.getCalcTypeOption();
        this.onBoardIndexForm.controls.calcType.setValue('');
        if(value){
            let items: any[] = this.calcTypeOptions.filter(x=>x.calcMethodolodyValue == value);
            this.calcTypeOptions = items;
            if(this.calcTypeOptions.length > 0){
                this.onBoardIndexForm.controls.calcType.setValue(this.calcTypeOptions[0].value);
            }
        }
    } 

    onChangeRebalance(type: any){
        if(type == ScheduleType.custom){
            this.onBoardIndexForm.patchValue({ 
                scheduleType: ScheduleType.custom,
                customScheduleOptions: {
                    recurrence: '',
                    weekDay: ''
                } 
            });
            this.resetMonthCheckBox();
        }
        if (type == ScheduleType.upload) {
            this.isCopyUploadSchedule = false
            this.onBoardIndexForm.patchValue({
                scheduleType: ScheduleType.upload,
                uploadScheduleFile: ''
            });
        }
        if (type == ScheduleType.adHoc) {
            this.onBoardIndexForm.patchValue({
                scheduleType: ScheduleType.adHoc
            });
        }
    }

    resetMonthCheckBox() {
        let months: FormArray = this.onBoardIndexForm.get('customScheduleOptions')['controls'].month as FormArray;
        if(months.controls.length > 0){
            for (let i = months.controls.length - 1; i >= 0; i--) {
                months.removeAt(i)
            }
        }
        if(this.checkboxes){
            this.checkboxes.forEach((element) => {
                element.nativeElement.checked = false;
            });
        }
    }

    onMonthChange(e){
        let months: FormArray = this.onBoardIndexForm.get('customScheduleOptions')['controls'].month as FormArray;
        if (e.target.checked) {
            months.push(new FormControl(e.target.value));
        } else {
            let i: number = 0;
            months.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    months.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

    onCorporateActionsChange(e) {
        let corporateActions: FormArray = this.onBoardIndexForm.get('corporateActions') as FormArray;
        if (e.target.checked) {
            corporateActions.push(new FormControl(e.target.value));
        } else {
            let i: number = 0;
            corporateActions.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    corporateActions.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

    onSubmit(): void{
        //console.log(this.onBoardIndexForm.value);
        if(this.onBoardIndexForm.valid){
            let error: number = 0;
            let fromData: any = this.onBoardIndexForm.value;
            
            //select atlest one index type
            let isSelected: boolean = fromData.indexDetail.filter(x=>x.indexType != '').length > 0 ? true : false;
            if(!isSelected){
                error++;
                this.showError('Select atleast one index type');
                return;
            }

            
            if(isSelected){
                //check duplicate index name
                for(let item of fromData.indexDetail){
                    if(item.indexName != ''){
                        let isDuplicateIndexName: boolean = fromData.indexDetail.filter(x=>x.indexName.trim() == item.indexName.trim()).length > 1 ? true : false;
                        if (isDuplicateIndexName) {
                            error++;
                            this.showError('Duplicate index name.');
                            return;
                        }
                    }
                    if(item.indexTicker != ''){
                        let isDuplicateTicker: boolean = fromData.indexDetail.filter(x=>x.indexTicker.trim() == item.indexTicker.trim()).length > 1 ? true : false;
                        if (isDuplicateTicker) {
                            error++;
                            this.showError('Duplicate ticker.');
                            return;
                        }
                    }
                }
            }

            // constituent file
            if(!fromData.constituentFile){
                error++;
                this.showError('Please upload constituent data file');
                return;
            }

            // hiliday list
            if(fromData.holidayType == 'upload' && !fromData.holidayFile){
                error++;
                this.showError('Please upload holiday data file');
                return;
            }

            if(this.holidayListFile && this.holidayListSanityCount > 0){
                error++;
                this.showError('Error in holiday data file');
                return;
            }

            // WHT required when index type is ntr
            // if(this.isNTR && !this.withholdingTaxFile){
            //     error++;
            //     this.showError('Please upload WHT data file');
            //     return;
            // }

            // wht tax
            if(this.withholdingTaxFile && this.withholdingTaxSanityCount > 0){
                error++;
                this.showError('Error in WHT data file');
                return;
            }

            //Rebalance Custom Schedule
            if(fromData.scheduleType == ScheduleType.custom){
                let recurrence: any = fromData['customScheduleOptions'].recurrence;
                let weekDays: any = fromData['customScheduleOptions'].weekDay;
                let months: any = fromData['customScheduleOptions'].month;
                
                if (!recurrence) {
                    error++;
                    this.showError('Select Recurrence.');
                    return;
                }
                if (!weekDays) {
                    error++;
                    this.showError('Select weekday');
                    return;
                }
                if (!months || months.length == 0) {
                    error++;
                    this.showError('Select month');
                    return;
                }
            }

            //Rebalance Upload Schedule
            if(fromData.scheduleType == ScheduleType.upload && this.scheduleFile && this.rebalUploadScheduleSanityCount > 0){
                error++;
                this.showError('Error in upload schedule file');
                return;
            }

            //Submit data when no error
            if (error == 0) {
                let accountId: any = AppSession.getSessionStorage('SelectedAccount');
                let indexDetail: IndexDetail[] = [];
                fromData.indexDetail.forEach(x=>{
                    if(x.indexType){
                        let item: IndexDetail = { return_type: x.indexType, index_name: x.indexName, ticker: x.indexTicker, transaction_cost: x.transactionCost };
                        indexDetail.push(item);
                    }
                });

                let model: IOnBoardIndex = {
                    index_detail: indexDetail,
                    cal_method: fromData.calcMethodolody ? fromData.calcMethodolody : '', 
                    index_currency: fromData.indexCurrency ? fromData.indexCurrency : '',
                    index_cal_days: fromData.indexCalcDays ? fromData.indexCalcDays : '',
                    index_type: fromData.calcType ? fromData.calcType : '',
                    holiday: fromData.holidayType == 'standard' ? this.getCommaSeparatedHoliday(fromData.holiday) : fromData.holidayType,
                    holiday_merge: fromData.holidayType == 'standard' ? fromData.holidayMergeType : null,
                    wht:fromData.whtTaxType ? fromData.whtTaxType : '',
                    schedule_type: fromData.scheduleType ? fromData.scheduleType : '',
                    recurrence: fromData.customScheduleOptions['recurrence'],
                    week_days: fromData.customScheduleOptions['weekDay'],
                    months: fromData.customScheduleOptions['month'],
                    base_date: fromData.baseDate ? AppUtil.getFormattedDate(fromData.baseDate, 'yyyy-mm-dd', false) : '',
                    base_value: fromData.baseValue ? fromData.baseValue : '',
                    onboarding_date: fromData.onboardingDate ? AppUtil.getFormattedDate(fromData.onboardingDate, 'yyyy-mm-dd', false) : '',
                    file_name: null
                };
                let api: any = ApiConfig.createOnboardIndexApi.replace("{account_id}", accountId);
                this.overlay = true;
                this.service.post(api, model).subscribe(res => {
                    if (res.result) {
                        this.showSuccess(res.message);
                        setTimeout(() => {
                            this.router.navigateByUrl('dashboard');
                        }, GlobalConst.growlLife);
                    }
                    else {
                        this.showError(res.message);
                    }
                    this.overlay = false;
                }, error => {
                    this.showError("Internal server error!");
                    this.overlay = false;
                });
            }
        }
    }

    onCancel(){
        this.router.navigateByUrl('dashboard');
    }

    getCommaSeparatedHoliday(items: any[]): any {
        let item: string = '';
        if (items) {
            items.forEach(x => {
                item = item + x.code + ',';
            });
        }
        return item.replace(/,\s*$/, "");
    }
 
    resetForm() {
        /*this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(['onboardindex'])
        );*/
        window.location.reload();
    }
    
    constituentFileChangeEvent(fileInput: any) {
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
                this.constituentFile = file;
                this.constituentFileSanity();
            }
        }
    }

    holidayFileChangeEvent(fileInput: any) {
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
            else {
                this.holidayListFile = file;
                //sanity check
                this.holidayFileSanity();
            }
        }
    }

    withholdingTaxFileChangeEvent(fileInput: any) {
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
            else {
                this.withholdingTaxFile = file;
                this.whtFileSanity();
            }
        }
    }

    scheduleFileChangeEvent(fileInput: any) {
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
            else {
                this.scheduleFile = fileInput.target.files[0];
                //this.onBoardIndexForm.patchValue({ uploadScheduleFile: file });
                this.rebalanceUploadScheduleSanity();
            }
        }
    }

    constituentFileSanity(): void{
        let error: number = 0;
        let fromData: any = this.onBoardIndexForm.value;
        let formData: FormData = new FormData();
        let isPR: any = fromData.indexDetail.filter(x=>x.indexType == 'pr').length > 0 ? 1 : 0;
        let isTR: any = fromData.indexDetail.filter(x=>x.indexType == 'tr').length > 0 ? 1 : 0;
        let isNTR: any = fromData.indexDetail.filter(x=>x.indexType == 'ntr').length > 0 ? 1 : 0;
        let indexName: any = fromData.indexDetail.filter(x=>x.indexType != "").length > 0 ? fromData.indexDetail.filter(x=>x.indexType != "")[0].indexName : '';
        
        //select atlest one index type
        let isSelected: boolean = fromData.indexDetail.filter(x=>x.indexType != '').length > 0 ? true : false;
        if(!isSelected){
            error++;
            this.showError('Select index type.');
            return;
        }
        if(isSelected && !indexName){
            error++;
            this.showError("Required index name.");
            this.constituentFile = null;
            return;
        }
        if(!fromData.onboardingDate){
            error++;
            this.showError("Required onboarding date.");
            this.constituentFile = null;
            return;
        }
        if(!fromData.baseDate){
            error++;
            this.showError("Required base date.");
            this.constituentFile = null;
            return;
        }
        
        if(this.constituentFile && error == 0){
            formData.append('constituent_file', this.constituentFile);
            formData.append('onboarding_date', AppUtil.getFormattedDate(fromData.onboardingDate,'yyyy-mm-dd'));
            formData.append('base_date', AppUtil.getFormattedDate(fromData.baseDate,'yyyy-mm-dd'));
            formData.append('pr', isPR);
            formData.append('tr', isTR);
            formData.append('ntr', isNTR);
            formData.append('index_name', indexName);

            this.overlay = true;
            this.service.postFormData(ApiConfig.constituentSanityApi,formData).subscribe(res=>{
                if(res.result){
                    this.constituentSanityCount = res.count;
                    this.constituentSanityStatusIcon = res.count > 0 ? 'notification-error fa fa-exclamation-circle' : 'notification-success fa fa-check-circle';
                    if(res.count > 0){
                        this.showError(res.message);
                    }
                    else{
                        this.onBoardIndexForm.patchValue({ constituentFile: this.constituentFile });
                        this.showSuccess(res.message);
                    }
                    this.isViewConstituentSanity = true;
                    this.overlay = false;
                }
                else{
                    this.showError(res.message);
                    this.isViewConstituentSanity = false;
                    this.constituentFile = null;
                    this.overlay = false;
                }
            }, error=>{
                this.overlay = false;
                this.isViewConstituentSanity = false;
                this.constituentFile = null;
                this.showError('Internal server error!');
            });
        }
    }

    holidayFileSanity(): void{
        let error: number = 0;
        let fromData: any = this.onBoardIndexForm.value;
        let formData: FormData = new FormData();
        let indexName: any = fromData.indexDetail.filter(x=>x.indexType != "").length > 0 ? fromData.indexDetail.filter(x=>x.indexType != "")[0].indexName : '';

        if(!indexName){
            error++;
            this.showError("Required index name");
            this.holidayListFile = null;
            return;
        }
        if(this.holidayListFile && error == 0){
            formData.append('holiday_file', this.holidayListFile);
            formData.append('index_name', indexName);

            this.overlay = true;
            this.service.postFormData(ApiConfig.holidaySanityApi,formData).subscribe(res=>{
                if(res.result){
                    this.holidayListSanityCount = res.count;
                    this.holidayListSanityStatusIcon = res.count > 0 ? 'notification-error fa fa-exclamation-circle' : 'notification-success fa fa-check-circle';
                    if(res.count > 0){
                        this.showError(res.message);
                    }
                    else{
                        this.onBoardIndexForm.patchValue({ holidayFile: this.holidayListFile });
                        this.showSuccess(res.message);
                    }
                    this.isViewHolidayListSanity = true;
                    this.overlay = false;
                }
                else{
                    this.showError(res.message);
                    this.isViewHolidayListSanity = false;
                    this.holidayListFile = null;
                    this.overlay = false;
                }
            }, error=>{
                this.overlay = false;
                this.isViewHolidayListSanity = false;
                this.holidayListFile = null;
                this.showError('Internal server error!');
            });
        }
    }

    whtFileSanity(): void{
        let error: number = 0;
        let fromData: any = this.onBoardIndexForm.value;
        let formData: FormData = new FormData();
        let indexName: any = fromData.indexDetail.filter(x=>x.indexType != "").length > 0 ? fromData.indexDetail.filter(x=>x.indexType != "")[0].indexName : '';

        if(!indexName){
            error++;
            this.showError("Required index name");
            this.withholdingTaxFile = null;
            return;
        }
        if(this.withholdingTaxFile && error == 0){
            formData.append('wht_file', this.withholdingTaxFile);
            formData.append('index_name', indexName);

            this.overlay = true;
            this.service.postFormData(ApiConfig.whtSanityApi,formData).subscribe(res=>{
                if(res.result){
                    this.withholdingTaxSanityCount = res.count;
                    this.withholdingTaxSanityStatusIcon = res.count > 0 ? 'notification-error fa fa-exclamation-circle' : 'notification-success fa fa-check-circle';
                    if(res.count > 0){
                        this.showError(res.message);
                    }
                    else{
                        this.onBoardIndexForm.patchValue({ withholdingTaxFile: this.withholdingTaxFile });
                        this.showSuccess(res.message);
                    }
                    this.isViewWithholdingTaxSanity = true;
                    this.overlay = false;
                }
                else{
                    this.showError(res.message);
                    this.isViewWithholdingTaxSanity = false;
                    this.withholdingTaxFile = null;
                    this.overlay = false;
                }
            }, error=>{
                this.overlay = false;
                this.isViewWithholdingTaxSanity = false;
                this.withholdingTaxFile = null;
                this.showError('Internal server error!');
            });
        }
    }

    rebalanceUploadScheduleSanity(): void{
        let error: number = 0;
        let fromData: any = this.onBoardIndexForm.value;
        let formData: FormData = new FormData();
        let indexName: any = fromData.indexDetail.filter(x=>x.indexType != "").length > 0 ? fromData.indexDetail.filter(x=>x.indexType != "")[0].indexName : '';

        if(!indexName){
            error++;
            this.showError("Required index name");
            this.scheduleFile = null;
            return;
        }
        if(this.scheduleFile && error == 0){
            formData.append('rebal_file', this.scheduleFile);
            formData.append('index_name', indexName);

            this.overlay = true;
            this.service.postFormData(ApiConfig.rebalUploadScheduleSanityApi,formData).subscribe(res=>{
                this.rebalUploadScheduleSanityCount = res.result  ? 0 : 1;
                this.rebalUploadScheduleSanityStatusIcon = res.result ? 'notification-success fa fa-check-circle' : 'notification-error fa fa-exclamation-circle';
                if(res.result){
                    this.showSuccess(res.message);
                    this.onBoardIndexForm.patchValue({ uploadScheduleFile: this.scheduleFile });
                    this.overlay = false;
                }
                else{
                    this.showError(res.message);
                    this.scheduleFile = null;
                    this.overlay = false;
                }
            }, error=>{
                this.overlay = false;
                this.scheduleFile = null;
                this.showError('Internal server error!');
            });
        }
    }

    onViewConstituentSanity() {
        this.overlay = true;
        let fromData: any = this.onBoardIndexForm.value;
        let indexName: any = fromData.indexDetail.filter(x => x.indexType != "").length > 0 ? fromData.indexDetail.filter(x => x.indexType != "")[0].indexName : '';
        let api: any = ApiConfig.viewConstituentSanityApi.replace("{indexName}", indexName).replace("{count}", this.constituentSanityCount > 0 ? "1" : "0");
        //let api: any = 'assets/datasource/constituentsanity.json';
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let sanityList: any[] = res.results;
                sanityList.forEach(x=>{
                    if(x.SanityResult){
                        let objArray: any[] = x.SanityResult.split(';');
                        let strError: any = '';
                        objArray.forEach(x=>{
                            strError = strError + x + '\n';
                        });
                        x.SanityResult = strError;
                    }
                    else{
                        x.SanityResult = 'Success';
                    }
                });
                let header: any = "Constituent Data ( " + res.error + ' errors' + ' out of ' + res.count + ' records )';
                this.setModalForm(sanityList, 'Constituent', header);
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    onViewHolidayListSanity() {
        this.overlay = true;
        let fromData: any = this.onBoardIndexForm.value;
        let indexName: any = fromData.indexDetail.filter(x => x.indexType != "").length > 0 ? fromData.indexDetail.filter(x => x.indexType != "")[0].indexName : '';
        let api: any = ApiConfig.viewHolidaySanityApi.replace("{indexName}", indexName).replace("{count}", this.holidayListSanityCount > 0 ? "1" : "0");
        //let api: any = 'assets/datasource/holidaysanity.json';
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let sanityList: any[] = res.results;
                sanityList.forEach(x=>{
                    if(x.SanityResult){
                        let objArray: any[] = x.SanityResult.split(';');
                        let strError: any = '';
                        objArray.forEach(x=>{
                            strError= strError + x + '\n';
                        });
                        x.SanityResult = strError;
                    }
                    else{
                        x.SanityResult = 'Success';
                    }
                });
                let header: any = "Holiday Data ( " + res.error + ' errors' + ' out of ' + res.count + ' records )';
                this.setModalForm(sanityList, 'HolidayList', header);
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    onViewWithholdingTaxSanity() {
        this.overlay = true;
        let fromData: any = this.onBoardIndexForm.value;
        let indexName: any = fromData.indexDetail.filter(x => x.indexType != "").length > 0 ? fromData.indexDetail.filter(x => x.indexType != "")[0].indexName : '';
        let api: any = ApiConfig.viewWhtSanityApi.replace("{indexName}", indexName).replace("{count}", this.withholdingTaxSanityCount > 0 ? "1" : "0" );
        //let api: any = 'assets/datasource/withholdingtaxsanity.json';
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let sanityList: any[] = res.results;
                sanityList.forEach(x=>{
                    if(x.SanityResult){
                        let objArray: any[] = x.SanityResult.split(';');
                        let strError: any = '';
                        objArray.forEach(x=>{
                            strError= strError + x + '\n';
                        });
                        x.SanityResult = strError;
                    }
                    else{
                        x.SanityResult = 'Success';
                    }
                });
                let header: any = "Withholding Tax Data ( " + res.error + ' errors' + ' out of ' + res.count + ' records )';
                this.setModalForm(sanityList, 'WithholdingTax', header);
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    setModalForm(dataSet: any, type: any, header: any = null) {
        this.isConstituentSanity = false;
        this.isHolidayListSanity = false;
        this.isWithholdingTaxSanity = false;
        this.isCustomRebalance = false;
        this.isStandardHoliday = false;
        this.isStandardWht = false;
        this.isPreOnboardedIndex = false;
        this.isUploadRebalance = false;
        
        //this.modalHeader = '';
        this.dataSource = null;

        if (type == 'Constituent') {
            this.isConstituentSanity = true;
            this.modalHeader = header;
            if(this.isCopyConstituents){
                this.constituentColumnList = [
                    'PrimaryID', 'RebalDate', 'RIC', 'SEDOL_CHK', 'ISIN', 'BBGTicker', 'CompanyName', 'PrimaryExchangeListed',
                    'Currency', 'CountryCode', 'IndexConstituentWeights', 'units_PR', 'units_TR', 'units_NTR', 'open_div_PR',
                    'open_div_TR', 'open_div_NTR'
                ];
            }
            else{
                this.constituentColumnList = [
                    'SanityResult', 'Message' , 'PrimaryID', 'RebalDate', 'RIC', 'SEDOL_CHK', 'ISIN', 'BBGTicker', 'CompanyName', 'PrimaryExchangeListed',
                    'Currency', 'CountryCode', 'IndexConstituentWeights', 'units_PR', 'units_TR', 'units_NTR', 'open_div_PR',
                    'open_div_TR', 'open_div_NTR'
                ];
            }
            
        }
        else if (type == 'HolidayList') {
            this.isHolidayListSanity = true;
            this.modalHeader = header;
            if(this.isCopyUploadHoliday){
                this.holidayColumnList =['Description', 'Exchange_Code', 'Holidays', 'Trading_Status', 'Settlement_Status'];
            }
            else{
                this.holidayColumnList =['SanityResult', 'Message', 'Description', 'Exchange_Code', 'Holidays', 'Trading_Status', 'Settlement_Status'];
            }
        }
        else if (type == 'WithholdingTax') {
            this.isWithholdingTaxSanity = true;
            this.modalHeader = header;
            if(this.isCopyWht){
                this.whtColumnList =['CountryCode', 'TaxRate', 'from_date', 'to_date'];
            }
            else{
                this.whtColumnList =['SanityResult', 'Message', 'CountryCode', 'TaxRate', 'from_date', 'to_date'];
            }
        }
        else if(type == 'CustomRebalance'){
            this.isCustomRebalance = true;
            this.modalHeader = 'Custom Rebalance';
        }
        else if(type == 'StandardHoliday'){
            this.isStandardHoliday = true;
            this.modalHeader = 'Standard Holiday';
        }
        else if(type == 'StandardWht'){
            this.isStandardWht = true;
            this.modalHeader = 'Standard Withholding Tax';
        }
        else if(type == 'PreOnboardedIndex'){
            this.isPreOnboardedIndex = true;
            this.modalHeader = 'Pre-Onboarded Index';
        }
        else if(type == 'UploadRebalance'){
            this.isUploadRebalance = true;
            this.modalHeader = 'Upload Rebalance';
        }
        
        if(dataSet){
            this.dataSource = new MatTableDataSource<any>(dataSet);
            //this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }

        this.showDialog();
    }

    onTemplateDownload(file: any) {
        let fileName: any;
        if(file == 'Constituent'){
            fileName = 'Constituent.xlsx';
        }
        if(file == 'Holiday'){
            fileName = 'Holiday.xlsx';
        }
        if(file == 'WithholdingTax'){
            fileName = 'Withholding Tax.xlsx';
        }
        if(file == 'UploadSchedule'){
            fileName = 'Upload Schedule.xlsx';
        }
        if(fileName){
            AppUtil.downloadStaticFile(environment.templatePath, fileName);
        }
    }

    resetConstituentFile(): void {
        this.constituentFile = null;
        this.isViewConstituentSanity = false;
    }

    resetHolidayFile(): void {
        this.holidayListFile = null;
        this.isViewHolidayListSanity = false;
    }

    resetWithholdingTaxFile(): void {
        this.withholdingTaxFile = null;
        this.isViewWithholdingTaxSanity = false;
    }

    resetScheduleFile(): void {
        this.scheduleFile = null;
    }

    onCustomRebalancePreview(){
        let fromData: any = this.onBoardIndexForm.value;
        if(!fromData.onboardingDate){
            this.showError('Required onboarding date.');
            return;
        }
        let customSchedule: any = this.onBoardIndexForm.get('customScheduleOptions')['controls'];
        if(!customSchedule.recurrence.value){
            this.showError('Recurrence missing.');
            return;
        }
        if(!customSchedule.weekDay.value){
            this.showError('Weekday missing.');
            return;
        }
        if(customSchedule.month.value.length == 0){
            this.showError('Month missing.');
            return;
        }
        let model: any = {
            "recurrence" : fromData['customScheduleOptions'].recurrence,
            "week_days" : fromData['customScheduleOptions'].weekDay,
            "months" : fromData['customScheduleOptions'].month,
            "onboarding_date": fromData.onboardingDate ? AppUtil.getFormattedDate(fromData.onboardingDate, 'yyyy-mm-dd', false) : ''
        };
        let api: any = ApiConfig.previewCustomRebalApi;
        this.overlay = true;
        this.service.post(api, model).subscribe(res => {
            if (res.result) {
                let rebalDate: any[] = [];
                res.results.forEach(x=>{
                    let item : any = { date : x };
                    rebalDate.push(item);
                });
                this.setModalForm(rebalDate, 'CustomRebalance');
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    onUploadSchedulePreview(){
        let sessionFormData: any = AppSession.getSessionStorage('IndexDetail');
        let fromData: any = this.onBoardIndexForm.value;
        let indexId: any = sessionFormData.index_id;
        let indexName: any = fromData.indexDetail.filter(x=>x.indexType != "").length > 0 ? fromData.indexDetail.filter(x=>x.indexType != "")[0].indexName : '';		
        let api: any = ApiConfig.previewUploadScheduleApi.replace('{index_id}',indexId).replace('{index_name}',indexName);
        this.overlay = true;
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let rebalDate: any[] = [];
                res.results.forEach(x=>{
                    let item : any = { rebal_date : x };
                    rebalDate.push(item);
                });
                this.setModalForm(rebalDate, 'UploadRebalance');
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    onConstituentsPreview(){
        let sessionFormData: any = AppSession.getSessionStorage('IndexDetail');
        let fromData: any = this.onBoardIndexForm.value;
        let indexId: any = sessionFormData.index_id;
        let indexName: any = fromData.indexDetail.filter(x=>x.indexType != "").length > 0 ? fromData.indexDetail.filter(x=>x.indexType != "")[0].indexName : '';
        let api: any = ApiConfig.previewConstituentsApi.replace('{index_id}',indexId).replace('{index_name}',indexName);
        this.overlay = true;
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let constituentDate: any[] = res.results;
                constituentDate.forEach(x=>{
                    x.RebalDate = x.RebalDate ? AppUtil.getDate(x.RebalDate,'yyyy-mm-dd') : '';
                });
                this.setModalForm(constituentDate, 'Constituent', 'Constituent');
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    onHolidayUploadPreview(){
        let sessionFormData: any = AppSession.getSessionStorage('IndexDetail');
        let fromData: any = this.onBoardIndexForm.value;
        let indexId: any = sessionFormData.index_id;
        let indexName: any = fromData.indexDetail.filter(x=>x.indexType != "").length > 0 ? fromData.indexDetail.filter(x=>x.indexType != "")[0].indexName : '';		
        let api: any = ApiConfig.previewHolidayUploadApi.replace('{index_id}',indexId).replace('{index_name}',indexName);
        this.overlay = true;
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let holidayData: any[] = [];
                res.results.forEach(x=>{
                    let item: any = { 
                        Description:x.description,
                        Exchange_Code: x.exchange_code,
                        Trading_Status: x.trading_status,
                        Settlement_Status: x.settelment_status,
                        Holidays : x.holiday_date ? AppUtil.getDate(x.holiday_date,'yyyy-mm-dd') : ''
                    };
                    holidayData.push(item);
                });
                this.setModalForm(holidayData, 'HolidayList', 'Holiday List');
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    onWhtUploadPreview(){
        let formData: any = AppSession.getSessionStorage('IndexDetail');
        let api: any = ApiConfig.previewWhtUploadApi.replace('{index_id}',formData.index_id).replace('{index_name}',formData.index_name);
        this.overlay = true;
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let whtData: any[] = [];
                res.results.forEach(x=>{
                    let item: any = { 
                        CountryCode:x.country_code,
                        TaxRate: x.taxrate,
                        from_date: x.from_date,
                        to_date: x.to_date
                    };
                    whtData.push(item);
                });
                this.setModalForm(whtData, 'WithholdingTax', 'WithholdingTax');
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    onHolidayStandardPreview(){
        let fromData: any = this.onBoardIndexForm.value;
        let holiday: any = '';
        let error: number = 0;
        if(fromData['holiday'].length == 0){
            error++;
            this.showError('Select holiday');
            return;
        }
        else{
            fromData['holiday'].forEach(x=>{
                holiday = holiday + x.code + ',';
            });
        }
        if(!fromData['holidayMergeType']){
            error++;
            this.showError('Select merge type');
            return;
        }

        let model: any = {
            "holiday" : holiday ? holiday.replace(/,\s*$/, "") : '',
            "holiday_merge" : fromData['holidayMergeType']
        };
        let api: any = ApiConfig.previewStandardHolidayApi;
        this.overlay = true;
        this.service.post(api, model).subscribe(res => {
            if (res.result) {
                let items: any[] = res.results;
                this.holidayStandardPreviewFileName = res.file_name;
                this.setModalForm(items, 'StandardHoliday');
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    onWhtStandardPreview() {
        let fromData: any = this.onBoardIndexForm.value;
        let api: any = ApiConfig.previewStandardWhtApi;
        this.overlay = true;
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let items: any[] = res.results;
                this.whtStandardPreviewFileName = res.file_name;
                this.setModalForm(items, 'StandardWht');
            }
            else {
                this.showError(res.message);
            }
            this.overlay = false;
        }, error => {
            this.overlay = false;
            this.showError("Internal server error!");
        });
    }

    isPreviewEnable(): boolean{
        let customSchedule: any = this.onBoardIndexForm.get('customScheduleOptions')['controls'];
        return (customSchedule.recurrence.value && customSchedule.weekDay.value && customSchedule.month.value.length > 0) ? false : true;
    }

    onChangeHolidayListType(value: any) {
        if (value == 'upload'){
            this.isCopyUploadHoliday = false;
            this.isUploadHolidayList = true;
            this.isHolidayListStandard = false;
            this.isHolidayListNA = false;
            this.isViewHolidayListSanity = false;
            this.holidayListFile = null;
            this.onBoardIndexForm.get('holiday').clearValidators();
            this.onBoardIndexForm.get('holidayMergeType').clearValidators();
        }   
        else if(value == 'standard'){
            this.isUploadHolidayList = false;
            this.isHolidayListStandard = true;
            this.isHolidayListNA = false;
            this.onBoardIndexForm.get('holiday').setValidators(Validators.required);
            this.onBoardIndexForm.get('holiday').markAsTouched();

            this.onBoardIndexForm.get('holidayMergeType').setValidators(Validators.required);
            this.onBoardIndexForm.get('holidayMergeType').markAsTouched();
        }
        else if(value == 'Not Applicable'){
            this.isUploadHolidayList = false;
            this.isHolidayListStandard = false;
            this.isHolidayListNA = true;
            this.isViewHolidayListSanity = false;
            this.holidayListFile = null;

            this.onBoardIndexForm.get('holiday').clearValidators();
            this.onBoardIndexForm.get('holidayMergeType').clearValidators();
        }
    }

    onChangeWithholdingTaxType(value: any) {
        this.isUploadWithholdingTax = false;
        this.isWhtStandard = false;
        this.isWhtNA = false;
        if (value == '1') {
            this.isUploadWithholdingTax = true;
            this.isCopyWht = false;
        }
        else if (value == '2') {
            this.isWhtStandard = true;
        }
        else if (value == '3') {
            this.isWhtNA = true;
        }
    }

    onDownload() {
        if (this.isConstituentSanity) {
            this.overlay = true;
            let fromData: any = this.onBoardIndexForm.value;
            let indexName: any = fromData.indexDetail.filter(x => x.indexType != "").length > 0 ? fromData.indexDetail.filter(x => x.indexType != "")[0].indexName : '';
            let api: any = ApiConfig.downloadConstituentApi.replace("{indexName}", indexName).replace("{sanity}", this.constituentSanityCount > 0 ? "1" : "0");
            let fileName: any = 'Constituent.xls';
            this.service.getExcelData(api).subscribe(res => {
                AppUtil.downloadFile(res, fileName);
                this.overlay = false;
            }, err => {
                this.overlay = false;
                this.showError("Internal server error");
                console.log(err);
            });
        }
        if (this.isHolidayListSanity) {
            this.overlay = true;
            let fromData: any = this.onBoardIndexForm.value;
            let indexName: any = fromData.indexDetail.filter(x => x.indexType != "").length > 0 ? fromData.indexDetail.filter(x => x.indexType != "")[0].indexName : '';
            let api: any = ApiConfig.downloadHolidayApi.replace("{indexName}", indexName).replace("{sanity}", this.holidayListSanityCount > 0 ? "1" : "0");
            let fileName: any = 'Holiday.xls';
            this.service.getExcelData(api).subscribe(res => {
                AppUtil.downloadFile(res, fileName);
                this.overlay = false;
            }, err => {
                this.overlay = false;
                this.showError("Internal server error");
                console.log(err);
            });
        }
        if (this.isWithholdingTaxSanity) {
            this.overlay = true;
            let fromData: any = this.onBoardIndexForm.value;
            let indexName: any = fromData.indexDetail.filter(x => x.indexType != "").length > 0 ? fromData.indexDetail.filter(x => x.indexType != "")[0].indexName : '';
            let api: any = ApiConfig.downloadWhtApi.replace("{indexName}", indexName).replace("{sanity}", this.withholdingTaxSanityCount > 0 ? "1" : "0");
            let fileName: any = 'WithholdingTax.xls';
            this.service.getExcelData(api).subscribe(res => {
                AppUtil.downloadFile(res, fileName);
                this.overlay = false;
            }, err => {
                this.overlay = false;
                this.showError("Internal server error");
                console.log(err);
            });
        }

        if (this.isStandardWht) {
            this.overlay = true;
            let api: any = ApiConfig.whtStandardPreviewApi.replace("{fileName}", this.whtStandardPreviewFileName);
            let fileName: any = 'WHT_Standard.xls';
            this.service.getExcelData(api).subscribe(res => {
                AppUtil.downloadFile(res, fileName);
                this.overlay = false;
            }, err => {
                this.overlay = false;
                this.showError("Internal server error");
                console.log(err);
            });
        }

        if (this.isStandardHoliday) {
            this.overlay = true;
            let api: any = ApiConfig.holidayStandardPreviewApi.replace("{fileName}", this.holidayStandardPreviewFileName);
            let fileName: any = 'Holiday_Standard.xls';
            this.service.getExcelData(api).subscribe(res => {
                AppUtil.downloadFile(res, fileName);
                this.overlay = false;
            }, err => {
                this.overlay = false;
                this.showError("Internal server error");
                console.log(err);
            });
        }
        
        if (this.isCustomRebalance) {
            this.overlay = true;
            let formData: any = AppSession.getSessionStorage('IndexDetail');
            let api: any = ApiConfig.downloadRebalUploadApi.replace('{index_id}',formData.index_id).replace('{index_name}',formData.index_name);
            let fileName: any = 'Rebalance Schedule.xls';
            this.service.getExcelData(api).subscribe(res => {
                AppUtil.downloadFile(res, fileName);
                this.overlay = false;
            }, err => {
                this.overlay = false;
                this.showError("Internal server error");
                console.log(err);
            });
        }
    }

    getHolidayListInputType() {
        this.holidayListInputTypeOptions = [
            { value: 'upload', label: 'Upload File' },
            { value: 'standard', label: 'Standard' },
            { value: 'Not Applicable', label: 'Not Applicable' }
        ];
    }

    getWithholdingTaxInputType() {
        this.withholdingTaxInputTypeOptions = [
            { value: '1', label: 'Upload File' },
            { value: '2', label: 'Standard MSCI' },
            { value: '3', label: 'Not Applicable' }
        ];
    }

    getIndexType() {
        this.indexTypeOptions = [
            { name: 'pr', value: 'pr', label: 'Price Return' },
            { name: 'tr', value: 'tr', label: 'Gross Total Return' },
            { name: 'ntr', value: 'ntr', label: 'Net Total Return' }
        ];
    }
    getIndexCurrencyOption() {
        this.indexCurrencyOptions = [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'JPY', value: 'JPY' },
            { label: 'GBP', value: 'GBP' },
            { label: 'AUD', value: 'AUD' },
            { label: 'HKD', value: 'HKD' },
            { label: 'CNY', value: 'CNY' }
        ];
    }

    getIndexCalcDaysOption() {
        this.indexCalcDaysOptions = [
            { label: '7 Days', value: '7 Days' },
            { label: '5 Days (Mon-Fri)', value: '5 Days (Mon-Fri)' },
            { label: '5 Days(Tue-Sat)', value: '5 Days(Tue-Sat)' },
            { label: '5 Days(Sun-Thu)', value: '5 Days(Sun-Thu)' }
        ];
    }

    getCalcMethodolodyOption() {
        this.calcMethodolodyOptions = [
            { label: 'Divisor Method', value: 'Divisor' },
            { label: 'Stock Reinvest Method', value: 'Stock Reinvest Method' },
            { label: 'Custom Strategy 1', value: 'Custom Strategy 1' },
            { label: 'Custom Strategy 2', value: 'Custom Strategy 2' }
        ];
    }

    getCalcTypeOption() {
        this.calcTypeOptions = [
            { label: 'Standard - Divisor Based', value: 'Standard', calcMethodolodyValue: 'Divisor' }
        ];
    }

    getRecurrenceOption() {
        this.recurrenceOptions = [
            { label: '1st WEEK', value: '1' },
            { label: '2nd WEEK', value: '2' },
            { label: '3rd WEEK', value: '3' },
            { label: '4th WEEK', value: '4' },
            { label: 'LAST WEEK', value: '5' },
            { label: 'EOM', value: 'EOM' }
        ];
    }

    getWeekDayOptions() {
        this.weekDayOptions = [
            { label: 'Monday', value: 'Monday' },
            { label: 'Tuesday', value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday', value: 'Thursday' },
            { label: 'Friday', value: 'Friday' },
            { label: 'Saturday', value: 'Saturday' },
            { label: 'Sunday', value: 'Sunday' }
        ];
    }

    getMonthOptions(){
        this.monthOptions = [
            { label: 'JAN', value: 'JAN', isChecked: false },
            { label: 'FEB', value: 'FEB', isChecked: false },
            { label: 'MAR', value: 'MAR', isChecked: false },
            { label: 'APR', value: 'APR', isChecked: false },
            { label: 'MAY', value: 'MAY', isChecked: false },
            { label: 'JUN', value: 'JUN', isChecked: false },
            { label: 'JUL', value: 'JUL', isChecked: false },
            { label: 'AUG', value: 'AUG', isChecked: false },
            { label: 'SEPT', value: 'SEPT', isChecked: false },
            { label: 'OCT', value: 'OCT', isChecked: false },
            { label: 'NOV', value: 'NOV', isChecked: false },
            { label: 'DEC', value: 'DEC', isChecked: false }
        ];
    }

    getCorporateActionOptions(){
        this.corporateActionOptions = [
            { label: 'Cash Dividend', value: 1, isChecked: true },
            { label: 'Special Cash Dividend', value: 4, isChecked: true },
            { label: 'Stock Dividend', value: 8, isChecked: true },
            { label: 'Stock Split', value: 9, isChecked: true },
            { label: 'Reverse Stock Split', value: 6, isChecked: true },
            { label: 'Rights Issue', value: 2, isChecked: true },
            { label: 'Buyback', value: 7, isChecked: true },
            { label: 'Spin-off', value: 3, isChecked: true }
        ];
    }

    getHolidayOption() {
        //let api: any = 'assets/datasource/holiday1.json';
        let api: any = ApiConfig.onBoardHolidayApi;
        this.service.get(api).subscribe(res => {
            if (res.result) {
                let items: any[] = res.results;
                if (items.length > 0) {
                    this.holidayOptions = items.map(x => {
                        return { name: x.code, code: x.code };
                    });
                }
            }
        }, error => {
            console.log(error);
        });
    }

    getHolidayCalTypeOption(){
        this.holidayMergeTypeOptions = [
            {'label':'Select Merge Type','value':''},
            {'label':'Union','value':'union'},
            {'label':'Intersection','value':'intersection'}
        ];
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

    loadScript() {
        $('#index_table').DataTable({
            responsive: true,
            ordering: true,
            fixedColumns: false,
            result: false,
            bFilter: false,
            bInfo: false,
            paging: false,
            searching: false,
            columnDefs: [
                { width: '20%', targets: 0 },
                { width: '40%', targets: 1 },
                { width: '20%', targets: 2 },
                { width: '20%', targets: 3 }]
        });

        // select the drop area element
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
                files.length > 1 ? ($input.attr('data-multiple-caption') || '').replace('{count}', files.length) : $label.html('<u>' + files[0].name + '  ' + ' <i class="fa fa-minus-circle" aria-hidden="true"></i>' + '</u>');
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



            // upload using Ajax

            // when select file with input control
            // show the selected file name
            $input.on('change', function (e) {
                showFiles(e.target.files);
            });
        }
    }
}
