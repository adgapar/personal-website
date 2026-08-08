Date: 2023-12-12
Title: how i got the data science interview with a cool scale-up without cv
Subtitle:
Image: background-images/blog-better-than-cv.png
----------------------------------------------
If you want to get a remote job, you need to stand out among global pool of candidates and CV isn't a great tool to achieve that. 

## old way of getting interview which doesn't work anymore
I have been using CV in job search since 2014, when I was still at college looking for my first internship ever.

I guess we all did and by now know all the rules and how to check all the checkboxes to write "perfect" CV/resume, right? ☑️

In case you forgot, I will briefly remind: it must be 1-page, have big brand names (Harvard, Google, etc), relevant keywords taken from the job posting, bullet points written to have impact, facts and numbers. I later learned that in some countries companies expect selfies (hmm, I wonder if it brings more discriminative bias, France?), unconventional structures making resumes more design brochure (Sweden), and putting non-work related stuff at the bottom to show your personality. 

Almost forgot: the CV must always be tailored to the specific job posting (they never are).

Once CV is polished and ready, we apply. At the end of the day, some folks consider it as a number game: assuming 1% application-to-interview conversion rate, if you apply 100 times (with the same CV, of course!), you will get 1 interview. No surprise that LinkedIn's feature "Easy Apply" is so popular. 

Once we submit the CV (LinkedIn or company website), we wait. We wait, because we believe that Applicant Tracking System (ATS) will catch all keywords, job roles, and company names and pass the resume through screening. Maybe a recruiter or hiring manager reads our CV in person, gets excited from big brand names and decides to spend more than 6 seconds to fully understand the bullet points we have so carefully crafted, and notices at the bottom of the page how cool we are. We are sure that the call must happen, because we checked all the boxes ✅.

And maybe you do indeed check all the boxes. 

Certainly I did and I used this approach to get me an interview with both Microsoft and Volvo Cars and that was great. However, I also used this approach for 100+ other companies across the globe and I haven't got any feedback but automated rejection. So something must be wrong with that approach. 

## new way to stand out

In the global market, where jobs are remote, you are competing with literally everyone. If in addition to that you are an immigrant and don't have yet the required network, it is getting more difficult to stand out and be noticed. You need to do something different and here is my approach for data science / analytics roles.

My approach conceptually can be summarized as: 
>show your work / prove your value to hiring manager

As a Data Scientist or Data Analyst, you are expected to provide value through data: either through ML or insights.

Between ML and insights, it is arguably easier and faster to do insights. Practically it means you get the dataset (Google/Kaggle/etc), do exploratory data analysis (EDA), and write the report. It is a typical day-to-day activity for any data scientist(s). Since it is easy and there are so many open datasets, instead of sending CV, I suggest to email the insight report.

What should the insight report be about? Here is where tailoring really matters. 

Every company that aspires to be or is data-driven has a core problem in mind. They try to generate the data necessary to solve or learn more about this core problem. And this core problem is quite guessable if you pay attention to their website and social media account posts.

The insight report that you need to send to hiring manager (or anyone in the company) should be about this core problem. 

## specific example

Here is how my tailored insight report was done to get an interview with Capchase in 2022.

Capchase in 2023 has several amazing financial and tech products and I am lucky to contribute to some of them directly or indirectly, but at the end of 2021 - early 2022 it was a scale-up doing revenue-based financing for SaaS (wiki). In simple terms it means you are in the business of evaluating (underwriting) SaaS startups to determine if they are going to grow and, if so, give them loan to do so, because they will certainly return it back.

These underwritings are obviously done based on private information that SaaS startups share with Capchase, but the core problem is still the same: evaluation of a SaaS company using data. I didn't have access to this confidential data and datasets on private companies are hard to find on the Internet, but public SaaS companies must share their financial metrics.

1. I pulled the list of public SaaS companies with their financial metrics
2. Filtered by size and kept those that are smaller and therefore should behave closer to startups ($10B SaaS company, e.g. Salesforce, behaves more like Volvo Cars than any SaaS startup)
3. Chose 1 specific "target" that I want to predict or find correlations with: revenue or monthly recurring revenue (MRR)
4. Collected all the data points about companies that could potentially explain revenue (headcount per department, location, VC raises, industry, etc)
5. Came up with few hypotheses and found that hiring decisions on a global level correlates somewhat with YoY MRR growth 
6. Built few scatterplots, wrote the insight report with explanations and sent ! 
7. Got an interview, the rest is a history

The report itself is saved somewhere and I will publish separately, but the summary of it is based on the following idea of maturity stage (relevant for B2B SaaS):

1. If a company doesn't have a product yet (too early), they need to build it  ➡  hire more engineers
2. If a company just found product market fit (PMF), they need to market and sell it  ➡  hire more sales and marketing (Go-To-Market or GTM)
3. If a company has been selling for a while, they need to take care of their customers so that customers renew ➡ hire more customer success

B2B SaaS companies at stage (2) and (3) should have enough non-tech employees to continue growing and I found that the ratios such as GTM-to-Engineers headcount and Customer Success-to-Engineers headcount correlate with YoY MRR growth.
