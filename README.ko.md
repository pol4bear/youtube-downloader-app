# 유튜브 다운로드 앱

리액트로 개발한 간단한 유튜브 영상 다운로드 앱
![light ko](https://user-images.githubusercontent.com/17893401/87107474-c8553180-c29a-11ea-8c7c-74af68326321.png)
![dark ko](https://user-images.githubusercontent.com/17893401/87107476-ca1ef500-c29a-11ea-8f6e-9915cc6b64e3.png)
![list ko](https://user-images.githubusercontent.com/17893401/87107479-cdb27c00-c29a-11ea-9624-ee6de50b3e3d.png)
![info ko](https://user-images.githubusercontent.com/17893401/87107483-d1de9980-c29a-11ea-81dd-20d080b54a3e.png)

# 기능

- [YouTube Data API v3](https://developers.google.com/youtube/v3/getting-started)로 유튜브 영상 검색 제공
- [YouTube-dl](https://github.com/ytdl-org/youtube-dl)로 유튜브 영상 다운로드 제공

# 참고

이 앱을 사용하려면 백엔드 서버를 실행해야 합니다.

백엔드 서버는 Node.js와 PHP로 개발되어 있고 편한 걸로 돌리면 됩니다.

백엔드 서버는 [여기](server)에서 확인할 수 있습니다.

# 자주 묻는 질문

## 다른 폴더에 앱을 운영하려면 어떻게 해야되나요?

package.json 파일의 "homepage" 값을 바꿔서 다른 폴더에서 운영할 수 있습니다.
