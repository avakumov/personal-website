#build personal-website
git pull
rm -R node_modules
rm -R dist
npm i
npm run build

#build portfolio windows project
cd portfolio/windows
rm -R node_modules
rm -R dist
npm i
gulp build-prod
#subdomain link
cp nginx /etc/nginx/sites-enabled/portfolio-windows
#back to the main dir
cd ../..

#reload nginx
/etc/init.d/nginx restart
