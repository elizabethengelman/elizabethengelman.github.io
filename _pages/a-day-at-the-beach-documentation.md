---
layout: splash
permalink: /blog-posts/a-day-at-the-beach
title: A Day at the Beach Documentation
---

<link
  rel="stylesheet"
  type="text/css"
  href="/assets/css/blog-posts.css"
/>
<link
  rel="stylesheet"
  type="text/css"
  href="/assets/css/blog-style.css"
/>

<h1 id="page-title">{{page.title}}</h1>

{% assign category = 'A Day at the Beach'%}

<section id="{{ category | slugify | downcase }}" class="taxonomy__section">
<div>
{% for post in site.posts %}
{% if post.categories contains 'A Day at the Beach' %}
{% include single-blog-post-on-index.html type=list %}
{% endif %}
{% endfor %}
</div>
<a href="#page-title" class="back-to-top">{{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }} &uarr;</a>
</section>
