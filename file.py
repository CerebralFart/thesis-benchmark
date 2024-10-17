class TSV:
    def __init__(self, filename, header=None):
        self._path = filename
        self._handle = open(filename, 'w')
        self._width = None
        if header is not None:
            self.write(header)

    def path(self):
        return self._path

    def write(self, data):
        if self._width is None:
            self._width = len(data)
        elif self._width != len(data):
            raise ValueError(f'Incorrect amount of fields received, expected {self._width} but received {len(data)}')

        self._handle.write('\t'.join(map(str, data)) + '\n')
        self._handle.flush()
