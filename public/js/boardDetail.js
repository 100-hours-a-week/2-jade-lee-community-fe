document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById('deleteModal'); // 게시글 삭제 모달
    const commentModal = document.getElementById('commentDeleteModal'); // 댓글 삭제 모달
    const closeButtons = document.querySelectorAll('.close'); // 모든 모달 닫기 버튼

    // 드롭다운 관련 변수
    const profileImg = document.querySelector('.profile-img');
    const dropdownContent = document.querySelector('.dropdown-content');

    // 드롭다운 메뉴 토글 및 외부 클릭 시 닫기
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

    // 모달 표시 및 닫기 함수
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
    } else {
        console.error('게시글 삭제 버튼을 찾을 수 없습니다.');
    }

    // 댓글 삭제 버튼
    const commentDeleteButton = document.querySelector('.boardUpdate2 button:last-child');
    if (commentDeleteButton) {
        commentDeleteButton.addEventListener('click', () => toggleModal(commentModal, true));
    } else {
        console.error('댓글 삭제 버튼을 찾을 수 없습니다.');
    }

    // 수정 버튼 클릭 시 보드 업데이트 페이지로 이동
    const updateButton = document.getElementById('updateButton');
    if (updateButton) {
        updateButton.addEventListener('click', () => {
            window.location.href = '/boardUpdate'; // 보드 업데이트 페이지로 리다이렉트
        });
    } else {
        console.error('수정 버튼을 찾을 수 없습니다.');
    }

    // 모든 모달 닫기 버튼 설정
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleModal(modal, false);
            toggleModal(commentModal, false);
        });
    });

    // 게시글 삭제 확인 버튼 설정
    document.getElementById('confirmDelete')?.addEventListener('click', () => {
        toggleModal(modal, false);
        alert("게시글이 삭제되었습니다!");
        // 여기에 실제 게시글 삭제 로직 추가
    });

    // 댓글 삭제 확인 버튼 설정
    document.getElementById('confirmCommentDelete')?.addEventListener('click', () => {
        toggleModal(commentModal, false);
        alert("댓글이 삭제되었습니다!");
        // 여기에 실제 댓글 삭제 로직 추가
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            toggleModal(modal, false);
        } else if (event.target === commentModal) {
            toggleModal(commentModal, false);
        }
    });
});
