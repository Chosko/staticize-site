# staticize-site

Make HTML snapshots and a sitemap for your website. (Useful for SEO with SPAs).

## Requirements

You need node.js >= 0.12 <= 5

## Getting started

1. Install dependencies

       npm install -g gulp
       npm install

2. Create a file `pageList.json` from `pageList.json.template` and add the list of page URLs of your website.

3. Edit gulpfile.js to change the hosts URLs.

## Make snapshots

* Snapshots from development env

      gulp staticize

* Snapshots from staging env

      gulp staticize --staging

* Snapshots from production env

      gulp staticize --prod

staticize-site will also create a Sitemap.xml file.

All the output files are saved into the `dist/snapshots` directory (you can change this in gulpfile.js)
