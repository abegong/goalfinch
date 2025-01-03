"""
Usage: upload_pics_to_s3_bucket.py <bucket_name> <folder_path> -d <destination_path>

Arguments:
    bucket_name: The name of the S3 bucket to which the images will be uploaded.
    folder_path: The path to the folder containing the images to be uploaded.
    destination_path: The path to the folder where the images will be saved in the S3 bucket.

Example:
    python upload_pics_to_s3_bucket.py my-bucket-name /path/to/pics/of/butterflies # Creates/appends to s3://my-bucket-name/butterflies
    python upload_pics_to_s3_bucket.py my-bucket-name /path/to/pics/of/istanbul -d constantinople # Creates/appends to s3://my-bucket-name/constantinople
"""

import argparse
import boto3
import json
import os
import hashlib
from pathlib import Path
from botocore.exceptions import ClientError
from typing import Dict, Set, Optional

def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Upload pictures to an S3 bucket')
    parser.add_argument('bucket_name', help='Name of the S3 bucket')
    parser.add_argument('folder_path', help='Path to the folder containing images')
    parser.add_argument('-d', '--destination_path', help='Destination path in the S3 bucket')
    return parser.parse_args()

def get_file_hash(file_path: str) -> str:
    """Calculate MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def configure_website_and_policy(s3_client, bucket_name: str) -> str:
    """Configure bucket for website hosting and set bucket policy for public read."""
    try:
        # Disable block public access
        s3_client.put_public_access_block(
            Bucket=bucket_name,
            PublicAccessBlockConfiguration={
                'BlockPublicAcls': False,
                'IgnorePublicAcls': False,
                'BlockPublicPolicy': False,
                'RestrictPublicBuckets': False
            }
        )
        print("Disabled block public access settings")
        
        # Configure website hosting
        website_config = {
            'ErrorDocument': {'Key': 'error.html'},
            'IndexDocument': {'Suffix': 'index.html'}
        }
        s3_client.put_bucket_website(
            Bucket=bucket_name,
            WebsiteConfiguration=website_config
        )
        
        # Set bucket policy for public read access
        bucket_policy = {
            "Version": "2012-10-17",
            "Statement": [{
                "Sid": "PublicReadForGetBucketObjects",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": f"arn:aws:s3:::{bucket_name}/*"
            }]
        }
        s3_client.put_bucket_policy(
            Bucket=bucket_name,
            Policy=json.dumps(bucket_policy)
        )
        
        # Get and return the website endpoint
        region = s3_client.get_bucket_location(Bucket=bucket_name)['LocationConstraint'] or 'us-east-1'
        website_endpoint = f"http://{bucket_name}.s3-website-{region}.amazonaws.com"
        print(f"Bucket website endpoint: {website_endpoint}")
        return website_endpoint
        
    except ClientError as e:
        if "AccessDenied" in str(e):
            print("Error: Insufficient permissions. Your IAM user needs these permissions:")
            print("- s3:PutPublicAccessBlock")
            print("- s3:PutBucketWebsite")
            print("- s3:PutBucketPolicy")
        print(f"Error configuring website hosting: {str(e)}")
        raise

def ensure_bucket_exists(s3_client, bucket_name: str) -> str:
    """Ensure the bucket exists and is configured for website hosting."""
    try:
        s3_client.head_bucket(Bucket=bucket_name)
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == '404':
            print(f"Bucket {bucket_name} does not exist. Creating it...")
            s3_client.create_bucket(Bucket=bucket_name)
        else:
            raise Exception(f"Error accessing bucket {bucket_name}: {str(e)}")
    
    return configure_website_and_policy(s3_client, bucket_name)

def get_manifest(s3_client, bucket_name: str, destination_path: str) -> Dict:
    """Get the manifest.json from S3 if it exists."""
    manifest_key = f"{destination_path}/manifest.json" if destination_path else "manifest.json"
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=manifest_key)
        return json.loads(response['Body'].read().decode('utf-8'))
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            return {}
        raise

def get_local_files(folder_path: str) -> Dict[str, str]:
    """Get a dictionary of local files and their hashes."""
    local_files = {}
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'}
    
    for file_path in Path(folder_path).rglob('*'):
        if file_path.suffix.lower() in image_extensions:
            relative_path = str(file_path.relative_to(folder_path))
            local_files[relative_path] = get_file_hash(str(file_path))
    
    return local_files

def upload_file(s3_client, file_path: str, bucket_name: str, s3_key: str, website_endpoint: str) -> None:
    """Upload a file to S3."""
    try:
        s3_client.upload_file(file_path, bucket_name, s3_key)
        website_url = f"{website_endpoint}/{s3_key}"
        print(f"Uploaded {file_path}")
        print(f"Website URL: {website_url}")
    except ClientError as e:
        print(f"Error uploading {file_path}: {str(e)}")
        raise

def main():
    args = parse_arguments()
    
    # Initialize S3 client
    s3_client = boto3.client('s3')
    
    # Ensure the bucket exists and get website endpoint
    website_endpoint = ensure_bucket_exists(s3_client, args.bucket_name)
    
    # Set destination path
    destination_path = args.destination_path or os.path.basename(args.folder_path.rstrip('/'))
    
    # Get existing manifest
    manifest = get_manifest(s3_client, args.bucket_name, destination_path)
    
    # Get local files
    local_files = get_local_files(args.folder_path)
    
    # Upload new or modified files
    for relative_path, file_hash in local_files.items():
        if relative_path not in manifest or manifest[relative_path] != file_hash:
            local_file_path = os.path.join(args.folder_path, relative_path)
            s3_key = f"{destination_path}/{relative_path}" if destination_path else relative_path
            upload_file(s3_client, local_file_path, args.bucket_name, s3_key, website_endpoint)
            manifest[relative_path] = file_hash
    
    # Upload updated manifest
    manifest_key = f"{destination_path}/manifest.json" if destination_path else "manifest.json"
    s3_client.put_object(
        Bucket=args.bucket_name,
        Key=manifest_key,
        Body=json.dumps(manifest, indent=2)
    )
    manifest_url = f"{website_endpoint}/{manifest_key}"
    print(f"Updated manifest at: {manifest_url}")

if __name__ == "__main__":
    main()
