---
layout: splash
permalink: /blog-posts
---

<div class="posts">
  {% for post in site.posts %}
    <article class="post">    
      <h1>
        <a href="{{post.url | relative_url}}">
          {{post.title}}
        </a>
      </h1>
      <div>{{post.date}}</div>
    </article>

{% endfor %}

</div>
