# Using S3 as Origin

When using S3 as Origin, one must either make sure S3 URLs are publicly reachable, or have appropriate bucket policy, allowing access from [CloudFlare IPs](https://www.cloudflare.com/ips/)


Example bucket policy:
```
{
  "Version": "2008-10-17",
  "Id": "CloudFlareRule",
  "Statement": [
    {
      "Sid": "AllowCloudFlareIPs",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-s3-bucket-name/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": [
            "173.245.48.0/20",
            "103.21.244.0/22",
            "103.22.200.0/22",
            "103.31.4.0/22",
            "141.101.64.0/18",
            "108.162.192.0/18",
            "190.93.240.0/20",
            "188.114.96.0/20",
            "197.234.240.0/22",
            "198.41.128.0/17",
            "162.158.0.0/15",
            "104.16.0.0/12",
            "172.64.0.0/13",
            "131.0.72.0/22",
            "2400:cb00::/32",
            "2606:4700::/32",
            "2803:f800::/32",
            "2405:b500::/32",
            "2405:8100::/32",
            "2a06:98c0::/29",
            "2c0f:f248::/32"
          ]
        }
      }
    }
  ]
}
```
