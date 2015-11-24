---
layout: post
title: "Bash scripting: Do's and Don'ts"
date: 2015-11-23 01:08:37
comments: true
---

What follows is a style guide of sorts. The "don'ts" won't always cause trouble, but they often have the ability to. It will make your Bash scripts look better and perform more consistently.

Note: If you're worried about supporting POSIX, ancient versions of Bash, or other shells, you can promptly ignore everything on this page.

---

**Don't:**

    for i in $(command); do
        ...
    done

**Do:**

    while IFS= read -r i; do
        ...
    done < <(command)

**Why:**

This won't break on spaces, just newlines.

---

**Don't:**

    command | while IFS= read -r i; do
        ...
    done

**Do:**

    while IFS= read -r i; do
        ...
    done < <(command)

**Why:**

The pipe causes the `while` loop to execute in a subshell. Any variable assignments within a subshell will be lost. While this can occasionally be desirable, it usually isn't.

---

**Don't:**

    while IFS= read -r path; do
        ...
    done < <(find)

**Do:**

    while IFS= read -rd $'\0' path; do
        ...
    done < <(find -print0)

**Why:**

Using a null byte as a delimiter is generally preferred wherever possible. Also note that a `while` loop isn't necessary to iterate over the output of `find`. For simple operations, you can simply use `find -exec command {} \;` (the command is run once for each matched file) or `find -exec command {} +` (the command line is built  by  appending each  selected file name at the end). Alternatively, you can pipe the output to `xargs -0`.

---

**Don't:**

    items='one two three'

    for i in $items; do
        ...
    done

**Do:**

    items=(one two three)

    for i in "${items[@]}"; do
        ...
    done

**Why:**

Bash has arrays, use them!

---

**Don't:**

    array=($(command))

**Do:**

    readarray -t array < <(command)

**Why:**

This won't break on spaces, just newlines.

---

**Don't:**

    newvar="$oldvar"

**Do:**

    newvar=$oldvar

**Why:**

There's no need to quote direct variable assignments. The same is true with `newvar=${oldvar// /}`. Note, feel free to ignore this advice if you feel like it. The double quotes, while unnecessary, don't pose a problem.

---

**Don't:**

    content=$(cat FILE)

**Do:**

    content=$(< FILE)

**Why:**

Useless use of `cat`.

`cat`'s description is as follows:

> Concatenate FILE(s), or standard input, to standard output.

If you're using `cat` for something else then you're (most likely) using it wrong.

---

**Don't:**

    echo "$something" | command

**Do:**

    command <<<"$something"

**Why:**

Useless use of `echo`. We can use HERE string and avoid calling an unnecessary command.
