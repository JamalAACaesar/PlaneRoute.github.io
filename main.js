
(function () {

    // Author: Jamal Caesar
    // Created: Tuesday 18th February 2020
    // Code Assignment: 3C
    // Descrition: Using the opensky network api, the code was created to track the flight data
    //             Of different Airplanes that are in Canada. The Code was filtered, Mapped and 
    //             of course plotted for the icons to be generated at each plot point along with
    //             A refresher to refresh the code whenever new ones are generated. The code is
    //             To not escape the global function, otherwise it will infect the global scope
    //             Thus causing issues with the code.

    // Due Date: 25th February, 2020.



    //create map in leaflet and tie it to the div called 'theMap'
    var map = L.map('theMap').setView([42, -60], 4);
    // This is an empty variable that will take the geoJson file, so that it will help
    // Later down in the code to remove the old data to replace with the new data
    var removelayer = L.geoJSON()
    // This below here is for the custom Icon beng used so whenever the data is retrieved they will
    // Plot the points that were set using the geojson data being retrieved from the leaflet.
    var planeicon = L.icon({
        iconUrl: 'plane2.png',
        iconSize: [50, 50],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]

    });



    // This code below should not be changed as it is the map.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    //Creation of the function for the map refreshing code. This activates when the entire code is finished
    // It will then refresh to regain new data at all times.
    function maprefreshing() {

        // This is a console log to state that the code is gathering the data to make sure the code does not freeze
        // This is for user safety and preference.
        console.log("Fetching Flight Data....")


        // This code below fetches the url which gives access to the API data
        // So that the coder can use it and initiate the coding processes below.
        fetch("https://opensky-network.org/api/states/all.")

            .then(function (response) {
                return response.json();
            })

            .then(function (json) {

                // This is wher ethe user gains the data and filters it to look specifically
                // For Canadian Flights thus the variable Canadian Flights was created.
                // It contains an if function that looks specifically for Canada.
                var CanadianFlights = json.states.filter(function (Canada) {

                    if (Canada[2].includes("Canada")) {
                        return Canada;
                    }
                })



                //This function below is to plot the points on the map for the Plane Icons
                // It fully plots each part the planes are going to and gives the direction of rotation to 
                // aim directly to go there.
                var GEOJSON = CanadianFlights.map(function (Geology) {

                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [Geology[5], Geology[6]],
                            time_position: [Geology[3]],
                            last_contact: [Geology[4]],
                            baro_altitude: [Geology[7]],
                            on_ground: [Geology[8]],
                            true_track: [Geology[10]],
                            vertical_rate: [Geology[11]],
                            geo_altitude: [Geology[13]]


                        }, properties: {
                            call_sign: [Geology[1]],
                            sensors: [Geology[12]],
                            squawk: [Geology[14]],
                            spi: [Geology[15]],
                            position_source: [Geology[16]],
                            velocity: [Geology[9]],
                            popupContent: "This is flight number "
                        }


                    }

                })

                // This function is for the popup feature that whenever a person clicks the plane 
                // They would be able to see the information on what it is, where it was last seen
                // Along with what type of flight it is (as most of them are Air Canada anyway)
                function onEachFeature(feature, layer) {
                    if (feature.properties && feature.properties.popupContent) {
                        layer.bindPopup(feature.properties.popupContent + `${feature.properties.call_sign} </br> With Coordinates ${feature.geometry.coordinates}
                    </br> With a velocity of ${feature.properties.velocity} m/s </br> It was first seen at ${feature.geometry.time_position}
                    </br> and last seen at ${feature.geometry.last_contact}`);



                    }
                }

                // This generates the code inside the console log so the person can see what code is 
                // Being generated
                console.log(GEOJSON)

               // This is the remove function that will remove the old data thus giving it a new fresh layer with
               // new plotted points and the icon moving to it's new location.
                removelayer.clearLayers();
                 // This code below is used to use the plane icon and rotate it to go directly to the place
                // That it goes to.
                removelayer = L.geoJSON(GEOJSON,
                    {
                        onEachFeature: onEachFeature,
                        pointToLayer: function planelayer(feature, layer) {
                            return L.marker(layer, { icon: planeicon, rotationAngle: feature.geometry.true_track })
                           
                        

                        }


                    }).addTo(map);


                // This code is a timeout feature that refreshes the map every chosen seconds that the user decides to use.
                // Whether it be 4 seconds (4000), a minute 10000 etc...
                setTimeout(maprefreshing, 4000);




            })

    }


    // This code below is the timeout feature's call back so whenever all of the code is finished generated, it will
    // Refresh according to the minutes/seconds used.
    maprefreshing()


})()