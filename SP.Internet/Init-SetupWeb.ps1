#Set-ExecutionPolicy RemoteSigned

$UserName = 'dany@yorgoinc.com'
$Password = 'DHo@39_1982'

$SiteURL = 'https://yorgoinc.sharepoint.com/sites/diabetesqatar'

Set-Location 'E:\Workspace\diabetesqatar\SP.Internet'
$Script = ".\Setup-Web.ps1" 
& $Script -RootSiteURL $SiteURL -UserName $UserName -Password $Password -IncludeData
