@echo off
echo Deploying CineCast to Netlify...

echo Building for production...
call npm run build

echo Copying Netlify configuration files...
copy _redirects dist\
copy netlify.toml dist\

echo Installing Netlify CLI if not already installed...
call npm install -g netlify-cli

echo Deploying to Netlify...
cd dist
call netlify deploy --prod

echo Deployment complete!
echo Your site should be available at https://cinecast.netlify.app 