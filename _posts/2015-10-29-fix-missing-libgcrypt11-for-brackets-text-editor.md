---
layout: post
title: Fix missing libgcrypt11 for Brackets text editor
date: 2015-10-29 02:05:33
comments: true
categories:
- Programming
- Software
- Tools
tags:
- Debian
- Ubuntu
- web development
- open source
---

*Note: This problem appears to be fairly widespread of late. There is an [issue][1] on the Brackets GitHub repository as well as an [article][2] on WebUpd8 discussing the topic.*

Adobe's [Brackets](http://brackets.io/) text editor has a problem on recent distribution releases like Debian Jessie and Ubuntu Vivid. It has a dependence on libgcrypt11 which has been superseded by libgcrypt20 and is no longer supplied by distro repositories. Having libgcrypt20 is not sufficient, so we must manually install an old libgcrypt11 *.deb* or bundle the libgcrypt11 shared library with the Brackets package. Unless you have other packages that depend on libgcrypt11, I think bundling is the superior option.

It would be nice if the Brackets development team took care of this (as the developers of Atom have done), but alas they do not. Luckily this is pretty easy to do ourselves.

You'll need to have a few things on hand: Brackets *.deb* package, *libgcrypt.so.11*, and [debtool](https://github.com/brbsix/debtool)

`debtool` is a handy script I've created to help manipulate Debian packages. You can use `dpkg` primitives instead, but `debtool` makes things much simpler.

I've included links to *libgcrypt.so.11* for [amd64](https://www.dropbox.com/s/qkcnf8724ko9vos/libgcrypt.so.11?dl=1) and [i386](https://www.dropbox.com/s/43ij4lovqmhcddb/libgcrypt.so.11?dl=1). Alternatively you can download a libgcrypt11 package from [Debian](https://packages.debian.org/search?keywords=libgcrypt11) or [Ubuntu](https://launchpad.net/ubuntu/+source/libgcrypt11) repositories and extract the library yourself.

Once you're ready, here are the steps:

1. Unpack Brackets

        debtool -u ./Brackets.1.6.Extract.64-bit.deb

2. Remove the package's dependence on libgcrypt11

        sed -i 's/ libgcrypt11 (>= [0-9.]\+),//' ./brackets_1.6.0-16680_amd64/DEBIAN/control

3. Copy the library into the unpacked package directory

        cp ~/Downloads/libgcrypt.so.11 ./brackets_1.6.0-16680_amd64/opt/brackets/

4. Rebuild the package

        debtool -b ./brackets_1.6.0-16680_amd64/

5. Install *brackets_1.6.0-16680_amd64.deb* (the newly created package)

In case it's not clear what is being done, I'm simply removing the dependence on libgcrypt11 and including the library in the package. You should also note that the [Atom](https://atom.io/) text editor bundles *libgcrypt.so.11* in the same way.

Brackets' dependency on libgcrypt11 is due to [brackets-shell](https://github.com/adobe/brackets-shell)'s use of the [Chromium Embedded Framework (CEF)](https://bitbucket.org/chromiumembedded/cef), a framework for embedding Chromium-based browsers in other applications. The Linux release of Brackets currently uses CEF 1547, a somewhat ancient branch. The Brackets dev team has been [in the process of migrating to CEF 2171][3] (which depends on libgcrypt20) for quite some time, but there appear to be a number of issues holding things behind.

Once the new CEF has been integrated successfully, developers may want to entertain the thought of dependence on the distribution's libgcrypt20 package. Until then, I propose bundling *libgcrypt.so.11* with the package.

---

## Downloads

For people who would like to skip the above steps, I've repackaged the official releases and made them available below:

**Release 1.6 + Extract bundle**

* [Brackets.1.6.Extract.64-bit.deb](https://www.dropbox.com/s/2k5ym33v9qchin1/Brackets.1.6.Extract.64-bit.deb?dl=1)
* [Brackets.1.6.Extract.32-bit.deb](https://www.dropbox.com/s/4gwp4elj6f99m5j/Brackets.1.6.Extract.32-bit.deb?dl=1)

**Release 1.6**

* [Brackets.Release.1.6.64-bit.deb](https://www.dropbox.com/s/6gllagx95tm1xmp/Brackets.Release.1.6.64-bit.deb?dl=1)
* [Brackets.Release.1.6.32-bit.deb](https://www.dropbox.com/s/ortzy9aqkw02tb4/Brackets.Release.1.6.32-bit.deb?dl=1)


**Release 1.5 + Extract bundle**

* [Brackets.1.5.Extract.64-bit.deb](https://www.dropbox.com/s/qsy5r2tan3qid3v/Brackets.1.5.Extract.64-bit.deb?dl=1)
* [Brackets.1.5.Extract.32-bit.deb](https://www.dropbox.com/s/6vp5qn0hhm5y2pq/Brackets.1.5.Extract.32-bit.deb?dl=1)

**Release 1.5**

* [Brackets.Release.1.5.64-bit.deb](https://www.dropbox.com/s/qj3dty2i8vx3lha/Brackets.Release.1.5.64-bit.deb?dl=1)
* [Brackets.Release.1.5.32-bit.deb](https://www.dropbox.com/s/sxwu2dv8dq2u6v4/Brackets.Release.1.5.32-bit.deb?dl=1)

[1]: https://github.com/adobe/brackets/issues/10255 "[Linux] Brackets depends on obsolete libgcrypt11 package which is no longer included by default #10255"

[2]: http://www.webupd8.org/2015/04/fix-missing-libgcrypt11-causing-spotify.html "FIX MISSING LIBGCRYPT11 CAUSING SPOTIFY, BRACKETS AND OTHER APPS NOT TO WORK / INSTALL IN UBUNTU 15.04"

[3]: https://github.com/adobe/brackets/issues/11047 "[CEF 2171][Linux only] Upgrade Linux app-shell's to use CEF 2171 #11047"
