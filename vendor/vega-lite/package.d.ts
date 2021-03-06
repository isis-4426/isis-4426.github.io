declare const _exports: {
    "name": string;
    "author": string;
    "version": string;
    "collaborators": string[];
    "homepage": string;
    "description": string;
    "main": string;
    "unpkg": string;
    "jsdelivr": string;
    "module": string;
    "types": string;
    "bin": {
        "vl2png": string;
        "vl2svg": string;
        "vl2vg": string;
    };
    "directories": {
        "test": string;
    };
    "scripts": {
        "build": string;
        "build:only": string;
        "postbuild": string;
        "prebuild:examples": string;
        "build:examples": string;
        "prebuild:examples-full": string;
        "build:examples-full": string;
        "build:example": string;
        "build:toc": string;
        "build:site": string;
        "build:jekyll": string;
        "build:versions": string;
        "clean": string;
        "predeploy:site": string;
        "deploy:site": string;
        "data": string;
        "schema": string;
        "renameschema": string;
        "presite": string;
        "site": string;
        "tsc:src": string;
        "tsc:site": string;
        "prettierbase": string;
        "eslintbase": string;
        "format": string;
        "lint": string;
        "test": string;
        "test:inspect": string;
        "test:runtime": string;
        "test:runtime:generate": string;
        "watch:build": string;
        "watch:site": string;
        "watch:test": string;
    };
    "repository": {
        "type": string;
        "url": string;
    };
    "license": string;
    "bugs": {
        "url": string;
    };
    "devDependencies": {
        "@commitlint/cli": string;
        "@commitlint/config-conventional": string;
        "@types/chai": string;
        "@types/d3": string;
        "@types/highlight.js": string;
        "@types/jest": string;
        "@types/jest-environment-puppeteer": string;
        "@types/mkdirp": string;
        "@types/puppeteer": string;
        "@typescript-eslint/eslint-plugin": string;
        "@typescript-eslint/parser": string;
        "ajv": string;
        "chai": string;
        "cheerio": string;
        "codecov": string;
        "concurrently": string;
        "d3": string;
        "eslint": string;
        "eslint-config-prettier": string;
        "eslint-plugin-prettier": string;
        "gh-pages": string;
        "highlight.js": string;
        "http-server": string;
        "husky": string;
        "jest": string;
        "jest-puppeteer": string;
        "lint-staged": string;
        "mkdirp": string;
        "prettier": string;
        "puppeteer": string;
        "rollup": string;
        "rollup-plugin-commonjs": string;
        "rollup-plugin-json": string;
        "rollup-plugin-node-resolve": string;
        "rollup-plugin-sourcemaps": string;
        "rollup-plugin-terser": string;
        "svg2png-many": string;
        "terser": string;
        "ts-jest": string;
        "ts-json-schema-generator": string;
        "typescript": string;
        "vega-cli": string;
        "vega-datasets": string;
        "vega-embed": string;
        "vega-tooltip": string;
        "yaml-front-matter": string;
    };
    "dependencies": {
        "@types/clone": string;
        "@types/fast-json-stable-stringify": string;
        "array-flat-polyfill": string;
        "clone": string;
        "fast-deep-equal": string;
        "fast-json-stable-stringify": string;
        "json-stringify-pretty-compact": string;
        "tslib": string;
        "vega-event-selector": string;
        "vega-expression": string;
        "vega-typings": string;
        "vega-util": string;
        "yargs": string;
    };
    "peerDependencies": {
        "vega": string;
    };
    "husky": {
        "hooks": {
            "pre-commit": string;
            "commit-msg": string;
        };
    };
    "lint-staged": {
        "*.ts": string[];
        "*.{md,css,yml}": string[];
    };
    "jest": {
        "preset": string;
        "transform": {
            "^.+\\.tsx?$": string;
        };
        "testRegex": string;
        "moduleFileExtensions": string[];
        "testPathIgnorePatterns": string[];
        "coverageDirectory": string;
        "collectCoverage": boolean;
    };
};
export = _exports;
