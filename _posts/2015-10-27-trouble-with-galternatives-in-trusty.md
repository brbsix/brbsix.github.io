---
layout: post
title: Trouble with galternatives in Trusty
comments: true
---

`galternatives` fails to work? The application window opens but you're unable to make any changes? Perhaps you're seeing errors like `sh: 1: /usr/sbin/update-alternatives: not found`?

The `galternatives` package in Ubuntu 14.04 (Trusty Tahr) suffers from a fatal flaw. It calls a hardcoded path to `update-alternatives` which does not exist. This is mostly the fault of dpkg, as it failed to include a symlink to `update-alternatives` in */usr/sbin* as it had done in previous releases. Unfortunately `galternatives` did not help matters by referencing a symlink instead of a canonical path.

Luckily, this appears to have been fixed in future releases. In the meantime, there is an easy fix:

    sudo ln -s ../bin/update-alternatives /usr/sbin/

### Sources:

- [https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=720575](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=720575)

- [https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=749895](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=749895)

- [https://bugs.launchpad.net/ubuntu/+source/galternatives/+bug/1309709](https://bugs.launchpad.net/ubuntu/+source/galternatives/+bug/1309709)

- [http://ubuntuforums.org/showthread.php?t=2217505](http://ubuntuforums.org/showthread.php?t=2217505)