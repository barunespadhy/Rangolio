# Rangolio: The Simple Free Blog and Portfolio Website Solution. Period.
<center>
    <img src="backend/icons/png/256x256.png" style="border-radius:10px;margin-bottom:10px" width=300/>
</center>
<br/>

Rangolio is a no-frills, simple solution built to create portfolio websites. That's pretty much it.
Why Rangolio, when there's like, millions of different blog creation platforms? Well, rangolio is a decent option for you if:

- You need a platform to post blogs with as minimal setup as possible
- You don't really care much about theming, and [this website's](https://barunes.io) theme is good enough for you
- You don't have any infrastructure of you own to post blogs (having purchased a domain name is a plus!), although Rangolio can be setup on a server as well

## Rangolio does a few things differently, adding convenience.

### Minimal setup time
Other content management systems (CMS) like Wordpress or Drupal can take quite some effort to set up, plus their generalized architecture to 'fit everything' with plugins make them bloated, which makes it very easy to un-optimize an optimized tool.
Rangolio on the other hand is simple to setup on windows or linux, using it's convenient [scripts](https://github.com/barunespadhy/rangolio-scripts). There is very basic theming (limited to only some colors) and no plugins.

### Simple UI
Rangolio features an intuitive and easy to use UI for managing your content. Rangolio is not trying to be a software which can 'fit everything', and the goal is very simple and clear: Create introduction section for yourself, and post your portfolio/blogs. Nothing else.

### Lightweight
Rangolio requires no backend to run. It generates static html, js and css files from the editor which can be served by anything that is capable of serving static websites.

### Rich Text Editing
Rangolio features a Rich Text Editor to make content-rich pages with text-formatting options, links and images

### Already optimized for basic SEO
Rangolio already includes basic SEO tags, useful for indexing it with different search engines.


## Instructions

Setting up Rangolio is very easy. For a TL;DR form of installation, execute one of the scripts below based on your operating system:

### Windows OS
Go to whatever folder you wish to install Rangolio, and then run:
```
curl -o rangolio_installer.bat https://raw.githubusercontent.com/barunespadhy/rangolio-scripts/main/rangolio_installer.bat && rangolio_installer.bat
```

### Linux based OS
In a folder of your choice, open a terminal and then run:
```
curl -o- https://raw.githubusercontent.com/barunespadhy/rangolio-scripts/main/rangolio_installer.sh | bash
```
For detailed instructions on installing Rangolio can be found in the Wiki: [Installation](https://github.com/barunespadhy/rangolio/wiki/Installation)

## Setup/Deployment
If you wish to set this up on github, you need to follow some pre-requisites first, and those instructions can be found [here](https://www.barunes.io/blog/975fda0e-6f2b-4f7b-9268-2d75dea61b0f).

For understanding how deployment works, see the wiki: [Deployment](https://github.com/barunespadhy/rangolio/wiki/Deployment)

For a TL;DR server deployment, just install `serve` npm package `npm -g install serve`, and then in the viewable ui frontend folder `rangolio/frontend/viewable-ui`, serve the server build:
```
serve -s dist/server -p 4871
```
After that, your built ui should be visible at [http://localhost:4871/](http://localhost:4871/)

#### NOTE: For the built UI to be functional, please ensure that the editor UI has been setup, and some data has been 'published' to the server build. This can be done by going to editor ui, then cliking on 'publish, then choosing 'server' from the modal.