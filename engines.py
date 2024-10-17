import os

from docker import build

engines = {
}

for engine in engines:
    tag = f'benchmark/{engine}'
    print(f'Building engine [{engine}]')
    build(f'{os.getcwd()}/engines/{engine}', tag)
    engines[engine]['tag'] = tag

print(engines)