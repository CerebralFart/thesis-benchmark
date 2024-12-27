FROM adfreiburg/qlever:pr-1629

ADD start.sh /start.sh

USER root
RUN mkdir /data/ && chown qlever:qlever /data/
USER qlever

ENTRYPOINT []
CMD ["/bin/bash", "/start.sh"]

HEALTHCHECK --start-period=12h --start-interval=5s --timeout=1s \
    CMD curl http://localhost:7001