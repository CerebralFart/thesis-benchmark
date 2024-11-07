import os

from docker import build

preferred_engine = 'fuseki'

engines = {
    'blazegraph': {
        'data_mount_point': '/dataset.ttl',
        'endpoint': '/blazegraph/namespace/kb/sparql',
        'port': 9999,
        'post_launch': [
            ['java', '-cp', '*:*.jar', 'com.bigdata.rdf.store.DataLoader', '-verbose', '/journal.properties', '/dataset.ttl']
        ],
    },
    'fuseki': {
        'data_mount_point': '/dataset.ttl',
        'endpoint': '/bsbm/sparql',
        'port': 3030,
    },
    'rdfox': {
        'args': ['-persistence', 'off', 'daemon', '.', '/data/init.rdfox'],
        'data_mount_point': '/data/dataset.ttl',
        'endpoint': '/datastores/bsbm/sparql',
        'env': {
            'RDFOX_ROLE': 'admin',
            'RDFOX_PASSWORD': 'admin',
        },
        'excluded_datasets': ['BSBM 100M', 'BSBM 1B', 'BSBM 10B'],
        'port': 12110,
        'volumes': {
            '/opt/RDFox/RDFox.lic': f'{os.getcwd()}/engines/rdfox/rdfox.license',
        }
    },
    'virtuoso': {
        'data_mount_point': '/database/data/dataset.ttl',
        'endpoint': '/sparql?default-graph-uri=http%3A%2F%2Fbsbm.org',
        'port': 8890,
        'volumes': {
            '/database/virtuoso.lic': f'{os.getcwd()}/engines/virtuoso/virtuoso.license'
        },
    },
}

for engine in engines:
    tag = f'benchmark/{engine}'
    print(f'Building engine [{engine}]')
    build(f'{os.getcwd()}/engines/{engine}', tag)
    engines[engine]['tag'] = tag

    config = engines[engine]
    config_array = [f'-p=8000:{config["port"]}', '--memory=96g', '--shm-size=96g']
    if 'env' in config:
        config_array.extend([f'-e{key}={value}' for key, value in config['env'].items()])

    if 'volumes' in config:
        config_array.extend([f'-v={local}:{mount}:ro' for mount, local in config['volumes'].items()])

    config_array.append(config['tag'])
    if 'args' in config:
        config_array.extend(config['args'])

    engines[engine]['config'] = config_array
