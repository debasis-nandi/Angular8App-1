
export enum GlobalConst {
    growlLife = 3000,
    maxTextAreaLength = 1000,
    maxUploadedFileSize = 10485760
}

export enum Action {
    delete = "Delete",
    download = "Download",
    share = "Share",
    copy = "Copy",
    edit = "Edit",
    search = "Search",
    downloadTemplate = "DownloadTemplate",
    add = "Add",
    view = "View",
    disable = "Disable",
    enable = "Enable"
}

export enum DocType{
    doc = "doc",
    docx = "docx",
    pdf = "pdf",
    csv = "csv",
    xls = "xls",
    xlsx = "xlsx",
    ppt = "ppt",
    pptx = "pptx",
    png = "png",
    jpg = "jpg",
    jpeg = "jpeg",
    gif = "gif",
    txt = "txt"
}

export enum RoleType{
    superAdmin = "Super Admin",
    clientAdmin = "Client Admin",
    accountManager = "Account Manager",
    analyst = "Analyst",
}

export enum ScheduleType{
    custom = "Custom",
    upload = "Upload",
    adHoc = "AdHoc"
}