
export class ApiConfig{
    
    //authentication api
    public static authenticationApi: string = 'customadminapp/admin/Authentication/Login/';
    public static refreshTokenApi: string = 'customadminapp/admin/Authentication/RefreshToken/';
    public static userInfoApi: string = 'customadminapp/admin/RoleACLs/LoginInfo/';

    //acl apis
    public static aclApi: string = 'customadminapp/admin/RoleACLs/RoleACL/';
    public static aclBasedOnAccountApi: string = 'customadminapp/admin/RoleACLs/GetACL/?account={accountId}';
    public static aclBasedOnRoleApi: string = 'customadminapp/admin/ACL/ACLData/{roleId}/';
    public static aclUpdateApi: string = 'customadminapp/admin/ACL/ACLData/{roleId}/';

    //forgot password
    public static forgotPasswordApi: string = 'customadminapp/admin/Authentication/ForgotPassword/';
    public static updatePasswordApi: string = 'customadminapp/admin/Authentication/Updatepassword/';

    //Client apis
    public static clientApi: string = 'customadminapp/admin/Clients/';
    public static updateClientApi: string = 'customadminapp/admin/Clients/{clientID}/';

    //Client apis
    public static accountApi: string = 'customadminapp/admin/Accounts/';
    public static updateAccountApi: string = 'customadminapp/admin/Accounts/{accountID}/';

    //User apis
    public static userApi: string = 'customadminapp/admin/Users/';
    public static userOnAccountIdApi: string = 'customadminapp/admin/Users/?account_id={id}';
    public static activeUserApi: string = 'customadminapp/admin/Users/ActiveUser/';

    //Dropdown list apis
    public static ddlClientApi: string = 'customadminapp/admin/Clients/?dropdown=yes';
    public static ddlAccountApi: string = 'customadminapp/admin/Accounts/?dropdown=yes';
    public static ddlAccountOnClientIdApi: string = 'customadminapp/admin/Accounts/?client={id}&dropdown=yes';
    public static ddlRoleApi: string = 'customadminapp/admin/RoleACLs/GetRole/';

    //Index onboard apis
    public static indexDetailApi: string = 'onboardingapp/IndexDetail/GetIndexDetail/{index_id}';
    public static constituentSanityApi: string = 'onboardingapp/RunSanity/ConstituentSanity/';
    public static viewConstituentSanityApi: string = 'onboardingapp/RunSanity/ConstituentSanityView/?index={indexName}&sanity={count}';
    public static holidaySanityApi: string = 'onboardingapp/RunSanity/HolidaySanity/';
    public static viewHolidaySanityApi: string = 'onboardingapp/RunSanity/HolidaySanityView/?index={indexName}&sanity={count}';
    public static whtSanityApi: string = 'onboardingapp/RunSanity/WHTSanity/';
    public static viewWhtSanityApi: string = 'onboardingapp/RunSanity/WHTSanityView/?index={indexName}&sanity={count}';
    public static createOnboardIndexApi: string = 'onboardingapp/IndexDetail/CreateIndex/?account_id={account_id}';
    public static onBoardHolidayApi: string = 'onboardingapp/IndexDetail/GetHolidays';
    public static checkIndexNameApi: string = 'onboardingapp/IndexDetail/CheckIndex/?indexname={indexname}';
    public static checkTickerApi: string = 'onboardingapp/IndexDetail/CheckIndex/?ticker={ticker}';
    public static previewCustomRebalApi: string = 'onboardingapp/IndexDetail/GetRebalPreview/';
    public static previewStandardHolidayApi: string = 'onboardingapp/IndexDetail/GetHolidayPreview/';
    public static previewStandardWhtApi: string = 'onboardingapp/IndexDetail/WhtPreview';
    public static rebalUploadScheduleSanityApi: string = 'onboardingapp/IndexDetail/UploadRebal/';
    public static downloadConstituentApi: string = 'onboardingapp/download/DownloadConstitunet/?index={indexName}&sanity={sanity}';
    public static downloadHolidayApi: string = 'onboardingapp/download/DownloadHoliday/?index={indexName}&sanity={sanity}';
    public static downloadWhtApi: string = 'onboardingapp/download/DownloadWHT/?index={indexName}&sanity={sanity}';
    public static downloadRebalUploadApi: string = 'onboardingapp/download/DownloadRebalPreview/?index_id={index_id}&file_name={index_name}';

    public static previewUploadScheduleApi: string = 'onboardingapp/IndexDetail/GetDuplicateRebal/?index_id={index_id}&index_name={index_name}';
    public static previewConstituentsApi: string = 'onboardingapp/IndexDetail/GetDuplicateConstitunet/?index_id={index_id}&index_name={index_name}';
    public static previewHolidayUploadApi: string = 'onboardingapp/IndexDetail/GetDuplicateHoliday/?index_id={index_id}&index_name={index_name}';
    public static previewWhtUploadApi: string = 'onboardingapp/IndexDetail/GetDuplicateWHT/?index_id={index_id}&index_name={index_name}';

    //Dashboard apis
    public static panelCountApi: string = 'onboardingapp/IndexDetail/PanelCount/?account={account_id}';
    public static indexListApi: string = 'onboardingapp/IndexDetail/?account={account_id}';
    public static holidayListApi: string = 'onboardingapp/IndexDetail/GetHolidayList';
    public static rebalListApi: string = 'onboardingapp/IndexDetail/GetRebalList/?account={account_id}';
    public static indexLevelApi: string = 'onboardingapp/IndexDetail/IndexLevelList/?index={index_id}';
    public static indexPerformanceApi: string = 'onboardingapp/IndexDetail/Snapshot/?index={index_id}';
    public static calYearPerformanceApi: string = 'onboardingapp/IndexDetail/CalPerformance/?index={index_id}';
    public static indexCharacteristicsApi: string = 'onboardingapp/IndexDetail/Characteristics/?index={index_id}';
    public static constituentApi: string = 'onboardingapp/IndexDetail/CompositionList/{index_id}';
    public static whtStandardPreviewApi: string = 'onboardingapp/download/DownloadWHTPreview/?file_name={fileName}';
    public static holidayStandardPreviewApi: string = 'onboardingapp/download/DownloadHolidayPreview/?file_name={fileName}';
    //public static downloadCompositionApi: string = 'onboardingapp/download/DownloadComposition/?file_name={fileName}';
    public static downloadCompositionApi: string = 'onboardingapp/download/DownloadComposition/?file_name={fileName}&id={id}';
    public static downloadOutputFileApi: string = 'dailyrunapp/DailySanity/OutputFileDownload/?output_file={file_name}';
    public static deleteIndexApi: string = 'onboardingapp/IndexDetail/DeleteIndex/{index_id}';

    //Run daily apis
    public static indexList2Api: string = 'onboardingapp/IndexDetail/IndexList/?account={account_id}';
    public static dummyDataCalculationApi: string = 'dailyrunapp/DailySanity/DummyDataCalculation/';
    public static runBasicSanityApi: string = 'dailyrunapp/DailySanity/DailyRunSanityBasic/';
    public static runServerSanityApi: string = 'dailyrunapp/DailySanity/DailyRunSanityBackend/';
    public static dailyRunConfirmApi: string = 'dailyrunapp/DailySanity/DailyRunConfirm/';
    public static dailyRunGetDataApi: string = 'dailyrunapp/DailySanity/GetConfirmData/';
    public static dailyRunCalculationApi: string = 'dailyrunapp/DailySanity/RunDailyCalculation/';
    //public static downloadBasicSanityApi: string = 'onboardingapp/download/DownloadBasicsanity/?tab_name={tab_name}&file_name={file_name}';
    //public static downloadServerSanityApi: string = 'onboardingapp/download/DownloadBackendsanity/?file_name={file_name}&tab_name={tab_name}';
    public static downloadBasicSanityApi: string = 'onboardingapp/download/DownloadBasicsanity/?tab_name={tab_name}&file_name={file_name}&run_date={run_date}';
    public static downloadServerSanityApi: string = 'onboardingapp/download/DownloadBackendsanity/?file_name={file_name}&tab_name={tab_name}&run_date={run_date}';

}