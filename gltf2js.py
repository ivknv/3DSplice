# -*- coding: utf-8 -*-

import argparse
import json
import sys
import os

def main(args: list) -> int:
    parser = argparse.ArgumentParser(description="Convert GLTF to a .js module")
    parser.add_argument("input", nargs="?", type=argparse.FileType("r"), default=sys.stdin)
    parser.add_argument("output", nargs="?", type=argparse.FileType("w"), default=sys.stdout)
    parser.add_argument("--variable", nargs="?", default=None)

    ns = parser.parse_args(args)

    gltf = json.load(ns.input)

    if ns.variable is None and ns.output is not sys.stdout:
        variable = os.path.split(ns.output.name)[1].rpartition(".js")[0]
    else:
        variable = ns.variable

    js = f"const {variable} = {repr(json.dumps(gltf))}; export default {variable};"
    ns.output.write(js)

    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
