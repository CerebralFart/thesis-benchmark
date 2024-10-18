FROM amazoncorretto:23-alpine

WORKDIR /
ADD fuseki-server-5-1-0.jar fuseki-server.jar
ADD config.ttl config.ttl
ADD webapp/ webapp/

CMD java -Xmx64g -Xms64g -jar fuseki-server.jar --config=/config.ttl
# query is `SELECT * WHERE{?s ?p ?o} LIMIT 1`
HEALTHCHECK --start-period=1h --start-interval=5s --timeout=1s \
    CMD wget --header='Content-Type: application/x-www-form-urlencoded' --post-data='query=SELECT%20%2A%20WHERE%20%7B%3Fs%20%3Fp%20%3Fo%7D%20LIMIT%201' --output-document - http://127.0.0.1:3030/bsbm/sparql
