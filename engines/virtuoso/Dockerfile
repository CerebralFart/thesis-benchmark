FROM openlink/virtuoso-closedsource-8:8.3

RUN apt update && apt install -y curl
ADD init.sql /opt/virtuoso/initdb.d/10-init.sql

HEALTHCHECK --start-period=1h --start-interval=5s --timeout=1s \
    CMD curl http://localhost:8890/sparql