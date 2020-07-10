# YouTube Data API v3

자세한 정보는[여기](https://developers.google.com/youtube/v3/docs/videos/list)에서 확인할 수 있습니다.

# 의존성

- [composer](https://getcomposer.org/): PHP 의존성 관리자

# 사용법

1. [composer](https://getcomposer.org/)로 의존성을 먼저 설치하십시오. `composer install`
2. deploy.sh에 실행 권한을 주십시오. `chmod +x deploy.sh`
3. deploy.sh를 실행하십시오. `./deploy.sh [Document root] [Sub directory]`

## deploy.sh에 대해서

### 참고사항

- 배포할 디렉토리에 쓰기 권한이 필수적으로 필요합니다.
- 배포 위치에 있는 파일들 중 배포되는 파일과 동일한 이름의 파일이 있다면 덮어써집니다.

### 기능

1. [Document root]의 부모 디렉토리에 src 디렉토리를 옮깁니다.
2. public 디렉토리의 파일들을 [Document root]/[Sub directory] 디렉토리로 옮깁니다.

### 인자

- Document root: 웹 서버의 Document root. 필수
- Sub directory: 서버를 배포할 서브 디렉토리. 선택
