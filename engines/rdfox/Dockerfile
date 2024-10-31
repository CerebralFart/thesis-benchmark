FROM oxfordsemantic/rdfox:7.2

USER root
RUN apt update && apt install -y curl

USER rdfox
ADD init/ /home/rdfox/.RDFox/
ADD init.rdfox /data/init.rdfox

HEALTHCHECK --start-period=1h --start-interval=5s --timeout=1s \
    CMD curl http://localhost:12110/health