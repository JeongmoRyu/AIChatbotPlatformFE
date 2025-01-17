#!/bin/sh

FAVICON_NAME=${FAVICON_NAME:-/MAAL_logo.svg}
APP_TITLE=${APP_TITLE:-MAAL}
CHATHUB_LOGO=${CHATHUB_LOGO:-'images/mStudio_logo.png'}
# Export variables so they are available to envsubst
export FAVICON_NAME
export APP_TITLE
export CHATHUB_LOGO
# export VITE_APP_CHATHUB_LOGO
echo "Setting CHATHUB_LOGO to ${CHATHUB_LOGO}"


# Replace environment variables in index.html
# envsubst '${FAVICON_NAME} ${APP_TITLE}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
envsubst '${FAVICON_NAME} ${APP_TITLE} ${CHATHUB_LOGO}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html
# echo "Setting VITE_APP_CHATHUB_LOGO to $VITE_APP_CHATHUB_LOGO"

# Start Nginx
exec "$@"
