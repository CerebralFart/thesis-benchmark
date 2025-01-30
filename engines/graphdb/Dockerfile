FROM ontotext/graphdb:10.8.0

ADD config.ttl /config.ttl
ADD start.sh /start.sh

ENTRYPOINT []
CMD ["/bin/bash", "/start.sh"]

HEALTHCHECK --start-period=12h --start-interval=5s --timeout=1s \
    CMD curl http://localhost:7200
