const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

async function loadEnvironmentVariables() {
  const s3 = new S3Client();
  const command = new GetObjectCommand({
    Bucket: 'investinfrastructurestack-envbucket236fc6cf-1pod8wxbg1mel',
    Key: '.env'
  })
  const s3Response = await s3.send(command);
  const envContents = s3Response.Body.toString();
  const envVars = envContents.split('\n').reduce((acc, line) => {
    if (line.trim().length > 0 && line.trim().charAt(0) !== '#') {
      const [key, value] = line.split('=');
      acc[key] = value;
    }
    return acc;
  }, {});
  process.env = { ...process.env, ...envVars };
}

loadEnvironmentVariables();
