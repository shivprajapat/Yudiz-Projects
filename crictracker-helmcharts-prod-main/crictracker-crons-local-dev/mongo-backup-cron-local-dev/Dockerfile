FROM mongo:latest

RUN apt update && \
    apt install awscli -y

WORKDIR /scripts

COPY backupscript.sh .
RUN chmod +x backupscript.sh

ENV BUCKET_URI="" \
    AWS_ACCESS_KEY_ID="" \
    AWS_SECRET_ACCESS_KEY="" \
    AWS_DEFAULT_REGION=""

CMD ["/scripts/backupscript.sh"]