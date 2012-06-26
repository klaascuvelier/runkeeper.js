var sqlite          = require('sqlite3'),
    fs              = require('fs'),

    arguments       = process.argv.splice(2),
    argCount        = arguments.length,
    outputBuffer    = '',

    inputFile       = null,
    outputFile      = null,
    action          = null;

if (argCount >= 2)
{
    inputFile   = arguments[0];
    action      = arguments[1];

    if (action === 'list')
    {
        if (argCount > 2)
        {
            outputFile = arguments[2];
        }

        list(output, error);
        return;
    }
    else if (action === 'export' && argCount >= 3)
    {
        tripId = arguments[2];
        tripId = parseInt(tripId, 10) || 0;

        if (argCount > 3)
        {
            outputFile = arguments[3];
        }

        exportTrip(tripId, output, error);
        return;
    }
}

help();
exit();



/**
 * Main action:
 * Display the help menu
 */
function help()
{
    var log = console.log;

    log('');
    log('Runkeeper.js by Klaas Cuvelier');
    log('------------------------------');
    log('');
    log('Runkeeper.js is a NodeJS script which allows you to export data from the Runkeeper® database file');
    log('');
    log('Usage:');
    log('node ./runkeeper.js <input-file> [action] [extra arguments] [output-file]');
    log('');
    log('Possible actions:');
    log(' - list:');
    log('     shows list with all trips in the input file');
    log(' - export <trip-id>:');
    log('     export a specific trip');

}


/**
 * Main action:
 * List all trips in the DB file
 *
 * @param function success
 * @param function failure
 */
function list(success, failure)
{
    var db;

    try {
        db = new sqlite.Database(inputFile);
        db.serialize(function() {
            buffer('#------------#----------------------#----------------------#---------------#----------------------------------------------------#', true);
            db.each('SELECT * FROM trips ORDER BY start_date DESC', function(error, row) {
                if (row)
                {
                    var distance = Math.floor(row.distance / 10) / 100;

                    buffer(
                        '# ' + ellipsis(lpad(row.trip_id , 10, ' '), 10) + ' | ' +
                        ellipsis(lpad(formatDate(row.start_date), 20, ' '), 20) + ' | ' + ellipsis(lpad(row.activity_type, 20, ' '), 20) + ' | ' +
                        ellipsis(lpad(distance, 10, ' '), 10) + ' km | ' +
                        ellipsis(lpad(row.notes, 50, ' '), 50) + ' #', true
                    );
                }

            
            }, function () {
                buffer('#------------#----------------------#----------------------#---------------#----------------------------------------------------#', true);
                success();
            });

        });
    }
    catch (e)
    {
        failure(e);
    }
}



/**
 * Main action:
 * Export data from a trip
 *
 * @param int tripId
 * @param function success
 * @param function failure
 */
function exportTrip(tripId, success, failure)
{
    var db;

    try {
        db = new sqlite.Database(inputFile);
        db.serialize(function() {

            // db.each('SELECT * FROM trips ORDER BY start_date DESC', function(error, row) {
            db.each('SELECT * FROM trips WHERE trip_id = ' + tripId + ' LIMIT 0, 1', function(error, trip) {

                if (trip)
                {

                    var meta = '',
                        index;

                    for (index in trip)
                    {
                        if (trip.hasOwnProperty(index))
                        {
                            meta += '<' + index + '>' + trip[index] + '</' + index + '>';
                        }
                    }

                    // buffer metadata
                    buffer('<?xml version="1.0" encoding="UTF-8"?>' +
                        '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpsies="http://www.gpsies.com/GPX/1/0" creator="GPSies http://www.gpsies.com - 2012-06-101917" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.gpsies.com/GPX/1/0 http://www.gpsies.com/gpsies.xsd">' +
                            '<metadata>' +
                                '<generator>Generator with Runkeeper.js by Klaas Cuvelier: https://github.com/klaascuvelier/runkeeper.js</generator>' +
                                '<name>Runkeeper trip ' + trip.trip_id + '</name>' +
                                meta +
                            '</metadata>' +
                            '<trk>' +
                                '<trkseg>');

                    // select rows
                     // db.each('SELECT *,n latitude, longitude, altitude, time_at_point from points where trip_id = ' + tripId + ';', function (error, row) {
                    db.each('SELECT * from points where trip_id = ' + tripId + ' ORDER BY point_id ASC', function (error, point) {
                        buffer('<trkpt lat="' + point.latitude + '" lon="' + point.longitude + '">' +
                                    '<ele>' + point.altitude + '</ele>' +
                                '<time>' + point.time_at_point + '</time>' +
                            '</trkpt>');
                    }, function () {
                        buffer('</trkseg></trk></gpx>');
                        success();
                    
                    });
                }
            }, function () {});
        });
    }
    catch (e)
    {
        failure(e);
    }
}



/**
 * Callback method for failures
 *
 * @param Exception exception
 **/
function error(exception)
{
    console.log('Could not complete the action');
    console.log(exception);

    exit();
}



/**
 * Callback method for outputting
 */
function output()
{
    if (!outputFile)
    {
        console.log(outputBuffer);
        exit();
    }
    else
    {
        writeBuffer(outputBuffer);
    }
}



/**
 * Buffer some output
 *
 * @param String data
 * @param Boolean newLine
 */
function buffer(data, newLine)
{
    outputBuffer += data + (newLine ? "\n" : '');
}



/**
 * Exit the process
 */
function exit()
{
    process.exit();
}



/**
 * Left pad string
 *
 * @param String input
 * @param int length
 * @param String fill
 */
function lpad(input, length, fill)
{
    input = '' + input;

    while (input.length < length)
    {
        input = fill + input;
    }

    return input;
}



/**
 * Ellips a given string
 *
 * @param String input
 * @param int length
 */
function ellipsis(input, length)
{
    if (input > length)
    {
        input = input.substr(0, length - 1) + "\u2026";
    }

    return input;
}



/**
 * Format given date to YYYY/MM/DD HH:II
 *
 * @param double date
 */
function formatDate(date)
{
    date = new Date(date * 1000);
    return '' + date.getFullYear() + '/' + lpad(date.getMonth(), 2, '0') + '/' + lpad(date.getDate(), 2, '0') + ' ' + lpad(date.getHours(), 2, '0') + ':' + lpad(date.getMinutes(), 2, '0');
}



/**
 * Write output buffer to file
 */
function writeBuffer()
{
    fs.writeFile(outputFile, outputBuffer, 'utf8', function (error) {
        if (error)
        {
            console.log('Could not write the file', error);
        }

        exit();
    });
}