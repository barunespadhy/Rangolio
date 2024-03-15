# Rangolio
Rangolio is a no-frills, simple solution built with (R)eact and Dj(ango) to create portf(olio) websites. This platform currently features an initial landing page that can be segmented into various sections, catering to diverse content needs. Additionally, Rangolio extends its functionality to include blog posting, making it a versatile tool for showcasing your work and thoughts.

Rangolio operates in two ways, one is local backend mode, and the other is live backend mode. 

## Local backend mode
Local backend mode is for those usecases when you don't have a dedicated server, and host your webpages on a static hosting service, like [github pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages). This mode does not require you to have a live server, and fetches information from a flat json file, which will be stored in the public folder.

Website content can be modified using another interface (to be created soon), which modifies those flat json files, from which the frontend fetches the information. Understandably, the backend will be running locally, and the JSON files modified by the local backend will have to be comitted to the hosting service.

## Live backend mode
In live backend mode, the entire backend and frontend can be deployed to your own server, and content can be modified anytime, anywhere as long as you have access to your server.
