---
layout: post
title: Using Winpdb to debug Python 3 applications
date: 2015-11-19 15:45:49
comments: true
---

[Winpdb](http://winpdb.org/about) is a Python debugger with a graphical user interface. As it's homepage states, it is compatible with CPython 2.x and Python 3.x.

# Installing

It can be easily installed via `sudo apt-get install winpdb` for a system installation or `pip2.7 install --user winpdb` for a user installation. Note that it is not possible to install winpdb via `pip3.4`. I'll go into that a little bit later.

# Debugging Python 2 applications

Debugging applications written in Python 2.x is very straightforward. First, start the debugged script with the debugger. The debugged script is the server process (also called debuggee).  Enter a temporary password when prompted.

    rpdb2 --debuggee SCRIPT

Then launch the GUI (client process) and attach to the debugged script. You will be prompted for the password you used earlier.

    winpdb --attach SCRIPT

# Porting to Python 3

When I initially read that Winpdb was compatible with Python 3.x, I assumed that I'd be able to install and run the application with Python 3. I was wrong. It is only possible to run under Python 2.

I like to work in Python 3 whenever possible, so I looked into porting it. I quickly discovered that Winpdb's GUI depends on wxPython 2.6+. On Debian/Ubuntu, the package it uses is *python-wxgtk3.0*.

`rpdb2.py` (the command line debugger included with Winpdb) does not depend on wxPython and will run under Python 3. The situation with `winpdb.py` (the GUI) is not so simple. wxPython does not run on Python 3, but there is an experimental project dubbed [Project Phoenix](http://wiki.wxpython.org/ProjectPhoenix) that purports to do so. Builds are only provided for Windows, and the build process on Linux is lengthy, far beyond what is reasonable to expect of end-users. Alas I continued on my quest to port `winpdb.py` but discovered the Phoenix Project made some significant departures from wxPython, enough that a simple port was not feasible. Perhaps it can be reattempted when the Phoenix Project is stable.

# Debugging Python 3 applications

Luckily we can still debug Python 3 applications with Winpdb's GUI. Oddly, I wasn't able to find documentation on this. Perhaps it is so obvious that it was overlooked? Anyways, the process is as follows.

Start the debugged script with the debugger. Note that instead of executing the `rpdb2` command on your *PATH*, you'll need to execute the `rpdb2.py` library directly with the Python 3 interpreter. If you've installed Winpdb locally, the location of `rpdb2.py` will differ. In fact you can copy `rpdb2.py` and execute it from anywhere. Enter a temporary password when prompted.

    python3 /usr/lib/python2.7/dist-packages/rpdb2.py --debuggee SCRIPT

Then launch the GUI and attach to the debugged script. You will be prompted for the password you used earlier.

    winpdb --attach SCRIPT

# Remote debugging

It's also possible to debug applications remotely. The process is very similar to what I've already covered.

First, copy `rpdb2.py` onto the remote machine. Then (on the remote machine) start the debugged script with the debugger.

    rpdb2.py --debuggee --remote SCRIPT

From your local machine, launch the GUI and attach to the debugged script. You should be able to use the full path or basename of the script as it exists on the remote machine.

    winpdb --attach --host=HOST SCRIPT

Note there is also an `--encrypt` option to force *encrypted socket communication*. It requires the *python-crypto* package. I wasn't able to get this to work but your experience may vary. I didn't look into any further.
