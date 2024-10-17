FROM amazoncorretto:23-alpine

WORKDIR /
ADD fuseki-server-5-1-0.jar fuseki-server.jar
ADD config.ttl config.ttl
ADD webapp/ webapp/

CMD ["java", "-jar", "fuseki-server.jar", "--config=/config.ttl"]
