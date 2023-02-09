const AWS = require('aws-sdk')
const s3 = new AWS.S3({signatureVersion: 'v4'})

exports.handler = async (event) => {
  //Fill in
  const filename = event.queryStringParameters.filename;
  const TTL = 300;  //Time to live for the URL
  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Expires: TTL,
    ContentType: 'application/pdf',
  }

  let uploadURL;
  try{
    uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadURL: uploadURL,
        filename: filename,
        validFor: `${TTL} seconds`
      })
    }
  } catch(e) {
    console.log(e);

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Something wrong!"
      })
    }
  }

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     uploadURL: uploadURL,
  //     filename: filename,
  //     validFor: `${TTL} seconds`
  //   })
  // }
}

exports.s3Handler = s3;