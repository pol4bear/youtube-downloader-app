# YouTube Data API v3

For detail information check [here](https://developers.google.com/youtube/v3/docs/videos/list).

# Dependencies

- [composer](https://getcomposer.org/): A Dependency Manager for PHP

# Usage

1. Install dependencies using [composer](https://getcomposer.org/). `composer install`
2. Give execute permission to deploy.sh. `chmod +x deploy.sh`
3. Run deploy.sh. `./deploy.sh [Document root] [Sub directory]`

## About deploy.sh

> **How it works**
>
> > You need permission of related directories.  
> > Warn that existing file with same name could be overwritten.
>
> 1. Move src directory under [Document root].
> 2. Move files in public directory to [Document root]/[Sub directory]

- Document root: Document root of the web server. Required.
- Sub directory: Sub directory for files in public directory. Optional.
