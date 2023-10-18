---
layout: splash
permalink: /blog-posts
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

<div class="posts">
  {% for post in site.posts %}
    <article class="post">    
      <h1>
        <a href="{{post.url | relative_url}}">
          {{post.title}}
        </a>
      </h1>
      <!-- <div class="post-categories">{{post.categories | join: ", "}}</div> -->
      <div class="post-date">{{post.date | date: "%B %e, %Y" }}</div>
    </article>

{% endfor %}

</div>
