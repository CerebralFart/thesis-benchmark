import os

from docker import build

preferred_engine = 'fuseki'

engines = {
    'fuseki': {
        'endpoint': '/bsbm/sparql',
        'port': 3030,
    },
}

for engine in engines:
    tag = f'benchmark/{engine}'
    print(f'Building engine [{engine}]')
    build(f'{os.getcwd()}/engines/{engine}', tag)
    engines[engine]['tag'] = tag
