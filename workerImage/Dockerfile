FROM rafalkrypa/ffmpeg:4.1 AS ffmpeg

FROM mesosphere/aws-cli:1.14.5 

RUN apk add --no-cache util-linux

WORKDIR /root
RUN mkdir logs tmp
COPY bin /bin/
COPY scripts scripts
COPY --from=ffmpeg /bin/ffmpeg /bin/ffmpeg

ENTRYPOINT ["/app/scripts/download-call.sh"]
