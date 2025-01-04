# Share pictures in a public S3 bucket

This tutorial explains how to use the `upload_pics_to_s3_bucket.py` script to share pictures in a public S3 bucket using static website hosting.

!!! danger

    This page is under construction

## Prerequisites

1. AWS account with appropriate permissions:
   - s3:PutPublicAccessBlock
   - s3:PutBucketWebsite
   - s3:PutBucketPolicy
   - s3:PutObject
   - s3:CreateBucket (if bucket doesn't exist)

2. AWS credentials configured (either through environment variables, AWS CLI configuration, or IAM role)

3. Python packages:
   ```bash
   pip install boto3
   ```

## Account-Level Settings

Before using the script, ensure that your AWS account allows public access to S3 buckets:

1. Go to AWS Console > S3 > Block Public Access settings for this account
2. Uncheck "Block all public access"
3. Confirm your choice

Note: This is an account-level security setting that cannot be changed programmatically.

## Using the Script

The script is located at `python/scripts/upload_pics_to_s3_bucket.py`. It handles:
- Creating/configuring the S3 bucket
- Setting up static website hosting
- Uploading pictures with proper permissions
- Maintaining a manifest of uploaded files

### Basic Usage

```bash
# Upload pictures, using folder name as destination
python upload_pics_to_s3_bucket.py my-bucket-name /path/to/pics/of/butterflies

# Upload pictures to a specific destination
python upload_pics_to_s3_bucket.py my-bucket-name /path/to/pics/of/istanbul -d constantinople
```

### What the Script Does

1. **Bucket Configuration**
   - Creates the bucket if it doesn't exist
   - Disables public access blocks at the bucket level
   - Configures static website hosting
   - Sets a bucket policy allowing public read access

2. **File Management**
   - Scans the local directory for images
   - Computes MD5 hashes to detect changes
   - Only uploads new or modified files
   - Maintains a manifest.json tracking uploaded files

3. **URL Generation**
   - Provides a website endpoint URL for the bucket
   - Generates URLs for each uploaded file
   - Creates a publicly accessible manifest

### Example Output

```
Disabled block public access settings
Bucket website endpoint: http://my-bucket-name.s3-website-us-west-2.amazonaws.com
Uploaded butterfly1.jpg
Website URL: http://my-bucket-name.s3-website-us-west-2.amazonaws.com/butterflies/butterfly1.jpg
Uploaded butterfly2.jpg
Website URL: http://my-bucket-name.s3-website-us-west-2.amazonaws.com/butterflies/butterfly2.jpg
Updated manifest at: http://my-bucket-name.s3-website-us-west-2.amazonaws.com/butterflies/manifest.json
```

## Supported File Types

The script supports common image formats:
- .jpg, .jpeg
- .png
- .gif
- .bmp
- .tiff
- .webp

## Security Considerations

1. **Public Access**
   - All uploaded files will be publicly readable
   - Anyone with the URL can access the files
   - Consider using pre-signed URLs for sensitive content

2. **Bucket Policy**
   - The bucket policy allows read-only access
   - Write operations still require AWS credentials
   - Policy is scoped to objects only, not bucket configuration

3. **Website Hosting**
   - Uses HTTP, not HTTPS (consider CloudFront for HTTPS)
   - Allows directory listing if index.html exists
   - Provides a custom error page for 404s

## Troubleshooting

1. **AccessDenied Errors**
   - Check IAM user permissions
   - Verify account-level S3 public access settings
   - Ensure bucket policy is not blocked

2. **Website Endpoint Not Working**
   - Wait a few minutes for DNS propagation
   - Verify bucket name follows DNS naming rules
   - Check if error.html exists for error pages

3. **Files Not Uploading**
   - Verify file extensions are supported
   - Check local file permissions
   - Ensure sufficient disk space

## Next Steps

- Set up CloudFront distribution for HTTPS
- Configure custom domain names
- Implement image resizing
- Add metadata to the manifest
- Set up monitoring and alerts

For more information, refer to:
- [AWS S3 Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [S3 Bucket Policies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-policies.html)
