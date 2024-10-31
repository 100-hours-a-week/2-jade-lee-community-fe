document.addEventListener("DOMContentLoaded", function () {
    // 모달 요소 선택
    const modal = document.getElementById('deleteModal'); 
    const commentModal = document.getElementById('commentDeleteModal'); 
    const editModal = document.getElementById('editModal'); 
    const closeButtons = document.querySelectorAll('.close'); 

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

    // 수정 버튼 클릭 시 모달 표시
    const editButton = document.getElementById('editButton');
    if (editButton) {
        editButton.addEventListener('click', () => toggleModal(editModal, true));
    } else {
        console.error('수정 버튼을 찾을 수 없습니다.');
    }

    // 모든 모달 닫기 버튼 설정
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleModal(modal, false);
            toggleModal(commentModal, false);
            toggleModal(editModal, false);
        });
    });

    // 수정 확인 버튼 설정
    document.getElementById('confirmEdit')?.addEventListener('click', () => {
        toggleModal(editModal, false);
        alert("회원정보가 수정되었습니다!");
        // 여기에 실제 회원정보 수정 로직 추가
    });

    // 취소 버튼 설정
    document.getElementById('cancelEdit')?.addEventListener('click', () => {
        toggleModal(editModal, false);
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            toggleModal(editModal, false);
        } else if (event.target === modal) {
            toggleModal(modal, false);
        } else if (event.target === commentModal) {
            toggleModal(commentModal, false);
        }
    });
});
