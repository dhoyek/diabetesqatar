// ========================================
// AskTheDoctor Component View Model
// ========================================
declare function require(name: string);

import * as i18n from "i18next";
import { Site, Web } from "sp-pnp-js";
import "trunk8";
// tslint:disable-next-line:no-var-requires
const Flickity = require("flickity");
require("flickity-imagesloaded");

require("@fancyapps/fancybox");


class AskTheDoctorViewModel {

    public items: KnockoutObservableArray<any> = ko.observableArray([]);
    public siteLogoUrl: KnockoutObservable<string> = ko.observable("");
    private readMoreLabel: KnockoutObservable<string> = ko.observable("");
    //private RiskFactorHeader: KnockoutObservable<string> = ko.observable("");
    private AskTheDoctor: any;

    constructor(params: any) {

        const listTitle = "Ask The Doctor";

        const languageFieldName = "IntranetContentLanguage";

        this.siteLogoUrl(_spPageContextInfo.webLogoUrl);
        this.readMoreLabel(i18n.t("readMore"));
       // this.RiskFactorHeader(i18n.t("AskTheDoctorHeader"));

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

                    // Setup the AskTheDoctor
                    // See http://flickity.metafizzy.co/ for more customizations
                    const AskTheDoctor = new Flickity(".AskTheDoctor", {
                        adaptiveHeight: true,
                        imageLoaded: true,
                        lazyLoad: 1,
                        pageDots: false,
                        prevNextButtons: false,
                        setGallerySize: true,
                        wrapAround: true
                    });

                    AskTheDoctor.select(0);

                    // next
                    $('.bootstrap-iso .AskTheDoctor-Content .next').on( 'click', function() {
                        AskTheDoctor.next();
                    });
                    $('.bootstrap-iso-ar .AskTheDoctor-Content .previous').on( 'click', function() {
                        AskTheDoctor.next();
                    });
                    // previous
                    $('.bootstrap-iso .AskTheDoctor-Content .previous').on( 'click', function() {
                        AskTheDoctor.previous();
                    });
                    $('.bootstrap-iso-ar .AskTheDoctor-Content .next').on( 'click', function() {
                        AskTheDoctor.previous();
                    });

                    // Truncate the label
                    $("#slide-title").trunk8(trunk8OptionsSlideTitle);

                    // Adjust automatically slide label on resize
                    $(window).resize((event) => {
                        $("#slide-title").trunk8(trunk8OptionsSlideTitle);
                    });
                });
            }
        });
    }

    public selectSlide = (data, event) => {
        const index = $(event.currentTarget).index();
        const AskTheDoctor = new Flickity(".AskTheDoctor");

        AskTheDoctor.select(index);
    }
}

export default AskTheDoctorViewModel;
