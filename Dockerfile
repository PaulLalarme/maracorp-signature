FROM nginx:alpine

# config nginx custom
COPY nginx.conf /etc/nginx/nginx.conf

# site statique
COPY site/ /usr/share/nginx/html/

# santé (facultatif)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
