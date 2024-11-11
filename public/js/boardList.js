document.addEventListener("DOMContentLoaded", function () {
    // 게시글 생성 버튼 기능
    const createPostButton = document.querySelector('.create-post-button');
    createPostButton.addEventListener('click', function() {
        window.location.href = '/boardWrite';
    });

    // 프로필 드롭다운 메뉴 기능
    const profileImg = document.querySelector('.profile-img');
    const dropdownContent = document.querySelector('.dropdown-content');
    profileImg.addEventListener('click', function () {
        dropdownContent.classList.toggle('show');
    });
    window.addEventListener('click', function (event) {
        if (!profileImg.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // 숫자 포맷 함수 (1k, 10k, 100k 형식)
    function formatNumber(value) {
        if (value >= 100000) {
            return Math.floor(value / 1000) + 'k';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return value.toString();
    }

    // 날짜 포맷 함수 (yyyy-mm-dd hh:mm:ss 형식)
    function formatDate(dateString) {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }

    // 게시글 목록을 JSON 파일로부터 불러오기
    fetch('/json/posts.json') // JSON 파일 경로를 설정
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(posts => {
            const postListContainer = document.querySelector('.post-list'); // 게시글 목록을 담을 컨테이너

            // 기존에 존재하는 빈 컨테이너를 제거 (빈 게시글 컨테이너 방지)
            const existingPostContainers = postListContainer.querySelectorAll('.post-container');
            existingPostContainers.forEach(container => {
                container.remove();
            });

            posts.forEach(post => {
                const postContainer = document.createElement('div');
                postContainer.classList.add('post-container');  // 각 게시글을 위한 개별 컨테이너

                const postItem = document.createElement('div');
                postItem.classList.add('post-item');

                // 제목이 26자를 초과할 경우 잘라내기
                const truncatedTitle = post.title.length > 26 ? post.title.slice(0, 26) + '...' : post.title;

                postItem.innerHTML = `
                    <h3 class="post-title" id="post${post.id}">&nbsp;&nbsp;${truncatedTitle}</h3>
                    <div class="info-flex">
                        <div class="post-info1">&nbsp;&nbsp;&nbsp;좋아요 ${formatNumber(post.likes)} 댓글 ${formatNumber(post.comments)} 조회수 ${formatNumber(post.views)}</div>
                        <div class="post-info2">${formatDate(post.date)}</div>
                    </div>
                    <hr>
                    <div class="author-flex">&nbsp;&nbsp;&nbsp;
                        <img src="/img/profile.png" class="content-writer"/>
                        <h4>&nbsp;&nbsp;${post.author}</h4>
                    </div>
                `;

                // 게시글을 클릭했을 때 상세 페이지로 이동
                postItem.querySelector(`#post${post.id}`).addEventListener("click", function() {
                    window.location.href = `/boardDetail?id=${post.id}`;
                });

                // 게시글을 postContainer에 추가
                postContainer.appendChild(postItem);
                postListContainer.appendChild(postContainer);  // 개별 게시글을 post-list에 추가
            });
        })
        .catch(error => console.error('Error loading posts:', error));
});
