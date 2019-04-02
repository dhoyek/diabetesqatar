// ========================================
// RiskFactors Component View Model
// ========================================
declare function require(name: string);

import * as i18n from "i18next";
import { Site, Web } from "sp-pnp-js";
import "trunk8";
// tslint:disable-next-line:no-var-requires
const Flickity = require("flickity");
require("flickity-imagesloaded");

class RiskFactorsViewModel {

    public items: KnockoutObservableArray<any> = ko.observableArray([]);
    public siteLogoUrl: KnockoutObservable<string> = ko.observable("");
    private readMoreLabel: KnockoutObservable<string> = ko.observable("");
    //private RiskFactorHeader: KnockoutObservable<string> = ko.observable("");
    private RiskFactors: any;

    constructor(params: any) {

        const listTitle = "Risk Factors";

        const languageFieldName = "IntranetContentLanguage";

        this.siteLogoUrl(_spPageContextInfo.webLogoUrl);
        this.readMoreLabel(i18n.t("readMore"));
       // this.RiskFactorHeader(i18n.t("RiskFactorsHeader"));

        const trunk8OptionsNavLabel: Trunk8Options = {
            lines: 2,
            tooltip: false,
        };

        const trunk8OptionsSlideTitle: Trunk8Options = {
            lines: 4,
            tooltip: false,
        };

        const site = new Site(_spPageContextInfo.siteAbsoluteUrl);
        const web = new Web(_spPageContextInfo.webAbsoluteUrl);

        // Get the current page language
        web.lists.getById(_spPageContextInfo.pageListId.replace(/{|}/g, "")).items.getById(_spPageContextInfo.pageItemId).select("ID", languageFieldName).get().then((item) => {

            const currentPageLanguage = item[languageFieldName];

            if (currentPageLanguage) {

                const now = new Date();
                const filterQuery = "CarouselItemEndDate ge datetime'" + now.toISOString() + "' and CarouselItemStartDate le datetime'" + now.toISOString() + "' and IntranetContentLanguage eq '" + currentPageLanguage + "'";

                site.rootWeb.lists.getByTitle(listTitle).items.orderBy("CarouselItemOrder", true).filter(filterQuery).get().then((elements) => {

                    // Fill the observable array
                    this.items(elements);

                    // Setup the RiskFactors
                    // See http://flickity.metafizzy.co/ for more customizations
                    const RiskFactors = new Flickity(".RiskFactors", {
                        adaptiveHeight: true,
                        imageLoaded: true,
                        lazyLoad: 1,
                        pageDots: false,
                        prevNextButtons: false,
                        setGallerySize: true,
                    });

                    RiskFactors.select(0);

                    // See https://codepen.io/desandro/pen/dMjbjR for Flickity vertical nav
                    RiskFactors.on("select", (data) => {

                        const RiskFactorsNav = $(".RiskFactors-nav");
                        const RiskFactorsNavCells = RiskFactorsNav.find(".RiskFactors-nav-row");

                        //const navTop  = RiskFactorsNav.position().top;
                        const navCellHeight = RiskFactorsNavCells.height();
                        const navHeight = RiskFactorsNav.height();

                        // Highlight the nav cell
                        const index = RiskFactors.selectedIndex ;

                        RiskFactorsNav.find(".is-nav-selected").removeClass("is-nav-selected");
                        const selected = RiskFactorsNavCells.eq(index).addClass("is-nav-selected");

                        // scroll nav
                        const scrollY = selected.position().top + RiskFactorsNav.scrollTop() - (navHeight + navCellHeight) / 2;

                        RiskFactorsNav.animate({
                            scrollTop: scrollY,
                        });
                    });

                    // Truncate the label
                    $(".nav-label").trunk8(trunk8OptionsNavLabel);
                    $("#slide-title").trunk8(trunk8OptionsSlideTitle);

                    // Adjust automatically slide label on resize
                    $(window).resize((event) => {
                        $(".nav-label").trunk8(trunk8OptionsNavLabel);
                        $("#slide-title").trunk8(trunk8OptionsSlideTitle);
                    });
                });
            }
        });
    }

    public selectSlide = (data, event) => {
        const index = $(event.currentTarget).index();
        const RiskFactors = new Flickity(".RiskFactors");

        RiskFactors.select(index);
    }
}

export default RiskFactorsViewModel;
