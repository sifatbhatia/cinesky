@echo off
echo Building CineCast for production...

echo Installing dependencies...
call npm install

echo Building application...
call npm run build

echo Copying Netlify configuration files...
copy _redirects dist\
copy netlify.toml dist\

echo Build complete! Your production-ready files are in the dist folder.
echo You can now deploy the contents of the dist folder to your hosting provider. 