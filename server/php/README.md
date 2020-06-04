# How to deploy

1. Give execute permission to deploy.sh. `chmod +x deploy.sh`
2. Run deploy.sh.

# About deploy.sh

## Usage

```
./deploy.sh [Document root] [Sub directory]
```

## Description

> **How it works**
>
> > You need permission of related directories.  
> > Warn that existing file with same name could be overwritten.
>
> 1. Move src directory under [Document root].
> 2. Move files in public directory to [Document root]/[Sub directory]

- Document root: Document root of the web server. Required.
- Sub directory: Sub directory for files in public directory. Optional.
