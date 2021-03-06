<%@ Page language="C#"   Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document" %>
<%@ Register Tagprefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@Register Tagprefix="PageFieldTaxonomyFieldControl" Namespace="Microsoft.SharePoint.Taxonomy" Assembly="Microsoft.SharePoint.Taxonomy, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register Tagprefix="PageFieldRadioButtonChoiceField" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register Tagprefix="PageFieldUserField" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register Tagprefix="PageFieldDateTimeField" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register Tagprefix="PageFieldPublishingScheduleFieldControl" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@Register Tagprefix="PageFieldBooleanField" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">

	<!-- Custom styles are loaded only on display mode -->
    <PublishingWebControls:EditModePanel runat="server" id="DisplayModeControl" SuppressTag="true" PageDisplayMode="display">
            <SharePointWebControls:CssRegistration runat="server" ID="PortalCss" Name="&lt;% $SPUrl:~sitecollection/Style Library/PnP/layouts.css %&gt;" After="corev15.css"/>
	</PublishingWebControls:EditModePanel>

    <!-- Custom styles are loaded only on edit mode -->
	<PublishingWebControls:EditModePanel runat="server" id="EditModeControl" SuppressTag="true">
        <SharePointWebControls:CssRegistration runat="server" ID="PortalLayoutEditCss" Name="&lt;% $SPUrl:~sitecollection/Style Library/PnP/layouts-edit.css %&gt;" After="corev15.css"/>

		<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>"
			After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	</PublishingWebControls:EditModePanel>
	
	<style type="text/css">
	
		#title {
			display: none;
		}

		/* Small devices */
		@media (max-width: 767px) { 
			#intranet-breadcrumb {
				display: none;
			}
		}

	</style>

</asp:Content>

<asp:Content ContentPlaceholderID="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:FieldValue id="PageTitle" FieldName="Title" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderMain" runat="server">

	<div class="page-layout">
		<div class="row">
			<div class="col-md-12">

				<PublishingWebControls:EditModePanel runat="server" id="DisplayModePageInfo" SuppressTag="true" PageDisplayMode="display">
					<div id="title" class="field">
						<SharePointWebControls:TextField runat="server" FieldName="Title"/>
					</div>

					<!-- Hidden metadata on the page tobe able to hide the side bar-->
					<div id="hide-side-bar-hidden">
						<SharePointWebControls:ListItemProperty runat="server" Property="HideSideBarHidden" />
					</div>
				</PublishingWebControls:EditModePanel>

				<PublishingWebControls:EditModePanel runat="server" CssClass="edit-mode-panel title-edit">
				
					<div id="title" class="field">
						<SharePointWebControls:TextField runat="server" FieldName="Title"/>            
					</div>

					<div id="contact" class="field">
						<PageFieldUserField:UserField FieldName="IntranetContact" runat="server"/>    
					</div>					
					
	                <div id="sitemap-position" class="field">
	        			<PageFieldTaxonomyFieldControl:TaxonomyFieldControl FieldName="IntranetSiteMapPosition" runat="server" CssClass="jambon"/>
	       			</div>
	                
	                <div id="language" class="field">
	                   <PageFieldRadioButtonChoiceField:RadioButtonChoiceField FieldName="IntranetContentLanguage" runat="server"/>
	                </div>
	
	                <div id="translation" class="field">
	                    <component-translationcontrol params='languageFieldName:"IntranetContentLanguage", associationKeyFieldName:"IntranetContentAssociationKey"'></component-translationcontrol>
	            	</div>

					<div id="hide-sidebar" class="field">
						<PageFieldBooleanField:BooleanField FieldName="HideSideBar" runat="server"/>
					</div>	
					
					<div id="hide-side-bar-hidden">
						<SharePointWebControls:ListItemProperty runat="server" Property="HideSideBarHidden" />
					</div>
		                    
				</PublishingWebControls:EditModePanel>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 col-md-3 col-sm-4 col-lg-3">
				<WebPartPages:WebPartZone id="xdd69f0bc06df4d3c9d3cdd55b43b5d80" runat="server" title="Main 25 1"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>				
			</div>
			<div class="col-xs-12 col-md-9 col-sm-8 col-lg-9">
				<WebPartPages:WebPartZone id="x0ae7cb517f874186bf4ba26559805dfe" runat="server" title="Main 75 1"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
			</div>
		</div>
	</div>

</asp:Content>
