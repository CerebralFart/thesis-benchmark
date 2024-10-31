import os

from docker import build

preferred_engine = 'fuseki'

engines = {
    'fuseki': {
        'data_mount_point': '/dataset.ttl',
        'endpoint': '/bsbm/sparql',
        'port': 3030,
    },
    'rdfox': {
        'args': ['-persistence', 'off', 'daemon','.','/data/init.rdfox'],
        'data_mount_point': '/data/dataset.ttl',
        'endpoint': '/datastores/bsbm/sparql',
        'env': {
            'RDFOX_ROLE': 'admin',
            'RDFOX_PASSWORD': 'admin',
        },
        'port': 12110,
        'volumes': {
            '/opt/RDFox/RDFox.lic': f'{os.getcwd()}/engines/rdfox/rdfox.license',
        }
    },
}

for engine in engines:
    tag = f'benchmark/{engine}'
    print(f'Building engine [{engine}]')
    build(f'{os.getcwd()}/engines/{engine}', tag)
    engines[engine]['tag'] = tag
