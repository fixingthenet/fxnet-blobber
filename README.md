# fxnet-blobber

File transformation as a service.

## Description

Convert a lot of format into other format with transformations. E.g.
 * converting a png image into a webp image
 * converting a LibreOffice Odt file into a PDF
 * Taking Odt, replacing handlerbar placeholders and rendering to Postscript
 * Taking an image cropping it, rotating it 10 degrees, removing colors to grayscale and output as a pdf

The service has two operation modes:
 * POST you define the transformations via the json body (uncached mode)
 * GET you define the transformations via the url path (cached mode)

## Quickstart
```
bin/generate_key
bin/prepare_upload priv.key sample/commands.json sample/vorlage.odt sample/prepared.bin
curl -X POST --data-binary @sample/prepared.bin localhost:3000/api/v1/key1/333/322322/transform
```


## Docker

Build image

```bash
$ bin/build
```

Run image

```bash
$ bin/container_exec bin/run
```

## Usage

Post the file you want to convert to the server and get the converted file in return.

See all possible conversions on the [unoconv website](http://dag.wiee.rs/home-made/unoconv/).

API for the webservice is /unoconv/{format-to-convert-to} so a docx to pdf would be

```bash
$ curl --form file=@myfile.docx http://localhost/unoconv/pdf > myfile.pdf
```

### Formats

To see all possible formats for convertion visit ```/unoconv/formats```

To see formats for a given type ```/unoconv/formats/{document|graphics|presentation|spreadsheet}```

### Versions

To see all versions of installed dependencies lookup ```/unoconv/versions```

### Healthz

Are we alive? ```/healthz```

returns

```JavaScript
{
  uptime: 18.849
}
```

## Environment

You can change the webservice port and filesize-limit by changing environment variables.

SERVER_PORT default is 3000

PAYLOAD_MAX_SIZE default is 1048576 (1 MB)

PAYLOAD_TIMEOUT default is 2 minutes (120 000 milliseconds)

TIMEOUT_SERVER default is 2 minutes (120 000 milliseconds)

TIMEOUT_SOCKET default is 2 minutes and 20 seconds (140 000 milliseconds)

Change it in the Dockerfile or create an env-file and load it at containerstart

```bash
$ docker run --env-file=docker.env -d -p 80:3000 --name unoconv-webservice unoconv-webservice
```
## Thanks

I'd like to thank :
  * https://github.com/zrrrzzt/tfk-api-unoconv for his/her work to wrap unoconv2 as a service.


## License

[MIT](LICENSE)
