---
layout: post
title: Dotfile Best Practices
date: 2015-11-12 00:00:00
comments: true
---

In this article I'll be talking all about dotfiles. I'll demonstrate how to set up your initial configuration and outline some best practices to follow when writing dotfiles.

# Setup

1. Create a VCS repository in your home directory. `git` is a good choice.

    git init .dotfiles

2. Create directories to categorize your dotfiles

    mkdir ~/.dotfiles/bash
    mkdir ~/.dotfiles/git
    mkdir ~/.dotfiles/system

3. Move preexisting dotfiles into their appropriate folders

    [img]

4. Link files

5. Commit your changes and consider synchronizing your repository with a service like Bitbucket, GitHub, or GitLab. Bitbucket offers free private repositories if privacy is a concern.

# Best Practices



stow for modular use of dotfiles?

manpath

adding to PATH

PATH=${PATH:+$PATH:}$rpath
PATH=$GSRC/bin${PATH:+:$PATH}

when you need to use export

sh (dash) versus bash (e.g. profile uses dash)