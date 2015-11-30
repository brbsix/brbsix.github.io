---
layout: post
title: Accessing tab-completion programmatically in Bash
date: 2015-11-29 07:04:27
comments: true
---

In working on writing unit tests for some of my utilities, I encountered a somewhat unique issue. How do you test bash-completion scripts?

Lacking an obvious answer (and wishing to avoid wading into [Expect](http://www.nist.gov/el/msid/expect.cfm) scripting), I figure my best approach would be to find a way to access the output of tab-completion programmatically.

I quickly found an [answer](https://stackoverflow.com/a/3640096/4117209) on StackOverflow that set me on the right path. Using it as a starting point, I'll outline a straightforward way to get the tab-completions for a particular command line. In this case I want to determine the tab-completions for `git a`.

First, determine the completion function used by `git`. To do so, run `complete -p git`. If you run this from a fresh terminal, you'll likely observe the following output:

> bash: complete: git: no completion specification

This is because Bash (version 2.04 and above) loads completion scripts for most commands *dynamically*. That is, git's completion script isn't sourced until it is needed, when you enter `git ` <kbd>Tab</kbd>. Luckily we can source it programmatically with the helper function `_completion_loader` found in */usr/share/bash-completion/bash_completion*. So to load git's completion script we run `_completion_loader git`. Be sure you only run `_completion_loader` for completion scripts that are sourced dynamically (it will screw things up otherwise). Once everything is loaded, run `complete -p` again. Note that this time the output is:

> complete -o bashdefault -o default -o nospace -F __git_wrap__git_main git

The part to pay attention to is `__git_wrap__git_main`, this is git's completion function. Just in case you're curious, `__git_wrap__git_main` is actually equivalent to `_git`, so I'll use it as shorthand.

In case you're not familiar with Bash completion scripts, they rely on a few environmental variables to operate. The important ones are as follows:

<dl>
  <dt>COMP_WORDS</dt>
  <dd>
    An array variable consisting of the individual words in the current command line.
  </dd>

  <dt>COMP_CWORD</dt>
  <dd>
    An index into <strong>${COMP_WORDS}</strong> of the word containing the current cursor position.
  </dd>

  <dt>COMP_LINE</dt>
  <dd>
    The current command line.
    <br>
    <small><emp>Note: While rarely accessed directly, this is used by common helper scripts (albeit indirectly).</emp></small>
  </dd>

  <dt>COMP_POINT</dt>
  <dd>
    The index of the current cursor position relative to the  beginning of the current command. If the current cursor position is at the end of the current command, the value of this variable is equal to <strong>${#COMP_LINE}</strong>.
    <br>
    <small><emp>Note: While rarely accessed directly, this is used by common helper scripts (albeit indirectly).</emp></small>
  </dd>

  <dt>COMPREPLY</dt>
  <dd>
    An array variable from which Bash reads the possible completions generated by a shell function invoked by the programmable completion facility.
  </dd>
</dl>

Bash completion scripts generally only use **COMP_WORDS** and **COMP_CWORD** to determine the current and previous words on the command lines. However there are helper functions that use some of the more obscure variables like **COMP_LINE** and **COMP_POINT**. All in all, these are used to generate a list of completions which are stored in the array **COMPREPLY** and then printed to the terminal. So if we want the output of tab-completion, we need to access **COMPREPLY** after the completion script has populated it.

Here's a very simple implementation:

{% highlight bash %}

# load bash-completion helper functions
source /usr/share/bash-completion/bash_completion

# load git's completion script (which is normally loaded dynamically)
_completion_loader git

# array of words in command line
COMP_WORDS=(git a)

# index of the word containing cursor position
COMP_CWORD=1

# command line
COMP_LINE='git a'

# index of cursor position
COMP_POINT=${#COMP_LINE}

# execute completion function
_git

# print completions to stdout
printf '%s\n' "${COMPREPLY[@]}"

{% endhighlight %}

That works alright, but what if things are more complicated? What if we want to perform programmatic tab-completion for other commands? For commands that do not load completions dynamically? For more complex command lines? What if we want to more accurately reflect real-world tab-completions?

Here is such a function:

{% highlight bash %}

get_completions(){
    local completion COMP_CWORD COMP_LINE COMP_POINT COMP_WORDS COMPREPLY=()

    # load bash-completion if necessary
    type _completion_loader &>/dev/null || {
        source /usr/share/bash-completion/bash_completion
    }

    COMP_LINE=$*
    COMP_POINT=${#COMP_LINE}

    eval set -- "$@"

    COMP_WORDS=("$@")

    # add '' to COMP_WORDS if the last character of the command line is a space
    [[ ${COMP_LINE[@]: -1} = ' ' ]] && COMP_WORDS+=('')

    # index of the last word
    COMP_CWORD=$(( ${#COMP_WORDS[@]} - 1 ))

    # determine completion function
    completion=$(complete -p "$1" 2>/dev/null | awk '{print $(NF-1)}')

    # run _completion_loader only if necessary
    [[ -n $completion ]] || {

        # load completion
        _completion_loader "$1"

        # detect completion
        completion=$(complete -p "$1" 2>/dev/null | awk '{print $(NF-1)}')

    }

    # ensure completion was detected
    [[ -n $completion ]] || return 1

    # execute completion function
    "$completion"

    # print completions to stdout
    printf '%s\n' "${COMPREPLY[@]}" | sort
}

{% endhighlight %}

Fox example `get_completions 'apt-get '` outputs the following:

> autoclean
> autoremove
> build-dep
> changelog
> check
> clean
> dist-upgrade
> download
> dselect-upgrade
> install
> purge
> remove
> source
> update
> upgrade

`get_completions 'docker p'` outputs the following:

> pause
> port
> ps
> pull
> push

`get_completions 'vagrant box '` outputs the following:

> add
> help
> list
> outdated
> remove
> repackage
> update