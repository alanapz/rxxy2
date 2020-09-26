FROM node:13-alpine

LABEL maintainer="alan@alanpinder.com"

EXPOSE 4200/tcp

COPY generate.sh /generate.sh
RUN chmod +x /generate.sh && /generate.sh

WORKDIR /app/rxxy2/rxxy2

ENTRYPOINT ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
