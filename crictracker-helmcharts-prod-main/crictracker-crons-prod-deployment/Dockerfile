FROM alpine:latest
RUN apk update && \
apk add curl && sync

ADD crontab.txt /crontab.txt

COPY entry.sh /entry.sh
RUN chmod 755  /entry.sh 
RUN /usr/bin/crontab /crontab.txt

ENTRYPOINT ["sh","/entry.sh"]