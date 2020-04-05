# fxnet-blobber

File transformations as a service. For e.g.

 * convert a png image into a webp image
 * convert a LibreOffice Odt file into a PDF
 * replace handlerbar placeholders in an OpenOffice document and render it to Postscript
 * crop an image, rotate it 10 degrees, reduce colors to grayscale and output as a pdf
 * identify the position of faces in an image

## Concept

### The problem

The are a lot of binary formats you may use in an application: images, pdf, word, excel. Handling them in your application introduces heavyweight dependencies. Precalculating images in all needed sizes is a waste of resources and introducing new styles (e.g. rounded corners) leads to huge precalculation runs.

### The solution

This service provides the possibility to run a (binary) document through a bunch of transformations and turn it into another document (format).

### API

The service has two operation modes:
 * POST: you define the transformations via the json body
 * GET: you define the transformations via the url path

In the GET mode:
 * transformation pipeline is encoded into the url
 * caching is possible
 * attachments are not allowed
 * two identical transformations have the same url
 * the endpoint is GET 'api/v1/:namespace/:bucket/:key/t/:encoded_encrypted_transformation_pipeline'

In th POST mode is to be used by your backends (see security)
  * allows to send source files as attachments
  * caching is not possible ( and usually not needed)
  * the endpoint is POST 'api/v1/:namespace/:bucket/:key/t'

### Transformations
A transformation starts with a source (e.g. get the file from a url or  through a headless browser), followed by a bunch of transformations (e.g, croping, grayscaling, handlebar replacements, ......) and output it to a specific format.


``` json
{
  "blob": {
         "tr": [
             [ "in-url": { "url": "https://someurl.example.com/image/1" }],
             [ "rotate", {"degrees": 12}],
             [ "grayscale"],
             [ "out", { "m": "image/png" }]
         ]
  }
}
```

Transformations have a name (e.g. "rotate", "grayscale", ....) and an optional parameter list.

Available Sources:
"in-browser","in-file","in-url"

Available Transformations:
"grayscale", "rotate", "odt-handlebar", "doc-convert"


### Caching

Transformations can be expensive so caching the result is essential. The cache key is the value of the "blob" key. The cache time can be defined by adding a cache instruction to the blob. Cache can only set at the GET api:

``` json
{
  "blob": {
     "ca": { "utl": 234098098234 }
    }
}
```
The "utl" option takes a unix time.

### Attachments

The POST endpoint allows you to send the files that are needed for the transformations as attachments:

``` json
{
  "att": {
    "name1": "base64encoded binary"
  }
}
```

The attachments can be referenced by a specifc url: "att://:att_name" .

### Security

The access to the transformation pipeline and it's configuration has to be protected. Thefore the "blob" value has to be encrypted and base64 encoded. The "key" parameter in the url defines the encryptor's key that referes to his public key.

A simple authentification is implemented.

### Healthcheck

Are we alive? ```/health```

returns

```json
{
  "success": true
}
```


## Usage
### Quickstart
```
bin/generate_key
bin/encrypt_payload priv.key sample/commands.json sample/vorlage.odt sample/prepared.bin
curl -X POST --data-binary @sample/prepared.bin localhost:3000/api/v1/key1/333/322322/transform
```


### Docker

Build image

```bash
$ bin/build
```

Run image

```bash
$ bin/container_exec bin/run
```

### Environment


## Thanks

I'd like to thank :
  * https://github.com/zrrrzzt/tfk-api-unoconv for his/her work to wrap unoconv2 as a service.
  * Thanks to Experteer GmbH to allow me to design https://github.com/experteer/blobsterix, a ruby implementation of the concept with built in storage.

## License

[MIT](LICENSE)
