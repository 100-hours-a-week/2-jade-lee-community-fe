document.addEventListener("DOMContentLoaded", function () {
    // Modal elements
    const modal = document.getElementById('deleteModal');
    const commentModal = document.getElementById('commentDeleteModal');
    const editModal = document.getElementById('editModal');
    const closeButtons = document.querySelectorAll('.close');
    const helperText = document.getElementById('nicknameHelperText');
    const editButton = document.getElementById('editButton');
    const nicknameInput = document.querySelector('.nickname input'); 

    const deleteButton = document.querySelector('.delete-button');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');

    // Delete 버튼 클릭 시, 삭제 확인 모달 표시
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            toggleModal(modal, true);
        });
    }

    // 삭제 확인 버튼 클릭 시 사용자 삭제 요청
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
            fetch('/delete-user', {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 삭제 성공 후 처리 (로그아웃하고 로그인 페이지로 이동)
                    alert('회원 탈퇴가 완료되었습니다.');
                    window.location.href = '/login'; // 로그인 페이지로 이동
                } else {
                    alert('회원 탈퇴 실패: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('회원 탈퇴 중 오류가 발생했습니다.');
            });
            toggleModal(modal, false); // 모달 닫기
        });
    }

    // Modal close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleModal(modal, false);
            toggleModal(commentModal, false);
            toggleModal(editModal, false);
        });
    });

    // 닉네임 유효성 검사
    editButton.addEventListener('click', () => {
        if (nicknameInput && !nicknameInput.value) {
            helperText.style.display = 'block'; 
        } else {
            helperText.style.display = 'none'; 
        }
    });

    if (nicknameInput) {
        nicknameInput.addEventListener('input', () => {
            const nicknameValue = nicknameInput.value;
            if (!nicknameValue) {
                helperText.style.display = 'block';
                helperText.textContent = '* 닉네임을 입력해주세요.';
            }
            else if (nicknameValue.length > 10) {
                helperText.style.display = 'block';
                helperText.textContent = '* 닉네임은 최대 10자까지 작성 가능합니다.';
            }
        });
    }

    // 모달 토글 함수
    function toggleModal(modal, shouldShow) {
        if (modal) {
            modal.style.display = shouldShow ? 'block' : 'none';
            document.body.style.overflow = shouldShow ? 'hidden' : 'auto';
        }
    }

    // 사용자 정보 업데이트
    document.getElementById('confirmEdit')?.addEventListener('click', () => {
        const nicknameInput = document.querySelector('.nickname input');
        const emailInput = document.querySelector('.email input');
        const passwordInput = document.querySelector('.password input');
        const profileImageInput = document.querySelector('#profileImage');

        let updatedNickname = nicknameInput ? nicknameInput.value : '';
        let updatedEmail = emailInput ? emailInput.value : '';
        let updatedPassword = passwordInput ? passwordInput.value : '';
        let updatedProfileImage = null;

        if (profileImageInput?.files[0]) {
            updatedProfileImage = profileImageInput.files[0];
        }

        const formData = new FormData();
        formData.append('nickname', updatedNickname);
        formData.append('email', updatedEmail);
        formData.append('password', updatedPassword);

        if (updatedProfileImage) {
            formData.append('profileImage', updatedProfileImage);
        }

        fetch('/update-user', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Toast 메시지 띄우기
                showToast("회원정보가 수정되었습니다!");

                if (nicknameInput) {
                    nicknameInput.value = updatedNickname;
                }
                const emailValueElement = document.querySelector('.emailValue');
                if (emailValueElement) {
                    emailValueElement.textContent = updatedEmail;
                }
                if (updatedProfileImage) {
                    document.querySelector('#imagePreview').src = URL.createObjectURL(updatedProfileImage);
                }
                toggleModal(editModal, false);
            } else {
                alert('회원정보 수정 실패: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            alert('회원정보 수정 중 오류가 발생했습니다.');
        });
    });

    // 사용자 정보 불러오기
    fetch('/myinfo-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load user session');
            }
            return response.json();
        })
        .then(data => {
            const currentUser = data.user;

            if (!currentUser) {
                throw new Error('User data is undefined or null');
            }

            const nicknameInput = document.querySelector('.nickname input');
            if (nicknameInput) {
                nicknameInput.value = currentUser.nickname || '';
            }

            const emailValueElement = document.querySelector('.emailValue');
            if (emailValueElement) {
                emailValueElement.textContent = currentUser.email || '이메일 없음';
            }

            const profileImageElement = document.querySelector('#imagePreview');
            if (profileImageElement) {
                profileImageElement.src = currentUser.profileImage
                    ? currentUser.profileImage
                    : '/img/default-profile.png';
            }
        })
        .catch(error => {
            console.error('Error loading user session:', error);
            window.location.href = '/login'; 
        });

    const imagePreview = document.getElementById('imagePreview');
    const profileImageInput = document.getElementById('profileImage');
    
    if (imagePreview) {
        imagePreview.addEventListener('click', function () {
            profileImageInput.click(); 
        });
    }

    if (profileImageInput) {
        profileImageInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result; 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Toast 메시지를 띄우는 함수
    function showToast(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000); // 3초 후에 toast 사라짐
        }
    }
});
