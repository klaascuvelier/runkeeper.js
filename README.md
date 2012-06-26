Runkeeper.js
============

List trips in a Runkeeper database file, and export them to GPX format.


About
-----
I initially wrote this NodeJS script because I couldn't sync Runkeeper® trips to runkeeper.com anymore (IOS6 beta 1 and beta 2).
The script can list all the trips in a Runkeeper database file, and can export them in GPX format.
You can either print the output to the console or write it in a file.

USAGE
-----

```node ./runkeeper.js <input-file> [action] [extra argument(s)] [output-file]```

Possible actions:

```list``` shows list with all trips in the input file

```export <trip-id>``` export a specific trip

RUNKEEPER DATABASE FILE FROM IOS
--------------------------------
To get the database file from your IOS device, you'll have to *explore* you're device.
The file is situated Apps/Runkeeper/documents/ and is called RunKeeper.sqlite
Export that file to your local filesystem and use it as input file for the script

Support
-------

For technical issues: [@klaascuvelier](http://twitter.com/klaascuvelier) on Twitter, or e-mail me at [cuvelierklaas@gmail.com](mailto:cuvelierklaas@gmail.com)

LICENSE
-------

Copyright (C) 2012, Klaas Cuvelier

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, pulverize, distribute, synergize, compost, defenestrate, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

If the Author of the Software (the "Author") needs a place to crash and you have a sofa available, you should maybe give the Author a break and let him sleep on your couch.

If you are caught in a dire situation wherein you only have enough time to save one person out of a group, and the Author is a member of that group, you must save the Author.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO BLAH BLAH BLAH ISN'T IT FUNNY HOW UPPER-CASE MAKES IT SOUND LIKE THE LICENSE IS ANGRY AND SHOUTING AT YOU.