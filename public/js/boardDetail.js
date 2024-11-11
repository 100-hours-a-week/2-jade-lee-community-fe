document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById('deleteModal'); // 게시글 삭제 모달
    const commentModal = document.getElementById('commentDeleteModal'); // 댓글 삭제 모달
    const closeButtons = document.querySelectorAll('.close'); // 모든 모달 닫기 버튼

    async function loadBoardData() {
        try {
            const response = await fetch('/json/data.json');
            const data = await response.json();
    
            const urlParams = new URLSearchParams(window.location.search);
            const boardId = urlParams.get('id');  
    
            const boardData = data.find(boardItem => boardItem.board.id == boardId)?.board;
    
            if (!boardData) {
                console.error('해당 게시글을 찾을 수 없습니다.');
                return;
            }
    
            document.getElementById('postTitle').textContent = boardData.title || "제목 없음";
            document.getElementById('writerName').textContent = boardData.writer || "작성자 없음";
            document.getElementById('postDate').textContent = boardData.date || "날짜 없음";
            document.getElementById('postContent').textContent = boardData.content || "내용 없음";
    
            // 게시글 이미지 설정
            const postImage = document.getElementById('postImage');
            postImage.src = boardData.image || "/img/profile.png"; // 이미지가 없으면 기본 프로필 이미지 사용
    
            document.getElementById('likeCount').innerHTML = `${boardData.likes || 0}<br>좋아요수`;
            document.getElementById('viewCount').innerHTML = `${boardData.views || 0}<br>조회수`;
    
            const comments = boardData.comments || [];
            document.getElementById('commentCount').innerHTML = `${comments.length}<br>댓글`;
    
            const commentContainer = document.getElementById('commentContainer');
            commentContainer.innerHTML = ''; 
    
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('commentContainer');
    
                commentDiv.innerHTML = `
                    <div class="commentWriteInfo">
                        <img src="${comment.image || '/img/profile.png'}" class="commentWriter" alt="댓글 작성자 프로필"/>
                        &nbsp;&nbsp;
                        <p>${comment.writer || "익명"}</p>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span>${comment.date || "날짜 없음"}</span>
                        <div class="boardUpdate2">
                            <button class="edit-btn">수정</button>
                            <button class="confirm-button">삭제</button>
                        </div>
                    </div>
                    <div class="commentContentContainer">
                        ${comment.content || "내용 없음"}
                    </div>
                `;
                
                commentContainer.appendChild(commentDiv);
            });
            
        } catch (error) {
            console.error('데이터를 불러오는 중 오류 발생:', error);
        }
    }
    
    // JSON 데이터 불러오기 실행
    loadBoardData();

    const profileImg = document.querySelector('.profile-img');
    const dropdownContent = document.querySelector('.dropdown-content');

    profileImg?.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        dropdownContent?.classList.toggle('show');
    });

    window.addEventListener('click', function (event) {
        if (!profileImg.contains(event.target)) {
            dropdownContent?.classList.remove('show');
        }
    });

    function toggleModal(modal, shouldShow) {
        if (modal) {
            modal.style.display = shouldShow ? 'block' : 'none';
            document.body.style.overflow = shouldShow ? 'hidden' : 'auto';
        }
    }

    // 게시글 삭제 버튼
    const deleteButton = document.querySelector('.boardUpdate button:last-child');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => toggleModal(modal, true));
    }

    // 댓글 삭제 및 수정 버튼에 이벤트 위임 적용
    const commentContainer = document.getElementById('commentContainer');
    if (commentContainer) {
        commentContainer.addEventListener('click', function (event) {
            const targetButton = event.target;
            if (targetButton.classList.contains('confirm-button')) {
                // 댓글 삭제 버튼 클릭 시 모달 열기
                toggleModal(commentModal, true);
            } else if (targetButton.classList.contains('edit-btn')) {
                // 댓글 수정 버튼 클릭 시 수정 모달 열기
                alert("댓글 수정 기능 추가 예정!");
            }
        });
    }

    const updateButton = document.getElementById('updateButton');
    if (updateButton) {
        updateButton.addEventListener('click', () => {
            window.location.href = '/boardUpdate';
        });
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleModal(modal, false);
            toggleModal(commentModal, false);
        });
    });

    document.getElementById('confirmDelete')?.addEventListener('click', () => {
        toggleModal(modal, false);
        alert("게시글이 삭제되었습니다!");
    });

    document.getElementById('confirmCommentDelete')?.addEventListener('click', () => {
        toggleModal(commentModal, false);
        alert("댓글이 삭제되었습니다!");
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            toggleModal(modal, false);
        } else if (event.target === commentModal) {
            toggleModal(commentModal, false);
        }
    });
});
