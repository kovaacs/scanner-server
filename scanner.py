"""Scanner script

The script first scans the image using scanimage, then the output is piped into convert,
which converts the TIFF into PDF. This gets output to the stdout. If you want to output to a file,
do it like this: python3 scanner.py > output.pdf
"""
import argparse
from subprocess import Popen, call, PIPE
from shlex import split
PARSER = argparse.ArgumentParser()
PARSER.add_argument(
    "-m", "--mode", choices=["gray", "color"], default="color")
PARSER.add_argument("-r", "--resolution", type=int, default=300)
PARSER.add_argument("-c", "--compression",
                    choices=["none", "zip", "jpeg", "lzw"], default="zip")
ARGS = PARSER.parse_args()


def scan():
    """Scanner function: requires sane, prints to stdout of subprocess"""
    temp_args = split("scanimage --progress --format=tiff --mode={} --resolution={}"
                      .format(ARGS.mode, ARGS.resolution))
    pipeline = Popen(
        temp_args, stdout=PIPE, stderr=PIPE)
    convert(pipeline.stdout)
    pipeline.stdout.close()


def convert(inpipe):
    """This is taking an stdin to convert to PDF, prints to stdout of subprocess"""
    temp_args = split(
        "convert -monitor -compress {} - pdf:-".format(ARGS.compression))
    call(temp_args, stdin=inpipe)


if __name__ == "__main__":
    try:
        scan()
    except Exception as ERROR_TEMP:
        print(str(ERROR_TEMP))
