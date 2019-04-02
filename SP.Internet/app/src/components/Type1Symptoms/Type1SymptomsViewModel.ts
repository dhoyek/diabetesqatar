// ========================================
// Type1Symptoms Component View Model
// ========================================
declare function require(name: string);

import * as i18n from "i18next";
import { Site, Web } from "sp-pnp-js";
import "trunk8";
// tslint:disable-next-line:no-var-requires
const Flickity = require("flickity");
require("flickity-imagesloaded");

class Type1SymptomsViewModel {

    public items: KnockoutObservableArray<any> = ko.observableArray([]);
    public siteLogoUrl: KnockoutObservable<string> = ko.observable("");
    private readMoreLabel: KnockoutObservable<string> = ko.observable("");
    //private RiskFactorHeader: KnockoutObservable<string> = ko.observable("");
    private Type1Symptoms: any;

    constructor(params: any) {

        const listTitle = "Type 1 Symptoms";

        const languageFieldName = "IntranetContentLanguage";

        this.siteLogoUrl(_spPageContextInfo.webLogoUrl);
        this.readMoreLabel(i18n.t("readMore"));
       // this.RiskFactorHeader(i18n.t("Type1SymptomsHeader"));

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

                    // Setup the Type1Symptoms
                    // See http://flickity.metafizzy.co/ for more customizations
                    const Type1Symptoms = new Flickity(".Type1Symptoms", {
                        adaptiveHeight: true,
                        imageLoaded: true,
                        lazyLoad: 1,
                        pageDots: false,
                        prevNextButtons: false,
                        setGallerySize: true,
                    });

                    Type1Symptoms.select(0);

                    // See https://codepen.io/desandro/pen/dMjbjR for Flickity vertical nav
                    Type1Symptoms.on("select", (data) => {

                        const Type1SymptomsNav = $(".Type1Symptoms-nav");
                        const Type1SymptomsNavCells = Type1SymptomsNav.find(".Type1Symptoms-nav-row");

                        //const navTop  = Type1SymptomsNav.position().top;
                        const navCellHeight = Type1SymptomsNavCells.height();
                        const navHeight = Type1SymptomsNav.height();

                        // Highlight the nav cell
                        const index = Type1Symptoms.selectedIndex ;

                        Type1SymptomsNav.find(".is-nav-selected").removeClass("is-nav-selected");
                        const selected = Type1SymptomsNavCells.eq(index).addClass("is-nav-selected");

                        // scroll nav
                        const scrollY = selected.position().top + Type1SymptomsNav.scrollTop() - (navHeight + navCellHeight) / 2;

                        Type1SymptomsNav.animate({
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
        const Type1Symptoms = new Flickity(".Type1Symptoms");

        Type1Symptoms.select(index);
    }
}

export default Type1SymptomsViewModel;
