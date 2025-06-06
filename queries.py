import itertools
import logging
import requests
import time
import urllib.parse

from docker import Container
from engines import engines, preferred_engine

prefix = """
PREFIX bsbm: <http://www4.wiwiss.fu-berlin.de/bizer/bsbm/v01/vocabulary/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rev: <http://purl.org/stuff/rev#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
"""

queries = {
    "bsbm-01": {
        "query": prefix + """
            SELECT DISTINCT ?product ?label WHERE {
                ?product rdfs:label ?label.
                ?product rdf:type <%type>.
                ?product bsbm:productFeature <%feature1>.
                ?product bsbm:productFeature <%feature2>.
                ?product bsbm:productPropertyNumeric1 ?value.
                FILTER (?value > %value)
            }
            ORDER BY ?label
            LIMIT 10
        """,
        "bindings": prefix + """
            SELECT ?type ?feature1 ?feature2 
                   ((MAX(?property1) - MIN(?property1)) / 3 + MIN(?property1) AS ?value)
            WHERE {
                ?product rdf:type ?type;
                         bsbm:productFeature ?feature1;
                         bsbm:productFeature ?feature2;
                         bsbm:productPropertyNumeric1 ?property1.
                ?type rdf:type bsbm:ProductType.
                FILTER(STR(?feature1) > STR(?feature2))
            }
            GROUP BY ?type ?feature1 ?feature2
            HAVING (COUNT(*) >= 10)
            ORDER BY SHA512(?type)
        """,
    },
    "bsbm-02": {
        "query": prefix + """
            SELECT
                ?label ?comment ?producer ?productFeature
                ?propertyTextual1 ?propertyTextual2 ?propertyTextual3 ?propertyTextual4 ?propertyTextual5
                ?propertyNumeric1 ?propertyNumeric2 ?propertyNumeric4
            WHERE {
                <%product> rdfs:label ?label.
                <%product> rdfs:comment ?comment.
                <%product> bsbm:producer ?p.
                ?p rdfs:label ?producer.
                <%product> dc:publisher ?p.
                <%product> bsbm:productFeature ?f.
                ?f rdfs:label ?productFeature.
                <%product> bsbm:productPropertyTextual1 ?propertyTextual1.
                <%product> bsbm:productPropertyTextual2 ?propertyTextual2.
                <%product> bsbm:productPropertyTextual3 ?propertyTextual3.
                <%product> bsbm:productPropertyNumeric1 ?propertyNumeric1.
                <%product> bsbm:productPropertyNumeric2 ?propertyNumeric2.
                OPTIONAL { <%product> bsbm:productPropertyTextual4 ?propertyTextual4 }
                OPTIONAL { <%product> bsbm:productPropertyTextual5 ?propertyTextual5 }
                OPTIONAL { <%product> bsbm:productPropertyNumeric4 ?propertyNumeric4 }
            }
        """,
        "bindings": prefix + """
            SELECT ?product WHERE {
                ?product rdf:type bsbm:Product.
            } ORDER BY SHA512(?product)
        """,
    },
    "bsbm-03": {
        "query": prefix + """
            SELECT ?product ?label WHERE {
                ?product rdfs:label ?label.
                ?product rdf:type <%type>.
                ?product bsbm:productFeature <%feature1>.
                ?product bsbm:productPropertyNumeric1 ?p1.
                FILTER (?p1 > %x)
                ?product bsbm:productPropertyNumeric3 ?p3.
                FILTER (?p3 < %y)
                OPTIONAL {
                    ?product bsbm:productFeature <%feature2>.
                    ?product rdfs:label ?testVar
                }
                FILTER (!BOUND(?testVar))
            }
            ORDER BY ?label
            LIMIT 10
        """,
        "bindings": prefix + """
            SELECT ?type ?feature1 ?feature2 ?x ?y WHERE {
	            ?product rdf:type bsbm:Product.
              	?product rdf:type ?type.
  	            FILTER(?type != bsbm:Product)
  	            { SELECT ?feature1 WHERE {
                    ?product bsbm:productFeature ?feature1.
                } LIMIT 1 }
  	            { SELECT ?feature2 WHERE {
                    ?feature2 rdf:type bsbm:ProductFeature.
                    FILTER NOT EXISTS { ?product bsbm:productFeature ?feature2. }
                } LIMIT 1 }
  	            ?product bsbm:productPropertyNumeric1 ?p1.
                ?product bsbm:productPropertyNumeric3 ?p3.
  	            BIND(?p1 * 0.5 AS ?x)
  	            BIND(?p3 * 1.5 AS ?y)
            } ORDER BY SHA512(?product)
        """,
    },
    "bsbm-04": {
        "query": prefix + """
            SELECT ?product ?label WHERE {
                {
                    ?product rdfs:label ?label.
                    ?product rdf:type <%type>.
                    ?product bsbm:productFeature <%feature1>.
                    ?product bsbm:productFeature <%feature2>.
                    ?product bsbm:productPropertyNumeric1 ?p1.
                    FILTER (?p1 > %x)
                } UNION {
                    ?product rdfs:label ?label.
                    ?product rdf:type <%type>.
                    ?product bsbm:productFeature <%feature1>.
                    ?product bsbm:productFeature <%feature3>.
                    ?product bsbm:productPropertyNumeric2 ?p2.
                    FILTER (?p2 > %y)
                }
            }
            ORDER BY ?label
            LIMIT 10 OFFSET 10
        """,
        "bindings": prefix + """
            SELECT ?feature1 ?feature2 ?feature3 ?x ?y WHERE {
                ?feature1 rdf:type bsbm:ProductFeature.
                ?feature2 rdf:type bsbm:ProductFeature.
                ?feature3 rdf:type bsbm:ProductFeature.
              
                FILTER(?feature1 != ?feature2 && ?feature2 != ?feature3 && ?feature1 != ?feature3)
                FILTER EXISTS {?product bsbm:productFeature ?feature1, ?feature2}
                FILTER EXISTS {?product bsbm:productFeature ?feature1, ?feature3}
              
                BIND(1000 AS ?x)
                BIND(1000 AS ?y)
            }
        """,
    },
    "bsbm-05": {
        "query": prefix + """
            SELECT DISTINCT ?product ?productLabel WHERE {
                ?product rdfs:label ?productLabel.
                FILTER (<%product> != ?product)
                <%product> bsbm:productFeature ?prodFeature.
                ?product bsbm:productFeature ?prodFeature.
                <%product> bsbm:productPropertyNumeric1 ?origProperty1.
                ?product bsbm:productPropertyNumeric1 ?simProperty1.
                FILTER (?simProperty1 < (?origProperty1 + 120) && ?simProperty1 > (?origProperty1 - 120))
                <%product> bsbm:productPropertyNumeric2 ?origProperty2.
                ?product bsbm:productPropertyNumeric2 ?simProperty2.
                FILTER (?simProperty2 < (?origProperty2 + 170) && ?simProperty2 > (?origProperty2 - 170))
            }
            ORDER BY ?productLabel
            LIMIT 5
        """,
        "bindings": prefix + """
            SELECT ?product WHERE {
                ?product rdf:type bsbm:Product.
            } ORDER BY SHA512(?product)
        """,
    },
    "bsbm-06": {
        "query": prefix + """
            SELECT ?product ?label WHERE {
                ?product rdfs:label ?label.
                ?product rdf:type bsbm:Product.
                FILTER regex(?label, "%word")
            }
        """,
        "bindings": prefix + """
            SELECT ?word WHERE {
                ?product rdf:type bsbm:Product;
                         rdfs:label ?label.
                BIND(STRBEFORE(STRAFTER(?label, " "), " ") AS ?word)
                FILTER(?word != "")
            }
            ORDER BY RAND()
        """,
    },
    "bsbm-07": {
        "query": prefix + """
            SELECT ?productLabel ?offer ?price ?vendor ?vendorTitle ?review ?revTitle ?reviewer ?revName ?rating1 ?rating2
            WHERE {
                <%product> rdfs:label ?productLabel.
                OPTIONAL {
                    ?offer bsbm:product <%product>.
                    ?offer bsbm:price ?price.
                    ?offer bsbm:vendor ?vendor.
                    ?vendor rdfs:label ?vendorTitle.
                    ?vendor bsbm:country <http://downlode.org/rdf/iso-3166/countries#DE>.
                    ?offer dc:publisher ?vendor.
                    ?offer bsbm:validTo ?date.
                    FILTER (?date > "%date"^^xsd:dateTime)
                }
                OPTIONAL {
                    ?review bsbm:reviewFor <%product>.
                    ?review rev:reviewer ?reviewer.
                    ?reviewer foaf:name ?revName.
                    ?review dc:title ?revTitle.
                    OPTIONAL { ?review bsbm:rating1 ?rating1. }
                    OPTIONAL { ?review bsbm:rating2 ?rating2. }
                }
            }
        """,
        "bindings": prefix + """
            SELECT ?product WHERE {
                ?product rdf:type bsbm:Product.
            }
        """,
    },
    "bsbm-08": {
        "query": prefix + """
            SELECT
                ?title ?text ?reviewDate ?reviewer ?reviewerName
                ?rating1 ?rating2 ?rating3 ?rating4
            WHERE {
                ?review bsbm:reviewFor <%product>.
                ?review dc:title ?title.
                ?review rev:text ?text.
                FILTER langMatches(lang(?text), "EN")
                ?review bsbm:reviewDate ?reviewDate.
                ?review rev:reviewer ?reviewer.
                ?reviewer foaf:name ?reviewerName.
                OPTIONAL { ?review bsbm:rating1 ?rating1. }
                OPTIONAL { ?review bsbm:rating2 ?rating2. }
                OPTIONAL { ?review bsbm:rating3 ?rating3. }
                OPTIONAL { ?review bsbm:rating4 ?rating4. }
            }
            ORDER BY DESC(?reviewDate)
            LIMIT 20
        """,
        "bindings": prefix + """
            SELECT ?product WHERE {
                ?product rdf:type bsbm:Product.
            } ORDER BY SHA512(?product)
        """,
    },
    # Disabled because not all engines support DESCRIBE queries
    # "bsbm-09": {
    #     "query": prefix + """
    #         DESCRIBE ?reviewer WHERE {
    #             <%review> rev:reviewer ?reviewer
    #         }
    #     """,
    #     "bindings": prefix + """
    #         SELECT ?review WHERE {
    #             ?review rdf:type bsbm:Review.
    #         } ORDER BY SHA512(?review)
    #     """,
    # },
    "bsbm-10": {
        "query": prefix + """
            SELECT DISTINCT ?offer ?price WHERE {
                ?offer bsbm:product <%product>.
                ?offer bsbm:vendor ?vendor.
                ?offer dc:publisher ?vendor.
                ?vendor bsbm:country <%country>.
                ?offer bsbm:deliveryDays ?deliveryDays.
                FILTER (?deliveryDays <= 3)
                ?offer bsbm:price ?price.
                ?offer bsbm:validTo ?date.
                FILTER (?date > "%date"^^xsd:dateTime)
            }
            ORDER BY xsd:double(str(?price))
            LIMIT 10
        """,
        "bindings": prefix + """
            SELECT ?date ?product ?country WHERE {
                ?offer bsbm:validTo ?date;
                       bsbm:product ?product;
                       bsbm:vendor/bsbm:country ?country.
            }
            ORDER BY SHA512(?offer)
        """,
    },
    "bsbm-11": {
        "query": prefix + """
        SELECT ?property ?hasValue ?isValueOf WHERE {
            {
                <%offer> ?property ?hasValue
            } UNION {
                ?isValueOf ?property <%offer>
            }
        }
        """,
        "bindings": prefix + """
            SELECT ?offer WHERE {
                ?offer rdf:type bsbm:Offer.
            } ORDER BY SHA512(?offer)
        """,
    },
    # Disabled because not all engines support CONSTRUCT queries
    # "bsbm-12": {
    #     "query": prefix + """
    #         PREFIX bsbm-export: <http://www4.wiwiss.fu-berlin.de/bizer/bsbm/v01/export/>
    #         CONSTRUCT {
    #             <%offer> bsbm-export:product ?productURI.
    #             <%offer> bsbm-export:productlabel ?productlabel.
    #             <%offer> bsbm-export:vendor ?vendorname.
    #             <%offer> bsbm-export:vendorhomepage ?vendorhomepage.
    #             <%offer> bsbm-export:offerURL ?offerURL.
    #             <%offer> bsbm-export:price ?price.
    #             <%offer> bsbm-export:deliveryDays ?deliveryDays.
    #             <%offer> bsbm-export:validuntil ?validTo.
    #         } WHERE {
    #             <%offer> bsbm:product ?productURI.
    #             ?productURI rdfs:label ?productlabel.
    #             <%offer> bsbm:vendor ?vendorURI.
    #             ?vendorURI rdfs:label ?vendorname.
    #             ?vendorURI foaf:homepage ?vendorhomepage.
    #             <%offer> bsbm:offerWebpage ?offerURL.
    #             <%offer> bsbm:price ?price.
    #             <%offer> bsbm:deliveryDays ?deliveryDays.
    #             <%offer> bsbm:validTo ?validTo.
    #         }
    #     """,
    #     "bindings": prefix + """
    #         SELECT ?offer WHERE {
    #             ?offer rdf:type bsbm:Offer.
    #         } ORDER BY SHA512(?offer)
    #     """,
    # },
}


def execute_query(url, query, url_params=None):
    if url_params is not None:
        infix = '&' if '?' in url else '?'
        url += infix + '&'.join([f"{urllib.parse.quote(key)}={urllib.parse.quote(value)}" for key, value in url_params.items()])

    response = requests.post(
        url,
        headers={'Accept': 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded'},
        data={'query': query},
        timeout=3600,  # One hour
    )
    if response.status_code == 200:
        return response
    else:
        raise Exception(response.text)


def get_query_mix(repetitions):
    config = engines[preferred_engine]
    database = Container([f'-v=./datasets/bsbm-1m.ttl:/{config["data_mount_point"]}:ro'] + config['config'])
    if 'healthcheck' not in config or config['healthcheck'] is True:
        database.await_healthy()
    else:
        time.sleep(10)

    if 'post_launch' in config:
        for cmd in config['post_launch']:
            database.exec(cmd)

    try:
        bindings = {}
        for query_name, query_data in queries.items():
            logging.info(f"Getting bindings for [{query_name}]")
            result = execute_query(
                f"http://127.0.0.1:8000/{config['endpoint'].lstrip('/')}",
                query_data['bindings'] + f" LIMIT {repetitions}"
            ).json()['results']['bindings']

            if result == []:
                raise Exception(f"No bindings for [{query_name}]")

            bindings[query_name] = itertools.cycle([{key: value['value'] for (key, value) in binding.items()} for binding in result])

        logging.info(f"Substituting bindings")
        bound_queries = []
        for i in range(repetitions):
            for query_name in queries:
                substitutions = next(bindings[query_name])
                query = queries[query_name]['query']
                for name, value in substitutions.items():
                    query = query.replace('%' + name, value)
                bound_queries.append({'type': query_name, 'repetition': i, 'query': query})

        return bound_queries
    finally:
        database.remove()


if __name__ == '__main__':
    logging.info(get_query_mix(5))
