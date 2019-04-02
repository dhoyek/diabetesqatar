fd.spRendered(function () {

    //Create Fnc Set Title Value = To Church Name after edit
    function FncSetTitle(fldTName) {
        if (fd.field(fldTName).value != null
            && fd.field(fldTName).value != '') {
            // Set Title Value
            fd.field('Title').value = fd.field(fldTName).value;
        }
    }
    //*****************************
    // Calling FncSetChurchTitle on form loading
    FncSetTitle('ChurchFullName');

    // Calling FncSetChurchTitle when the user changes the Parish Name
    fd.field("ChurchFullName").$on('change', function (value) {
        FncSetTitle('ChurchFullName');
    });

    //Disable Controls
    fd.field('Title').disabled = true;
    fd.field('ChurchEparchy').disabled = true;
    fd.field('ChurchParish').disabled = true;

    //Default Country
    //fd.field('ChurchCountryIDFk').value = '114'	

    // Cascading Neighborhood
    function NeighborhoodFilterLookup(v) {
        // getting the selected ParishEparchy (0 if nothing is selected).
        var intItemID = 0;
        if (v) {
            intItemID = isNaN(v) ? v.LookupId : v;
        }

        if (intItemID) {
            // setting filtration
            fd.field('Churchneighborhood').filter = 'NeiborhoodVillageName/Id eq ' + intItemID;
        } else {
            // resetting the filtration
            fd.field('Churchneighborhood').filter = null;
        }

        fd.field('Churchneighborhood').widget.dataSource.read();
    }

    function VillageFilterLookup(v) {
        // getting the selected ParishEparchy (0 if nothing is selected).
        var intItemID = 0;
        if (v) {
            intItemID = isNaN(v) ? v.LookupId : v;
        }

        if (intItemID) {
            // setting filtration
            fd.field('ChurchVillage').filter = 'Country/Id eq ' + intItemID;
        } else {
            // resetting the filtration
            fd.field('ChurchVillage').filter = null;
        }

        fd.field('ChurchVillage').widget.dataSource.read();
    }


    fd.field("Churchneighborhood").ready().then(function () {
        return fd.field('ChurchVillage').ready();
    }).then(function () {
        return fd.field('ChurchCountryIDFk').ready();
    }).then(function () {

        VillageFilterLookup(fd.field("ChurchCountryIDFk").value);
        fd.field("ChurchCountryIDFk").$on('change', function (value) {
            VillageFilterLookup(value);
            fd.field('ChurchVillage').value = null;
        });

        NeighborhoodFilterLookup(fd.field("ChurchVillage").value);
        fd.field("ChurchVillage").$on('change', function (value) {
            NeighborhoodFilterLookup(value);
            fd.field('Churchneighborhood').value = null;
        });
    });



    //Function Disable Enable Controls
    //################################################################
    //**********
    //Sekrestiya
    function FncSekristiya() {
        debugger;
        fd.field('ChurchSekristiyaAvailable').ready().then(function (field) {
            if (fd.field('ChurchSekristiyaAvailable').value === false) {
                // If False/Not Available
                fd.field('ChurchSekristiyaNote').value = '';
                fd.field('ChurchSekristiyaNote').clear();
                fd.field('ChurchSekristiyaNote').disabled = true;
            } else {
                // If True/Available
                fd.field('ChurchSekristiyaNote').disabled = false;
            }
        });
        
    }

    // Calling  when the user changes the status
    fd.field('ChurchSekristiyaAvailable').$on('change', FncSekristiya);

    // Calling  on form loading
    FncSekristiya();


    //**********
    //Priest House
    function FncPriestHouse() {
        if (fd.field('ChurchPriestHouseAvailable').value == false) {
            // If False/Not Available
            fd.field('ChurchPriestHouseNote').clear();
            fd.field('ChurchPriestHouseNote').disabled = true;
        } else {
            // If True/Available            
            fd.field('ChurchPriestHouseNote').disabled = false;
        }
    }

    // Calling when the user changes the status
    fd.field('ChurchPriestHouseAvailable').$on('change', FncPriestHouse);

    // Calling on form loading
    FncPriestHouse();


    //**********
    //Cemetry
    function FncCemetry() {
        if (fd.field('ChurchCemetryAvailable').value == false) {
            // If False/Not Available
            fd.field('ChurchCemetryNote').clear();
            fd.field('ChurchCemetryNote').disabled = true;
        } else {
            // If True/Available            
            fd.field('ChurchCemetryNote').disabled = false;
        }
    }

    // Calling when the user changes the status
    fd.field('ChurchCemetryAvailable').$on('change', FncCemetry);

    // Calling on form loading
    FncCemetry();



    //**********
    //BaptismPlace
    function FncBaptismPlace() {
        if (fd.field('ChurchBaptismPlaceAvailable').value == false) {
            // If False/Not Available
            fd.field('ChurchBaptismPlaceNote').clear();
            fd.field('ChurchBaptismPlaceNote').disabled = true;
        } else {
            // If True/Available            
            fd.field('ChurchBaptismPlaceNote').disabled = false;
        }
    }

    // Calling when the user changes the status
    fd.field('ChurchBaptismPlaceAvailable').$on('change', FncBaptismPlace);

    // Calling on form loading
    FncBaptismPlace();


    //**********
    //Bell Place
    function FncBellPlace() {
        if (fd.field('ChurchBellPlaceAvailable').value == false) {
            // If False/Not Available
            fd.field('ChurchBellPlaceNote').clear();
            fd.field('ChurchBellPlaceNote').disabled = true;
        } else {
            // If True/Available            
            fd.field('ChurchBellPlaceNote').disabled = false;
        }
    }

    // Calling when the user changes the status
    fd.field('ChurchBellPlaceAvailable').$on('change', FncBellPlace);

    // Calling on form loading
    FncBellPlace();



    //**********
    //Basement
    function FncBasement() {
        if (fd.field('ChurchBasementAvailable').value == false) {
            // If False/Not Available
            fd.field('ChurchBasementNote').clear();
            fd.field('ChurchBasementNote').disabled = true;
        } else {
            // If True/Available            
            fd.field('ChurchBasementNote').disabled = false;
        }
    }

    // Calling when the user changes the status
    fd.field('ChurchBasementAvailable').$on('change', FncBasement);

    // Calling on form loading
    FncBasement();
    //################################################################

    // End of fd.spRendered(function() {
});
