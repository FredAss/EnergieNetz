/** 
 * @module Route table
 */
define(['services/constants'], function(constants) {

  var postBaseUrl = constants.postBaseUrl();

  var routes = {
    // Breeze Routes. Relative to entitymanagerprovider service name
    saveChangesUrl: "durandalauth/savechanges",
    networksUrl: "durandalauth/networks",
    measuresUrl: "durandalauth/measures",
    energySourcesUrl: "durandalauth/energySources",
    measureStatesUrl: "durandalauth/measureStates",
    companiesUrl: "durandalauth/companies",
    invitationsUrl: "durandalauth/invitations",
    outputUnitUrl: "durandalauth/outputUnits",
    energySavingUrl: "durandalauth/energySavings",
    surveyUrl: "durandalauth/surveys",
    networkCompaniesUrl: "durandalauth/networkCompanies",
    investmentPlansUrl: "durandalauth/investmentPlans",
    comparisonsUrl: "durandalauth/comparisons",
    documentsUrl: "durandalauth/documents",
    areasUrl: "durandalauth/areas",
    productsUrl: "durandalauth/products",
    productionTimesUrl: "durandalauth/productionTimes",
    readingsUrl: "durandalauth/readings",
    importantTopicsUrl: "durandalauth/importantTopics",
    changeSetsUrl: "durandalauth/changeSets",
    changesUrl: "durandalauth/changes",
    companySizesUrl: "durandalauth/companySizes",
    fiscalYearsUrl: "durandalauth/fiscalYears",
    operationTimesUrl: "durandalauth/operationTimes",

    //UtilsController
    companyRankingUrl: postBaseUrl + "/api/utils/companyRanking",
    companyRankingByCompanyUrl: postBaseUrl + "/api/utils/companyRankingByCompany",

    networkChartDataByUrl: postBaseUrl + "/api/utils/networkChartDataBy",
    networkChartDataDetailsByUrl: postBaseUrl + "/api/utils/networkChartDataDetailsBy",
    networkCompanyChartDataByUrl: postBaseUrl + "/api/utils/networkCompanyChartDataBy",
    networkCompanyChartDataDetailsByUrl: postBaseUrl + "/api/utils/networkCompanyChartDataDetailsBy",
    networksTotalEnergyConsumptionUrl: postBaseUrl + "/api/utils/networksTotalEnergyConsumption",
    getMeasureStatesUrl: postBaseUrl + "/api/utils/getMeasureStates",
    financialCalculationUrl: postBaseUrl + "/api/utils/financialCalculation",

    //ExcelExport
    exportMeasureDataByUrl: postBaseUrl + "/excelexport/ExportMeasureDataBy",
    exportCompanyDataByUrl: postBaseUrl + "/excelexport/ExportCompanyDataBy",
    exportNetworkDataByUrl: postBaseUrl + "/excelexport/ExportNetworkDataBy",

    //File
    getFileByUrl: postBaseUrl + "/file/getFileBy",
    saveFileUrl: postBaseUrl + "/file/saveFile",
    removeFileUrl: postBaseUrl + "/file/removeFile",

    //Authentication Routes
    addExternalLoginUrl: postBaseUrl + "/api/account/addexternallogin",
    changePasswordUrl: postBaseUrl + "/api/account/changepassword",
    loginUrl: postBaseUrl + "/token",
    logoutUrl: postBaseUrl + "/api/account/logout",
    registerUrl: postBaseUrl + "/api/account/register",
    registerExternalUrl: postBaseUrl + "/api/account/registerexternal",
    removeLoginUrl: postBaseUrl + "/api/account/removelogin",
    setPasswordUrl: postBaseUrl + "/api/account/setpassword",
    siteUrl: postBaseUrl + "/",
    userInfoUrl: postBaseUrl + "/api/account/userinfo",
    usersManageUrl: postBaseUrl + "/api/account/usersManage",
    usersUrl: postBaseUrl + "/api/account/users",
    usersGroupedByRolesUrl: postBaseUrl + "/api/account/usersGroupedByRoles",
    rolesUrl: postBaseUrl + "/api/account/roles",
    hasPermissionUrl: postBaseUrl + "/api/account/hasPermission",
    updateUserUrl: postBaseUrl + "/api/account/updateUser",
    changeUserDataUrl: postBaseUrl + "/api/account/changeUserData",
    usersByCompanyIdUrl: postBaseUrl + "/api/account/usersByCompanyId/",
    forgotPassword: postBaseUrl + "/api/account/forgotpassword",
    resendMailRoute: postBaseUrl + "/api/account/resendconfirmationemail",
    resetPassword: postBaseUrl + "/api/account/resetpassword",
    deleteaccount: postBaseUrl + "/api/account/deleteaccount",
    contactUrl: postBaseUrl + "/api/account/sendContactMessage",
    invitationUrl: postBaseUrl + "/api/account/sendInvitation",
    getInvitationByIdUrl: postBaseUrl + "/api/account/getInvitationById",
    isUsernameInUseUrl: postBaseUrl + "/api/account/isUsernameInUse",
    isEmailInUseUrl: postBaseUrl + "/api/account/isEmailInUse"
  };

  return routes;

});