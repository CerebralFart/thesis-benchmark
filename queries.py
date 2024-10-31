import itertools
import requests

from datasets import datasets
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
            ORDER BY SHA512(?product)
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
            } ORDER BY SHA512(?product)
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
                FILTER (?date > "%currentDate"^^xsd:dateTime)
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
    "bsbm-12": {
        "query": prefix + """
            PREFIX bsbm-export: <http://www4.wiwiss.fu-berlin.de/bizer/bsbm/v01/export/>
            CONSTRUCT {
                <%offer> bsbm-export:product ?productURI.
                <%offer> bsbm-export:productlabel ?productlabel.
                <%offer> bsbm-export:vendor ?vendorname.
                <%offer> bsbm-export:vendorhomepage ?vendorhomepage.
                <%offer> bsbm-export:offerURL ?offerURL.
                <%offer> bsbm-export:price ?price.
                <%offer> bsbm-export:deliveryDays ?deliveryDays.
                <%offer> bsbm-export:validuntil ?validTo.
            } WHERE {
                <%offer> bsbm:product ?productURI.
                ?productURI rdfs:label ?productlabel.
                <%offer> bsbm:vendor ?vendorURI.
                ?vendorURI rdfs:label ?vendorname.
                ?vendorURI foaf:homepage ?vendorhomepage.
                <%offer> bsbm:offerWebpage ?offerURL.
                <%offer> bsbm:price ?price.
                <%offer> bsbm:deliveryDays ?deliveryDays.
                <%offer> bsbm:validTo ?validTo.
            }
        """,
        "bindings": prefix + """
            SELECT ?offer WHERE {
                ?offer rdf:type bsbm:Offer.
            } ORDER BY SHA512(?offer)
        """,
    },
}


def execute_query(url, query):
    response = requests.post(
        url,
        headers={'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'},
        data={'query': query},
    )
    if response.status_code == 200:
        return response
    else:
        raise Exception(response.text)


def get_query_mix(dataset, repetitions):
    config = engines[preferred_engine]
    database = Container([f'-v={dataset}:/{config["data_mount_point"]}:ro'] + config['config'])
    database.await_healthy()

    try:
        bindings = {}
        for query_name, query_data in queries.items():
            print(f"Getting bindings for [{query_name}]")
            result = execute_query(
                f"http://127.0.0.1:8000/{config['endpoint'].lstrip('/')}",
                query_data['bindings'] + f" LIMIT {repetitions}"
            ).json()['results']['bindings']
            bindings[query_name] = itertools.cycle([{key: value['value'] for (key, value) in binding.items()} for binding in result])

        print(f"Substituting bindings")
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
    print(get_query_mix(datasets[0], 5))
