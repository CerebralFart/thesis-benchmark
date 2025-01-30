FROM amazoncorretto:23-alpine

WORKDIR /
ADD blazegraph-2-1-6.jar blazegraph.jar
ADD journal.properties journal.properties

CMD java -Xmx64g -Xms64g -jar blazegraph.jar /journal

HEALTHCHECK --start-period=1h --start-interval=5s --timeout=1s \
    CMD wget -O- http://localhost:9999/blazegraph
