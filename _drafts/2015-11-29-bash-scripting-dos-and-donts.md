---
layout: post
title: "Bash scripting: Do's and Don'ts"
date: 2015-11-29 20:30:56
comments: true
---

What follows is a style guide of sorts, outlining a few "gotcha's" and anti-patterns often encountered in Bash shell scripts. Following these guidelines will make your Bash scripts look better and perform more consistently.

*Note: If you're worried about supporting POSIX, ancient versions of Bash, or other shells, you can promptly ignore everything on this page.*

---

<div class="project" markdown="1">

**Don't:**

{% highlight bash %}
for i in $(command); do
    ...
done
{% endhighlight %}

**Do:**

{% highlight bash %}
while IFS= read -r i; do
    ...
done < <(command)
{% endhighlight %}

**Why:**

The `for` loop uses a space as a delimiter whereas the `while` loop uses a newline.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %}
command | while IFS= read -r i; do
    ...
done
{% endhighlight %}

**Do:**

{% highlight bash %}
while IFS= read -r i; do
    ...
done < <(command)
{% endhighlight %}

**Why:**

The pipe causes the `while` loop to execute in a subshell. Any variable assignments within a subshell will be lost. While this can occasionally be desirable, it usually isn't.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %}
while IFS= read -r path; do
    ...
done < <(find)
{% endhighlight %}

**Do:**

{% highlight bash %}
while IFS= read -rd $'\0' path; do
    ...
done < <(find -print0)
{% endhighlight %}

**Why:**

Using a null byte as a delimiter is generally preferred wherever possible.

Also note that a `while` loop isn't necessary in order to iterate over the output of `find`. For simple operations, you can simply use `find -exec command {} \;` (command is run once for each matched file) or `find -exec command {} +` (the command line is built  by  appending each  selected file name at the end). Alternatively, you can pipe the output to `xargs -0`.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %}
items='one two three'

for i in $items; do
    ...
done
{% endhighlight %}

**Do:**

{% highlight bash %}
items=(one two three)

for i in "${items[@]}"; do
    ...
done
{% endhighlight %}

**Why:**

Bash has arrays, use them! Also, they will not break if array items contain spaces or newlines.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} lines=($(command)) {% endhighlight %}

**Do:**

{% highlight bash %} readarray -t lines < <(command) {% endhighlight %}

**Why:**

`readarray` will not break on spaces.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} newvar="$oldvar" {% endhighlight %}

**Do:**

{% highlight bash %} newvar=$oldvar {% endhighlight %}

**Why:**

There's no need to quote direct variable assignments. The same is true with `newvar=${oldvar// /}`.

Feel free to ignore this advice if you have a difficult time remembering quoting rules. The double quotes, while unnecessary, don't pose a problem here.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} content=$(cat FILE) {% endhighlight %}

**Do:**

{% highlight bash %} content=$(< FILE) {% endhighlight %}

**Why:**

Useless use of `cat`.

`cat`'s description is as follows: *Concatenate FILE(s), or standard input, to standard output.* If you're using `cat` for some other purpose then you probably shouldn't be using it.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} echo "$something" | command {% endhighlight %}

**Do:**

{% highlight bash %} command <<<"$something" {% endhighlight %}

**Why:**

Useless use of `echo`. We can use a *HERE string* and avoid calling an unnecessary command.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} echo "$@" {% endhighlight %}

**Do:**

{% highlight bash %} echo "$*" {% endhighlight %}

**Why:**

`"$*"` concatenates the positional parameters into a single word, with the first character of the IFS as separator. That is, `"$*"` is equivalent to `"$1c$2c..."`, where c is the first character of the value of the IFS variable.

`"$@"` expands each positional parameter to a separate word.

E.g. With a default IFS and positional parameters of `$1=one`, `$2=two`, `$3=three`, `"$*"` expands to `'one two three'` whereas `"$@"` expands to `'one' 'two' 'three'`.

While `echo "$@"` and `echo "$*"` happen to have the same effect, with other commands this won't always be the case. There are times when you'll need to be aware of this.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} [[ $# > 0 ]] {% endhighlight %}

**Do:**

{% highlight bash %} [[ $# -gt 0 ]] {% endhighlight %}
or
{% highlight bash %} (( $# > 0 )) {% endhighlight %}

**Why:**

The `>` operator in `[[ $# > 0 ]]` performs a string comparison, not a numerical one! E.g. `[[ string1 > string2 ]]` is true if `string1` sorts after `string2` lexicographically. Instead, use one of `-eq`, `-ne`, `-lt`, `-le`, `-gt`, or `-ge`. These arithmetic binary operators return true if `arg1` is equal to, not equal to, less than, less than or equal to, greater than, or greater than or equal to `arg2`, respectively. `arg1` and `arg2` may be positive or negative integers.

Alternatively, use `((...))` for arithmetic evaluation.

</div>

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} (( $var == 1 )) {% endhighlight %}

**Do:**

{% highlight bash %} (( var == 1 )) {% endhighlight %}

**Why:**

Don't use `$` on variables in `$((...))` or `((...))`. E.g. `(( $var == 1 ))` will break when `$var` is null or unset.

</div>

For even more egregious examples of bad code, check out shellcheck's [Gallery of Bad Code](https://github.com/koalaman/shellcheck#gallery-of-bad-code). While you're at it, consider linting your shell scripts with [shellcheck](https://github.com/koalaman/shellcheck).
