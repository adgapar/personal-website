Date: 2024-01-12
Title: everyone should have a personal website
Subtitle:
Image: background-images/personal-website.png
----------------------------------------------

When everything is googleable, every modern professional already has an online presence. Here some random links that appear when I google my name:
<img src="content-images/personal-website/google-search-1.png" />

From the privacy and security perspective it is not great and I don't like it. However, if you can't make it go away, at least you should try to control the story so that the top 3 links look more like this:
<img src="content-images/personal-website/google-search-2.png" />

The first link is my LinkedIn, the second is my Instagram account, and third is my personal website.

Most professionals have LinkedIn. Many have Instagram account (often private like mine). With this blog post my goal is to show 
* why having personal website makes sense
* what content should it have
* where to host

## why: visibility and branding

It is often surprise for many people when they learn that my first ever full-time job was in sales. Two weeks after my graduation with Bachelors degree in Robotics, I joined Microsoft graduate program. It was May 2016 and the role was in their sales engineering organization.

Working in sales changed my perspectives about many things and taught me even more. For example, the personal branding and visibility is important for career growth. 

Back then I thought it was only relevant for "business" professionals. But I started to notice that more and more engineers were progressing faster in their careers by creating more content. Most of the times this content was in the form of posts in some 3rd party newsletter (dev.to, freeCodeCamp, Medium) or social media (LinkedIn, Twitter). Some of them, however, were posting on their personal websites.

## what: content and design

In 2020 I finally bought myself a domain with my full name (adiletgaparov.com) on Google Domains and it costs me $12 per year.

At the same time I was checking other people websites and concluded that a personal website can have the following:
* Links to social media accounts
* Bio/Resume: often just a copy of LinkedIn shown in a different way, but might contain other personal educational and work experiences
* Portfolio: write-ups about projects, links to deployed products, a link to GitHub repository, etc
* Blog
* Call-to-Action (CTA): a button to write or subscribe if it is a blog

Despite the structure and content being typical, the main differentiation was the way to show this content. I have seen crazy animations (most designers have great UX), minimalistic modern pages (many engineers prefer minimalism) and sites built in 1990s (Paul Graham page).

When I was doing all this research, I was building a lot of analytical/BI dashboards and it occurred to me that a personal website is essentially dashboard that shows insights about you.

I got obsessed with this idea and sketched the design of a website that will be perfect for a data professional - personal analytical dashboard.

## design: personal analytical dashboard

The BI dashboards have tabs (navigation) and tab content. The tabs can be located in the bottom (sheets in Excel/GSheet), but usually you can find them on the left side of the screen.

### home

Starting page showing photo, name, summary, links to social media accounts.
<img src="content-images/personal-website/wireframe-1.png" />

## projects

A place for portfolio. 
You can organize projects linearly. Each project should contain charts and be clickable to drill down for more details.
<img src="content-images/personal-website/wireframe-2.png" />

An alternative is to layout projects in thumbnail view.
<img src="content-images/personal-website/wireframe-4.png" />

### resume

I find the way past academic and work experience is shown on LinkedIn and CVs quite boring.

Since there is always a duration time component to an experience (from .. until ...), a Gantt chart may be a better fit for showing this type of info.

It would be much clearer what experiences intercept, what and how long are the gaps and how much experience a person has. Colors can indicate types of experiences (education, internship, full-time, volunteering). Experiences can be clickable if you are interested in learning more (CV bullet points).
<img src="content-images/personal-website/wireframe-5.png" />

Same goes for skills section.

Languages fluency, for example, is often described in ordinal categories. LinkedIn uses categories such as "Professional working proficiency" and "Full professional working proficiency", but what is the difference between them?

Maybe it would make more sense to try to quantify the proficiency and list them as a bar chart ordered from native to learned? 

What about online courses that you take? A simple table containing all these courses might just work.
<img src="content-images/personal-website/wireframe-6.png" />

### chatbot

For my application to study at IE Master in Business Analytics and Big Data I created a simple chatbot in Google Dialogflow. It could answer typical questions that recruiters and hiring managers ask during first interview:
* why did you decide to join company A? 
* what you liked most about doing B? 
* what are your strengths and weakness?
* 
Back in 2018 when I created this chatbot, LLMs were not developed yet. Tools like Dialogflow allowed folks to create decent chatbot by providing questions and answers in the platform and the platform would then manage variations in the questions. I just searched top 50 questions and saved my answers there.

Now in 2024 it seems like a more sophisticated chatbot could be created in much more scalable way. Truly "Ask Me Anything" chatbot. 
<img src="content-images/personal-website/wireframe-7.png" />

## where: flexibility, maintainability, and cost

### v0: streamlit + docker + heroku

Obsessed over the idea of designing my first personal website as a personal analytical dashboard, I started to build.

In 2020 I only knew Python and I used Streamlit a lot to create custom dashboards. 

As a result, my first website was implemented using this Python framework. I built an app and deployed it as a Docker container on Heroku. The deployment was done directly from GitHub, so that new merged changes would trigger new deployment.

The website looked very similar to sketched wireframes but still Streamlit didn't allow me much customization. I had to write a lot of markdown.
<img src="content-images/personal-website/streamlit-dash.png" />

### v1: react + gh pages

In 2021 I thought it would be nice to learn some front-end. 

The most straightforward way to learn new programming language is by using it in a project. I picked React.js and started to redo my website using this framework. Now I had full control over the website, but as a beginner in front-end, I struggled a lot.

The React single-page app (SPA) was hosted as a static website on GitHub Pages.

### v2: search for managed service 

Making changes in React became quite a hassle that I just stopped maintaining it.

I dropped the idea of a "dashboard" design and started the search for managed service where making changes would be much easier. 

The first idea was to continue using GitHub Pages, but instead of own React app, just use a Jekyll template. You still need to make changes by modifying codebase and pushing it to master branch, but arguably changes in Jekyll are much faster than in React. 

Then I accidentally came across a website named Polywork. Its vision in 2021-2022 was to create a social media network where a polyworking would be encouraged. Polyworking is what many modern professionals do: you can write code, teach, have a YouTube channel or podcast, publish a digital book or newsletter, and provide consulting services. 

In Polywork.com, you basically create a page similar to LinkedIn one, but with some nice features making your profile more flexible and interesting than just boring-professional. You could post personal updates, write a blog post, search for opportunities, announce open positions and overall organize your profile in more flexible way.

This vision didn't take off and they pivoted into just building better personal websites. There is one free template (I use it) and many cooler premium templates requiring subscription.

## where to host?

To sum up, the most convenient and basic way to create a personal website is to use managed services. Apart from the cost of buying custom domain and a price of low customization / flexibility, the best two free options at this moment are: 
- Polywork: 1 free modern template, no code solution
- GitHub Pages: many free Jekyll templates, requires some setup and coding

In case you want to have a personal website with more focus on blogging, then in addition to above two you can check:
- Substack: platform for creating newsletters
- Ghost: alternative to Substack (this blog post is hosted by Ghost).
