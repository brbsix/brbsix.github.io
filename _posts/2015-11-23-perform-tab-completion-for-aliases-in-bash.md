---
layout: post
title: Perform tab-completion for aliases in Bash
date: 2015-11-23 07:03:08
comments: true
---

In a simple world, it is quite straightforward to perform tab-completion for Bash aliases. Suppose we want to create the alias `d` for `docker`.

    alias d=docker

`/etc/bash_completion.d/docker` is the completion script for Docker. It is sourced when the shell starts, loading a `_docker` function into the shell's namespace. It executes `complete -F _docker docker` and thus `docker` has tab-completion. Bestowing the alias `d` with `docker`'s tab-completion is as simple as:

    complete -F _docker d

Now upon entering `d ` <kbd>Tab</kbd>, we see a pretty list of Docker commands.

---

Of course the world is rarely so simple. Loading hundreds or thousands of completion scripts for every new interactive shell is quite slow. So starting with version 1.90, Bash supports dynamically loaded completions.

Let us suppose that we'd like to create the alias `g` for `git` and enable tab-completion. Where to start?

### Sourcery

We need to source `git`'s completion script so that it's completion function is in the shell's namespace and available to us. We can go about this a couple of different ways.

We can source it ourselves, but where is the file? Try `dpkg -L git | grep bash-completion`. We git lucky and see that it's located at */usr/share/bash-completion/completions/git*. So we can run `. /usr/share/bash-completion/completions/git`. But we may not always be so lucky, so this isn't a great option.

Another option is to have it loaded dynamically. Simply enter `git ` <kbd>Tab</kbd>. But we'd like to be able to do this programmatically.

To do so programmatically, we have `_completion_loader`, a function included in the `bash-completion` package. As you might expect, it loads the completions for a given command.

    _completion_loader git

It will return an exit status of 124, disregard it. You can read more about programmable completion and `_completion_loader` in [Bash's manual](https://www.gnu.org/software/bash/manual/html_node/Programmable-Completion.html).

### Discovery

Now that `git`'s completion script has been loaded, we need to figure out exactly what was loaded and how.

    complete -p git

This returns `complete -o bashdefault -o default -o nospace -F __git_wrap__git_main git`. Great, now we know how to bestow `g` with `git`'s tab-completion.

    complete -o bashdefault -o default -o nospace -F __git_wrap__git_main g

F.Y.I. the aforementioned command is equivalent to the following:

    complete -o bashdefault -o default -o nospace -F _git g

### Completion

This is what all of this would look like in a *.bashrc* or *.bash_aliases*.

**Note:** Ensure programmable completion is sourced before the following code. If you see an error like *_completion_loader: command not found*, you'll want to move the programmable completion portion of *.bashrc* above the alias definitions. Alternatively you can manually source it by running `source /usr/share/bash-completion/bash_completion`.

    alias g=git
    _completion_loader git
    complete -o bashdefault -o default -o nospace -F _git g

Just out of curiosity, let's see how we could do this a bit more programmatically.

{% highlight bash %}
alias_completion(){
    # keep global namespace clean
    local cmd completion

    # determine first word of alias definition
    # NOTE: This is really dirty. Is it possible to use
    #       readline's shell-expand-line or alias-expand-line?
    cmd=$(alias "$1" | sed 's/^alias .*='\''//;s/\( .\+\|'\''\)//')

    # determine completion function
    completion=$(complete -p "$1" 2>/dev/null)

    # run _completion_loader only if necessary
    [[ -n $completion ]] || {

        # load completion
        _completion_loader "$cmd"

        # detect completion
        completion=$(complete -p "$cmd" 2>/dev/null)
    }

    # ensure completion was detected
    [[ -n $completion ]] || return 1

    # configure completion
    eval "$(sed "s/$cmd\$/$1/" <<<"$completion")"
}

# set aliases
alias d=docker
alias g=git
alias v=vagrant

# aliases to load completion for
aliases=(d g v)

for a in "${aliases[@]}"; do
    alias_completion "$a"
done

# clean up after ourselves
unset a aliases
{% endhighlight %}

### Complexity

Note that all of the aforementioned code is only useful for simple aliases like `alias g=git`. Completion for subcommands requires a different approach. Luckily `git` makes this pretty easy. For example, providing completion for something like `git diff` entails the following:

    alias gd="git diff"
    _completion_loader git
    __git_complete gd _git_diff

More complex aliases involving option flags or pipes require wrapper functions and are beyond the scope of this article. For more information on setting up programmable completion for these sorts of aliases, see:

* [https://superuser.com/a/437508/376111](https://superuser.com/a/437508/376111)
* [http://stackoverflow.com/a/1793178/4117209](http://stackoverflow.com/a/1793178/4117209)
* [http://ubuntuforums.org/showthread.php?t=733397](http://ubuntuforums.org/showthread.php?t=733397)
