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

<!-- --- -->

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

<!-- --- -->

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

Also note that a `while` loop isn't always necessary in order to iterate over the output of `find`. For simple operations, you can simply use `find -exec command {} \;` (command is run once for each matched file) or `find -exec command {} +` (the command line is built  by  appending each  selected file name at the end). Alternatively, you can pipe the output to `xargs -0`.

</div>

<!-- --- -->

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

Bash has arrays, use them!

</div>

<!-- --- -->

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} array=($(command)) {% endhighlight %}

**Do:**

{% highlight bash %} readarray -t array < <(command) {% endhighlight %}

**Why:**

`readarray` will not break on spaces, only newlines.

</div>

<!-- --- -->

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} newvar="$oldvar" {% endhighlight %}

**Do:**

{% highlight bash %} newvar=$oldvar {% endhighlight %}

**Why:**

There's no need to quote direct variable assignments. The same is true with `newvar=${oldvar// /}`.

Feel free to ignore this advice. The double quotes, while unnecessary, don't pose a problem.

</div>

<!-- --- -->

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} content=$(cat FILE) {% endhighlight %}

**Do:**

{% highlight bash %} content=$(< FILE) {% endhighlight %}

**Why:**

Useless use of `cat`.

`cat`'s description is as follows: *Concatenate FILE(s), or standard input, to standard output.* If you're using `cat` for something else then you probably shouldn't be using it at all.

</div>

<!-- --- -->

<div class="project" markdown="1">

**Don't:**

{% highlight bash %} echo "$something" | command {% endhighlight %}

**Do:**

{% highlight bash %} command <<<"$something" {% endhighlight %}

**Why:**

Useless use of `echo`. We can use a *HERE string* and avoid calling an unnecessary command.

</div>

<!-- --- -->

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
