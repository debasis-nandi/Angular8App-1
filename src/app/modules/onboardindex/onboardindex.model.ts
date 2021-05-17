export interface IOnBoardIndex{
    index_detail?: IndexDetail[];
    cal_method?: any;
    index_currency?: any;
    index_cal_days?: any;
    index_type?: any;
    holiday?: any;
    holiday_merge?: any;
    wht?: any;
    schedule_type?: any;
    recurrence?: any;
    week_days?: any;
    months?: any;
    base_date?: any;
    base_value?: any;
    onboarding_date?: any;
    file_name?: any;
}

export interface IndexDetail{
    return_type?: any;
    index_name?: any;
    ticker?: any;
    transaction_cost?: any;
}