#build personal-website
rm -R node_modules
rm -R dist
#git pull
npm i
npm run build

#build portfolio windows project
cd portfolio/windows
rm -R node_modules
rm -R dist
npm i
gulp build-prod
#sub domain link
cp nginx /etc/nginx/sites-enabled/portfolio-windows
#back to the main dir
cd ../..

#reload nginx
/etc/init.d/nginx restart
