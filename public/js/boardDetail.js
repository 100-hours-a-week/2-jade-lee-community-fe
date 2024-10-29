document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById('deleteModal'); // 게시글 삭제 모달
    const commentModal = document.getElementById('commentDeleteModal'); // 댓글 삭제 모달
    const closeButton = document.querySelector('.close'); // 모달 닫기 버튼

    // 버튼 클릭 시 모달 표시 함수
    function showModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // 버튼 클릭 시 모달 닫기 함수
    function hideModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 게시글 삭제 버튼 설정
    const deleteButton = document.querySelector('.boardUpdate button:last-child');
    if (deleteButton) {
        console.log('게시글 삭제 버튼을 찾았습니다:', deleteButton);
        deleteButton.addEventListener('click', () => showModal(modal));
    } else {
        console.error('게시글 삭제 버튼을 찾을 수 없습니다.');
    }

    // 댓글 삭제 버튼 설정
    const commentDeleteButton = document.querySelector('.boardUpdate2 button:last-child');
    if (commentDeleteButton) {
        console.log('댓글 삭제 버튼을 찾았습니다:', commentDeleteButton);
        commentDeleteButton.addEventListener('click', () => showModal(commentModal));
    } else {
        console.error('댓글 삭제 버튼을 찾을 수 없습니다.');
    }

    // 모달 닫기 버튼 설정
    closeButton?.addEventListener('click', () => {
        hideModal(modal);
        hideModal(commentModal); // 댓글 삭제 모달 닫기
    });

    // 게시글 삭제 확인 버튼 설정
    document.getElementById('confirmDelete')?.addEventListener('click', () => {
        hideModal(modal);
        alert("게시글이 삭제되었습니다!");
        // 여기에 실제 게시글 삭제 로직을 추가
    });

    // 댓글 삭제 확인 버튼 설정
    document.getElementById('confirmCommentDelete')?.addEventListener('click', () => {
        hideModal(commentModal);
        alert("댓글이 삭제되었습니다!"); // 댓글 삭제 알림
        // 여기에 댓글 삭제 로직을 추가
    });

    // 모달 외부 클릭 시 모달 닫기
    window.addEventListener('click', (event) => {
        if (event.target === modal || event.target === commentModal) {
            hideModal(modal);
            hideModal(commentModal); // 댓글 삭제 모달 닫기
        }
    });
});
