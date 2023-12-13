#!/bin/bash

set -ex

rm -rf target/deploy/
anchor build
anchor keys sync
anchor build

BgBw6TUtknFTcx4Z9B1tARbbUV48Ukfj5EXe6p6ZHcQb
