var sqlite      = require('sqlite3'),
    fs          = require('fs'),
    args        = process.argv.slice(2),
    inputFile   = args[0],
    outputFile  = args[1],
    output      = null;

if (!inputFile)
{
    return;
}

if (!outputFile)
{
    outputFile = inputFile.substr(0, inputFile.lastIndexOf('.')) + '.gpx';
}


extract(inputFile, outputFile);


/**
 * Extract data from Runkeeper sql database and put it in the output file
 *
 * @param String inputFile Runkeeper sqlite file to read from
 * @param String outputFile GPX path to write output to
 */
function extract(inputFile, outputFile)
{
    // var db = sqlite.openDatabaseSync(inputFile);
    var db      = new sqlite.Database(inputFile),
        tripId  = null;

    db.serialize(function() {
        db.get("SELECT * FROM trips ORDER BY start_date DESC", function(error, row) {

            if (row)
            {
                initializeOutput(row);

                tripId = row['trip_id'];

                db.each('SELECT latitude, longitude, altitude, time_at_point from points where trip_id = ' + tripId + ';', function (error, row) {
                    addPoint(row);
                }, function () {
                    finilizeOutput();
                    writeOutput(outputFile);
                });
  
            }
            else
            {
                console.log('Could not find any trips');
            }
        });
    });
}


/**
 * Add XML tags and metadata for GPX file to output buffer
 *
 * @param Object info Info about the trip
 */
function initializeOutput(info)
{
    output = '' +
        '<?xml version="1.0" encoding="UTF-8"?>' +
            '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpsies="http://www.gpsies.com/GPX/1/0" creator="GPSies http://www.gpsies.com - 2012-06-101917" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.gpsies.com/GPX/1/0 http://www.gpsies.com/gpsies.xsd">' +
                '<metadata>' +
                    '<name>Runkeeper trip ' + info.trip_id + '</name>' +
                '</metadata>' +
                '<trk>' +
                    '<trkseg>';
}

/**
 * Add point to output buffer
 *
 * @param Object point Point object to add, needs keys: latitude, longitude, altitude, time
 */
function addPoint(point)
{
    output +=   '<trkpt lat="' + point.latitude + '" lon="' + point.longitude + '">' +
                    '<ele>' + point.altitude + '</ele>' +
                    '<time>' + point.time_at_point + '</time>' +
                '</trkpt>';
}

/**
 * Add closing XML tags to output buffer
 */
function finilizeOutput()
{
    output += '</trkseg></trk></gpx>';
}


/**
 * Write output buffer to file
 *
 * @param String outputFile path to the file to write
 */
function writeOutput(outputFile)
{
    console.log(outputFile);
    fs.writeFile(outputFile, output, function (error) {
        if (error)
        {
            console.log('Could not write the file', error);
        }
        else
        {
            console.log('The file was saved!');
        }
    });
}