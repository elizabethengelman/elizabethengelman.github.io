---
title: "A Day at the Beach Technical Considerations"
date: 2022-12-11
categories:
  - A Day at the Beach
layout: custom-blog-post
original_post_link: https://www.notion.so/Final-Project-Documentation-186196c7f88844478a76945275784f92
show_date: true
excerpt: This project came from my Critical Experiences final, and my initial idea was to explore sunscreen with the expectation that I could answer some questions I had about how sunscreen works, and generally that I would continue to be very pro-sunscreen. I even hoped that I could create a compelling argument to convince the people in my life who don’t wear sunscreen to reconsider.
---

I continued to refine the technical interaction of this project as part of my Connections Lab final project.

**Project:** [https://a-day-at-the-beach-kpqv.onrender.com/](https://a-day-at-the-beach-kpqv.onrender.com/)

**Github Repo:** [https://github.com/elizabethengelman/a-day-at-the-beach](https://github.com/elizabethengelman/a-day-at-the-beach)

**Presentation slide dec:** [https://docs.google.com/presentation/d/1g5CJUgKx24gUuOplheeChtIGNo9kTbag8haEc0nEIiM/edit#slide=id.g1ac9d23add7_0_77](https://docs.google.com/presentation/d/1g5CJUgKx24gUuOplheeChtIGNo9kTbag8haEc0nEIiM/edit?usp=sharing)

**Research from Critical Experiences Blog:** [Sunscreen Project Development](https://www.notion.so/Sunscreen-Project-Development-76a128eb2c8b451190593ba8a55a5cec?pvs=21)

## Concept & Motivation

This project came from my Critical Experiences final, and my initial idea was to explore sunscreen with the expectation that I could answer some questions I had about how sunscreen works, and generally that I would continue to be very pro-sunscreen. I even hoped that I could create a compelling argument to convince the people in my life who don’t wear sunscreen to reconsider.

I began imagining what sunscreen may look like in the future and considered a world where people wear colorful sunscreen not only to protect their skin but as a fashion statement. As I was imagining this future, I decided to do some research into the past to understand where sunscreen came from.

I was surprised to find out that sunscreen isn’t such a cut-and-dry topic and that the systems that sunscreen affects are far more varied than I had realized. This is when I realized how steeped in colonialism sunscreen is, and how much my own experiences have shaped my viewpoint about sunscreen.

My idea to create sunscreens that were fun colors that people could wear as a fashion statement felt new and innovative to me until I learned that there are cultures in Southeast Asia that have been doing this for centuries - using yellow or white pastes for cosmetics and sun protection purposes.

I learned that colonialism is really at the heart of a lot of what I know about sunscreen:

- Historically: Wikipedia says that an Australian chemist, H.A. Milton Blake, invented sunscreen in 1932, yet contradictorily the article then later goes on to describe how [sun protection has been used by civilizations for thousands of year](https://en.wikipedia.org/wiki/Sunscreen#History)s.
- Clinical research: People of color are missing from a lot of sunscreen efficacy research. In addition, there are also scientists who are questioning how dangerous UV rays are to people who have more melanin in their skin. Since there is little to no research on this topic, it’s hard to understand how dermatologists can recommend people of color put potentially harmful chemicals on their skin so readily without more information.
- Product development: Sunscreens on the market specifically developed for people of color are relatively new.
- Product usage: I found several accounts of people whose primary use of sunscreen is to keep their skin from getting darker, rather than being specifically worried about skin damage. The main motivation for sunscreen use was to keep skin lighter, presumably a product of white-focused beauty standards.

My hope was to create a project to allow my audience an opportunity to “experience life in someone else’s skin”, while also hoping to expose and educate about how colonialism affects sunscreen research, how we talk about the history of it, and how products are marketed and developed.

## Technical Considerations

- **Deploy to Render instead of Glitch:** At some point, I decided to deploy my project using Render instead of Glitch. One of the big reasons was that because I also used this project concept for my Critical Experiences final, I wanted a way to deploy different commits so that I could see the progress I made between the two projects. I wasn’t able to find an easy way to do that, so I went with Render instead, which I’ve used before.
- **Using Tailwind for css styling:** I’ve been using Tailwind for adding styles to my current project at work, and have enjoyed using it, so I decided to use Tailwind for this project as well to continue to get comfortable with it.
- **Express App instead of React:** I originally thought that I would create a React app so that I could more easily create a single-page app. I had gotten my p5js sketch to work using the web editor: [first attempt](https://editor.p5js.org/elizabethengelman/sketches/hs3OqxO5W), [second attempt](https://editor.p5js.org/elizabethengelman/sketches/J_eOS9voi), but then when I tried to get it to work with React, I ran into some complications and couldn’t get it to work as expected, though I can’t remember now what the issue was! However I decided to go back to using Express because I knew that I could get p5js working there. I suspect that perhaps the p5 React library I was using may have had a bug, or perhaps I wasn’t using it correctly.
- **ML5:** Once we learned about the ml5.js library in class, I got really into the idea of experimenting with it, specifically the ability to create a mask with a video. This was something we hoped to do for the yearbook project that Dora and I made and didn’t quite get that done. So getting the chance to explore that a bit more seemed fun. As I was thinking about ml5 and my sunscreen project, I kind of like the idea of talking about colonialism, and skin color by allowing a user to look at their own face in this context rather than using just an image or video that represents only one skin color. There’s also a lot of bias in machine learning, which would be really interesting to explore in the future as well, but I didn’t quite get there with this project.
- **Only allow the “sunscreen” to be put on the user in the video:**
  - I used ml5 to detect the distinction between the human in the video and the background.
  - I created an offscreen buffer using `createGraphic`, and allowed for the “sunscreen” ellipses only to be drawn on that buffer wherever the user’s mouse is.
  - Then, using bodyPix, I got the `backgroundMask` segmentation and used that as a mask for the sunscreen buffer. This way the sunscreen buffer would only be drawn where the user is in the video.
    ![](/assets/blog-post-assets/day-at-the-beach-tech-1.png)
- **Creating a virtual background:**
  - One of the big things that helped me unlock the ability to have the beach video as the background was using the `clear()` p5js method. This allowed me to embed a p5js sketch in my webpage, and then continually clear the background so that it was transparent. Making sure to update the background in `draw` was important so that I didn’t continually render the video frames on top of each other, and end up with a blur of my own image.
    ![](/assets/blog-post-assets/day-at-the-beach-tech-2.png)
    ![](/assets/blog-post-assets/day-at-the-beach-tech-3.png)

## Challenges and Next Steps

One of the main challenges I ran into was technical performance - having a video, a p5js with another video, and ml5 all running at the same time was a lot and I noticed a lot of lag. One thing that I was able to do to improve this was that I had originally been hiding video 1 when I displayed video 2, and so on. The end result was that the webcam streams weren’t being closed, and this seemed to take up a lot of computing power. Once I realized this was happening, I was able to stop the video streams after each one, which helped. However, there are still some more improvements I’d like to make. I wonder if using a tool other than p5 would help with this, or if there is another way to optimize my performance.

Another, less technical challenge I experienced was trying to figure out how to make this experience more interactive between multiple users. I thought about allowing two users to be on the website at the same time and to put sunscreen on each other. While this would be a cool experience, it didn’t seem to fit with the narrative, and I wonder if it would have taken away from the point of the project.

I also began playing with PoseNet and was trying to get it set up so that the user could put the sunscreen on their face using the location of their hands. I made a bit of [progress](https://github.com/elizabethengelman/a-day-at-the-beach/tree/posenet) getting PoseNet wired up but didn’t quite get the whole idea put together.

## Resources

- to get the video in the background: [https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_fullscreen_video](https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_fullscreen_video)
- to get the audio in the background: [https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_audio_all](https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_audio_all)
- p5 Instance Mode: [https://necromuralist.github.io/p5_explorations/posts/p5-instance-mode-revisited/](https://necromuralist.github.io/p5_explorations/posts/p5-instance-mode-revisited)
- Background Video: [https://www.pexels.com/video/beautiful-view-of-a-beach-1854202/](https://www.pexels.com/video/beautiful-view-of-a-beach-1854202)
- [https://editor.p5js.org/Jaesar/sketches/gP_yqLk4J](https://editor.p5js.org/Jaesar/sketches/gP_yqLk4J)
- [https://github.com/processing/p5.js/wiki/Global-and-instance-mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode)
- [https://editor.p5js.org/ml5/sketches/BodyPix_Webcam](https://editor.p5js.org/ml5/sketches/BodyPix_Webcam)
- [https://tailwindcss.com/docs/installation](https://tailwindcss.com/docs/installation)
- [https://css-tricks.com/snippets/css/a-guide-to-flexbox/](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
