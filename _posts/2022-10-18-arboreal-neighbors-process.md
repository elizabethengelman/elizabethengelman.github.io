---
title: "Arboreal Neighbors Process"
date: 2022-10-19
categories:
  - Arboreal Neighbors
layout: custom-blog-post
show_date: true
---

The following blog post is a collection of brainstorming activities that lead me to my first iteration of Arboreal Neighbors as part of my Connections Lab course in the Fall of 2022.

## Initial Ideas

_Initially posted on the [class notion page](https://www.notion.so/imalowres/Mid-Term-Project-1-2495ceea7f834c76b4656170d6f7c712)._

The working title for my project is “Meet Your Arboreal Neighbors”. The goal is to allow a user in my city to explore the tree-life in their neighborhood, and hopefully gain a better appreciation for the trees neighbors, and their care. I hope to plot all of the trees in my city, Lancaster, PA, on a map, and allow a user to click on a tree to see more information about it. I was able to get a dataset from the City Open Records Office that includes each tree’s species, longitude and latitude. The city currently has a similar map project on their [website](https://lancaster-pa.maps.arcgis.com/apps/View/index.html?appid=2f1ca18840d74a9bad523d785ccdfaed), but the data is from 2010, so I’m hoping to recreate this map with this up-to-date data! Instead of using p5.js, I’ve decided to dip my toe into D3.js to produce the map.

The following is what the existing 2010 map looks like, and while I think that this structure will be my aim, I would like to iterate on the aesthetic some. For one, I’d love to have the plots on the map to be tree-shaped. Or perhaps use a different shade of green depending on the species.

<img src="/assets/blog-post-assets/arboreal-ideas-1.png" alt="example of existing tree visualization" width="50%"/>

I don’t think I can accomplish it in the time frame, but longer term, I would love to allow the user to get down closer to street level and perhaps navigate around like you can do in street view in Google Maps. Possibly looking something like this:

<img src="/assets/blog-post-assets/arboreal-ideas-2.png" alt="sketch of initial idea" width="50%"/>

## Progress: Week 1

### Brainstorming and Wireframes

<div class="iframe-container">
  <iframe src="https://miro.com/app/live-embed/uXjVPX3JXew=/?moveToViewport=-346,729,1533,757&embedId=606039954019" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>
</div>

### First Iteration

<div class="iframe-container">
  <iframe src="https://elizabethengelman.com/connections-lab/week-1/"></iframe>
</div>

## Progress: Week 2

This is very much a work in progress! I went down a D3 rabbit hole (the map at the bottom) which was really fun, but I didn’t quite get to the user event interactions yet. I’m thinking that I’ll try to use D3 to create a map of the the city I live in, and then plot the city’s trees on the map. I was able to get some data about the trees from the city’s open data team. 🌳🎉

<div class="iframe-container">  
  <iframe src="https://elizabethengelman.com/connections-lab/week-2/"></iframe>
</div>

Reference:

- [https://www.youtube.com/watch?v=hrJ64jpYb0A](https://www.youtube.com/watch?v=hrJ64jpYb0A)
- [https://flaviocopes.com/fix-cannot-use-import-outside-module/](https://flaviocopes.com/fix-cannot-use-import-outside-module/)
- [https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules/](https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules/)
