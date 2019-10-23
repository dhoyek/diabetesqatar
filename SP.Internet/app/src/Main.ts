// ===============================
// Application main entry point
// ===============================
// We must declare this function to get static files like html or CSS via the ts-loader
// More info here https://github.com/TypeStrong/ts-loader
declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

// View models for components
import AzureApplicationInsightsListener from "./AzureApplicationInsightsListener";
import BaseKnockoutComponent from "./components/BaseKnockoutComponent";
import BotWebChatViewModel from "./components/BotWebchat/BotWebChatViewModel";
import BreadcrumbViewModel from "./components/Breadcrumb/BreadcrumbViewModel";
import CarouselViewModel from "./components/Carousel/CarouselViewModel";
import SliderViewModel from "./components/Slider/SliderViewModel";
import UsefulLinksViewModel from "./components/UsefulLinks/UsefulLinksViewModel";
import CommentsViewModel from "./components/Comments/CommentsViewModel";
import ContextualMenuViewModel from "./components/ContextualMenu/ContextualMenuViewModel";
import DisplayTemplateViewModel from "./components/DisplayTemplates/DisplayTemplateViewModel";
import FooterLinksViewModel from "./components/FooterLinks/FooterLinksViewModel";
import HeaderLinksViewModel from "./components/HeaderLinks/HeaderLinksViewModel";
import ICSCalendarGeneratorViewModel from "./components/IcsCalendarGenerator/IcsCalendarGeneratorViewModel";
import LanguageSwitcherViewModel from "./components/LanguageSwitcher/LanguageSwitcherViewModel";
import NotificationBannerViewModel from "./components/NotificationBanner/NotificationBannerViewModel";
import PageInfoViewModel from "./components/PageInfo/PageInfoViewModel";
import SearchBoxViewModel from "./components/SearchBox/SearchBoxViewModel";
import SearchBoxLightViewModel from "./components/SearchBoxLight/SearchBoxLightViewModel";
import SearchBoxMobileViewModel from "./components/SearchBoxMobile/SearchBoxMobileViewModel";
import TopNavViewModel from "./components/TopNav/TopNavViewModel";
import TranslationControlViewModel from "./components/TranslationControl/TranslationControlViewModel";
import WelcomeOverlayViewModel from "./components/WelcomeOverlay/WelcomeOverlayViewModel";
import LocalizationModule from "./modules/LocalizationModule";
import UtilityModule from "./modules/UtilityModule";

import RiskFactorViewModel from "./components/RiskFactor/RiskFactorViewModel";
import Type1SymptomsViewModel from "./components/Type1Symptoms/Type1SymptomsViewModel";
import Type2SymptomsViewModel from "./components/Type2Symptoms/Type2SymptomsViewModel";
import GestationalSymptomsViewModel from "./components/GestationalSymptoms/GestationalSymptomsViewModel";
import AskTheDoctorViewModel from "./components/AskTheDoctor/AskTheDoctorViewModel";

// Third party libraries
import { AppInsights } from "applicationinsights-js";
import * as i18n from "i18next";
// tslint:disable-next-line:no-implicit-dependencies
import "jquery-ui";
import * as moment from "moment";
import { ConsoleListener, Logger, LogLevel, setup, Site, sp, storage, Util, Web } from "sp-pnp-js";

// tslint:disable-next-line:no-submodule-imports
require("es6-promise/auto"); // Fix for IE11 (inject the polyfill in the global context)

// Main style sheet for the application
require("./styles/css/global.scss");
require("./styles/css/layouts.scss");
require("./styles/css/layouts-edit.scss");
require("./components/DisplayTemplates/DisplayTemplates.scss");

// Images
require("./styles/css/images/spinner.gif");
require("./styles/css/images/default_image.png");
require("./styles/css/images/favicon_intranet.ico");
require("./styles/css/images/intranet-background.jpg");
require("./styles/css/images/flags.png");

// Bootstrap CSS isolation
require("./styles/css/bootstrap/bootstrap-prefix.less");
require("./styles/css/bootstrap/bootstrap-prefix-ar.less");

// jQueryUi css for the datepicker
// tslint:disable-next-line:no-submodule-imports
require("jquery-ui-dist/jquery-ui.min.css");

//Diabetes Styles
//require("./styles/diabetesqatar/css/bootstrap.css"); //<!--=== Add By Designer ===-->
require("./styles/diabetesqatar/css/style.css");
require("./styles/diabetesqatar/css/yamm.css"); //<!-- Animation -->
require("./styles/diabetesqatar/css/animate.css"); //<!-- Animation -->
require("./styles/diabetesqatar/css/flaticon.css"); //<!-- Animation -->
require("./styles/diabetesqatar/css/font-awesome.min.css"); //<!-- Animation -->
//require("./styles/diabetesqatar/css/fonts.css"); //<!-- Animation -->

require("./styles/diabetesqatar/css/jquery.fancybox.min.css"); //<!-- fancy Box -->

//Diabetes Images
require("./styles/diabetesqatar/images/d_logo_en.png");
require("./styles/diabetesqatar/images/moph_logo.png");
require("./styles/diabetesqatar/images/d_logo_ar.png");
require("./styles/diabetesqatar/images/moph_logo_ar.png");

require("./styles/diabetesqatar/images/diabetes_logo.png");
//require("./styles/diabetesqatar/images/logo.png");
require("./styles/diabetesqatar/images/community.png");
require("./styles/diabetesqatar/images/community_ar.png");
require("./styles/diabetesqatar/images/doc.png");
require("./styles/diabetesqatar/images/doc_ar.png");
require("./styles/diabetesqatar/images/family.png");
require("./styles/diabetesqatar/images/family_ar.png");
require("./styles/diabetesqatar/images/patient.png");
require("./styles/diabetesqatar/images/patient_ar.png");


export class Main {

    // Static methods are mainly used for SharePoint display templates (it is just a public wrapper)
    // We can't use Knockout components here because bindings are not triggered when the display template logic adds the component programmatically
    // We have to apply bindings manually after rendering
    public static initDisplayTemplateViewModel = (domElement: string, currentItem?: any) => {

        const viewModel = new DisplayTemplateViewModel(currentItem);
        ko.applyBindings(viewModel, domElement);
    }

    public static initFilterDatePicker = (controlID: string, fromInput: any, toInput: any) => {

        const container = {};
        const format = "yy-mm-dd";

        // Store the IDs in a container variable
        container[controlID] = {};
        container[controlID]["from"] = fromInput;
        container[controlID]["to"] = toInput;

        $("#" + container[controlID].from).datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: format,
        });

        $("#" + container[controlID].to).datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: format,
        });

        const localization = new LocalizationModule();
        localization.ensureResourcesLoaded(() => {
            $["datepicker"].setDefaults(i18n.t("datepicker", { returnObjects: true }));
        });
    }

    public static getResource = (resourceKey: string) => {

        let resource;
        const localization = new LocalizationModule();
        localization.ensureResourcesLoaded(() => {
            resource = i18n.t(resourceKey);
        });

        return resource;
    }

    public static initWelcomePage = () => {

        $(document).ready(() => {

            const utilityModule = new UtilityModule();

            utilityModule.getSharePointBuildNumber().then((serverVersion) => {

                // We voluntary don't track the page name and the URL to respect confidentiality (i.e trackView() method)
                AppInsights.trackEvent("HomePageDisplayed", {
                    ClientUniqueId: _spPageContextInfo.pageListId.toString(),
                    IsSPO: _spPageContextInfo["isSPO"] ? _spPageContextInfo["isSPO"] : false,
                    Language: _spPageContextInfo.webLanguage.toString(),
                    SharePointVersion: serverVersion,
                }, null);

            }).catch((errorMessage) => {
                Logger.write(errorMessage, LogLevel.Error);
            });

            // Detect if the welcome overlay control has to be displayed (the visibility is controlled by Bootstrap CSS classes 'hidden-xx')
            const welcomeOverlay = $("#welcome-overlay");
            if (welcomeOverlay.is(":visible")) {

                // Remove the node before the Knockout JS bindings applied
                // We can't simply move the top navcomponent (bindings are applied twice otherwise)
                $("component-topnav").remove();

                // Use of the welcome overlay component containing the top nav
                welcomeOverlay.append("<component-welcome></component-welcome>");

            } else {
                // Load the mobile view
                const welcomeOverlayMobile = $("#welcome-overlay-mobile");
                if (welcomeOverlayMobile.is(":visible")) {
                    welcomeOverlayMobile.append("<component-welcomemobile></component-welcomemobile>");
                }
            }
        });
    }

    public static initHomePage = () => {

        $(document).ready(() => {
            $(".moph_logo_holder").removeClass("col-sm-2 col-md-2").addClass("col-sm-3 col-md-3");
            $(".diabeteslogoholder").removeClass("col-sm-10 col-md-10").addClass("col-sm-9 col-md-9");
        });
    }


    public static truncate = (rootElement) => {
        $(rootElement + " " + ".truncatable").trigger("truncate");
    }

    // Return third libraries root objects to be able to use it in display template (dates comparison for events, or jQuery for DOM manipulations)
    public static jQuery = () => {
        return $;
    }

    public static moment = () => {
        return moment;
    }

    /**
     * Register all Knockout components for the entire application
     */
    public registerComponents() {

        // ===============================
        // Register Knockout components
        // ===============================

        // Component: "MainMenu"
        const mainMenuTemplate = require("./components/TopNav/TopNav.html");
        require("./components/TopNav/TopNav.scss");
        const mainMenuComponent = new BaseKnockoutComponent("component-topnav", TopNavViewModel, mainMenuTemplate);

        // Component: "ContextualMenu"
        const contextualMenuTemplate = require("./components/ContextualMenu/ContextualMenu.html");
        require("./components/ContextualMenu/ContextualMenu.scss");
        const contextualMenuComponent = new BaseKnockoutComponent("component-contextualmenu", ContextualMenuViewModel, contextualMenuTemplate);

        // Component: "Breadcrumb"
        const breadcrumbTemplate = require("./components/Breadcrumb/Breadcrumb.html");
        require("./components/Breadcrumb/Breadcrumb.scss");
        const breadcrumbComponent = new BaseKnockoutComponent("component-breadcrumb", BreadcrumbViewModel, breadcrumbTemplate);

        // Component: "Header" (template only)
        const headerTemplate = require("./components/Header/Header.html");
        require("./components/Header/Header.scss");
        const headerComponent = new BaseKnockoutComponent("component-header", null, headerTemplate);

        // Component: "Page Info"
        const pageInfoTemplate = require("./components/PageInfo/PageInfo.html");
        require("./components/PageInfo/PageInfo.scss");
        const pageInfoComponent = new BaseKnockoutComponent("component-pageinfo", PageInfoViewModel, pageInfoTemplate);

        // Component: "Translation Control"
        const translationControlTemplate = require("./components/TranslationControl/TranslationControl.html");
        require("./components/TranslationControl/TranslationControl.scss");
        const translationcontrolComponent = new BaseKnockoutComponent("component-translationcontrol", TranslationControlViewModel, translationControlTemplate);

        // Component: "Language Switcher"
        const languageSwitcherTemplate = require("./components/LanguageSwitcher/LanguageSwitcher.html");
        require("./components/LanguageSwitcher/LanguageSwitcher.scss");
        require("./styles/css/flags.scss");
        const languageSwitcherComponent = new BaseKnockoutComponent("component-languageswitcher", LanguageSwitcherViewModel, languageSwitcherTemplate);

        // Component: "Searchbox"
        const searchboxTemplate = require("./components/Searchbox/Searchbox.html");
        require("./components/Searchbox/Searchbox.scss");
        const searchboxComponent = new BaseKnockoutComponent("component-searchbox", SearchBoxViewModel, searchboxTemplate);

        // Component: "Header Links"
        const headerLinksTemplate = require("./components/HeaderLinks/HeaderLinks.html");
        require("./components/HeaderLinks/HeaderLinks.scss");
        const headerLinksComponent = new BaseKnockoutComponent("component-headerlinks", HeaderLinksViewModel, headerLinksTemplate);

        // Component: "Footer Links"
        const footerLinksTemplate = require("./components/FooterLinks/FooterLinks.html");
        require("./components/FooterLinks/FooterLinks.scss");
        const footerLinksComponent = new BaseKnockoutComponent("component-footerlinks", FooterLinksViewModel, footerLinksTemplate);

        // Component: "Search Box (mobile)"
        const searchboxMobileTemplate = require("./components/SearchBoxMobile/SearchBoxMobile.html");
        require("./components/SearchBoxMobile/SearchBoxMobile.scss");
        const searchboxMobileComponent = new BaseKnockoutComponent("component-searchboxmobile", SearchBoxMobileViewModel, searchboxMobileTemplate);

        // Component: "Carousel"
        const carouselTemplate = require("./components/Carousel/Carousel.html");
        require("./components/Carousel/Carousel.scss");
        const carouselComponent = new BaseKnockoutComponent("component-carousel", CarouselViewModel, carouselTemplate);

        // Component: "Slider"
        const sliderTemplate = require("./components/Slider/Slider.html");
        require("./components/Slider/Slider.scss");
        const sliderComponent = new BaseKnockoutComponent("component-slider", SliderViewModel, sliderTemplate);

        // Component: "UsefulLinks"
        const usefulLinksTemplate = require("./components/UsefulLinks/UsefulLinks.html");
        require("./components/UsefulLinks/UsefulLinks.scss");
        const usefulLinksComponent = new BaseKnockoutComponent("component-usefullinks", UsefulLinksViewModel, usefulLinksTemplate);

        // Component: "ICS Generator"
        const calendarGeneratorTemplate = require("./components/IcsCalendarGenerator/IcsCalendarGenerator.html");
        require("./components/IcsCalendarGenerator/IcsCalendarGenerator.scss");
        const calendarGeneratorComponent = new BaseKnockoutComponent("component-icsgenerator", ICSCalendarGeneratorViewModel, calendarGeneratorTemplate);

        // Component: "Bot Web chat"
        const botWebChatTemplate = require("./components/BotWebchat/BotWebchat.html");
        require("./components/BotWebchat/BotWebchat.scss");
        const botWebChatComponent = new BaseKnockoutComponent("component-botwebchat", BotWebChatViewModel, botWebChatTemplate);

        // Component: "Welcome"
        const welcomeTemplate = require("./components/WelcomeOverlay/WelcomeOverlay.html");
        require("./components/WelcomeOverlay/WelcomeOverlay.scss");
        const welcomeComponent = new BaseKnockoutComponent("component-welcome", WelcomeOverlayViewModel, welcomeTemplate);

        // Component: "Welcome (mobile)"
        const welcomeTemplateMobile = require("./components/WelcomeOverlay/WelcomeOverlayMobile.html");
        require("./components/WelcomeOverlay/WelcomeOverlay.scss");
        require("./components/WelcomeOverlay/WelcomeOverlayMobile.scss");
        const welcomeMobileComponent = new BaseKnockoutComponent("component-welcomemobile", WelcomeOverlayViewModel, welcomeTemplateMobile);

        // Component: "Search Box Light"
        const searchboxLightTemplate = require("./components/SearchBoxLight/SearchBoxLight.html");
        require("./components/SearchBoxLight/SearchBoxLight.scss");
        const searchboxLightComponent = new BaseKnockoutComponent("component-searchboxlight", SearchBoxLightViewModel, searchboxLightTemplate);

        // Component: "Search Help Dialog" (template only)
        const searchHelpDialogTemplate = require("./components/SearchBoxLight/SearchHelpDialog.html");
        const searchHelpDialog = new BaseKnockoutComponent("component-searchhelp", null, searchHelpDialogTemplate);

        // Component: "Notification Banner"
        const notificationBannerTemplate = require("./components/NotificationBanner/NotificationBanner.html");
        require("./components/NotificationBanner/NotificationBanner.scss");
        const notificationBannerComponent = new BaseKnockoutComponent("component-notification", NotificationBannerViewModel, notificationBannerTemplate);

        // Component: "Discussion Board"
        const commentsTemplate = require("./components/Comments/Comments.html");
        require("./components/Comments/Comments.scss");
        const commentsComponent = new BaseKnockoutComponent("component-comments", CommentsViewModel, commentsTemplate);

        //// Component: "RiskFactors"
        //const RiskFactorsTemplate = require("./components/RiskFactors/RiskFactors.html");
        //require("./components/RiskFactors/RiskFactors.scss");
        //const RiskFactorsComponent = new BaseKnockoutComponent("component-riskfactors", RiskFactorsViewModel, RiskFactorsTemplate);

        // Component: "RiskFactor"
        const RiskFactorTemplate = require("./components/RiskFactor/RiskFactor.html");
        require("./components/RiskFactor/RiskFactor.scss");
        const RiskFactorComponent = new BaseKnockoutComponent("component-riskfactor", RiskFactorViewModel, RiskFactorTemplate);

        // Component: "Type1Symptoms"
        const Type1SymptomsTemplate = require("./components/Type1Symptoms/Type1Symptoms.html");
        require("./components/Type1Symptoms/Type1Symptoms.scss");
        const Type1SymptomsComponent = new BaseKnockoutComponent("component-type1symptoms", Type1SymptomsViewModel, Type1SymptomsTemplate);

        // Component: "Type2Symptoms"
        const Type2SymptomsTemplate = require("./components/Type2Symptoms/Type2Symptoms.html");
        require("./components/Type2Symptoms/Type2Symptoms.scss");
        const Type2SymptomsComponent = new BaseKnockoutComponent("component-type2symptoms", Type2SymptomsViewModel, Type2SymptomsTemplate);

        // Component: "GestationalSymptoms"
        const GestationalSymptomsTemplate = require("./components/GestationalSymptoms/GestationalSymptoms.html");
        require("./components/GestationalSymptoms/GestationalSymptoms.scss");
        const GestationalSymptomsComponent = new BaseKnockoutComponent("component-gestationalsymptoms", GestationalSymptomsViewModel, GestationalSymptomsTemplate);

        // Component: "AskTheDoctor"
        const AskTheDoctorTemplate = require("./components/AskTheDoctor/AskTheDoctor.html");
        require("./components/AskTheDoctor/AskTheDoctor.scss");
        const AskTheDoctorComponent = new BaseKnockoutComponent("component-askthedoctor", AskTheDoctorViewModel, AskTheDoctorTemplate);


    }

    public registerBindingHandlers() {

        ko.bindingHandlers.getResource = {

            init: (element, valueAccessor) => {

                const localization = new LocalizationModule();

                localization.ensureResourcesLoaded(() => {
                    const value = ko.unwrap(valueAccessor());
                    $(element).text(i18n.t(value));
                });
            },
        };
    }

    public init() {

        // Initialize Knockout JS
        this.registerComponents();
        this.registerBindingHandlers();

        // Init the loggers
        const consoleListener = new ConsoleListener();
        const azureLogger = new AzureApplicationInsightsListener();
        Logger.subscribe(consoleListener);
        Logger.subscribe(azureLogger);
        Logger.activeLogLevel = LogLevel.Error;

        // Needed for SharePoint 2013 On-Premise otherwise it will use Atom XML
        // You can set odata=metadata to reduce the payload. However, you will need to configure you SharePoint server accordingly (2013 only)
        // See https://technet.microsoft.com/en-us/library/dn762092(v=office.15).aspx
        setup({
            sp: {
                headers: {
                    Accept: "application/json; odata=verbose",
                },
            },
        });

        // Be careful, we need to apply bindings after the document is ready
        $(document).ready(() => {

            const localization = new LocalizationModule();
            const utilityModule = new UtilityModule();
            localization.initLanguageEnv().then(() => {

                const currentLanguage = i18n.t("languageLabel");
                const web = new Web(_spPageContextInfo.webAbsoluteUrl);
                const site = new Site(_spPageContextInfo.siteAbsoluteUrl);

                // Apply the Knockout JS magic!
                // Bindings are applied globally, so it means we can use static methods in master pages and page layouts as well (i.e for example for resources)
                ko.applyBindings();

                /* This value is used to determines whether or not the side bar should be hidden or not
                We use this mechanism instead of making a REST query to the curent item to improve performances. Even if this is not very elegant,
                a jQuery DOM manipulation is faster than a network query in this specific case*/
                const hiddenElt = $("#hide-side-bar-hidden");

                if (hiddenElt) {
                    const hideSideBar = hiddenElt.text().trim();
                    if (parseInt(hideSideBar, 10) === 1) {

                        // Hide the sidebar and breadcrumb
                        $("#intranet-sidebar").hide();
                        $("#intranet-content").removeClass("col-md-8 col-lg-9");
                        $("#intranet-content").addClass("col-md-12 col-lg-12");
                    }
                }

                // Add Bootstrap responsive behavior for news images
                $("#page-image img").addClass("img-responsive");

                /* Enable custom stylesheet prefix for CEWP (Editing Styles) */
                ExecuteOrDelayUntilScriptLoaded(() => {

                    $.each($("div[RteRedirect]"), (index, elt) => {

                        const id = $(elt).attr("RteRedirect");
                        const editSettings = $("#" + id);
                        if (editSettings.length > 0 && (editSettings[0]["PrefixStyleSheet"] === null || editSettings[0]["PrefixStyleSheet"] !== "intranet")) {
                            editSettings[0]["PrefixStyleSheet"] = "intranet";
                        }
                    });
                }, "sp.ribbon.js");

                // Check if an Azure Instrumentation key has been set in the configuration list
                utilityModule.getConfigurationListValuesForLanguage(currentLanguage).then((item) => {

                    if (item) {

                        const appInsightsInstrumentationKey = item.AppInsightsInstrumentationKey ? item.AppInsightsInstrumentationKey : "";

                        // Init Azure Application Insights
                        AppInsights.downloadAndSetup({
                            disableAjaxTracking: true,
                            instrumentationKey: appInsightsInstrumentationKey,
                        });

                    }
                });
            });
        });
    }
}

// Start the engine
const main = new Main();
main.init();
